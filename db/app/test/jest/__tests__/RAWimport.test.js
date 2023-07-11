/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @description Hiermit teste ich den Import / Export von Rohdaten
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/RAWimport.test.js 
 */

const fs = require("fs");
const path = require("path")
const raw_fn = path.join(global.MOCKUP_PATH, "/hl7/patient_10019815_2023-01-22_HL7.json")
const dbman = require('../../../src/tools/dbman')

const db_fn = global.DB_TEST_PATH
import { View_Concept } from "src/classes/View_Concept";
import { View_Patient } from "src/classes/View_Patient";
import { View_Visit } from "src/classes/View_Visit";
import { View_Observation } from "src/classes/View_Observation";
const VIEW_CONCEPT = new View_Concept(dbman, db_fn)
const VIEW_PATIENT = new View_Patient(dbman, db_fn)
const VIEW_VISIT= new View_Visit(dbman, db_fn)
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn)

const DUMMY = {PATIENT_NUM: undefined, ENCOUNTER_NUM: undefined}

// FUNCTIONS TO TEST
import { raw_read, raw_write } from "src/tools/raw_import";

describe('Teste RAW import', () => {
  
  beforeAll(async () => {
      // CREATE DUMMY PATIENT
      console.log('CREATE DUMMY PATIENT')
      const patient = await VIEW_PATIENT.create({BIRTH_DATE: '2022', AGE_IN_YEARS: 10})
      DUMMY.PATIENT_NUM = patient.data.PATIENT_NUM
      const visit = await VIEW_VISIT.create({PATIENT_NUM: DUMMY.PATIENT_NUM})
      DUMMY.ENCOUNTER_NUM = visit.data.ENCOUNTER_NUM
      console.log(DUMMY)

  })

  // afterAll(async () => {
  //   const status = await VIEW_PATIENT.delete({PATIENT_NUM: DUMMY.PATIENT_NUM})
  //   console.log('Deleting DUMMY Patient: ', status.status)
  // })

  it (`Das Testfile existiert`, async () => {
    expect(fs.existsSync(raw_fn))
  })

  it (`Das Testfile wird korrect eingelesen und wieder schreiben`, async () => {
    // READ TESTFILE
    const status_read = await raw_read(raw_fn, fs, path)
    expect(status_read).toBeTruthy()
    // WRITE OUTPUT
    status_read.data.filename = 'output222'
    const status_write = await raw_write(status_read.data, fs, path)
    expect(status_write).toBeTruthy()
    // NOW CHECK IF ORIG and OUTPUT are the SAME
    const status_check = await raw_read(status_write.data, fs, path)
    expect(JSON.stringify(status_check.data.buffer)).toBe(JSON.stringify(status_read.data.buffer))
  })

  it (`Add somedata to the db and retrieve it`, async() => {
    // READ TESTFILE
    const status_read = await raw_read(raw_fn, fs, path)
    expect(status_read).toBeTruthy()

    // PREPARE THE PAYLOAD
    const payload = {
      PATIENT_NUM: DUMMY.PATIENT_NUM, 
      ENCOUNTER_NUM: DUMMY.ENCOUNTER_NUM, 
      PROVIDER_ID: 'sb71279', 
      CATEGORY_CHAR: 'RAW',
      TVAL_CHAR: JSON.stringify({filename: status_read.data.filename+status_read.data.ext, ext: status_read.data.ext, source_dir: status_read.data.dir}),
      OBSERVATION_BLOB: status_read.data.buffer,
      UPLOAD_ID: 'sb71279', 
      SOURCESYSTEM_CD: 'SNOMED-CT',
      VALUEFLAG_CD: status_read.data.signature
    }
    // CREATE THE OBSERVATION
    const status_prepare_create = await VIEW_OBSERVATION.prepare_create(payload)
    // CHECK IF THE OBSERVATION EXISTS
    const status_obs = await VIEW_OBSERVATION.read({OBSERVATION_ID: status_prepare_create.data.OBSERVATION_ID})
    // check the data and the blob
    expect(status_obs).toBeTruthy() 
    expect(JSON.stringify(status_obs.data[0].OBSERVATION_BLOB)).toBe(JSON.stringify(status_read.data.buffer))
  })
  
})

