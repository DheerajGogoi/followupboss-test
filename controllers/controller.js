const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');
require('dotenv').config();

const isFromFollowUpBoss = (context, signature) => {
    const calculated = crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(context)
        .digest('hex');
    return calculated === signature;
}

exports.index = async(req, res) => {
    // if (isFromFollowUpBoss(req.query.context, req.query.signature)) {
        
    // }
    res.render('index');
}

exports.main = async(req, res) => {
    // if (isFromFollowUpBoss(req.query.context, req.query.signature)) {
        
    // }
    res.render('main');
}