const Joi = require('joi')

const requestPropSchema = Joi.object().keys({
  errorMessage: Joi.alternatives().try(Joi.func(), Joi.string()),
  schema: Joi.any().required(),
})

const settingsSchema = Joi.object()
  .keys({
    params: requestPropSchema,
    query: requestPropSchema,
    body: requestPropSchema,
    options: Joi.object().keys({
      useRequestAsJoiContext: Joi.boolean(),
      updateRequest: Joi.boolean(),
      errorHandler: Joi.func(),
      continueOnValidationError: Joi.boolean(),
      abortOnFirstError: Joi.boolean(),
    }),
  })
  .min(1)

const validateSettingsSchema = schema => settingsSchema.validate(schema)

module.exports = {
  settingsSchema,
  validateSettingsSchema,
}
