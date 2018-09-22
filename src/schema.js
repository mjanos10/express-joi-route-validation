const Joi = require('joi')

module.exports = {
  validatorSchema: Joi.object()
    .keys({
      params: Joi.any(),
      query: Joi.any(),
      body: Joi.any(),
      options: Joi.object().keys({
        useRequestAsJoiContext: Joi.boolean(),
        updateRequest: Joi.boolean(),
        errorHandler: Joi.func(),
        continueOnValidationError: Joi.boolean(),
        abortOnFirstError: Joi.boolean(),
      }),
    })
    .min(1),
}
