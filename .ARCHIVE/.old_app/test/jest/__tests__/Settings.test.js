/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class Settings
 * @description Testen der Klasse **Settings.js**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Settings.test.js 
 */


import {LocalStorageMock} from './LocalStorageMock.js'
global.localStorage = new LocalStorageMock;


import {SETTINGS} from "src/classes/Settings"


describe('Teste SETTINGS', () => {

  it ('Starts with empty settings',  () => {
    expect(SETTINGS.data).toBeUndefined()
  })

  it ('inits correctly', async () => {
    SETTINGS.init()
    expect(SETTINGS.data).toBeDefined()
  })

  it ('save and load work correctly',  () => {
    SETTINGS.init()
    expect(SETTINGS.data).toBeDefined()

    // clear
    SETTINGS.clear()
    expect(SETTINGS.data).toBeUndefined()

    //load
    SETTINGS.load()
    expect(SETTINGS.data).toBeDefined()
  })
  
  it ('getter and setter', () => {
    expect(SETTINGS.data.user).toBe(null)
    SETTINGS.data = {label: 'user', value: 'John'}
    expect(SETTINGS.data.user).toBe('John')

    // wrong field
    expect(SETTINGS.data.name).toBe(undefined)
    SETTINGS.data = {label: 'name', value: 'John'}
    expect(SETTINGS.data.name).toBe(undefined)

  })



})

