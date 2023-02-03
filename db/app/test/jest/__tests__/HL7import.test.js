/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/HL7import.test.js 
 */

const fs = require("fs");
const path = require("path")
const hl7_json = JSON.parse(fs.readFileSync(path.join(global.MOCKUP_PATH, "/hl7/patient_10019815_2023-01-22_HL7.json"), 'utf-8'))
const dbman = require('../../../src-electron/dbman')

const db_fn = global.DB_TEST_PATH
import { View_Concept } from "src/classes/View_Concept";
import { View_Patient } from "src/classes/View_Patient";
import { View_Visit } from "src/classes/View_Visit";
import { View_Observation } from "src/classes/View_Observation";
const VIEW_CONCEPT = new View_Concept(dbman, db_fn)
const VIEW_PATIENT = new View_Patient(dbman, db_fn)
const VIEW_VISIT= new View_Visit(dbman, db_fn)
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn)



// FUNCTIONS TO TEST
import { verifyCDA, importHL7toObject, addHL7ObjectToDB } from "src/tools/hl7_import";

describe('Teste HL7 import und verify Funktion', () => {
  
  // beforeAll(() => {
    
  // })

  it (`Das Testfile wurde korrekt eingelesen`, () => {
    expect(hl7_json).toBeDefined()
    expect(hl7_json.cda).toBeDefined()
    expect(hl7_json.hash).toBeDefined()
  })

  it (`Teste die hl7-Verify Funktion: true for original data`, () => {
    expect(verifyCDA(hl7_json)).toBeTruthy()
  })

  it (`Teste die hl7-Verify Funktion: false for changed data`, () => {
    const hl7_copy = JSON.parse(JSON.stringify(hl7_json))
    hl7_copy.cda.id = '123'
    expect(verifyCDA(hl7_copy)).toBeFalsy()
  })

  it (`Teste importHL7toObject funktion mit gültigen Daten`, async () => {
    const DATA = await importHL7toObject(hl7_json.cda, VIEW_CONCEPT)
    expect(DATA).toBeDefined()
    expect(DATA.PATIENT.PATIENT_CD).toBeDefined()
    expect(DATA.VISITS.length).toBe(5)
    expect(DATA.OBSERVATIONS.length).toBe(5)
    // console.log(DATA.OBSERVATIONS[0])
  })

  it (`Teste addHL7ObjectToDB funktion mit gültigen Daten`, async () => {
    //lösche Patienten (wenn vorhanden)
    const res_delete = await VIEW_PATIENT.delete({PATIENT_CD: '10019815', _force: true})
    //import
    const DATA = await importHL7toObject(hl7_json.cda, VIEW_CONCEPT)
    //write to db
    
    const status = await addHL7ObjectToDB(DATA, VIEW_PATIENT, VIEW_VISIT, VIEW_OBSERVATION)
    expect(status.status).toBeTruthy()
    console.log(status)

  })

  
})

