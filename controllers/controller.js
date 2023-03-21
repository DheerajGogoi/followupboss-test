const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
require('dotenv').config();
const DatastoreClient = require("../services/datastore");
const LocalStorage = require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage('./scratch'); 

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
    const decoded_value = await base64ToJson(req.query.context);
    
    // localStorage.setItem('FUB_Context', req.query.context); 
    // localStorage.setItem('FUB_Context_Decoded', JSON.stringify(decoded_value)); 
    
    // let account_id = String(decoded_value.account.id);

    //only for testing purpose - will delete later
    let account_id = String(decoded_value.account.id);
    console.log(account_id);
    let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
    
    //checking if FUBID exists
    if (value.length > 0) {
        // localStorage.setItem('GHL_Details', JSON.stringify(value));
        
        console.log("Account Id exists.");
        res.redirect(`/path/main/sms`);
    }
    else {
        console.log("Account Id not present.");
        res.render('index');
    }
}

exports.main = async(req, res) => {
    let type = req.params.type;
    if(!type){
        res.redirect(`/path/main/sms`);
    }

    // const decoded_value = JSON.parse(localStorage.getItem('FUB_Context_Decoded'))
    // let account_id = String(decoded_value.account.id);

    //only for testing purpose - will delete later
    const decoded_value = await base64ToJson(process.env.DEV_CONTEXT);
    let account_id = String(decoded_value.account.id);

    let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
    
    //checking if FUBID exists
    if (value.length > 0) {
        console.log("Account Id exists.");
        res.render('main', { channel: type });
    }
    else {
        console.log("Account Id do not exist.");
        res.redirect(`/path/index?context=${localStorage.getItem('FUB_Context')}`);
    }
    // res.render('main', { channel: type });
}

exports.send_note = async(req, res) => {
    let message = "";
    if(req.body.schedule){
        message = `${req.body.schedule} ${req.body.note}`
    } else {
        message = `${req.body.note}`
    }
    let obj = {
        personId: 12345, //12234
        subject: "Note",
        body: message,
        isHtml: false
    };
    console.log(obj);

    // const ghl_details = JSON.parse(localStorage.getItem('GHL_Details'));
    // let auth_api_key = utf8_to_base64(`${ghl_details[0].FUB_API_KEY}:`);

    //only for testing purpose - will delete later
    const decoded_value = await base64ToJson(process.env.DEV_CONTEXT);
    let account_id = String(decoded_value.account.id);
    let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
    let auth_api_key = utf8_to_base64(value[0].FUB_API_KEY);

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
            
            let type = req.params.type;
            res.render('success', { channel: type });
        })
        .catch(err => {
            console.error(err);
            res.render('failure', { channel: type });
        });
}


// exports.success = async(req, res) => {
//     res.render('success');
// }

// exports.fail = async(req, res) => {
//     res.render('failure');
// }