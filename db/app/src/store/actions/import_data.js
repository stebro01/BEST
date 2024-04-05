
import { verifyCDA, importHL7toObject, addHL7ObjectToDB } from "src/tools/hl7_import";
import {importCDAtoObject, extract_cda} from 'src/tools/surveybest_import'
import {importCSV, splitVisits} from 'src/tools/formatdata'
import {Process_Observations} from 'src/tools/db_import_obs'
import { importJSON } from "src/tools/db_datatransfer";
import { error_codes, RETURN_DATA } from 'src/tools/logger'
import { View_Visit } from 'src/classes/View_Visit'
import { View_Observation } from 'src/classes/View_Observation'
import { View_Patient } from "src/classes/View_Patient";
import { View_Concept } from 'src/classes/View_Concept'
import { View_user_patient_lookup } from "src/classes/View_User_Patient_Lookup";
import { raw_read, raw_write } from "src/tools/raw_import";


export const importSurveyBEST = async ({commit, state}, payload ) => {
  commit('LOG', {method: 'importSurveyBEST'})
  if (!payload || typeof(payload) !== 'string') return RETURN_DATA({status: false, error: error_codes.invalid_payload}, commit)
  var CDA_FROM_JSON = extract_cda(payload)
  if (!CDA_FROM_JSON.status) return CDA_FROM_JSON
  //is valid?
  const valid = verifyCDA(CDA_FROM_JSON.data)
  if (!valid) return RETURN_DATA({status: false, error: error_codes.h7cda_not_valid}, commit)

  // now import the data using the CONCEPT_DIMENSION Table and crate a atandard output format
  const VIEW_CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
  var DATA = undefined
  if (CDA_FROM_JSON.data.cda.id === "QUESTIONNAIRE-surveyBEST") DATA = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
  else DATA = await importHL7toObject(CDA_FROM_JSON.data.cda, VIEW_CONCEPT)

  // RETURN
  if (!DATA || !DATA.PATIENT) return RETURN_DATA({status: false, error: error_codes.invalid_json_object}, commit)
  return RETURN_DATA(DATA, commit)
}

 export const  importObjectsFromHL7File = async ({commit, state}, filePath) => {
    commit('LOG', {method: 'importObjectsFromHL7File', data: filePath})
    commit('SPINNER_SET', true)

    const hl7json = JSON.parse(window.electron.readFile(filePath, 'utf8'))
    //is valid?
    const valid = verifyCDA(hl7json)
    if (!valid) return RETURN_DATA({status: false, error: error_codes.h7cda_not_valid}, commit)

    const VIEW_CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
    var res = undefined
    if (hl7json.cda.id === "QUESTIONNAIRE-surveyBEST") res = await importCDAtoObject(hl7json, VIEW_CONCEPT)
    else res = await importHL7toObject(hl7json.cda, VIEW_CONCEPT)

    // RETURN
    if (!res.PATIENT) return RETURN_DATA({status: false, error: error_codes.invalid_json_object}, commit)
    return RETURN_DATA(res, commit)
 }

 export const  saveHL7ObjectsToDB = async ({commit, state}, payload) => {
    commit('LOG', {method: 'saveHL7ObjectsToDB', data: payload.PATIENT})
    commit('SPINNER_SET', true)
    if (!payload || !payload.PATIENT || !payload.VISITS || !payload.OBSERVATIONS) return RETURN_DATA({status: false, error: error_codes.invalid_payload}, commit)
    const VIEW_PATIENT = new View_Patient(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
    const VIEW_VISIT = new View_Visit(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
    const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
    const res = await addHL7ObjectToDB(payload, VIEW_PATIENT, VIEW_VISIT, VIEW_OBSERVATION)
    if (res.status) {
        const res_patient = await VIEW_PATIENT.read({PATIENT_CD: payload.PATIENT.PATIENT_CD})
        if (res_patient.data && state.USER) {
            const PATIENT_NUM = res_patient.data[0].PATIENT_NUM
            const TABLE_USER_PATIENT_LOOKUP = new View_user_patient_lookup(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
            const res_lookup = await TABLE_USER_PATIENT_LOOKUP.read({USER_ID: state.USER.USER_ID, PATIENT_NUM: PATIENT_NUM})
            if (res_lookup.data.length < 1) TABLE_USER_PATIENT_LOOKUP.create({USER_ID: state.USER.USER_ID, PATIENT_NUM: PATIENT_NUM})
        }
    }
    return RETURN_DATA(res, commit)
 }

/**
 *
 * @param {*} param0
 * @param {*} filePath
 * @returns
 * @example
 * this.$store.dispatch('importObjectsFromCSVFile', file.path) //called by DBFunctions_CSVImport.vue
 */
 export const  importObjectsFromCSVFile = async ({commit, state}, filePath) => {
    commit('LOG', {method: 'importObjectsFromCSVFile->importData', data: filePath})
    commit('SPINNER_SET', true)

    const txt = window.electron.readFile(filePath, 'utf8')
    var OBS = importCSV(txt)
    const CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
    OBS = await Process_Observations(OBS, CONCEPT)

    if (OBS === undefined || OBS.length < 1) return RETURN_DATA(false, commit)
    const VISITS = splitVisits(OBS)

    //PREPARE THE PATIENTS STRUCTURE FOR THE GUI
    const PATIENTS = {}
    VISITS.forEach(v => {
        if (!PATIENTS[v.PATIENT_NUM]) PATIENTS[v.PATIENT_NUM] = {PATIENT_NUM: v.PATIENT_NUM, PATIENT_CD: v.PATIENT_CD, VISITS: [], VISIT_INFO: []}
        PATIENTS[v.PATIENT_NUM].VISITS.push(v.OBSERVATIONS)
    })
    Object.keys(PATIENTS).forEach(key => {
        PATIENTS[key].VISITS.forEach(v => {
          let visit_info = {START_DATE: v[0].START_DATE, END_DATE: v[0].END_DATE, LOCATION_CD: v[0].LOCATION_CD, PROVIDER_ID: v[0].PROVIDER_ID}
          PATIENTS[key].VISIT_INFO.push(visit_info)
        })
      })

    return RETURN_DATA(PATIENTS, commit)
 }

/**
 * @description Importiere eine komplette Datei mit RAW Daten
 * @param {*} param0 - {commit, state}
 * @param {*} payload
 */
export const  importRAWdata_from_file = async ({commit, state}, payload) => {
  commit('LOG', {method: 'action->importRAWdata_from_file', data: payload.raw_fn})
  commit('SPINNER_SET', true)
  // READ DATA
  const raw_fn = payload.raw_fn; //'test/jest/mockups/hl7/patient_10019815_2023-01-22_HL7.json'
  const LOCAL_FS = {readFileSync: window.electron.readFile, existsSync: window.electron.exists}
  const status_read = await raw_read(raw_fn, LOCAL_FS, window.electron.path)
  if (status_read.status === false) return RETURN_DATA( {status: false, error: error_codes.file_does_not_exist}, commit)
  // ADD OBSERVATION
  const OBSERVATION_DATA = {
    PATIENT_NUM: payload.PATIENT_NUM,
    ENCOUNTER_NUM: payload.ENCOUNTER_NUM,
    PROVIDER_ID: payload.PROVIDER_ID,
    START_DATE: payload.START_DATE,
    TVAL_CHAR: JSON.stringify({filename: status_read.data.filename+status_read.data.ext, ext: status_read.data.ext, sizeKB: status_read.data.sizeKB,source_dir: status_read.data.dir}),
    UPLOAD_ID: state.UPLOAD_ID,
    CATEGORY_CHAR: 'RAW',
    OBSERVATION_BLOB: status_read.data.buffer,
    SOURCESYSTEM_CD: 'SNOMED-CT',
    VALUEFLAG_CD: status_read.data.signature,
    CONCEPT_CD: payload.CONCEPT_CD,
    VALTYPE_CD: 'R'
  }
  // CREATE THE VIEW OBSERVATION
  const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
  // CHECK IF THE DATA ALREADY EXISTS
  if (!payload._force) {
    const res_exist = await VIEW_OBSERVATION.read({VALUEFLAG_CD: OBSERVATION_DATA.VALUEFLAG_CD})
    console.log(OBSERVATION_DATA.VALUEFLAG_CD, res_exist)
    if (res_exist.data.length > 0) return RETURN_DATA({status: false, error: error_codes.data_already_exists}, commit)
  }
  // ADD THE DATA
  const status_prepare_create = await VIEW_OBSERVATION.prepare_create(OBSERVATION_DATA)
  // FERTIG
  return RETURN_DATA(status_prepare_create, commit)
}

export const exportRAWdata_to_file = async ({commit, state}, payload) => {
  commit('LOG', {method: 'action->exportRAWdata_to_file', data: payload})
  commit('SPINNER_SET', true)
  // WRITE DATA
  const status_write = await raw_write(payload, {writeFileSync: window.electron.writeFile}, window.electron.path)
  commit('SPINNER_SET', false)
  return RETURN_DATA(status_write, commit)
}

/**
 * Importiert ein JSON Objekt mit tables f. die DB => verwendet von DataTransfer_Import.vue
 * !siehe Test: DataTransfer.test.js
 * @param {object} param0
 * @param {object} payload - {JSON_DATA}
 * @returns Promise with result of importJSON
 */
 export const  importJSON_DataTransfer = async ({commit, state}, payload) => {
  commit('LOG', {method: 'ImportObservation->importJSON_DataTransfer'})
  commit('SPINNER_SET', true)

  const data = {JSON: payload.JSON, db_fn: state.SETTINGS.data.filename.path, dbman: window.electron.dbman, force: undefined, UPLOAD_ID: state.UPLOAD_ID}

  const res = await importJSON( data)
  commit('SPINNER_SET', false)

  return res

 }
