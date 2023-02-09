/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/ViewExport.test.js 
 */


const fs = require("fs");
const dbman = require('../../../src-electron/dbman')
import path from 'path'

import { csvJSON } from "src/tools/formatdata";
import { resetDatabase } from 'src/tools/db_functions';

const ENV = require('../../../public/env.json')
const TEMPLATES = ENV.app.templates

import { prepare_path } from "src/tools/prepare_sql_template_path";

import {View_Observation} from '../../../src/classes/View_Observation'
import { View_Patient } from 'src/classes/View_Patient';
import { View_Visit } from 'src/classes/View_Visit';

// SOME MOCKUPS
const mockup_export = {
  "PATIENTS":[
    {"PATIENT_NUM":468},{"PATIENT_NUM":469}
  ],
  "CONCEPTS":[
    {"CONCEPT_CD":"LID: 74246-8","CONCEPT_NAME_CHAR":"Hämoglobin A1c/hämoglobin.total in Blood durch IFCC-protokoll"},{"CONCEPT_CD":"LID: 63900-5","CONCEPT_NAME_CHAR":"Age"},{"CONCEPT_CD":"SCTID: 184099003","CONCEPT_NAME_CHAR":"Date of birth"},{"CONCEPT_CD":"SCTID: 263495000","CONCEPT_NAME_CHAR":"Gender"},{"CONCEPT_CD":"LID: 74287-4","CONCEPT_NAME_CHAR":"Occupation"},{"CONCEPT_CD":"LID: 45404-1","CONCEPT_NAME_CHAR":"Maritual status"},{"CONCEPT_CD":"SCTID: 224288002","CONCEPT_NAME_CHAR":"Duration of fromal education"},{"CONCEPT_CD":"SCTID: 105529008","CONCEPT_NAME_CHAR":"Lives alone (finding)"},{"CONCEPT_CD":"LID: 18630-4","CONCEPT_NAME_CHAR":"Primary Diagnosis"},{"CONCEPT_CD":"CUSTOM: PROGRESSION_DEMENTIA","CONCEPT_NAME_CHAR":"Progredienz zu Demenz"},{"CONCEPT_CD":"SCTID: 394877006","CONCEPT_NAME_CHAR":"Family History of dementia "},{"CONCEPT_CD":"SCTID: 102478008","CONCEPT_NAME_CHAR":"Pre-existing conditions"},{"CONCEPT_CD":"SCTID: 56265001","CONCEPT_NAME_CHAR":"Heart disease"},{"CONCEPT_CD":"SCTID: 38341003","CONCEPT_NAME_CHAR":"Hypertensive disorder, systemic arterial (disorder)"},{"CONCEPT_CD":"SCTID: 44054006","CONCEPT_NAME_CHAR":"Diabetes mellitus 2"},{"CONCEPT_CD":"LID: 72166-2","CONCEPT_NAME_CHAR":"Tabacco Smoking status"},{"CONCEPT_CD":"SCTID: 35489007","CONCEPT_NAME_CHAR":"Depression (disorder)"},{"CONCEPT_CD":"LID: 11331-6","CONCEPT_NAME_CHAR":"History of Alcohol use"},{"CONCEPT_CD":"LID: 8480-6","CONCEPT_NAME_CHAR":"Blood pressure systolic"},{"CONCEPT_CD":"LID: 8462-4","CONCEPT_NAME_CHAR":"Blood pressure diastolic"},{"CONCEPT_CD":"LID: 8867-4","CONCEPT_NAME_CHAR":"Heart rate"},{"CONCEPT_CD":"SCTID: 167699000","CONCEPT_NAME_CHAR":"Cerebrospinal fluid examination"},{"CONCEPT_CD":"SCTID: 258450006","CONCEPT_NAME_CHAR":"Cerebrospinal fluid specimen (specimen)"},{"CONCEPT_CD":"LID: 30160-6","CONCEPT_NAME_CHAR":"Tau-Protein (Mass/Volume) in Cerebral spinal fluid"},{"CONCEPT_CD":"LID: 33203-1","CONCEPT_NAME_CHAR":"Amyloid beta 42 peptide (Mass/Volume) in cerebral spinal fluid"},{"CONCEPT_CD":"LID: 72260-3","CONCEPT_NAME_CHAR":"Phosphorylated tau 181 (Mass/Volume) in cerebral spinal fluid by Immunoassay"},{"CONCEPT_CD":"SCTID: 15220000","CONCEPT_NAME_CHAR":"Laboratory test"},{"CONCEPT_CD":"LID: 26464-8","CONCEPT_NAME_CHAR":"Leukocytes (#/Volume) in Blood"},{"CONCEPT_CD":"LID: 718-7","CONCEPT_NAME_CHAR":"Hemoglobin (Mass/Volume) in Blood"},{"CONCEPT_CD":"LID: 26453-1","CONCEPT_NAME_CHAR":"Erythrocytes (#/Volume) in Blood"},{"CONCEPT_CD":"LID: 20570-8","CONCEPT_NAME_CHAR":"Hematocrit (Volume Fraction) of Blood"},{"CONCEPT_CD":"LID: 26515-7","CONCEPT_NAME_CHAR":"Platelets (#/volume) in Blood"},{"CONCEPT_CD":"LID: 34714-6","CONCEPT_NAME_CHAR":"INR in Blood by Coagulation assay"},{"CONCEPT_CD":"LID: 3173-2","CONCEPT_NAME_CHAR":"aPTT in Blood by C.A"},{"CONCEPT_CD":"LID: 22748-8","CONCEPT_NAME_CHAR":"LDL-Cholesterin (Moles/Volume) in Serum or Plasma"},{"CONCEPT_CD":"LID: 38483-4","CONCEPT_NAME_CHAR":"kreatinin (Mass/Voloume) in Blood"},{"CONCEPT_CD":"LID: 14646-4","CONCEPT_NAME_CHAR":"HDL-Cholesterin (Moles/Volume) in Serum or Plasma"},{"CONCEPT_CD":"LID: 14685-2","CONCEPT_NAME_CHAR":"Cobalamin (Vitamin B12) (Moles/volume) in serum or plasma"},{"CONCEPT_CD":"LID: 63718003","CONCEPT_NAME_CHAR":"Folsäure"},{"CONCEPT_CD":"CUSTOM: MRI\\BRAIN\\FINDINGS","CONCEPT_NAME_CHAR":"Befund MRT Schädel / cMRT"},{"CONCEPT_CD":"SCTID: 765172009","CONCEPT_NAME_CHAR":"Doppler ultrasound"},{"CONCEPT_CD":"SCTID: 816077007","CONCEPT_NAME_CHAR":"MRI of brain"},{"CONCEPT_CD":"SCTID: 445412006","CONCEPT_NAME_CHAR":"ACE-III"},{"CONCEPT_CD":"SCTID: 473313006","CONCEPT_NAME_CHAR":"ACE-III Memory"},{"CONCEPT_CD":"SCTID: 473312001","CONCEPT_NAME_CHAR":"ACE-III Attention"},{"CONCEPT_CD":"SCTID: 473315004","CONCEPT_NAME_CHAR":"ACE-III Exekutiv/ Fluency"},{"CONCEPT_CD":"SCTID: 473311008","CONCEPT_NAME_CHAR":"ACE-III language"},{"CONCEPT_CD":"SCTID: 473314000","CONCEPT_NAME_CHAR":"ACE-III visospatial"},{"CONCEPT_CD":"LID: 72106-8","CONCEPT_NAME_CHAR":"MMSE Total Score"},{"CONCEPT_CD":"SCTID: 401319005","CONCEPT_NAME_CHAR":"Hospital Anxiety and Depression scale: anxiety score (observable entity)"},{"CONCEPT_CD":"SCTID: 401320004","CONCEPT_NAME_CHAR":"Hospital Anxiety and Depression scale: depression score (observable entity)"},{"CONCEPT_CD":"LID: 72172-0","CONCEPT_NAME_CHAR":"MOCA Total Score"},{"CONCEPT_CD":"CUSTOM: DRUGINTAKE","CONCEPT_NAME_CHAR":"Einnahme Demenz Medikament"},{"CONCEPT_CD":"LID: 52418-1","CONCEPT_NAME_CHAR":"Current medication, Name"},{"CONCEPT_CD":"LID: 18607-2","CONCEPT_NAME_CHAR":"Current medication Dose"},{"CONCEPT_CD":"LID: 14927-8","CONCEPT_NAME_CHAR":"Triglyceride (Moles/Volume) in Blood"},{"CONCEPT_CD":"LID: 14879-1","CONCEPT_NAME_CHAR":"Phosphat (Mol/volume) in Serum or Plasma"},{"CONCEPT_CD":"LID: LP40001-7","CONCEPT_NAME_CHAR":"TPO-AK (Thyreoperoxidase-Antikörper)"},{"CONCEPT_CD":"SCTID: 252559003","CONCEPT_NAME_CHAR":"olfaction test"},{"CONCEPT_CD":"CUSTOM: NP\\LACHS","CONCEPT_NAME_CHAR":"Lachs / Gesamtscore"},{"CONCEPT_CD":"SCTID: 273302005","CONCEPT_NAME_CHAR":"Barthel index"},{"CONCEPT_CD":"CUSTOM: DIAGNOSIS_DEMENTIA","CONCEPT_NAME_CHAR":"Schweregrad der Demenz"},{"CONCEPT_CD":"SCTID: 52448006","CONCEPT_NAME_CHAR":"Form der Demenz"},{"CONCEPT_CD":"LID: 22664-7","CONCEPT_NAME_CHAR":"Urea (Moles/volume) in Serum or Plasma"},{"CONCEPT_CD":"LID: 76485-2","CONCEPT_NAME_CHAR":"C-reaktives Protein Moles/Volume in serum or Plasma: 76485-2"},{"CONCEPT_CD":"LID: 2947-0","CONCEPT_NAME_CHAR":"Natrium (mole/volume) in Blood"},{"CONCEPT_CD":"LID: 6298-4","CONCEPT_NAME_CHAR":"Kalium"},{"CONCEPT_CD":"CUSTOM: NP\\BADL","CONCEPT_NAME_CHAR":"B-ADL / Gesamtscore"},{"CONCEPT_CD":"CUSTOM: NP\\IQCODE","CONCEPT_NAME_CHAR":"IQCODE / Gesamtscore"}
  ]
}

const MOCKUP_PATIENTS = csvJSON(fs.readFileSync(path.resolve(global.MOCKUP_PATH, 'demodata', 'mockups_PATIENTS_202301.csv'), 'utf-8'), ';')
const MOCKUP_VISITS = csvJSON(fs.readFileSync(path.resolve(global.MOCKUP_PATH, 'demodata', 'mockups_VISITS_202301.csv'), 'utf-8'), ';')
const MOCKUP_OBSERVATIONS = csvJSON(fs.readFileSync(path.resolve(global.MOCKUP_PATH, 'demodata', 'mockups_Observations_202301.csv'), 'utf-8'), ';')

describe('Teste RESET DB Funktion', () => {
  const db_fn = global.DB_TEST_PATH

  // beforeAll(() => {
  //   // erzeuge eine leere neue DB
  //   if (fs.existsSync(db_fn)) {
  //     fs.unlinkSync(db_fn)
  //   }
  //   dbman.create(db_fn)
  //  })


  // it (`Fülle jetzt die ganze DB`, async() => {
  //   const publicFolder = '/Users/ste/MyProjects/dbBEST/app/public'
  //   const PATH = prepare_path(TEMPLATES, publicFolder, path)
    
  //   dbman.connect(db_fn)
  //   var status = await dbman.resetDB(PATH, resetDatabase)
  //   expect(status).toBe(true)
  //   //add some data
  //     //PATIENTS
  //     const VIEW_PATIENT = new View_Patient(dbman, db_fn)
  //     for (let m of MOCKUP_PATIENTS) {
  //       status = await VIEW_PATIENT.create(m)
  //       expect(status.status).toBe(true)
  //     }
  //     //VISITS
  //     const VIEW_VISIT = new View_Visit(dbman, db_fn)
  //     for (let m of MOCKUP_VISITS) {
  //       status = await VIEW_VISIT.create(m)
  //       expect(status.status).toBe(true)
  //     }

  //     //OBSERVATIONS
  //     const VIEW_OBS = new View_Observation(dbman, db_fn)
  //     for (let m of MOCKUP_OBSERVATIONS) {
  //       status = await VIEW_OBS.create(m)
  //       expect(status.status).toBe(true)
  //     }
  //   dbman.close()
  // })

  it (`Exportiere jetzt Daten: falsch payload`, async() => {
   const OBSERVATION = new View_Observation(dbman, db_fn)

    var status = await OBSERVATION.export()
    expect(status).not.toBe(true)

    status = await OBSERVATION.export({super: 1})
    expect(status).not.toBe(true)

    status = await OBSERVATION.export({PATIENTS: undefined})
    expect(status).not.toBe(true)
  })

  it (`Exportiere jetzt Daten: 1 kompletter Patient`, async() => {
    const OBSERVATION = new View_Observation(dbman, db_fn)
 
    var status = await OBSERVATION.export({PATIENTS: [{PATIENT_NUM: 468}]}, 'csv')
    expect(status.status).toBe(true)
    var rows = csvJSON(status.data, ';')
    expect(rows.length).toBe(7)
    expect(Object.keys(rows[0]).length).toBeGreaterThan(10)
    expect(rows[0].PATIENT_NUM).not.toBe(undefined)
    expect(rows[0].PATIENT_NUM).toBe('numeric')
   })

   it (`Exportiere jetzt Daten: 2 komplette Patienten`, async() => {
    const OBSERVATION = new View_Observation(dbman, db_fn)
 
    var status = await OBSERVATION.export({PATIENTS: [{PATIENT_NUM: 468}, {PATIENT_NUM: 469}]}, 'csv')
    expect(status.status).toBe(true)
    var rows = csvJSON(status.data, ';')
    expect(rows.length).toBeGreaterThan(4)
    expect(Object.keys(rows[0]).length).toBeGreaterThan(10)
    expect(rows[0].PATIENT_NUM).not.toBe(undefined)
    expect(rows[0].PATIENT_NUM).toBe('numeric')
   })

   it (`Exportiere jetzt Daten: 2 komplette Patienten und spezifiziere, welche Daten exportiert werden sollen`, async() => {
    const OBSERVATION = new View_Observation(dbman, db_fn)
 
    var status = await OBSERVATION.export({PATIENTS: [{PATIENT_NUM: 468}, {PATIENT_NUM: 469}], CONCEPTS: [{"CONCEPT_CD":"SCTID: 184099003","CONCEPT_NAME_CHAR":"Date of birth"}, {"CONCEPT_CD":"LID: 63900-5","CONCEPT_NAME_CHAR":"Age"}]}, 'csv')
    expect(status.status).toBe(true)
    var rows = csvJSON(status.data, ';')
    expect(rows.length).toBe(12)
    expect(Object.keys(rows[0]).length).toBeGreaterThan(5)
    expect(rows[0].PATIENT_NUM).not.toBe(undefined)
    expect(rows[0].PATIENT_NUM).toBe('numeric')
   })

   it (`HL7 Exportiere jetzt Daten: 1 kompletter Patienten und spezifiziere, welche Daten exportiert werden sollen`, async() => {
    const OBSERVATION = new View_Observation(dbman, db_fn)
 
    var status = await OBSERVATION.export(
        {
          PATIENTS: [{PATIENT_NUM: 468}], 
          CONCEPTS: [{"CONCEPT_CD":"SCTID: 184099003","CONCEPT_NAME_CHAR":"Date of birth"}, {"CONCEPT_CD":"LID: 63900-5","CONCEPT_NAME_CHAR":"Age"}]
        }, 
        'hl7/json',
        ENV.app
        )
    expect(status.status).toBe(true)
    expect(status.data[0].cda).not.toBe(undefined)
    expect(status.data[0].cda.id).toBe('dbBEST')
    expect(status.data[0].cda.section).not.toBe(undefined)
    expect(status.data[0].cda.section.length).toBeGreaterThan(0)
    expect(status.data[0].hash).not.toBe(undefined)
    expect(status.data[0].hash.method).toBe('SHA256')
    

   })

   it (`HL7 Exportiere jetzt Daten: 2 komplette Patienten und spezifiziere, welche Daten exportiert werden sollen`, async() => {
    const OBSERVATION = new View_Observation(dbman, db_fn)
 
    var status = await OBSERVATION.export(
        {
          PATIENTS: [{PATIENT_NUM: 468}, {PATIENT_NUM: 469}], 
          CONCEPTS: [{"CONCEPT_CD":"SCTID: 184099003","CONCEPT_NAME_CHAR":"Date of birth"}, {"CONCEPT_CD":"LID: 63900-5","CONCEPT_NAME_CHAR":"Age"}]
        }, 
        'hl7/json',
        ENV.app
        )
    expect(status.status).toBe(true)
    expect(status.data.length).toBe(2)
    expect(status.data[0].cda).not.toBe(undefined)
    expect(status.data[0].cda.id).toBe('dbBEST')
    expect(status.data[0].cda.section).not.toBe(undefined)
    expect(status.data[0].cda.section.length).toBeGreaterThan(0)
    expect(status.data[0].hash).not.toBe(undefined)
    expect(status.data[0].hash.method).toBe('SHA256')
    

   })

})