const express = require('express');
const collections = require('../collections/collections');
const mongoUtils = require('../MongoConnection/mongoUtils');
const balanceQuery = require('../Quries/balanceQuery');
const portfolioQuery = require('../Quries/portfolioQuery');
const resourceQuery = require('../Quries/resourceQuery');
const AssistantV1 = require('ibm-watson/assistant/v1');
const msgModel = require('../Models/msgModel');
const Joi = require('@hapi/joi');
var msgContext = AssistantV1.context;
var router = express.Router();

const service = new AssistantV1({
    version: '2019-02-28',
    iam_apikey: 'Ty0uVuiUV2pcMMIgmQaZAoLw1iMtBu_ILkvXvO8YX5X5',
    url: 'https://gateway-lon.watsonplatform.net/assistant/api'
});

var getUserBalance = async (username) => {
    let lowerCasedUserName = username.toLowerCase();
    const db = mongoUtils.getDB();
    const balances = db.collection(collections.balCollection);
    try {
        const result = await balanceQuery.findBalanceByName(balances, lowerCasedUserName);
        if (result) {
            return {
                status: 1,
                options: [],
                portfolio: [],
                isMine: 0,
                msg: `you have Rs. ${result.balance} in your wallet.`
            }
        }
        else {
            return {
                status: 0,
                options: [],
                portfolio: [],
                isMine: 0,
                msg: 'you dont have it'
            }
        }
    }
    catch (e) {
        throw e;
    }
}

var getUserTradeOptions = async (username) => {
    let lowerCasedUserName = username.toLowerCase();
    const db = mongoUtils.getDB();
    const resources = db.collection(collections.resCollection);
    try {
        const result = await resourceQuery.findResourcesByName(resources, lowerCasedUserName);
        if (result) {
            if ((result.resources != undefined) && (result.resources.length > 0)) {
                return {
                    status: 1,
                    options: result.resources,
                    portfolio: [],
                    isMine: 0,
                    msg: 'your trading options'
                }
            }
            else {
                return {
                    status: 0,
                    options: [],
                    portfolio: [],
                    isMine: 0,
                    msg: 'you dont have it'
                }
            }
        }
        else {
            return {
                status: 0,
                options: [],
                portfolio: [],
                isMine: 0,
                msg: 'you dont have it'
            }
        }
    }
    catch (e) {
        throw e;
    }
}

var getPortfolios = async (username) => {
    let lowerCasedUserName = username.toLowerCase();
    const db = mongoUtils.getDB();
    const portfolios = db.collection(collections.pfCollection);
    try {
        const result = await portfolioQuery.findPortfolioByName(portfolios, lowerCasedUserName);
        if (result) {
            if ((result.portfolios != undefined) && (result.portfolios.length > 0)) {
                return {
                    status: 1,
                    options: [],
                    portfolio: result.portfolios,
                    isMine: 0,
                    msg: 'your trading options'
                }
            }
            else {
                return {
                    status: 0,
                    options: [],
                    portfolio: [],
                    isMine: 0,
                    msg: 'you dont have it'
                }
            }
        }
        else {
            return {
                status: 0,
                options: [],
                portfolio: [],
                isMine: 0,
                msg: 'you dont have it'
            }
        }
    }
    catch (e) {
        throw e;
    }
}


router.post('/msg', async (req, res) => {
    Joi.validate(req.body, msgModel, async (err, val) => {
        if (err) {
            console.log('validation error ===>>>', err)
            res.json({
                status: 0,
                options: [],
                portfolio: [],
                isMine: 0,
                msg: err.name
            })
        }
        else {
            try {
                var outputMsg = await service.message({
                    workspace_id: 'f0c3dd9a-1aee-418e-b4b6-8d2c2714aeb8',
                    input: { 'text': req.body.msg },
                    context: msgContext
                });
                if (outputMsg.context.system.branch_exited){
                    msgContext = AssistantV1.context
                }
                else{
                    msgContext = outputMsg.context;
                }
                console.log('bot output all ===>>>', outputMsg);
                if ((outputMsg.intents != undefined) && (outputMsg.intents.length > 0) && (outputMsg.intents[0].intent == 'tradeoptions')) {
                    try {
                        let userResources = await getUserTradeOptions(req.body.username);
                        res.json(userResources);
                    }
                    catch (e) {
                        throw e;
                    }
                }
                else if ((outputMsg.intents != undefined) && (outputMsg.intents.length > 0) && (outputMsg.intents[0].intent == 'balance')) {
                    try {
                        let userBalance = await getUserBalance(req.body.username);
                        res.json(userBalance);
                    }
                    catch (e) {
                        throw e;
                    }
                }
                else if ((outputMsg.intents != undefined) && (outputMsg.intents.length > 0) && (outputMsg.intents[0].intent == 'portfolio')) {
                    try {
                        let userPortfolio = await getPortfolios(req.body.username);
                        res.json(userPortfolio);
                    }
                    catch (e) {
                        throw e;
                    }
                }
                else if ((outputMsg.intents != undefined) && (outputMsg.intents.length > 0) && (outputMsg.intents[0].intent == 'invest')) {
                    let options = [];
                        outputMsg.output.generic.forEach(element => {
                            if (element.response_type == 'option') {
                                element.options.forEach(elementOption => {
                                    options.push(elementOption.label);
                                });
                            }
                        });

                        res.json({
                            status: 1,
                            options: options,
                            portfolio: [],
                            isMine: 0,
                            msg: outputMsg.output.text[0]
                        });
                }
                else if ((outputMsg.intents != undefined) && (outputMsg.intents.length > 0) && (outputMsg.intents[0].intent == 'getrisklevel')) {
                    if (outputMsg.entities[0].entity == 'risklevel'){
                        let investmentTypes;
                        if (outputMsg.entities[0].value == 'high'){
                            investmentTypes = 'equity, forex, currency, comodities'
                        }
                        else if (outputMsg.entities[0].value == 'medium'){
                            investmentTypes = 'mutual funds, Corporate Bonds'
                        }
                        else if (outputMsg.entities[0].value == 'low'){
                            investmentTypes = 'Govt. bonds, Fixed Deposites, Gold'
                        }
                        res.json({
                            status: 1,
                            options: [],
                            portfolio: [],
                            isMine: 0,
                            msg: investmentTypes
                        });
                    }
                }
                else {
                    res.json({
                        status: 1,
                        options: [],
                        portfolio: [],
                        isMine: 0,
                        msg: outputMsg.output.text[0],
                        inv : outputMsg
                    });
                }
            }
            catch (error) {
                console.log('Chatbot service error ===>>>', error)
                res.json({
                    status: 0,
                    options: [],
                    portfolio: [],
                    isMine: 0,
                    msg: 'Something got broken'
                })
            }
        }
    });
});

module.exports = router;