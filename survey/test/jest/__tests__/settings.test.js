// Run Test with:
// npm run test:unit test/jest/__tests__/settings.test.js 

import { SETTINGS } from "../../../src/tools/settings"


describe('SETTINGS Class', () => {

  it('can use empty settings', () => {
    expect(SETTINGS._DATA).not.toBe(undefined)
  });

  it('can change values', () => {
    expect(SETTINGS.size).toBe('normal')
    SETTINGS.size = 'big'
    expect(SETTINGS.size).toBe('big')

    expect(SETTINGS.email_export).toBe(undefined)
    SETTINGS.email_export = 'ste@ste'
    expect(SETTINGS.email_export).toBe('ste@ste')
    expect(SETTINGS._USER.email).toBe('ste@ste')
  })

  it('can save and load', () => {
    expect(SETTINGS._DATA).not.toBe(undefined)
    SETTINGS._DATA = undefined
    SETTINGS._USER.clear()
    expect(SETTINGS._DATA).toBe(undefined)
    SETTINGS.load()

    expect(SETTINGS._DATA).not.toBe(undefined)

    expect(SETTINGS._USER.email).toBe('ste@ste')

    
  })



})


