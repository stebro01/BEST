import { verify } from '../../../../survey3/src/tools/hhash'
import { error_codes } from "./logger"
/**
 * Testet, ob Daten in json.cda modifiziert wurden anhand der in json.signiture hinterlegten Signatur
 * @param {object} json - {cda, hash} => schould be the import of an HL7 cda json dokument 
 * @returns true or false
 */
export function verifyCDA(json) {
    if (!json || !json.cda || !json.hash) return false
    const status = verify(json.cda, json.hash)
    return status
}

/**
 * ASYNC FUNCTION to READ a CDA JSON Object and Konvert it into rows for the DB >> Using the VIEW_CONCEPT it resolves all CONCEPTS and VALUES if nessessary
 * @param {object} cda - {subject: {display}, event: [...], section: [...], ...}
 * @param {object} VIEW_CONCEPT - Instance of View_concept
 * @returns {PATIENT: {PATIENT_CD: ...}, VISITS: [...], OBSERVATIONS: [...]}
 * @example
 * * tested by: HL7import.test.js
 */
export async function importHL7toObject(cda, VIEW_CONCEPT) {
    if (!cda) return undefined
    if (!cda.section) return undefined
    
    // get the PATIENT
    var PATIENT = undefined
    if (cda.subject.display) PATIENT = {PATIENT_CD: cda.subject.display}

    // get the visits
    var OBSERVATIONS = _hl7_extract_observations(cda.section) 
    const VISITS = _hl7_extract_visits(cda.event)

    //make a list of CONCEPTS to reduce the number of queries
    var CONCEPT_LIST = _get_concept_list(OBSERVATIONS)
    CONCEPT_LIST = await _db_query_concepts(CONCEPT_LIST, VIEW_CONCEPT)
    OBSERVATIONS = await _db_resolve_observations(OBSERVATIONS, CONCEPT_LIST, VIEW_CONCEPT)
    console.log(OBSERVATIONS)
    return {PATIENT, VISITS, OBSERVATIONS}
}

/**
 * 
 * @param {object} DATA - {PATIENT, VISITS, OBSERVATIONS}
 * @param {object} VIEW_PATIENT - Instance of View_patient
 * @param {object} VIEW_VISIT - Instance of View_visit
 * @param {object} VIEW_OBSERVATION - Instance of View_observation
 */
export async function addHL7ObjectToDB(DATA, VIEW_PATIENT, VIEW_VISIT, VIEW_OBSERVATION) {
    if (!DATA || !VIEW_PATIENT || !VIEW_VISIT || !VIEW_OBSERVATION) return {status: false, error: error_codes.invalid_payload}
    if (!DATA.PATIENT) return {status: false, error: error_codes.invalid_payload}
     //CHECK VSITS UND OBSERVATIONS
    if (DATA.VISITS.length !== DATA.OBSERVATIONS.length) return {status: false, error: error_codes.invalid_payload}
    
    const FIX_VISIT = await _get_FIX_VISIT(DATA, VIEW_VISIT)

    //first get PATIENT_NUM
    const PATIENT_NUM = await _get_PATIENT_NUM(DATA.PATIENT, VIEW_PATIENT)
    // console.log('PATIENT_NUM: ', PATIENT_NUM)
    if (!PATIENT_NUM) return {status: false, error: error_codes.could_not_get_patient_num}
    
    // now loop through the visits and create them
    var i_visit = -1
    var i_obs = 0
    var i_obs_added = 0
    for (let visit of DATA.VISITS) {
        i_visit ++
        if (visit.ENCOUNTER_NUM) delete visit.ENCOUNTER_NUM //brauche ich nicht
        //create new visit?
        let res_visit = FIX_VISIT //verwende die Feste Visite oder erzeuge eine neue, falls diese nicht vergeben wurde
        if (!res_visit) res_visit = await VIEW_VISIT.create({...visit, PATIENT_NUM: PATIENT_NUM})
        // console.log('VISIT: ', res_visit)
        if (res_visit.status && res_visit.data) {
            let ENCOUNTER_NUM = res_visit.data.ENCOUNTER_NUM
            for (let obs of DATA.OBSERVATIONS[i_visit]) {
                i_obs ++
                if (!obs.PROVIDER_ID) obs.PROVIDER_ID = 'hl7import'
                const OBSTOADD = {...obs, ENCOUNTER_NUM: ENCOUNTER_NUM, PATIENT_NUM: PATIENT_NUM}
                // console.log('OBSTOADD: ', OBSTOADD)
                let res_obs = await VIEW_OBSERVATION.create(OBSTOADD)
                // console.log('OBS: ', res_obs)
                if (res_obs.data) i_obs_added ++ 
            }
        }
    }

    return {status: true, data: `${i_obs_added} / ${i_obs} ${error_codes.observations_added_sucessfully}`}
}

async function _get_FIX_VISIT(DATA, VIEW_VISIT) {
    if (!DATA.FORCE_VISIT) return undefined
    else {
        if (!DATA.FORCE_VISIT.ENCOUNTER_NUM) return undefined
        const res_visit = await VIEW_VISIT.read({ENCOUNTER_NUM: DATA.FORCE_VISIT.ENCOUNTER_NUM, PATIENT_NUM: DATA.FORCE_VISIT.PATIENT_NUM})
        if (res_visit.data.length > 0) return {status: true, data: res_visit.data[0]}
        else return undefined
    }
}

async function _get_PATIENT_NUM(PATIENT, VIEW_PATIENT) {
    var PATIENT_CD = PATIENT.PATIENT_CD
    var PATIENT_NUM = undefined
    var res_patient = await VIEW_PATIENT.read({PATIENT_CD})
    if (res_patient.error) return undefined
    else if (res_patient.data.length === 0) {
        //PATIENTEN NOCH ANLEGEN
        res_patient = await VIEW_PATIENT.create(PATIENT)
        PATIENT_NUM = res_patient.data.PATIENT_NUM
    } else PATIENT_NUM = res_patient.data[0].PATIENT_NUM

    return PATIENT_NUM
}

function _hl7_extract_visits(event) {
    if (!event || !Array.isArray(event)) return undefined
    const RESULT = []
    var cc = 0
    event.forEach(visit => {
        cc ++
        RESULT.push({
            ENCOUNTER_NUM: cc,
            SOURCESYSTEM_CD: _hl7_extract_sourcessystem(visit),
            START_DATE: visit.period.start,
            END_DATE: visit.period.end

        })
    })


    return RESULT
}

function _hl7_extract_observations(section) {
    if (!section || !Array.isArray(section)) return undefined

    const RESULT = []
    section.forEach(visit => {
        let OBSERVATIONS = []
        if (visit.entry) {
            visit.entry.forEach(obs => {
                let ITEM = {
                    CONCEPT_CD: _hl7_get_code(obs),
                    VALUE: obs.value,
                    UNIT_CD: undefined
                }

                OBSERVATIONS.push(ITEM)
            })
        } // ELSE?

        RESULT.push(OBSERVATIONS)
    })

    return RESULT
}

function _hl7_get_code(obs) { //recursive funktion um in so was wie obs.code[0].coding[0].code = 'SCTID: 717268000' zu finden
    if (!obs) return undefined
    if (!obs.code && !obs.coding) return undefined

    if (obs.code) {
        if (Array.isArray(obs.code)) return _hl7_get_code(obs.code[0])
        else if (typeof(obs.code) === 'object') return _hl7_get_code(obs.code)
        else return obs.code
    }
    if (obs.coding) {
        if (Array.isArray(obs.coding)) return _hl7_get_code(obs.coding[0])
        else if (typeof(obs.coding) === 'object') return _hl7_get_code(obs.coding)
        else return obs.coding
    }



    // if (!obs.code) return undefined
    // // console.log(obs.code[0].coding)
    // if (Array.isArray(obs.code)) {
    //     if (Array.isArray(obs.code[0].coding && obs.code[0].coding[0])) return obs.code[0].coding[0].code
    //     else return undefined
    // } else {
    //     if (obs.code.code) {
    //         if (Array.isArray(obs.code.code)) return obs.code.code[0].code
    //         else return undefined
    //     } else if (obs.code.coding) {
    //         if (Array.isArray(obs.code.coding)) return obs.code.coding[0].code
    //         else return undefined
    //     }
    //     else return undefined
    // }
    
    
}

function _hl7_extract_sourcessystem(event) {
    if (!event || !event.code) return undefined
    try {
        var code = event.code[0].coding[0].system
        if (code.indexOf('snomed') > -1) return 'SNOMED-CT'
        else return 'LOINC' 
    } catch (error) {
        return 'UNKNOWN'
    }
}

function _get_concept_list(OBSERVATIONS) {
    const LIST = []
    OBSERVATIONS.forEach(obs => {
        obs.forEach(val => {
            if (val.CONCEPT_CD) {
                let obj = LIST.find(el => el.CONCEPT_CD === val.CONCEPT_CD)
                if (!obj) LIST.push({CONCEPT_CD: val.CONCEPT_CD})
            }
        })
    })

    return LIST
}

async function _db_query_concepts(CONCEPT_LIST, VIEW_CONCEPT) {

    for (let i = 0; i < CONCEPT_LIST.length; i++) {
        let concept = CONCEPT_LIST[i]
        let res = await VIEW_CONCEPT.read(concept)
        if (res.status && res.data.length > 0) {
            concept.VALTYPE_CD = res.data[0].VALTYPE_CD
            concept.SOURCESYSTEM_CD = res.data[0].SOURCESYSTEM_CD
            concept.UNIT_CD = res.data[0].UNIT_CD
            concept.NAME_CHAR = res.data[0].NAME_CHAR
            concept.CONCEPT_PATH = res.data[0].CONCEPT_PATH

        } else concept.ERROR = error_codes.could_not_resolve_concept
    }
    
    return CONCEPT_LIST
}

async function _db_resolve_observations(OBSERVATIONS, CONCEPT_LIST, VIEW_CONCEPT) {
    for (let OBS of OBSERVATIONS) {
        for (let observation of OBS) {
            // find the CONCEPT
            let obj = CONCEPT_LIST.find(el => el.CONCEPT_CD === observation.CONCEPT_CD)
            if (obj) {
                observation.CONCEPT_NAME_CHAR = obj.NAME_CHAR
                observation.VALTYPE_CD = obj.VALTYPE_CD
                observation.SOURCESYSTEM_CD = obj.SOURCESYSTEM_CD
                if (obj.UNIT_CD) observation.UNIT_CD = obj.UNIT_CD
                //jetzt zuordnen der korrekten Werte
                if (obj.VALTYPE_CD === 'N') observation.NVAL_NUM = observation.VALUE
                else if (obj.VALTYPE_CD === 'T' || obj.VALTYPE_CD === 'D') observation.TVAL_CHAR = observation.VALUE
                else if (obj.VALTYPE_CD === 'F') {
                    if (observation.VALUE) {
                        if (observation.VALUE === 1) observation.TVAL_CHAR = 'SCTID: 373066001'
                        else if (observation.VALUE === 0) observation.TVAL_CHAR = 'SCTID: 373067005'
                        else if (observation.VALUE.toLowerCase() === 'yes') observation.TVAL_CHAR = 'SCTID: 373066001'
                        else observation.TVAL_CHAR = 'SCTID: 373067005'
                    } 
                    else observation.TVAL_CHAR = 'SCTID: 373067005'
                }
                else if (obj.VALTYPE_CD === 'S') {
                    observation.TVAL_CHAR = await _db_resolve_selections(observation, CONCEPT_LIST, VIEW_CONCEPT)
                }
                
                //for debbugging
                if (obj.VALTYPE_CD === 'S' || obj.VALTYPE_CD === 'F') observation.TVAL_RESOLVED = observation.VALUE

                //some tidying up
                if (observation.UNIT_CD === null || observation.UNIT_CD === undefined) delete observation.UNIT_CD
                delete observation.VALUE

            } else observation.ERROR = error_codes.could_not_resolve_concept

        }
    }

    return OBSERVATIONS
}

async function _db_resolve_selections(observation, CONCEPT_LIST, VIEW_CONCEPT) {
    var VALUE = observation.VALUE
    if (VALUE === undefined || VALUE === null) return null
    //first find entry in the CONCEPT_LIST
    let obj = CONCEPT_LIST.find(el => el.NAME_CHAR && el.NAME_CHAR.toLowerCase() === VALUE.toLowerCase())
    
    if (!obj) {
        let res = await VIEW_CONCEPT.read({NAME_CHAR: VALUE})
        if (res.status && res.data.length > 0) {
            CONCEPT_LIST.push(res.data[0])
            VALUE = res.data[0].CONCEPT_CD
        }
    } else VALUE = obj.CONCEPT_CD

    return VALUE
}