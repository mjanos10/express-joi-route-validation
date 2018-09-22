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
})
