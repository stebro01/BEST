import { error_codes } from "./logger"

import {importHL7toObject} from './hl7_import'
import { stringify } from "src/classes/sqltools"

/**
 * @description Kann aus einem TextString aus einer JSON/HTML Datei korrekt das CDA extrahieren
 * @param {string} txt - eingelesener Fragebogen im html oder json format 
 * @returns extrahiertes CDA Object: {status: true, data: {cda: {...}, hash: {...}, info: {...}, exported: true}}
 */
export function extract_cda(txt) {
    if (!txt || typeof(txt) !== 'string') return {status: false, error: error_codes.invalid_payload}
    // JSON ?
    if (txt.substring(0,6) === '{"cda"') return _extract_json(txt)
    // HTML?
    if (txt.substring(0,15) === '<!DOCTYPE html>') return _extract_html(txt)
    // CDA?
    if (txt.indexOf('"cda"') > 0 && txt.indexOf('"cda"') < 10) return _extract_json(txt)
    //else
    return {status: false, error: error_codes.invalid_payload}
}

function _extract_html(txt) {
    var start = txt.indexOf('<script>')
    var ende = txt.indexOf('</script>')
    if (!start || !ende) return {status: false, error: error_codes.invalid_html_object}
    //else
    try {

    
    var SCRIPT = txt.substring(start + 8, ende).trim()
    var CDA = SCRIPT.substring(SCRIPT.indexOf('CDA=')+4).trim()
    var JSON_DATA = JSON.parse(CDA)
    if (JSON_DATA.cda) return {status: true, data: JSON_DATA}
    else return {status: false, error: error_codes.invalid_html_object}
    
    } catch(err) {
        return {status: false, error: error_codes.invalid_html_object}
    }
    
}

function _extract_json(txt) {
    var JSON_DATA = undefined
    try {
        JSON_DATA = JSON.parse(txt)
        if (JSON_DATA.cda) return {status: true, data: JSON_DATA}
    } catch(err) {
        return {status: false, error: error_codes.invalid_json_object}
    }
}

/**
 * 
 * @param {object} DATA - import object {data} from extract_cda: DATA = {cda, hash, info, exported} 
 * @param {*} VIEW_CONCEPT - class Instance of View
 * @returns 
 */
export async function importCDAtoObject(DATA, VIEW_CONCEPT) {
    if (!DATA) return undefined
    if (!DATA.cda) return undefined
    
    // PREPARE RESULT STRUCTURE
    const RESULT = {
        PATIENT: undefined,
        VISITS: undefined,
        OBSERVATIONS: []
    }

    // EXTRACT DATA
    const cda = DATA.cda

    var res = await importHL7toObject(cda, VIEW_CONCEPT)
    RESULT.PATIENT = res.PATIENT
    RESULT.VISITS = res.VISITS
    const OBS = []
    OBS.push(await _prepare_surveybest_observation(cda, VIEW_CONCEPT))
    res.OBSERVATIONS.forEach(obs => {
        if (obs.length > 0) obs.forEach(o => {
            if (o.VALTYPE_CD) OBS.push(o) //VALTYPE_CD entsteht, wenn die CONCEPT_CD korrekt in der DB gefunden wurde
        })
    })
    RESULT.OBSERVATIONS = [OBS]
    return RESULT
}

/**
 * 
 * @param {*} cda 
 * @param {*} VIEW_CONCEPT 
 * @returns einen Observation-Eintrag f. den Fragebogen mit
 * - CATEGOREY_CHAR: 'surveyBEST'
 * - CONCEPT_CD: Konzept wird überprüft und ggf. gg. 'SCTID: 273249006' ausgetauscht
 * - TVAL-CHAR: Name des Fragebogens; wenn CONCEPT_CD in DB enthalten, dann wird der Name angepasst
 * - OBSERVATION_BLOB: datadump des gesamten JSON Objectes (JSON.stringifiy)
 */
async function _prepare_surveybest_observation(cda, VIEW_CONCEPT) {
    const OBS = {
        CATEGORY_CHAR: 'surveyBEST',
        SOURCESYSTEM_CD: 'SNOMED-CT',
        OBSERVATION_BLOB: stringify(cda),
        CONCEPT_CD: cda.event[0].code[0].coding[0].code,
        TVAL_CHAR: cda.event[0].code[0].coding[0].display,
        START_DATE: cda.event[0].period.start,
        END_DATE: cda.event[0].period.end,
        CONCEPT_NAME_CHAR: 'surveyBEST (CDA document)'
    }

    //CHECK THE CONCEPT
    const res_concept = await VIEW_CONCEPT.read({CONCEPT_CD: OBS.CONCEPT_CD})
    if (res_concept.status && res_concept.data.length > 0){
        OBS.TVAL_CHAR = res_concept.data[0].NAME_CHAR
    } else OBS.CONCEPT_CD = 'SCTID: 273249006'
    
    return OBS
}