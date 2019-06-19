
const express = require('express');
const collections = require('../collections/collections');
const userQuery = require('../Quries/userQuery');
const portfolioQuery = require('../Quries/portfolioQuery');
const portFolioModel = require('../Models/portfolioModel');
const Joi = require('@hapi/joi');
const router = express.Router();
const mongoUtils = require('../MongoConnection/mongoUtils');

/*
"uname" : ""
"portfolios" : [{
    symbol : "",
    percAlloc : 0.0
}, {
    symbol : "",
    percAlloc : 0.0
}]
*/

router.post('/add', async (req, res) => {
    Joi.validate(req.body, portFolioModel, async (err, val) => {
        if (err) {
            console.log('validation error ===>>>', err)
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
                if (user) {
                    const db = mongoUtils.getDB();
                    const portfolios = db.collection(collections.pfCollection);
                    const result = await portfolioQuery.findPortfolioByName(portfolios, req.body.username)
                    if (result) {
                        res.json({
                            status: 0,
                            msg: 'user already have portfolio',
                            doc: {}
                        });
                    }
                    else {
                        const objNewPortfoilio = {
                            username: req.body.username.toLowerCase(),
                            portfolios: req.body.portfolios
                        }
                        try {
                            const newPortfolio = await portfolioQuery.addPortfolio(portfolios, objNewPortfoilio);
                            if (newPortfolio) {
                                //mongoUtils.disconnectDB();
                                res.json({
                                    status: 1,
                                    msg: 'successfuly added',
                                    doc: newPortfolio
                                });
                            }
                            else {
                                res.json({
                                    status: 0,
                                    msg: 'portfolio not added',
                                    doc: newPortfolio
                                });
                            }
                        }
                        catch (e) {
                            throw e;
                        }
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