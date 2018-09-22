const Joi = require('joi')

const requestPropSchema = Joi.object().keys({
  schema: Joi.any().required(),
  errorMessage: Joi.alternatives().try(Joi.func(), Joi.string()),
  joiOptions: Joi.object().keys({
    abortEarly: Joi.boolean().default(true),
    convert: Joi.boolean().default(true),
    allowUnknown: Joi.boolean().default(false),
    skipFunctions: Joi.boolean().default(false),
    stripUnknown: Joi.alternatives().try(
      Joi.boolean().default(false),
      Joi.object().keys({
        arrays: Joi.boolean().default(false),
        objects: Joi.boolean().default(false),
      }),
    ),
    languaage: Joi.any().default({}),
    presence: Joi.string()
      .valid('optional', 'required', 'forbidden')
      .default('optional'),
    context: Joi.any(),
    noDefaults: Joi.boolean().default(false),
    escapeHtml: Joi.boolean().default(false),
  }),
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
