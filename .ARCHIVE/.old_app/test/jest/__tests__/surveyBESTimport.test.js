/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/surveyBESTimport.test.js 
 */

const fs = require("fs");
const path = require("path")
const dbman = require('../../../src-electron/dbman')

const db_fn = global.DB_TEST_PATH
const mockup_fn = path.resolve(global.MOCKUP_PATH, 'surveyBEST')
import { View_Concept } from "src/classes/View_Concept";
import { View_Patient } from "src/classes/View_Patient";
import { View_Visit } from "src/classes/View_Visit";
import { View_Observation } from "src/classes/View_Observation";

const VIEW_CONCEPT = new View_Concept(dbman, db_fn)
const VIEW_PATIENT = new View_Patient(dbman, db_fn)
const VIEW_VISIT= new View_Visit(dbman, db_fn)
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn)

//MOCKUP DATA
const bdi2_json = fs.readFileSync(path.resolve(mockup_fn, 'quest_bdi2.json'), 'utf-8')
const bdi2_html = fs.readFileSync(path.resolve(mockup_fn, 'quest_bdi2.html'), 'utf-8')

const biomag_json = fs.readFileSync(path.resolve(mockup_fn, 'quest_biomag_fw.json'), 'utf-8')
const biomag_html = fs.readFileSync(path.resolve(mockup_fn, 'quest_biomag_fw.html'), 'utf-8')

const mfq_json = fs.readFileSync(path.resolve(mockup_fn, 'quest_MFQ.json'), 'utf-8')
const mfq_html = fs.readFileSync(path.resolve(mockup_fn, 'quest_MFQ.html'), 'utf-8')

const nihs_json = fs.readFileSync(path.resolve(mockup_fn, 'quest_nihs.json'), 'utf-8')

// FUNCTIONS TO TEST
import { extract_cda, importCDAtoObject } from "src/tools/surveybest_import";
import { addHL7ObjectToDB } from "src/tools/hl7_import";


describe('Teste surveyBEST import Funktionen', () => {
  
  // beforeAll(() => {
    
  // })

  it (`Die Testfiles wurde korrekt eingelesen`, () => {
    expect(bdi2_json).toBeDefined()
    expect(bdi2_html).toBeDefined()
    expect(biomag_json).toBeDefined()
    expect(biomag_html).toBeDefined()
    expect(mfq_json).toBeDefined()
    expect(mfq_html).toBeDefined()

    expect(JSON.parse(bdi2_json).cda).toBeDefined()
    expect(JSON.parse(biomag_json).cda).toBeDefined()
    expect(JSON.parse(mfq_json).cda).toBeDefined()
  })

  it (`Das CDA kann erfolgreich aus JSON/HTML Files extrahiert werden`, () => {
    // JSON
    var CDA_FROM_JSON = extract_cda(bdi2_json)
    expect(CDA_FROM_JSON.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()
    CDA_FROM_JSON = extract_cda(biomag_json)
    expect(CDA_FROM_JSON.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()
    CDA_FROM_JSON = extract_cda(mfq_json)
    expect(CDA_FROM_JSON.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()

    // HTML
    var CDA_FROM_HTML = extract_cda(bdi2_html)
    expect(CDA_FROM_HTML.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()
    CDA_FROM_HTML = extract_cda(biomag_html)
    expect(CDA_FROM_HTML.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()
    CDA_FROM_HTML = extract_cda(mfq_html)
    expect(CDA_FROM_HTML.status).toBeTruthy()
    expect(CDA_FROM_JSON.data.cda).toBeDefined()
  })

  it (`BDI2 wird korrekt eingelesen und entsprechende Daten extrahiert: {PATIENT, VISITS, OBSERVATIONS}`, async () => {
    var CDA_FROM_JSON = extract_cda(bdi2_json)
    const res = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
    expect(res).not.toBeUndefined()
    checkObject(res)
  })

  it (`MFQ wird korrekt eingelesen und entsprechende Daten extrahiert: {PATIENT, VISITS, OBSERVATIONS}`, async () => {
    var CDA_FROM_JSON = extract_cda(mfq_json)
    const res = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
    expect(res).not.toBeUndefined()
    checkObject(res)
  })

  it (`NIHS wird korrekt eingelesen und entsprechende Daten extrahiert: {PATIENT, VISITS, OBSERVATIONS}`, async () => {
    var CDA_FROM_JSON = extract_cda(nihs_json)
    const res = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
    expect(res).not.toBeUndefined()
    checkObject(res)
    expect(res.OBSERVATIONS[0][1].NVAL_NUM).toBe(23)
  })

  it (`BIOMAGFW wird korrekt eingelesen und entsprechende Daten extrahiert: {PATIENT, VISITS, OBSERVATIONS}`, async () => {
    var CDA_FROM_JSON = extract_cda(biomag_json)
    const res = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
    expect(res).not.toBeUndefined()
    checkObject(res)

    // console.log(res)
  })

  it (`BIOMAGFW wird korrekt eingelesen und in die DB eingetragen`, async () => {
    var CDA_FROM_JSON = extract_cda(biomag_json)
    const DATA = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
    expect(DATA).not.toBeUndefined()
    const status = await addHL7ObjectToDB(DATA, VIEW_PATIENT, VIEW_VISIT, VIEW_OBSERVATION)
    expect(status.status).toBeTruthy()
    console.log(status)

    // console.log(res)
  })




})

function checkObject(obj) {
  expect(obj.PATIENT).toBeDefined()
  expect(obj.PATIENT.PATIENT_CD).toBe('DEMO')
  expect(obj.VISITS).toBeDefined()
  expect(obj.VISITS[0].ENCOUNTER_NUM).toBe(1)
  expect(obj.VISITS[0].START_DATE).toBeDefined()
  expect(obj.VISITS[0].SOURCESYSTEM_CD).toBeDefined()
  expect(obj.OBSERVATIONS).toBeDefined()
  expect(obj.OBSERVATIONS[0][0].CATEGORY_CHAR).toBe('surveyBEST')
  expect(obj.OBSERVATIONS[0][0].SOURCESYSTEM_CD).toBeDefined()
  expect(obj.OBSERVATIONS[0][0].OBSERVATION_BLOB).toBeDefined()
  expect(obj.OBSERVATIONS[0][0].CONCEPT_CD).toBeDefined()
  expect(obj.OBSERVATIONS[0][0].TVAL_CHAR).toBeDefined()
  expect(obj.OBSERVATIONS[0][0].START_DATE).toBeDefined()
}