/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/QuerySnomedAPI.test.js 
 */

import * as SNOMED from "src/tools/snomed_api"

describe('Teste die SNOMED API', () => {

  beforeAll(() => {
    
  })

  // it (`Frage ab: 433178008`, async() => {
  //   const SNOMED_ID = 433178008
  //   const res = await SNOMED.query(SNOMED_ID)

  //   expect(res).toBeDefined()
  //   expect(res.conceptId).toBe(`${SNOMED_ID}`)

  // })

  it (`Löse auf ab: 433178008`, async() => {
    const SNOMED_ID = 433178008
    const res = await SNOMED.resolve(SNOMED_ID)
    expect(res).toBeDefined()

    console.log(res)
  })

   

})

