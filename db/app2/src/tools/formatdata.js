import {stringify} from 'src/classes/sqltools'
import {datenow_isostring}  from 'src/tools/mydate'

import {SCHEME_CONCEPT_DIMENSION} from 'src/classes/Scheme_concept_dimension'
import {log} from 'src/tools/logger'

/**
 * @param {object} Object mit Werten 
 * @returns {object} - entferne Elemente die Undefined/null sind und löse objects {value, label} auf
 * @example 
 * const data = beautify_data('{"PATIENT_NUM":1,"VITAL_STATUS_CD":"NF","BIRTH_DATE":1979,"DEATH_DATE":null,"AGE_IN_YEARS":42,"SEX_CD":{"label":"Transsexual","value":"SCTID: 407374003"},"LANGUAGE_CD":"german","RACE_CD":"LID: 46463-UK","MARITAL_STATUS_CD":"LID:45404-2","RELIGION_CD":null,"STATECITYZIP_PATH":null,"PATIENT_BLOB":null,"UPDATE_DATE":null,"DOWNLOAD_DATE":null,"IMPORT_DATE":"2022-12-13 19:16:33","SOURCESYSTEM_CD":null,"UPLOAD_ID":859723}')
 * //returns: {"PATIENT_NUM":1,"VITAL_STATUS_CD":"NF","BIRTH_DATE":1979,"AGE_IN_YEARS":42,"SEX_CD":"SCTID: 407374003","LANGUAGE_CD":"german","RACE_CD":"LID: 46463-UK","MARITAL_STATUS_CD":"LID:45404-2","IMPORT_DATE":"2022-12-13 19:16:33","UPLOAD_ID":859723}
 */
export function beautify_data(data) {
    const tmp = JSON.parse(JSON.stringify(data))
    const keys = Object.keys(tmp)
    for (let i = 0; i<keys.length; i++) {
        if (tmp[keys[i]] === undefined || tmp[keys[i]] === null) tmp[keys[i]] = 'NULL'
        if (typeof(tmp[keys[i]]) === 'object') tmp[keys[i]] = tmp[keys[i]].value
    }

    return tmp
}

/**
 * @description wandelt einen String (HTML Survey Best eingelesen) in ein OBSERVATION_FACT Objekt um
 * @param {string} txt -  eingelesenes HTML  SuveyBest  
 * @returns {OBSERVATION} object
 * @example
 * const txt = window.electron.readFile(filepath, 'utf8')
 * const obs = importSurveyBest(txt)
*    console.log(obs)
 * }
 */
export function importSurveyBest(txt) {
    //read the file using the electron interface
    //create a html object from the txt
    var el = document.createElement( 'html' );
    el.innerHTML = txt;
    //extract body html to string
    const body_html = el.getElementsByTagName('BODY')[0].innerHTML.trim()
    //extract the script section
    const script_html = el.getElementsByTagName('SCRIPT')[0].innerHTML.trim()
    // check > 'CDA=' should be in the script html
    let pos = script_html.indexOf('CDA=')
    if ( pos < 0 ) reject('Dateiformat nicht korrekt!')
    const cda_txt = script_html.substring(4, script_html.length)
    const cda_json = JSON.parse(cda_txt)
    
    // now prepare all data
    const obs = {
        START_DATE: datenow_isostring(cda_json.info.date),
        CONCEPT_CD: cda_json.cda.event[0].code[0].coding[0],
        NVAL_NUM: extract_sum(cda_json),
        CATEGORY_CHAR: 'quest_surveyBEST',
        TVAL_CHAR: stringify(body_html),   
        VALTYPE_CD: 'N',             
        OBSERVATION_BLOB: stringify(JSON.stringify(cda_json)),
        LOCATION_CD: cda_json.cda.attester[0].party.display,
    }
    return obs
  }

  /**
   * Versuch aus dem CDA Dokument des surveyBEST Fragebogen die Summe herauszufinden
   * @param {json} json 
   * @returns {number} - wenn Feld existiert oder null
   * 
   */
function extract_sum(json) {
    try {
        var sum = json.cda.section[1].entry[0]
        if (sum.title === 'sum') return sum.value
        else return null
    } catch {
        return null
    }
}

/**
 * 
 * @param {string} text - eingelesenes CSV File mit standardisierter Spalte: TEMPLATE_CSV.xls
 * refer to Scheme_observation_facts.js for Description of the OBSERVATION object
 * @returns {OBSERVATION} object
 * const txt = window.electron.readFile(filepath, 'utf8')
 * const obs = importCSV(txt)
*    console.log(obs)
 */
export function importCSV(text) {
    const json = csvJSON(text, ';')

    // definiere Felder, die keine Observations enthalten
    const _NO_OBS = ['FIELD_NAME', 'PATIENT_NUM', 'PATIENT_CD', 'ENCOUNTER_NUM', 'START_DATE', 'END_DATE', 'PROVIDER_ID', 'LOCATION_CD' ]
    
    //prepare Fields
    const FIELD_NAMES = Object.keys(json[0])
    const VALTYPE_CD = jsonScanRow(json[0], FIELD_NAMES)
    const UNIT_CD = jsonScanRow(json[1], FIELD_NAMES)
    const NAME_CHAR = jsonScanRow(json[2], FIELD_NAMES)

    //build the observations
    const OBSERVATION = []
    for (let i = 3; i < json.length; i++) {
        let obs = {
            PATIENT_NUM: json[i].PATIENT_NUM,
            PATIENT_CD: json[i].PATIENT_CD,
            ENCOUNTER_NUM: json[i].ENCOUNTER_NUM,
            START_DATE: json[i].START_DATE,
            END_DATE: json[i].END_DATE,
            PROVIDER_ID: json[i].PROVIDER_ID,
            LOCATION_CD: json[i].LOCATION_CD
        }
        //ALS NAECHSTES: DURDCH FIELD_NAMES LOOPEN 
        // verwende _NO_OBS um zu pruefen, ob der KEY reserviert ist

        FIELD_NAMES.forEach(F => {
            if (!_NO_OBS.includes(F) && json[i][F]) {
                //numeric
                let somethin_found = false
                if (VALTYPE_CD[F] === 'numeric') {
                    obs.NVAL_NUM = parse_int(json[i][F])
                    obs.VALTYPE_CD = 'N'
                    obs.TVAL_CHAR = null
                    obs.UNIT_CD = UNIT_CD[F]
                    obs.CONCEPT_CD = {value: F, label: NAME_CHAR[F]}
                    somethin_found = true
                } else if (VALTYPE_CD[F] === 'date') {
                    obs.NVAL_NUM = null
                    obs.VALTYPE_CD = 'D'
                    obs.TVAL_CHAR = parse_date(json[i][F])
                    obs.UNIT_CD = null
                    obs.CONCEPT_CD = {value: F, label: NAME_CHAR[F]}
                    somethin_found = true
                }
                else if (VALTYPE_CD[F] === 'text' || VALTYPE_CD[F] === 'string') {
                    obs.NVAL_NUM = null
                    obs.VALTYPE_CD = 'T'
                    obs.TVAL_CHAR = json[i][F]
                    obs.UNIT_CD = null
                    obs.CONCEPT_CD = {value: F, label: NAME_CHAR[F]}
                    somethin_found = true
                }
                if (somethin_found) OBSERVATION.push(JSON.parse(JSON.stringify(obs)))

            }
        })
    }

    return OBSERVATION
}

/**
 * Bereitet Listen vor und schaut in data nach den keys und schreibt das Object
 * @param {*} data 
 * @param {*} keys 
 * @returns {object}
 * @example
 * const data = {"FIELD_NAME":"NAME_CHAR","PATIENT_NUM":"Patient","ENCOUNTER_NUM":"Visite","START_DATE":"Datum","PROVIDER_ID":"Untersucher","LOCATION_CD":"Ort","LID: 63900-5":"Age","SCTID: 263495000":"Gender","SCTID: 184099003":"Date of birth","SCTID: 1148423001":"MoCA -  Montreal Cognitive Assessment version 8.1","LID: 2085-9":"HDL-Cholesterin"}
 * const keys = ["FIELD_NAME","PATIENT_NUM","ENCOUNTER_NUM","START_DATE","PROVIDER_ID","LOCATION_CD","LID: 63900-5","SCTID: 263495000","SCTID: 184099003","SCTID: 1148423001","LID: 2085-9"]
 * const res = jsonScanRow(data, keys)
 * expect(res).toBe('{"PATIENT_NUM":"Patient","ENCOUNTER_NUM":"Visite","START_DATE":"Datum","PROVIDER_ID":"Untersucher","LOCATION_CD":"Ort","LID: 63900-5":"Age","SCTID: 263495000":"Gender","SCTID: 184099003":"Date of birth","SCTID: 1148423001":"MoCA -  Montreal Cognitive Assessment version 8.1","LID: 2085-9":"HDL-Cholesterin"}')
 */
function jsonScanRow(data, keys) {
    const RES = {}
    let c = 0
    keys.forEach(k => {
        if (c > 0 && data[k]) RES[k] = data[k]
        c++
    })
    return RES
}

/**
 * @description erzeugt aus einem CSV einen String => die erste Zeile wird als Feldname gesetzt
 * @param {string} csv - csv string
 * @param {string} split_str - separator String => i.e. ',' oder ';'
 * @returns {object}
 * @example
 * const json = csvJSON('Name;Alter\nBen;2', ';')
 * expect(JSON.stringify(json)).toBe('[{"Name":"Ben","Alter":"2"}]')
 */
export function csvJSON(csv, split_str){
    var lines=csv.split("\n");
    var result = [];
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(split_str);
  
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(split_str);
        for(var j=0;j<headers.length;j++){
            if (currentline[j]) {
                headers[j] = headers[j].trim().toUpperCase()
                obj[headers[j]] = currentline[j].trim();
            }
            
        }
        if (Object.keys(obj).length > 0) result.push(obj);
    }
  
    //return result; //JavaScript object
    return result; //JSON
  }

  /**
   * Geht durch ein Array mit Observations und gibt ein Objekt mit den notwendigen Visten zurück
   * ie: [{obs1_visit1}, {obs2_visit1}, {obs3_visit2}, {obs4_visit2}] =>  [{PATIENT_NUM: 1, ENCOUNTER_NUM: 1, OBSERVATIONS: [obs1, obs2], ...}]
   * @param {array} array mit Observations 
   * @returns {array of objects} - i.e. [{PATIENT_NUM: 1, ENCOUNTER_NUM: 1, OBSERVATIONS: [obs1, obs2], ...}]
   */
  export function splitVisits(observations) {
    // collect all pairs of {PATIENT_NUM, ENCOUNTER_NUM}
    var visitXpatient = []
    observations.forEach(o => {
        visitXpatient.push(JSON.stringify({PATIENT_NUM: o.PATIENT_NUM, PATIENT_CD: o.PATIENT_CD, ENCOUNTER_NUM: o.ENCOUNTER_NUM}))
    })
    // uniques only
    let uniqueItems = [...new Set(visitXpatient)]
    // back to array of objects
    visitXpatient = []
    // now i make an array of objects like: [{PATIENT_NUM: 1, ENCOUNTER_NUM: 1, OBSERVATIONS: []}, {PATIENT_NUM: 1, ENCOUNTER_NUM: 2, OBSERVATIONS: []}...]
    uniqueItems.forEach(o => visitXpatient.push({...JSON.parse(o), OBSERVATIONS: []}))

    // finally sort the observations to the Object 
    observations.forEach(o => {
        visitXpatient.forEach(v => {
            if (v.ENCOUNTER_NUM === o.ENCOUNTER_NUM && v.PATIENT_NUM === o.PATIENT_NUM) v.OBSERVATIONS.push(o)
        })
    })
    return visitXpatient
  }


/**
 * Wandele einen CSV - String mit CONCEPT_CDs in ein gültiges JSON Objekt entsprechend SCHEME_CONCEPT_DIMENSION um
 * @param {string} - CSV File
 * @returns {object} JSON Objekt für den IMPORT 
 * 
 */
export function importConceptFromCSV(txt) {
    const CONCEPTS = []
    const csv = csvJSON(txt, ';')
    if (!csv || !Array.isArray(csv)) return CONCEPTS
    csv.forEach(c => {
        if (all_needed_fields_are_there(c)) {
            let CC = {}
            Object.keys(SCHEME_CONCEPT_DIMENSION._FIELDS).forEach(f => {
                if (c[f] !== undefined && c[f] !== null && c[f] !== '') {
                    CC[f] = c[f].trim()
                }
            })
            // console.log(CC)
            beautify_CONCEPT_CD(CC)
            beautify_CONCEPT_PATH(CC)
            beautify_VALTYPE(CC)
            CONCEPTS.push(CC)
        }
        
    })
    // THE END ...
    return CONCEPTS

    // EINIGE LOKALE FUNKTIONEN
    function all_needed_fields_are_there(c) {
        var all_good = true
        SCHEME_CONCEPT_DIMENSION._NOT_NULL.forEach(s => {
            if (c[s] === undefined || c[s] === null || c[s] === '') {
                log({method: 'formatdata/importConceptFromCSV/all_needed_fields_are_there', message: 'fields not valid', data: c})
                all_good = false
            }
        })
        return all_good
    }

    function beautify_CONCEPT_CD(CC) {
        if (CC.CONCEPT_PATH.indexOf('\\CONCEPT') >  -1) return
        //FORMAT: 'SCTID: 2343'
        var CONCEPT_CD = CC.CONCEPT_CD
        //1 check position of ':'
        if (CONCEPT_CD.indexOf(':') < 0 || CONCEPT_CD.indexOf(': ') < 0) {
            if (CONCEPT_CD.indexOf(':') < 0 && CC>SOURCESYSTEM_CD) {
                if (CC.SOURCESYSTEM_CD.toLowerCase() === 'snomed-ct') CC.CONCEPT_CD = `SCTID: ${CONCEPT_CD}`
                else if (CC.SOURCESYSTEM_CD.toLowerCase() === 'loinc') CC.CONCEPT_CD = `LID: ${CONCEPT_CD}`
                else if (CC.SOURCESYSTEM_CD.toLowerCase() === 'custom') CC.CONCEPT_CD = `CUSTOM: ${CONCEPT_CD}`
            } else if (CONCEPT_CD.indexOf(':') > 0 && CONCEPT_CD.indexOf(': ') < 0) {
                let split = CONCEPT_CD.split(':')
                CC.CONCEPT_CD = `${split[0].trim()}: ${split[1].trim()}`
            }
        }
    }

    function beautify_CONCEPT_PATH(CC) {
        // FORMAT: '\SNOMED-CT\...\...\CONCECPT_CD
        var CONCEPT_PATH = CC.CONCEPT_PATH

        // CONCEPT_CD SHOULD BE IN THE PATH
        if (CC.CONCEPT_CD && CC.CONCEPT_CD.indexOf(':') > 0) {
            let split = CC.CONCEPT_CD.split(':')
            if (CONCEPT_PATH.indexOf(split[1].trim()) < 0) {
                CC.CONCEPT_PATH = `${CONCEPT_PATH}\\${split[1].trim()}`
            }
        }

        // check the \
        CC.CONCEPT_PATH = CC.CONCEPT_PATH.replace(/\\\\/g, '\\')
        CC.CONCEPT_PATH = CC.CONCEPT_PATH.replace(/\\\\/g, '\\') //2. Aufruf ist korrekt!
    }

    function beautify_VALTYPE(CC) {
        var VALTYPE_CD = CC.VALTYPE_CD
        let obj = SCHEME_CONCEPT_DIMENSION._VALTYPE_CD_LIST.find(el => el.value === VALTYPE_CD)
        if (obj) return
        //else: VALTYPE nicht gefunden!!!
        //1. Gross und klein?
        obj = SCHEME_CONCEPT_DIMENSION._VALTYPE_CD_LIST.find(el => el.value.toLowerCase() === VALTYPE_CD)
        if (obj) {
            CC.VALTYPE_CD = VALTYPE_CD.toUpperCase()
            return
        } else CC.VALTYPE_CD = 'A' //ANSWER als DEFAULT
    }
}

export const VALTYPE_CD_LIST = SCHEME_CONCEPT_DIMENSION._VALTYPE_CD_LIST



//////// LOCAL HELPER FUNCTIONS

/**
 * Wandelt einen String in eine Zahl um, korrigiert auch f. '.' und ','
 * @param {string} value 
 * @returns {number} - wenn erfolgreich, ansonsten wird der eingangswert zurückgeeben
 * const num = parse_int('11,1')
 * >> returns: 11.1
 */
function parse_int(value) {
    var int = undefined
    if (typeof(value) === 'string') {
        //replace ',' => '.'
        value = value.replace(/,/g,'.');
        // parse number
        int = parseFloat(value)
    }
    else int = value
    return int
}

/**
 * @param {string} value 
 * @returns {string} date
 */
function parse_date(value) {
    // todo: hier könnte man noch etwas am Datum arbeiten
    return value
}