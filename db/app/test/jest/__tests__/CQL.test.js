/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/CQL.test.js 
 */

import { exec, checkRule, exportCQL, importCQL} from "src/tools/cql"
const path = require("path")
const fs = require("fs");

const cql_date = JSON.parse(fs.readFileSync(path.join(global.MOCKUP_PATH, "/cql/cql_date.json"), 'utf-8'))

const dbman = require('src/tools/dbman')
const db_fn = global.DB_TEST_PATH
import { View_cql } from "src/classes/View_CQL";
import { View_Observation } from "src/classes/View_Observation";
import { View_Concept_CQL_Lookup } from "src/classes/View_Concept_CQL_Lookup";
const VIEW_CQL = new View_cql(dbman, db_fn)
const VIEW_CONCEPT_CQL_LOOKUP = new View_Concept_CQL_Lookup(dbman, db_fn)
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

    it (`Erzeuge einen Export als JSON`, async () => {
    
    var res = await exportCQL({VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP})
    expect(res.status).toBe(true)
    expect(res.data).toBeDefined()
    
    //store to disk
    const fn = path.join(global.MOCKUP_PATH, 'cql', 'cql_export.json')
    console.log('writing data to Disk: ' + fn)
    fs.writeFileSync(fn, JSON.stringify(res.data))

  })

  it (`Erzeuge einen Import als JSON`, async () => {
    // LOAD DATA
    const fn = path.join(global.MOCKUP_PATH, 'cql', 'cql_import.json')
    console.log('reading data from Disk: ' + fn)
    const CQL_DATA = JSON.parse(await fs.readFileSync(fn,  'utf-8'))
    expect(CQL_DATA).toBeDefined()
    expect(CQL_DATA.length).toBeGreaterThan(2)

    //remove data, if existant
    for (let cql of CQL_DATA) {
      await VIEW_CQL.delete({CODE_CD: cql.CODE_CD, _force: true})
    }

    //do the import
    var res = await importCQL({data: CQL_DATA, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP})
    expect(res.status).toBe(true)
    expect(res.data).toBeDefined()
    expect(res.data.length).toBeGreaterThan(4)
    for (let d of res.data) {
      expect(d.status).toBeTruthy()
    }

    //

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
        let res = await checkRule({data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP: {}})
        expect(res).toBeDefined()
        expect(res.status).toBe(data.expected)
      }

  })

  it (`Überprüfe einen Datensatz entsprechend seines types und seiner CONCEPT_CD in CQL_FACT`, async () => {
    const DATA = [
      {type: dtypes.numeric, value: 4, CONCEPT_CD: 'LID: 72172-0', expected: true},
      {type: dtypes.numeric, value: -1, CONCEPT_CD: 'LID: 72172-0', expected: false},
      {type: dtypes.numeric, value: 46, CONCEPT_CD: 'LID: 72172-0', expected: false},
      {type: dtypes.numeric, value: '4', CONCEPT_CD: 'LID: 72172-0', expected: false},
    ]

    for (let data of DATA) {        
      let res = await checkRule({data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP})
      console.log('TestResult: ', JSON.stringify(res))
      expect(res).toBeDefined()
      expect(res.status).toBe(data.expected)
    }

})

})

