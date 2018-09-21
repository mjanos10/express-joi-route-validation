'use strict'

const Joi = require('joi')
const { validatorSchema } = require('./schema')

const REQUEST_VALIDATION = ['params', 'query', 'body']
const ERROR_SYMBOL = Symbol('ValidationError')

const getValidationMessage = (errorMsg = '', error) => {
  const message = typeof errorMsg === 'function' ? errorMsg(error) : errorMsg

  if (typeof errorMsg !== 'string') {
    throw new Error(`Validation.errorMessage should be a string!`)
  }

  return message
}

const validator = validationSettings => {
  const { error: validatorError } = Joi.validate(validationSettings, validatorSchema)

  if (validatorError) {
    throw new Error(`Invalid validationSettings supplied`)
  }

  const defaultOptions = {
    useRequestAsJoiContext: false,
    updateRequest: true,
    errorHandler: null,
    continueOnValidationError: false,
  }

  const options = validationSettings.options
    ? { ...defaultOptions, ...validationSettings.options }
    : defaultOptions

  return (req, res, next) => {
    const errors = []

    for (let requestProp of REQUEST_VALIDATION) {
      /** @type OneValidationSetting */
      const validation = validationSettings[requestProp]

      if (!validation) {
        continue
      }

      if (!validation.schema) {
        throw new Error(`A schema is required.`)
      }

      const dataToValidate =
        typeof validation.preValidation === 'function'
          ? validation.preValidation(req[requestProp])
          : req[requestProp]

      if (validation.useRequestAsJoiContext) {
        validation.joiOptions.context = req
      }

      const { value, error } = validation.schema.validate(dataToValidate, validation.joiOptions)

      if (error) {
        error[ERROR_SYMBOL] = true
        error.validationMessage = getValidationMessage(validation.errorMessage, error)

        errors.push(error)
      } else if (options.updateRequest) {
        req[requestProp] = value
      }
    }

    if (errors.length === 0 || options.continueOnValidationError === true) {
      return next()
    }

    if (typeof options.errorHandler === 'function') {
      return options.errorHandler(errors, req, res, next)
    }

    return next(errors)
  }
}

const isValidationError = err => err && err[ERROR_SYMBOL] === true

module.exports = {
  validator,
  isValidationError,
  Joi,
}
