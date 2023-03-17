const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
require('dotenv').config();
const DatastoreClient = require("../services/datastore");

const isFromFollowUpBoss = (context, signature) => {
    const calculated = crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(context)
        .digest('hex');
    return calculated === signature;
}
// if (isFromFollowUpBoss(req.query.context, req.query.signature)) {
        
// }

const base64ToJson = async (base64String) => {
    const json = Buffer.from(base64String, "base64").toString();
    return JSON.parse(json);
}

exports.index = async(req, res) => {
    
    const decoded_value = await base64ToJson(req.query.context);
    // const decoded_value = await base64ToJson(process.env.DEV_CONTEXT);
    let account_id = decoded_value.account.id;
    // let account_id = Number(process.env.DEV_ACCOUNT_ID);
    console.log(account_id);
    let value = await DatastoreClient.get('Users', account_id);
    if (value) {
        console.log("Account Id exists.");
        res.redirect('/path/main');
    }
    else {
        //create it
        const obj = {
            account_id: account_id,
        }
        //save in database
        console.log("Account Id not present.");
        // await DatastoreClient.save('Users', account_id, obj);
        res.render('index');
    }
}

exports.main = async(req, res) => {
    const decoded_value = await base64ToJson(req.query.context);
    // const decoded_value = await base64ToJson(process.env.DEV_CONTEXT);
    let account_id = decoded_value.account.id;
    // let account_id = Number(process.env.DEV_ACCOUNT_ID);
    console.log(account_id);
    let value = await DatastoreClient.get('Users', account_id);
    if (value) {
        console.log("Account Id exists.");
        res.render('main');
    }
    else {
        console.log("Account Id do not exist.");
        res.redirect('/path/index');
    }
    
}