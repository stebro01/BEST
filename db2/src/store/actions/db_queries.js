
import { View_Concept } from 'src/classes/View_Concept'
import { View_Code_Lookup } from 'src/classes/View_Code_Lookup'
import { View_Provider } from 'src/classes/View_Provider'
import { prepare_path } from 'src/tools/prepare_sql_template_path'
import { resetDatabase } from 'src/tools/db_functions'

import { error_codes } from 'src/tools/logger'
import { View_Visit } from 'src/classes/View_Visit'
import { View_Observation } from 'src/classes/View_Observation'


/**
 * @param NONE
 * @returns PROMISE mit einer Liste der GENDER / Concept
 * @example
 * this.$store.dispatch('getGender').then(res => {...})
 */
export const getGender = async ({commit, state}) => {
    commit('LOG', {method: 'action/db_queries -> getGender'})
    const CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const payload = {
        query_string: {CONCEPT_PATH: '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA', _like: true}, 
        table: 'CONCEPT_DIMENSION'}

    return new Promise((res, rej) => {
        CONCEPT.read(payload.query_string).then(query => {
            if (query.status) res(query.data)
            else rej(query.error)
        })
    })
}

/**
 * @param {string} - CONCEPT_PATH
 * @returns PROMISE mit einer Liste des angegebenen Pfades*: {value, label}
 * @example
 * this.$store.dispatch('getConceptList', '\\SNOMED-CT\\363787003\\278844005\\263495000\\LA').then(res => {...})
 */
 export const getConceptList = async ({commit, state}, path) => {
    commit('LOG', {method: 'action/db_queries -> getConceptList', data: path})
    const CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const payload = {
        query_string: {CONCEPT_PATH: path, _like: true}, 
        table: 'CONCEPT_DIMENSION'}

    return new Promise((res, rej) => {
        CONCEPT.read(payload.query_string).then(query => {
            if (query.status) {
                const d = []
                query.data.forEach(r => d.push({label: r.NAME_CHAR, value: r.CONCEPT_CD}))
                res(d)
            }
            else rej(query.error)
        })
    })
}

export const getAnswers = async ({commit, state}, obj) => {
    var CONCEPT_PATH = obj.CONCEPT_PATH
    if (obj.VALTYPE_CD === 'S') CONCEPT_PATH +='\\LA'
    else CONCEPT_PATH = '\\SNOMED-CT\\362981000\\260245000\\'
    return getConceptList({commit, state}, CONCEPT_PATH)
}

export const getAnswersForObservation = async ({commit, state}, obs) => {
    if (obs.VALTYPE_CD === 'F') {
        return getAnswers({commit, state}, obs)
      } else if (obs.VALTYPE_CD === 'S') {
        let res_concept = await getConceptBy_CONCEPT_CD({commit, state}, obs.CONCEPT_CD)
        let res_s = await getAnswers({commit, state}, {CONCEPT_PATH: res_concept.path, VALTYPE_CD: 'S'})
        return res_s
      } else return undefined
}

/**
* @param {string}
* @returns PROMISE mit dem gefunden koncept: {value, label}
* @example
* this.$store.dispatch('getConceptBy_CONCEPT_CD', 'LID: LA45404-3').then(res => {...})
*/
export const  getConceptBy_CONCEPT_CD = async ({commit, state}, value) => {
   commit('LOG', {method: 'action/db_queries -> getConceptBy_CONCEPT_CD', data: value})
   const CONCEPT = new View_Concept(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
   const payload = {
       query_string: {CONCEPT_CD: value}, 
       table: 'CONCEPT_DIMENSION'}

   return new Promise((res, rej) => {
       CONCEPT.read(payload.query_string).then(query => {
           if (query.status && query.data.length > 0) res({label: query.data[0].NAME_CHAR, value: query.data[0].CONCEPT_CD, path: query.data[0].CONCEPT_PATH})
           else res(value)
       })
   })
}

/**
* @param {string}
* @returns PROMISE mit dem gefunden koncept: {value, label}
* @example
* this.$store.dispatch('getLookupBy_CODE_CD', 'UKJ_Neuro').then(res => {...})
*/
export const  getLookupBy_CODE_CD = async ({commit, state}, value) => {
    commit('LOG', {method: 'action/db_queries -> getLookupBy_CODE_CD', data: value})
    const LOOKUP = new View_Code_Lookup(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const payload = {
        query_string: {CODE_CD: value}, 
        table: 'CODE_LOOKUP'}
 
    return new Promise((res, rej) => {
        LOOKUP.read(payload.query_string).then(query => {
            if (query.status && query.data.length > 0) res({label: query.data[0].NAME_CHAR, value: query.data[0].CODE_CD})
            else res(value)
        })
    })
 }

 /**
* @param {string}
* @returns PROMISE mit dem gefunden koncept: {value, label}
* @example
* this.$store.dispatch('getCodeLookupList', {COLUMN_CD: 'VALTYPE_CD'}).then(res => this.OPTIONS_VALTYPE_CD = res)
*/
export const  getCodeLookupList = async ({commit, state}, payload) => {
    commit('LOG', {method: 'action/db_queries -> getCodeLookupList', data: payload})
    const LOOKUP = new View_Code_Lookup(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
 
    return new Promise((res, rej) => {
        LOOKUP.read(payload).then(query => {
            if (query.status && query.data.length > 0) {
                const RESULT = []
                query.data.forEach(d => {
                    RESULT.push({label: d.NAME_CHAR, value: d.CODE_CD})
                })
                res(RESULT)
            }
            else res([])
        })
    })
 }

 /**
* @param {string}
* @returns PROMISE mit dem gefunden koncept: {value, label}
* @example
* this.$store.dispatch('getProviderBy_PROVIDER_ID', 's02840').then(res => {...})
*/
export const  getProviderBy_PROVIDER_ID = async ({commit, state}, value) => {
    commit('LOG', {method: 'action/db_queries -> getProviderBy_PROVIDER_ID', data: value})
    const PROVIDER = new View_Provider(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const payload = {
        query_string: {PROVIDER_ID: value}, 
        table: 'PROVIDER_DIMENSION'}
 
    return new Promise((res, rej) => {
        PROVIDER.read(payload.query_string).then(query => {
            if (query.status && query.data.length > 0) res({label: query.data[0].NAME_CHAR, value: query.data[0].PROVIDER_ID})
            else res(value)
        })
    })
 }

/**
* Setzt die gesamte DB zurück und initialisiert mit Standardwerten
* @param {string}
* @returns PROMISE: true, wenn erfolgreich, sonst fehlernachricht
* @example
* this.$store.dispatch('resetDB')
*/
export const  resetDB = async ({commit, state}, payload) => {
    commit('LOG', {method: 'action/db_queries -> resetDB'})
    return new Promise((resolve, reject) => {
        var publicFolder = 'public'
        if (!process.env.DEV) publicFolder = window.electron.publicFolder
        const TEMPLATES = state.ENV.app.templates
        const PATH = prepare_path(TEMPLATES, publicFolder, window.electron.path)

        var db_fn = ''
        if (payload) db_fn = payload
        else db_fn = state.SETTINGS.data.filename.path
        window.electron.dbman.connect(db_fn)
        window.electron.dbman.resetDB(PATH, resetDatabase)
        .then(res => resolve(res))
        .catch(err =>{console.log(err); reject(err)})
        .finally(() => window.electron.dbman.close())
                
    })
 }

 export const  createDB = async ({commit, state}, payload) => {
    commit('LOG', {method: 'action/db_queries -> createDB'})
    if (!payload) return {status: false, error: error_codes.instance_invalid}
    if (!window.electron.exists(payload)) return {status: false, error: error_codes.folder_does_not_exist}
    const filename = window.electron.path.resolve(payload, 'dbBEST_sqlite.db')
    const status = window.electron.dbman.create(filename)
    if (!status) return {status: false, error: error_codes.could_not_create_db}

    //reset DB
    const res = await resetDB({commit, state}, filename)
    console.log(res)    

    if (res) return {status: true, filename: filename, msg: `DB erfolgreich angelegt: ${filename}`}
    return {status: false, error: error_codes.could_not_create_db}

 }



 /**
  * speichert importierte Visiten/Observation zu einem aktiven Patienten >> nach Import aus CSV File
  * @param {object} param0 
  * @param {object} payload - Input from CSV_ObservationEdit_Card/saveCSVObservation >> db_import_obs/Process_Observations
  * @example
  * this.$store.dispatch('saveVisitObservation_to_Patient', PATIENT) //called by CSV_ObservationEdit_Card.vue
  */
 export const  saveVisitObservation_to_Patient = async ({commit, state}, payload) => {
    commit('LOG', {method: 'ImportObservation->saveVisitObservation_to_Patient'})
    if (!payload) return error_codes.invalid_payload
    const PATIENT = payload
    if (!PATIENT.PATIENT_NUM) return error_codes.invalid_payload
    //PREPARE THE VIEWS
    const VIEW_VISIT = new View_Visit(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    //perfrom SAVE OPERATION
    const res = await Save_PatientVisitObservation(PATIENT, VIEW_VISIT, VIEW_OBSERVATION)
    if (res.error.length > 0) commit('ERROR', {method: 'saveVisitObservation_to_Patient', message: "Errors occured", data: res.error})
    return 'Speichern erfolgreich'

 }


/**
 * Erzeuge eine DISTINCTE LIST der OBSERVATIONS entsprechend der PATIENTENLISTE
 * @param {STORE} param0 
 * @param {object} payload 
 * @example
  * this.$store.dispatch('getDistinctPatientList', {PATIENT_NUM: 1, PATIENT_NUM: 2}) //called by CSV_ObservationEdit_Card.vue
 */
 export const  getDistinctPatientList = async ({commit, state}, payload) => {
    commit('LOG', {method: 'ImportObservation->getDistinctPatientList', data: payload})
    if (!payload || payload.length < 1) throw(error_codes.invalid_payload)

    var SQL_STATEMENT = 'SELECT DISTINCT patient_observations.CONCEPT_CD as CONCEPT_CD, patient_observations.CONCEPT_NAME_CHAR as CONCEPT_NAME_CHAR FROM patient_observations WHERE'
    let cc = 0
    payload.forEach( p => {        
        cc++
        if (cc === 1) SQL_STATEMENT = SQL_STATEMENT + ` patient_observations.PATIENT_NUM=${p.PATIENT_NUM}`
        else  SQL_STATEMENT = SQL_STATEMENT + ` OR patient_observations.PATIENT_NUM=${p.PATIENT_NUM}`
    })

    const VIEW_OBSERVATION = new View_Observation(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await VIEW_OBSERVATION.run_query(SQL_STATEMENT)
    if (res.error) throw(res.error)

    return res.data

 }