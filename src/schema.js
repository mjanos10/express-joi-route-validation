const Joi = require('joi')

module.exports = {
  validatorSchema: Joi.object().keys({
    params: Joi.any(),
    query: Joi.any(),
    body: Joi.any()
  }).min(1)
}
