/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/CQL.test.js 
 */

import { exec } from "src/tools/cql"
const path = require("path")
const fs = require("fs");

const cql_date = JSON.parse(fs.readFileSync(path.join(global.MOCKUP_PATH, "/cql/cql_date.json"), 'utf-8'))

describe('Teste CQL Funktionen', () => {

  beforeAll(() => {
    
  })

  it (`Importiere ein Testfile > Observations.csv`, () => {
    const payload = {
      parameters: { "A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47' },
      lib: cql_date
    }
    var res = exec(payload)
    
    expect(res.status).toBe(true)
    expect(res.data.unfilteredResults).toBeDefined()
    expect(res.data.unfilteredResults.Add).toBe(payload.parameters.A + payload.parameters.B)
    // console.log(res.data.unfilteredResults)
  })

})

