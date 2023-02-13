/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @method myDate
 * @description Testen der Funktionen in **mydate.js**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/mydate.test.js 
 */



import {now} from "src/tools/mydate.js"


describe('Teste myDate', () => {

  it ('Kann ein aktuelles Datum formatieren',  () => {
    
    const D = now()
    console.log(D)
    expect(D).not.toBe(undefined)
  })





})

