const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
require('dotenv').config();
const DatastoreClient = require("../services/datastore");

const base64ToJson = async (base64String) => {
    const json = Buffer.from(base64String, "base64").toString();
    return JSON.parse(json);
}

function utf8_to_base64(str) {
    let buff = new Buffer.from(str);
    let base64data = buff.toString('base64');
    return base64data;
}

exports.index = async(req, res) => {

    if(!req.query.context){
        res.redirect("/path/fail");
    } else {
        const decoded_value = await base64ToJson(req.query.context);
        
        let account_id = String(decoded_value.account.id);
        let person_id = decoded_value.person.id;
        let have_contact = decoded_value.person.phones[0].value ? true : false;
        // let have_contact = false;

        console.log(account_id);
        let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);

        console.log("ghl key", value.Key);

        // if(!value.CHANNEL){
        //     value.CHANNEL = "SMS";
        //     await DatastoreClient.save('Users', "5644523313037312", value);
        // }
        
        //checking if FUBID exists
        if (value.length > 0) {
            console.log("Account Id exists.");
            res.redirect(`/path/main?personId=${person_id}&accountId=${account_id}&contact=${have_contact}`);
        }
        else {
            console.log("Account Id not present.");
            res.render('index');
        }
    }
}

exports.main = async(req, res) => {

    if(!req.query.personId || !req.query.accountId || !req.query.contact){
        res.redirect("/path/fail");
    } else {
        res.render('main', { channel: "SMS", person_id: req.query.personId, account_id: req.query.accountId, have_contact: req.query.contact, action_path: `/path/main?personId=${req.query.personId}&accountId=${req.query.accountId}&contact=${req.query.contact}`, delete_success: false });
    }
}

exports.send_note = async(req, res) => {
    console.log(req.query);
    
    if(!req.query.personId || !req.query.accountId){
        res.redirect("/path/fail");
    } else {
        let message = "";
        console.log(req.body);
        if(req.body.schedule){
            if(req.body.schedule === "none"){
                message = `SMS ${req.body.note}`
            } else {
                message = `${req.body.schedule} ${req.body.note}`
            }
        } else {
            if(req.body.channel === "[delete]"){
                message = `${req.body.channel}`
            } else {
                message = `${req.body.channel} ${req.body.note}`
            }
        }
        let obj = {
            personId: req.query.personId, //12234
            subject: "Follow Up Boss Note", //leadngage action
            body: message,
            isHtml: false
        };
        console.log(obj);

        let account_id = String(req.query.accountId);
        let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
        let auth_api_key = utf8_to_base64(`${value[0].FUB_API_KEY}:`);

        let options = {
            method: 'POST',
            url: 'https://api.followupboss.com/v1/notes',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Basic ${auth_api_key}`
            },
            data: JSON.stringify(obj)
        };

        console.log(options);
        
        axios(options)
            .then(response => {
                response = response.data;
                console.log(response);
                let delete_success = req.body.schedule === "[delete]" ? true : false;
                
                res.render('main', { channel: req.body.channel, person_id: req.query.personId, account_id: req.query.accountId, have_contact: req.query.contact, action_path: `/path/main?personId=${req.query.personId}&accountId=${req.query.accountId}&contact=${req.query.contact}`, delete_success: delete_success });
            })
            .catch(err => {
                console.error(err);
                res.redirect('/path/fail');
            });
    }
}

// exports.success = async(req, res) => {
//     res.render('success');
// }

exports.fail = async(req, res) => {
    res.render('failure');
}