/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/CQL.test.js 
 */

import { exec, checkRule } from "src/tools/cql"
const path = require("path")
const fs = require("fs");

const cql_date = JSON.parse(fs.readFileSync(path.join(global.MOCKUP_PATH, "/cql/cql_date.json"), 'utf-8'))

const dbman = require('src/tools/dbman')
const db_fn = global.DB_TEST_PATH
import { View_cql } from "src/classes/View_CQL";
import { View_Observation } from "src/classes/View_Observation";
const VIEW_CQL = new View_cql(dbman, db_fn)
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn)
const {dtypes} = require('src/classes/more/dtypes')

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
    expect(res.data.check).toBeDefined()
    
    // console.log(res.data.unfilteredResults)
  })

  it (`Überprüfe einen Datensatz entsprechend seines types und einer definierten Regel in CQL_FACT`, async () => {
      const DATA = [
        {type: dtypes.numeric, value: 123, expected: true},
        {type: dtypes.date, value: '2022-01-11', expected: true},
        {type: dtypes.string, value: 'haloo', expected: true},
        {type: dtypes.blob, value: 'hallo', expected: true},
        {type: dtypes.numeric, value: '123', expected: false},
        {type: dtypes.date, value: '2022-1-11', expected: false},
        {type: dtypes.string, value: 123, expected: false},
        {type: dtypes.blob, value: 123, expected: false},
      ]

      for (let data of DATA) {        
        let res = await checkRule({data, VIEW_CQL})
        expect(res).toBeDefined()
        expect(res.status).toBe(data.expected)
      }

  })

})

