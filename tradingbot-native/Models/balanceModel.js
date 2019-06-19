const Joi = require('@hapi/joi');

const balSchema = Joi.object().keys({
    username : Joi.string().alphanum().required(),
    balance : Joi.number().required()
});

module.exports = balSchema;