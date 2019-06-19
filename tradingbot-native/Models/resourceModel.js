const Joi = require('@hapi/joi');
const resourceModel = Joi.object().keys({
    username : Joi.string().alphanum().required(),
    resources : Joi.array().required().unique()
})
module.exports = resourceModel;