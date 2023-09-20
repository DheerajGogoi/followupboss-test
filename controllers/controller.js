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

function stringToBase64(inputString) {
    const utf8Encoder = new TextEncoder();
    const data = utf8Encoder.encode(inputString);
    const base64String = btoa(String.fromCharCode(...data));
    return base64String;
}
  

exports.index = async(req, res) => {

    if(!req.query.context){
        res.redirect("/path/fail");
    } else {
        const decoded_value = await base64ToJson(req.query.context);
        
        let account_id = String(decoded_value.account.id);
        let person_id = decoded_value.person.id;
        // [0].value
        let have_contact = decoded_value.person.phones && decoded_value.person.phones.length > 0 && decoded_value.person.phones && decoded_value.person.phones[0] && decoded_value.person.phones[0].value ? true : false;
        // let have_contact = false;

        console.log(account_id);
        let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
        
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
        let note = req.body.note;
        if (Array.isArray(note)) {
            note = note.filter((str) => str.trim() !== '');
            note = note.join('');
        }
        if(req.body.channel){
            if(req.body.schedule){
                if(req.body.schedule === "none"){
                    message = `SMS ${note}`
                } else {
                    message = `${req.body.schedule} ${note}`
                }
            } else {
                if(req.body.channel === "[delete]"){
                    message = `${req.body.channel}`
                } else if (req.body.channel === "OPT LEAD OUT-DND") {
                    message = `[DND]`
                } else if (req.body.channel === "Ask.Ai - Beta") {
                    message = `[Ask.Ai] ${note}`
                } else {
                    message = `${req.body.channel} ${note}`
                }
            }
        } else {
            message = `[Call Connect]`;
        }

        let obj = {
            personId: req.query.personId, //123
            subject: "Follow Up Boss Note", //leadngage action
            body: message,
            isHtml: false
        };
        console.log(obj);

        let account_id = String(req.query.accountId);
        let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
        
        const base64String = stringToBase64((value[0].FUB_API_KEY).trim()+":");
        console.log(base64String);
        // let auth_api_key = utf8_to_base64(`${value[0].FUB_API_KEY}:`);
        let auth_api_key = base64String;

        let options = {
            method: 'POST',
            // url: process.env.NOTE_URL,
            url: "https://api.followupboss.com/v1/notes",
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
                let delete_success = req.body.channel === "[delete]" ? true : false;
                
                res.render('main', { channel: req.body.channel, person_id: req.query.personId, account_id: req.query.accountId, have_contact: req.query.contact, action_path: `/path/main?personId=${req.query.personId}&accountId=${req.query.accountId}&contact=${req.query.contact}`, delete_success: delete_success });
            })
            .catch(err => {
                console.error(err);
                res.redirect('/path/fail');
            });
    }
}

exports.get_person = async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        try {
            let person_id = req.body.person.id;
            let account_id = String(req.body.account.id);
            let value = await DatastoreClient.ArrLookUp('Users', "FUBID", account_id);
            
            const base64String = stringToBase64((value[0].FUB_API_KEY).trim()+":");
            // console.log(base64String);

            let auth_api_key = base64String;
            let options = {
                method: 'GET',
                url: `https://api.followupboss.com/v1/people/${person_id}`,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: `Basic ${auth_api_key}`
                }
            };
            const person_response = await axios(options);
            
            let config = {
                method: 'POST',
                url: `https://hook.us1.make.com/uxw85hfc9z2ua7ndnmyxexqwblob5qfb`,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                data: person_response.data
            };
            const hook_response = await axios(config);
            console.log(person_response.data);
            console.log(hook_response.data);

            return res.status(200).json(person_response.data);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

exports.update_credentails = async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        try {
            const { Agent_Phone, Business_Name, FUBID, FUB_API_KEY, GHLID, GHL_API_KEY, GHL_FB, GHL_GMB, GHL_IG, GHL_SMS, GHL_WHISPER_MESSAGE_ID, OPENAI_KEY, TWILIO_AUTH, TWILIO_PHONE_1, TWILIO_SID } = req.body;

            if(!GHLID) return res.status(404).json({ success: false, message: "GHLID not present" })
            let value = await DatastoreClient.FindByValue('Users', "GHLID", String(GHLID));
            // console.log(value);
            if(value && value.length > 0){
                const id = value[0].key.id;
                value = value[0].entity
                if (Agent_Phone !== undefined) value.Agent_Phone = Agent_Phone;
                if (Business_Name !== undefined) value.Business_Name = Business_Name;
                if (FUBID !== undefined) value.FUBID = FUBID;
                if (FUB_API_KEY !== undefined) value.FUB_API_KEY = FUB_API_KEY;
                if (GHLID !== undefined) value.GHLID = GHLID;
                if (GHL_API_KEY !== undefined) value.GHL_API_KEY = GHL_API_KEY;
                if (GHL_FB !== undefined) value.GHL_FB = GHL_FB;
                if (GHL_GMB !== undefined) value.GHL_GMB = GHL_GMB;
                if (GHL_IG !== undefined) value.GHL_IG = GHL_IG;
                if (GHL_SMS !== undefined) value.GHL_SMS = GHL_SMS;
                if (GHL_WHISPER_MESSAGE_ID !== undefined) value.GHL_WHISPER_MESSAGE_ID = GHL_WHISPER_MESSAGE_ID;
                if (OPENAI_KEY !== undefined) value.OPENAI_KEY = OPENAI_KEY;
                if (TWILIO_AUTH !== undefined) value.TWILIO_AUTH = TWILIO_AUTH;
                if (TWILIO_PHONE_1 !== undefined) value.TWILIO_PHONE_1 = TWILIO_PHONE_1;
                if (TWILIO_SID !== undefined) value.TWILIO_SID = TWILIO_SID;

                await DatastoreClient.save('Users', Number(id), value);
                return res.status(200).json(value)
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Account not found."
                });
            } 
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

exports.fail = async(req, res) => {
    res.render('failure');
}