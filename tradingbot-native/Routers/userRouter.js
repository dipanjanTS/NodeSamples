const express = require('express');
const mongoUtils = require('../MongoConnection/mongoUtils');
const collections = require('../collections/collections');
const userQuery = require('../Quries/userQuery')
const userModel = require('../Models/userModel');
const router = express.Router();
const Joi = require('@hapi/joi');

/*
"uname" : "" 
 */

router.post('/signup', async (req,res) =>{
    

    Joi.validate(req.body, userModel, async (err,val) =>{
        if (err)
        {
            console.log('joi validation err ===>>', err)
            res.json({
                status: 0,
                msg: err.name,
                doc: {}
            });
        }
        else {
            const db = mongoUtils.getDB();
            const users = db.collection(collections.userCollection);
            try{
                const result = await userQuery.finduserByName(users,req.body.username.toLowerCase());
                if (result){
                    res.json({
                        status: 0,
                        msg: 'sorry try with some other username',
                        doc: {}
                    });
                }
                else {
                    var objNewUser = {
                        userName: req.body.username,
                        _userName: req.body.username.toLowerCase()
                    }
                    try {
                        const newuser = await userQuery.createUser(users, objNewUser);
                        if (newuser) {
                            res.json({
                                status: 1,
                                msg: 'successfuly created',
                                doc: newuser
                            });
                        }
                        else {
                            res.json({
                                status: 0,
                                msg: 'user not created',
                                doc: newuser
                            });
                        }
                    }
                    catch (e) {
                        throw e;
                    }
                }
            }
            catch (e){
                throw e;
            }
        }
    });
});


module.exports = router;