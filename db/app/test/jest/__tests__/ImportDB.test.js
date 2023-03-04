/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/ImportDB.test.js 
 */

const fs = require("fs");
const path = require("path")
const csv = fs.readFileSync(path.join(global.MOCKUP_PATH, "/OBS_MULTIPLE_PATIENTS.csv"), 'utf-8')
const csv_stroke = fs.readFileSync(path.join(global.MOCKUP_PATH, "/franzi_stroke/Stroke_Overview_202303_short.csv"), 'utf-8')
const csv_large = fs.readFileSync(path.join(global.MOCKUP_PATH, "OBS_MULTIPLE_PATIENTS_LARGE.csv"), 'utf-8')
import { importCSV, splitVisits } from "src/tools/formatdata";
const dbman = require('src/tools/dbman')

//DB Connection
import { View_Concept } from "src/classes/View_Concept";
import { View_Observation } from "src/classes/View_Observation";
import { View_Visit } from "src/classes/View_Visit";
import { View_Patient } from "src/classes/View_Patient";

const db_fn = global.DB_TEST_PATH
const VIEW_CONCEPT = new View_Concept(dbman, db_fn)
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn)
const VIEW_VISIT = new View_Visit(dbman, db_fn)
const VIEW_PATIENT = new View_Patient(dbman, db_fn)


// SOME MOCKUP DATA
const JSON_PATIENT_VISITS = require('../mockups/mockup_Import_JSON.json')

// FUNCTIONS TO TEST
import {Process_Observations, Save_PatientVisitObservation} from 'src/tools/db_import_obs'


describe('Teste Import DB Funktion', () => {
  

  beforeAll(() => {
    
  })

  // it (`Importiere ein Testfile > Observations.csv`, async() => {
  //   var OBS = importCSV(csv)
  //   OBS = await Process_Observations(OBS, VIEW_CONCEPT)
  //   expect(OBS).not.toBeUndefined()
  // })

  // it (`Speichere einen Testdatensatz in der DB: invalid payload`, async() => {   
  //   const OBS = await Save_PatientVisitObservation()
  //   expect(OBS).not.toBeUndefined()
  //   expect(OBS.status).toBeFalsy()
  // })
  // it (`Speichere einen Testdatensatz in der DB: valid data`, async() => {     
  //   const resAddPatient = await VIEW_PATIENT.create({PATIENT_BLOB: 'testPatient'})
  //   expect(resAddPatient.status).toBeTruthy()
  //   JSON_PATIENT_VISITS.PATIENT_NUM = resAddPatient.data.PATIENT_NUM
  //   const OBS = await Save_PatientVisitObservation(JSON_PATIENT_VISITS, VIEW_VISIT, VIEW_OBSERVATION)
  //   expect(OBS).not.toBeUndefined()
  //   expect(OBS.status).toBeTruthy()

  //   //lösche den Patienten wieder
  //   VIEW_PATIENT.delete({PATIENT_NUM: JSON_PATIENT_VISITS.PATIENT_NUM})
  // })

  it (`Importiere ein Testfile > Observations.csv`, async() => {
    var OBS = importCSV(csv_large)
    OBS = await Process_Observations(OBS, VIEW_CONCEPT)
    const VISITS = splitVisits(OBS)
 
    
    expect(VISITS).not.toBeUndefined()
  })

  it (`Importiere ein Testfile > Stroke Daten von Franzi`, async() => {
    var OBS = importCSV(csv_stroke)
    OBS = await Process_Observations(OBS, VIEW_CONCEPT)
    const VISITS = splitVisits(OBS)
 
    const tmp = VISITS[0].OBSERVATIONS
    // LID: 70184-7 => TVAL_RESOLVED = '1'
    let obj = tmp.find(el => el.CONCEPT_CD === 'LID: 70184-7')
    expect(obj.TVAL_RESOLVED).toBe('1')

    // LID: 70184-7 => TVAL_CHAR = 'SCTID: 373068000' <= undefined
    obj = tmp.find(el => el.CONCEPT_CD === 'LID: 70185-4')
    expect(obj.TVAL_CHAR).toBe('SCTID: 373068000')

    // MOD: 70187-0 LEFT => hier muss ich den modifier aufloese
    obj = tmp.find(el => el.CONCEPT_CD === 'MOD: 70187-0 LEFT')
    // console.log(obj)
    expect(obj.TVAL_RESOLVED).toBe('0')
    expect(obj.TVAL_CHAR).toBe('LID: LA6626-1_70187-0')



    expect(VISITS).not.toBeUndefined()
  })



  
})

