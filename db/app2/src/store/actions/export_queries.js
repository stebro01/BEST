import { error_codes } from 'src/tools/logger'
import { View_Observation } from 'src/classes/View_Observation'


/**
 * @description Inpot von  DBQueries_PatientCSVExport: Liste mit Patienten und Concepts wird als CSV string zurückgeben
 * @param {STORE} param0 
 * @param {object} payload - {PATIENTS: [{PATIENT_NUM: ...}], CONCEPTS: [{CONCEPT_CD: ...}]}
 * @returns {string} CSV STRING
 */
export const  exportObservationsCSV = async ({commit, state}, payload) => {
    if (!payload || !payload.PATIENTS) return {status: false, error: error_codes.invalid_payload}
    commit('LOG', {method: 'exportObservationsCSV', data: payload.PATIENTS})
    
    const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await VIEW_OBSERVATION.export(payload, 'csv')
    return res
 }

 /**
 * @description Inpot von  DBQueries_PatientCSVExport: Liste mit Patienten und Concepts wird als HL7 string zurückgeben => f. jeden Patienten ein eigenes Array
 * @param {STORE} param0 
 * @param {object} payload - {PATIENTS: [{PATIENT_NUM: ...}], CONCEPTS: [{CONCEPT_CD: ...}]}
 * @returns {array} für die einzelnen Patienten
 */
export const  exportObservationsHL7 = async ({commit, state}, payload) => {
    if (!payload || !payload.PATIENTS) return {status: false, error: error_codes.invalid_payload}
    commit('LOG', {method: 'exportObservationsHL7', data: payload.PATIENTS})
    
    const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await VIEW_OBSERVATION.export(payload, 'hl7/json', state.ENV.app)
    return res
 }
