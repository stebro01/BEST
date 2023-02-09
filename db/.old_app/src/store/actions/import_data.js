
import { verifyCDA, importHL7toObject, addHL7ObjectToDB } from "src/tools/hl7_import";
import {importCDAtoObject, extract_cda} from 'src/tools/surveybest_import'
import {importCSV, splitVisits} from 'src/tools/formatdata'
import {Process_Observations, Save_PatientVisitObservation} from 'src/tools/db_import_obs'
import { error_codes } from 'src/tools/logger'
import { View_Visit } from 'src/classes/View_Visit'
import { View_Observation } from 'src/classes/View_Observation'
import { View_Patient } from "src/classes/View_Patient";
import { View_Concept } from 'src/classes/View_Concept'
import { View_user_patient_lookup } from "src/classes/View_User_Patient_Lookup";


export const importSurveyBEST = async ({commit, state}, payload ) => {
  commit('LOG', {method: 'importSurveyBEST'})
  if (!payload || typeof(payload) !== 'string') return {status: false, error: error_codes.invalid_payload}
  var CDA_FROM_JSON = extract_cda(payload)
  if (!CDA_FROM_JSON.status) return CDA_FROM_JSON
  //is valid?
  const valid = verifyCDA(CDA_FROM_JSON.data)
  if (!valid) return {status: false, error: error_codes.h7cda_not_valid}

  // now import the data using the CONCEPT_DIMENSION Table and crate a atandard output format
  const VIEW_CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
  var DATA = undefined
  if (CDA_FROM_JSON.data.cda.id === "QUESTIONNAIRE-surveyBEST") DATA = await importCDAtoObject(CDA_FROM_JSON.data, VIEW_CONCEPT)
  else DATA = await importHL7toObject(CDA_FROM_JSON.data.cda, VIEW_CONCEPT)
  
  if (!DATA || !DATA.PATIENT) return {status: false, error: error_codes.invalid_json_object}
  return DATA
}

 export const  importObjectsFromHL7File = async ({commit, state}, filePath) => {
    commit('LOG', {method: 'importObjectsFromHL7File', data: filePath})
    const hl7json = JSON.parse(window.electron.readFile(filePath, 'utf8'))
    //is valid?
    const valid = verifyCDA(hl7json)
    if (!valid) return {status: false, error: error_codes.h7cda_not_valid}

    const VIEW_CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    var res = undefined
    if (hl7json.cda.id === "QUESTIONNAIRE-surveyBEST") res = await importCDAtoObject(hl7json, VIEW_CONCEPT) 
    else res = await importHL7toObject(hl7json.cda, VIEW_CONCEPT)

    if (!res.PATIENT) return {status: false, error: error_codes.invalid_json_object}
    return res
 }

 export const  saveHL7ObjectsToDB = async ({commit, state}, payload) => {
    commit('LOG', {method: 'saveHL7ObjectsToDB', data: payload.PATIENT})
    if (!payload || !payload.PATIENT || !payload.VISITS || !payload.OBSERVATIONS) return {status: false, error: error_codes.invalid_payload}
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
    return res
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
    commit('LOG', {method: 'ImportObservation->importData', data: filePath})
    const txt = window.electron.readFile(filePath, 'utf8')
    var OBS = importCSV(txt)
    const CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    OBS = await Process_Observations(OBS, CONCEPT)
    if (OBS === undefined || OBS.length < 1) return false
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

    return PATIENTS
 }