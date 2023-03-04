/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class Scheme_X
 * @description Testen der Klassen: **Scheme_code_lookup.js** als Inheritance von Scheme_X.js
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/SchemeX.test.js 
 */

const fs = require("fs");
const dbman = require('../../../src-electron/dbman')

// schemes
import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'
import { SCHEME_CONCEPT_DIMENSION } from 'src/classes/Scheme_concept_dimension';
import { SCHEME_PATIENT_DIMENSION } from 'src/classes/Scheme_patient_dimension';
import { SCHEME_VISIT_DIMENSION } from 'src/classes/Scheme_visit_dimension';
import { SCHEME_PROVIDER_DIMENSION } from 'src/classes/Scheme_provider_dimension';
import { SCHEME_OBSERVATION_FACT } from 'src/classes/Scheme_observation_fact';

// MOCKUP DATA
import {MOCKUP_CODE_LOOKUP, MOCKUP_CONCEPT_DIMENSION, MOCKUP_PROVIDER_DIMENSION, MOCKUP_PATIENT_DIMENSION, MOCKUP_VISIT_DIMENSION, MOCKUP_OBSERVATION_FACT} from '../mockups/db_mockup_data'


describe('Teste Scheme_XXX', () => {
  const db_fn = global.DB_TEST_PATH

  beforeAll(() => {
    // erzeuge eine leere neue DB
    console.log('erzeuge neue DB: ' + db_fn)
    if (fs.existsSync(db_fn)) {
      fs.unlinkSync(db_fn)
    }
    dbman.create(db_fn)
   })


  it ('Teste SCHEME_CODE_LOOKUP', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_CODE_LOOKUP, MOCKUP_CODE_LOOKUP)
    dbman.close()
  })

  it ('Teste SCHEME_CONCEPT_DIMENSION', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_CONCEPT_DIMENSION, MOCKUP_CONCEPT_DIMENSION)
    dbman.close()
  })


  it ('Teste SCHEME_PATIENT_DIMENSION', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_PATIENT_DIMENSION, MOCKUP_PATIENT_DIMENSION)
    dbman.close()
  })

  it ('Teste SCHEME_VISIT_DIMENSION', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_VISIT_DIMENSION, MOCKUP_VISIT_DIMENSION)
    dbman.close()
  })

  it ('Teste SCHEME_PROVIDER_DIMENSION', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_PROVIDER_DIMENSION, MOCKUP_PROVIDER_DIMENSION)
    dbman.close()
  })

  it ('Teste SCHEME_OBSERVATION_FACT', async() => {
    dbman.connect(db_fn)    
    const status = await perform_sql(SCHEME_OBSERVATION_FACT, MOCKUP_OBSERVATION_FACT)
    dbman.close()
  })


})

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