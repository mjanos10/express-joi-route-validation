'use strict'

const { validateSettingsSchema } = require('../src/schema')

describe('settingsSchema validation tests', () => {
  describe('basic validations', () => {
    test('non-object settingsSchema should fail', () => {
      const { error } = validateSettingsSchema('not an object')
      expect(error).not.toBe(null)
    })

    test('settings object with only unknown props should fail', () => {
      const { error } = validateSettingsSchema({ a: true })
      expect(error).not.toBe(null)
    })

    test('settings object with at least one correct key should pass', () => {
      const { error } = validateSettingsSchema({ options: {} })
      expect(error).toBe(null)
    })
  })

  describe('options validations', () => {
    test('settingsSchema with options should pass validation', () => {
      const { error } = validateSettingsSchema({ options: { useRequestAsJoiContext: true } })
      expect(error).toBe(null)
    })
  })

  describe('request property validation', () => {
    test('schema key is required', () => {
      const { error } = validateSettingsSchema({ body: {} })
      expect(error).not.toBe(null)
    })

    test('errorMessage should fail when not a string of fn', () => {
      const { error } = validateSettingsSchema({ body: { errorMessage: false, schema: {} } })
      expect(error).not.toBe(null)
    })

    test('errorMessage can be a string', () => {
      const { error } = validateSettingsSchema({ body: { errorMessage: 'something', schema: {} } })
      expect(error).toBe(null)
    })

    test('errorMessage can be a function', () => {
      const { error } = validateSettingsSchema({ body: { errorMessage: () => {}, schema: {} } })
      expect(error).toBe(null)
    })
  })

  describe('joiOptions validations', () => {
    const booleanOptions = [
      'abortEarly',
      'convert',
      'allowUnknown',
      'skipFunctions',
      'noDefaults',
      'escapeHtml',
    ]

    test.each(booleanOptions)('%s fails when not a boolean', prop => {
      const obj = {
        body: {
          schema: {},
          joiOptions: { [prop]: 'string' },
        },
      }
      const { error } = validateSettingsSchema(obj)
      expect(error).not.toBe(null)
    })

    test.each(booleanOptions)('%s passes test when a boolean', prop => {
      const obj = {
        body: {
          schema: {},
          joiOptions: { [prop]: false },
        },
      }
      const { error } = validateSettingsSchema(obj)
      expect(error).toBe(null)
    })

    test('stripUnknown passes when a boolean', () => {
      const { error } = validateSettingsSchema({
        body: {
          schema: {},
          joiOptions: { stripUnknown: false },
        },
      })
      expect(error).toBe(null)
    })

    test('stripUnknown passes when an object', () => {
      const { error } = validateSettingsSchema({
        body: {
          schema: {},
          joiOptions: { stripUnknown: { arrays: false, objects: true } },
        },
      })
      expect(error).toBe(null)
    })

    test('stripUnknown fails when an object with wrong keys', () => {
      const { error } = validateSettingsSchema({
        body: {
          schema: {},
          joiOptions: { stripUnknown: { arrays: 'non bool' } },
        },
      })
      expect(error).not.toBe(null)
    })

    test('stripUnknown fails when not an object or a string', () => {
      const { error } = validateSettingsSchema({
        body: { schema: {}, joiOptions: { stripUnknown: 'non-bool' } },
      })
      expect(error).not.toBe(null)
    })

    test('presence should fails when not a valid string', () => {
      const { error } = validateSettingsSchema({
        body: { schema: {}, joiOptions: { presence: 'invalid' } },
      })
      expect(error).not.toBe(null)
    })

    test('presence should passes when a valid string', () => {
      const { error } = validateSettingsSchema({
        body: { schema: {}, joiOptions: { presence: 'forbidden' } },
      })
      expect(error).toBe(null)
    })
  })
})
