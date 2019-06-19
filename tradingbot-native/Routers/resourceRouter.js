const express = require('express');
const collections = require('../collections/collections');
const userQuery = require('../Quries/userQuery');
const resourceQuery = require('../Quries/resourceQuery');
const resourceModel = require('../Models/resourceModel');
const router = express.Router();
const mongoUtils = require('../MongoConnection/mongoUtils');
const Joi = require('@hapi/joi');
/*
"uname" : ""
"resources" : ["","",""]
*/

router.post('/add', async (req, res) => {
    Joi.validate(req.body, resourceModel, async (err, val) => {
        if (err) {
            console.log('validation err ===>>>', err)
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
                const user = await userQuery.finduserByName(users, req.body.username)
                if (user) { // search user registered or not
                    const db = mongoUtils.getDB();
                    const resources = db.collection(collections.resCollection);
                    try {
                        const result = await resourceQuery.findResourcesByName(resources, req.body.username) // search user has resource or not
                        if (result) {
                            res.json({
                                status: 0,
                                msg: 'user allready have resource added',
                                doc: {}
                            });
                        }
                        else {
                            const objNewResource = {
                                username: req.body.username.toLowerCase(),
                                resources: req.body.resources
                            }
                            try {
                                const newResource = await resourceQuery.addResource(resources, objNewResource);
                                if (newResource) {
                                    //mongoUtils.disconnectDB();
                                    res.json({
                                        status: 1,
                                        msg: 'successfuly added',
                                        doc: newResource
                                    });
                                }
                                else {
                                    res.json({
                                        status: 0,
                                        msg: 'resource not added',
                                        doc: newResource
                                    });
                                }
                            }
                            catch (e) {
                                throw e;
                            }
                        }
                    }
                    catch (e) {
                        throw e
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