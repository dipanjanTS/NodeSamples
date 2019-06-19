const Joi = require('@hapi/joi');

const msgSchema = Joi.object().keys({
    username : Joi.string().alphanum().required(),
    msg : Joi.string().required()
});

module.exports = msgSchema;