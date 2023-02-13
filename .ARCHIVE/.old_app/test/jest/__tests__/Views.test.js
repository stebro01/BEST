/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Views.test.js 
 */

const fs = require("fs");
const dbman = require('../../../src-electron/dbman')

// schemes
import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'
import { SCHEME_CONCEPT_DIMENSION } from 'src/classes/Scheme_concept_dimension';
import { SCHEME_MODIFIER_DIMENSION } from 'src/classes/Scheme_modifier_dimension';
import { SCHEME_PATIENT_DIMENSION } from 'src/classes/Scheme_patient_dimension';
import { SCHEME_VISIT_DIMENSION } from 'src/classes/Scheme_visit_dimension';
import { SCHEME_PROVIDER_DIMENSION } from 'src/classes/Scheme_provider_dimension';
import { SCHEME_OBSERVATION_FACT } from 'src/classes/Scheme_observation_fact';

// MOCKUP DATA
import {MOCKUP_CODE_LOOKUP, MOCKUP_CONCEPT_DIMENSION, MOCKUP_MODIFIER_DIMENSION, MOCKUP_PROVIDER_DIMENSION, MOCKUP_PATIENT_DIMENSION, MOCKUP_VISIT_DIMENSION, MOCKUP_OBSERVATION_FACT} from '../mockups/db_mockup_data'

// VIEWS
import {View_Patient} from '../../../src/classes/View_Patient'
import {View_Visit} from '../../../src/classes/View_Visit'
import {View_Observation} from '../../../src/classes/View_Observation'

describe('Teste die VIEWs für die DB', () => {
  const db_fn = global.DB_TEST_PATH

  beforeAll(() => {
    // erzeuge eine leere neue DB
    if (fs.existsSync(db_fn)) {
      fs.unlinkSync(db_fn)
    }
    dbman.create(db_fn)
   })

   it (`Erzeuge Mockup - Table: ${db_fn}`, async() => {
    dbman.connect(db_fn)    
    await perform_sql(SCHEME_CODE_LOOKUP, MOCKUP_CODE_LOOKUP)
    await perform_sql(SCHEME_CONCEPT_DIMENSION, MOCKUP_CONCEPT_DIMENSION)
    await perform_sql(SCHEME_MODIFIER_DIMENSION, MOCKUP_MODIFIER_DIMENSION)
    await perform_sql(SCHEME_PATIENT_DIMENSION, MOCKUP_PATIENT_DIMENSION)
    await perform_sql(SCHEME_VISIT_DIMENSION, MOCKUP_VISIT_DIMENSION)
    await perform_sql(SCHEME_PROVIDER_DIMENSION, MOCKUP_PROVIDER_DIMENSION)
    await perform_sql(SCHEME_OBSERVATION_FACT, MOCKUP_OBSERVATION_FACT)

    dbman.close()
  })

  it (`Teste View_Patient: read`, async() => {
   
    //invalid instanciation
    var status = undefined
    const INVALID_PATIENT = new View_Patient()
    status = await INVALID_PATIENT.read({})
    expect(status.error).not.toBe(undefined)

    //valid instanciation
    const PATIENT = new View_Patient(dbman, db_fn); status = undefined
    status = await PATIENT.read({NAME: 'Peter'})
    expect(status.error).not.toBe(undefined)
    status = await PATIENT.read({PATIENT_NUM: 1})
    expect(status.error).toBe(undefined)
    expect(status.data.length).toBeGreaterThan(0)
    expect(status.data[0].PATIENT_NUM).toBe(1)
  })

  it (`Teste View_Patient: create`, async() => {
    var res = undefined
    const PATIENT = new View_Patient(dbman, db_fn)
    res = await PATIENT.create({BIRTH_DATE: '2022', AGE_IN_YEARS: 10})
    expect(res.status).toBe(true)
    expect(res.data.PATIENT_NUM).toBe(2)
  })

  it (`Teste View_Patient: resolve_cd`, async() => {
    var res = undefined
    const PATIENT = new View_Patient(dbman, db_fn)
    res = await PATIENT.resolve_cd()
    expect(res.status).toBe(true)
    expect(res.data).not.toBe(undefined)
    expect(res.data.SEX_CD.length).toBeGreaterThan(0)
    expect(res.data.RACE_CD.length).toBeGreaterThan(0)
    expect(res.data.MARITAL_STATUS_CD.length).toBeGreaterThan(0)
    expect(res.data.LANGUAGE_CD.length).toBeGreaterThan(0)
  })

  it (`Teste View_Patient: update`, async() => {
    var res = undefined
    const PATIENT = new View_Patient(dbman, db_fn)
    res = await PATIENT.read({PATIENT_NUM: 1})
    expect(res.error).toBe(undefined)
    expect(res.data[0].AGE_IN_YEARS).toBe(42)

    //UPDATE
    res = await PATIENT.update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 45}})
    expect(res.error).toBe(undefined)

    //CHECK
    res = await PATIENT.read({PATIENT_NUM: 1})
    expect(res.error).toBe(undefined)
    expect(res.data[0].AGE_IN_YEARS).toBe(45)
  })

  it (`Teste View_Patient: delete`, async() => {
    var res = undefined
    const PATIENT = new View_Patient(dbman, db_fn)
    var res_created = await PATIENT.create({AGE_IN_YEARS: 100})
    expect(res_created.error).toBe(undefined)
    
    //check
    res = await PATIENT.read(res_created.data)
    expect(res.error).toBe(undefined)
    expect(res.data[0].AGE_IN_YEARS).toBe(100)

    //DELETE
    res = await PATIENT.delete(res_created.data)
    expect(res.error).toBe(undefined)

    //check
    res = await PATIENT.read(res_created.data)
    expect(res.error).toBe(undefined)
    expect(res.data.length).toBe(0)
  })

  // VISIT
  it (`Teste View_Visit: create`, async() => {
    var res = undefined
    const VISIT = new View_Visit(dbman, db_fn)

    // INVALID Payload: PATIENT_NUM should not be undefined!
    res = await VISIT.create({START_DATE: '202211', LOCATION_CD: 'HNO'})
    expect(res.error).not.toBe(undefined)
    // CORRECT Payload: PATIENT_NUM should not be undefined!
    res = await VISIT.create({PATIENT_NUM: 2, START_DATE: '202211', LOCATION_CD: 'HNO'})
    expect(res.error).toBe(undefined)
  })

  it (`Teste View_Visit: resolve_cd`, async() => {
    var res = undefined
    const VISIT = new View_Visit(dbman, db_fn)
    res = await VISIT.resolve_cd()
    expect(res.status).toBe(true)
    
  })


  // OBSERVATION
    // VISIT
    it (`Teste View_Observation: create`, async() => {
      var res = undefined
      const OBSERVATION = new View_Observation(dbman, db_fn)
  
      // INVALID Payload: PATIENT_NUM, ENCOUNTER_NUM, PROVIDER_ID should not be undefined!
      res = await OBSERVATION.create({START_DATE: '202211', CONCEPT_CD: 'AGE', NVAL_NUM: 10})
      expect(res.error).not.toBe(undefined)
      // CORRECT Payload: PATIENT_NUM should not be undefined!
      res = await OBSERVATION.create({PATIENT_NUM: 1, ENCOUNTER_NUM: 1, PROVIDER_ID: 'sb', START_DATE: '202211', CONCEPT_CD: 'AGE', NVAL_NUM: 10})
      expect(res.error).toBe(undefined)
    })

    it (`Teste View_Observation: scheme_find`, async() => {
      var res = undefined
      const OBSERVATION = new View_Observation(dbman, db_fn)
      //suche alle verfügbaren Schemes
      res = await OBSERVATION.scheme_find() 
      expect(res.status).toBe(true)
      expect(res.data.length).toBeGreaterThan(1)
      //suche alle verfügbaren Schemes
      res = await OBSERVATION.scheme_find({CODE_CD: 'mci_precog'}) 
      expect(res.status).toBe(true)
      expect(res.data.length).toBe(1)
    })

    it (`Teste View_Observation: scheme_resolve`, async() => {
      var res = undefined
      const OBSERVATION = new View_Observation(dbman, db_fn)

      //suche alle verfügbaren Schemes
      res = await OBSERVATION.scheme_resolve({CODE_CD: 'mci_precog'}) 
      expect(res.status).toBe(true)
      expect(res.data.length).toBeGreaterThan(0)
    })
  
})

// used for adding data to db >> input are a SCHEME {class} and MOCKUP {object}
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