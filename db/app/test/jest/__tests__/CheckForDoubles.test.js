/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * @depends importDB.test.js
 * npm run test:unit test/jest/__tests__/CheckForDoubles.test.js 
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
import {Process_Observations, CheckObservationsForDoubles} from 'src/tools/db_import_obs'


describe('Teste Import DB Funktion', () => {
  

  beforeAll(() => {
    
  })


  it (`Importiere ein Testfile und checke in der DB nach doubles> Stroke Daten von Franzi`, async() => {
    var OBS = importCSV(csv_stroke)
    OBS = await Process_Observations(OBS, VIEW_CONCEPT)
    OBS = await CheckObservationsForDoubles(OBS, VIEW_CONCEPT)
    OBS.forEach(o => {
      expect(o._double_found).toBeDefined()
    })

  })



  
})

