const Joi = require('@hapi/joi');
const objPortfolio = Joi.object().keys({
    symbol : Joi.string().alphanum().required(),
    percAlloc : Joi.number().required()
});
const portfolioModel = Joi.object().keys({
    username : Joi.string().alphanum().required(),
    portfolios : Joi.array().required().unique().items(objPortfolio)
})

module.exports = portfolioModel;