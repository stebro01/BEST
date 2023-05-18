/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * MERGE DB
 * - zusammenfügen von Tablen einer DB =>
 * 1. einzelne Tables wie: CONCEPT_DIMENSION, 
 * 2. Komplette Patienten / Visiten / Observations
 * @description Testen der Klassen: **Scheme_code_lookup.js** als Inheritance von Scheme_X.js
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Merge_DB.test.js 
 */

const fs = require("fs");
const dbman = require('../../../src/tools/dbman')
const db_merge = require('src/tools/db_merge')
// schemes
// import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'
import { SCHEME_CONCEPT_DIMENSION } from 'src/classes/Scheme_concept_dimension';
// import { SCHEME_PATIENT_DIMENSION } from 'src/classes/Scheme_patient_dimension';
// import { SCHEME_VISIT_DIMENSION } from 'src/classes/Scheme_visit_dimension';
// import { SCHEME_PROVIDER_DIMENSION } from 'src/classes/Scheme_provider_dimension';
// import { SCHEME_OBSERVATION_FACT } from 'src/classes/Scheme_observation_fact';

// MOCKUP DATA
import {MOCKUP_CONCEPT_DIMENSION} from '../mockups/db_mockup_data'

const db_main_fn = global.DB_MAIN_PATH
const db_secondary_fn = global.DB_SECONDARY_PATH

describe(`merge ${db_main_fn} => ${db_secondary_fn}`, () => {
  beforeAll(() => {
    // erzeuge eine leere neue DB
    create_db(db_main_fn)
    create_db(db_secondary_fn)
   })


  it ('Bereite den Table CONCEPT_DIMENSION mit MOCK-DATA vor', async() => {
    var status = false
    status = await fill_table(db_main_fn, SCHEME_CONCEPT_DIMENSION, MOCKUP_CONCEPT_DIMENSION.slice(0,13))
    expect(status).toBeTruthy()
    MOCKUP_CONCEPT_DIMENSION[12].UPDATE_DATE = '2023-06'
    status = await fill_table(db_secondary_fn, SCHEME_CONCEPT_DIMENSION, MOCKUP_CONCEPT_DIMENSION.slice(11,20))
    expect(status).toBeTruthy()
  })

  it ('Merged daten from: main <- secondary TABLE: CONCEPT_DIMENSION', async() => {
    var res = await db_merge.mergeTable({fn_db_target: db_main_fn, fn_db_from: db_secondary_fn, scheme: SCHEME_CONCEPT_DIMENSION}, dbman)
    console.log(res)
    expect(res.status).toBeTruthy()
  })


})

function create_db(db_fn){
  console.log('erzeuge neue DB: ' + db_fn)
  if (fs.existsSync(db_fn)) {
    fs.unlinkSync(db_fn)
  }
  dbman.create(db_fn)
}

async function fill_table(db_fn, SCHEME, MOCKUP) {
  console.log(`Fülle table "${db_fn}" mit ${MOCKUP.length} Elementen`)
  dbman.connect(db_fn)
  const status = await perform_sql(SCHEME, MOCKUP)
  dbman.close()
  return true
}

async function perform_sql(SCHEME, MOCKUP) {
  // erzeuge den table
  const sql_query = SCHEME.init()
  expect(sql_query.query).not.toBe(undefined)
  const res = await dbman.run(sql_query.query)
  expect(res.status).toBe(true)
  //schreibe die Daten
  MOCKUP.forEach(async (el) => {
    let sql_query = SCHEME.create(el)
    let res = await dbman.run(sql_query.query)
    expect(res.status).toBe(true)
  })
  return true
}