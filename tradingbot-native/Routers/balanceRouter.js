const express = require('express');
const collections = require('../collections/collections');
const userQuery = require('../Quries/userQuery');
const balanceQuery = require('../Quries/balanceQuery');
const router = express.Router();
const mongoUtils = require('../MongoConnection/mongoUtils');
const balModel = require('../Models/balanceModel');
const Joi = require('@hapi/joi');
/*
"uname" : ""
"balance" : ""
*/

router.post('/add', async (req, res) => {
    Joi.validate(req.body, balModel, async (err, val) => {
        if (err) {
            console.log('validation error ===>>',err)
            res.json({
                status: 0,
                msg: err.name,
                doc: {}
            });
        }
        else {
            const db = mongoUtils.getDB();
            const users = db.collection(collections.userCollection);
            try {
                const user = await userQuery.finduserByName(users, req.body.username);
                //mongoUtils.disconnectDB();
                if (user) {
                    const db = mongoUtils.getDB();
                    const balances = db.collection(collections.balCollection);
                    try {
                        const result = await balanceQuery.findBalanceByName(balances, req.body.username)
                        if (result) {
                            res.json({
                                status: 0,
                                msg: 'user alredy have balance',
                                doc: {}
                            });
                        }
                        else {
                            const objNewBal = {
                                username: req.body.username.toLowerCase(),
                                balance: parseFloat(req.body.balance)
                            }
                            try {
                                const newBalance = await balanceQuery.addBalance(balances, objNewBal);
                                if (newBalance) {
                                    //mongoUtils.disconnectDB();
                                    res.json({
                                        status: 1,
                                        msg: 'successfuly added',
                                        doc: newBalance
                                    });
                                }
                                else {
                                    res.json({
                                        status: 0,
                                        msg: 'balance not added',
                                        doc: newBalance
                                    });
                                }
                            }
                            catch (e) {
                                throw e;
                            }
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                }
                else {
                    res.json({
                        status: 0,
                        msg: 'user not found',
                        doc: {}
                    });
                }
            }
            catch (e) {
                throw e;
            }
        }
    });

});

module.exports = router;