const Joi = require('@hapi/joi');

const userSchema = Joi.object().keys({
    username : Joi.string().alphanum().required()
});

module.exports = userSchema;

// mongo schema validator is applied only with db.createCollection() method while creating the db.