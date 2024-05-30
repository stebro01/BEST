
/**
 * @description Klasse für die Arbeit an einer Observation
 * Funktionen: 
 * - create({ENCOUNTER_NUM: 1, PATIENT_NUM}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({ENCOUNTER_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_CONCEPT_DIMENSION } from './Scheme_concept_dimension'
import { SCHEME_OBSERVATION_FACT } from './Scheme_observation_fact'
import { SCHEME_CODE_LOOKUP } from './Scheme_code_lookup'

import { error_codes, log } from 'src/tools/logger'
import { unstringify } from './sqltools'

import {exportCSVTable, exportHL7JSON} from 'src/tools/db_export_obs'
export class View_Observation extends View_X {
    _VIEW_NAME = 'OBSERVATION'
    _CLASS_NAME = 'View_Observation'
    _SCHEME = SCHEME_OBSERVATION_FACT
    _RESOLVE_CONCEPT_CD = []
   
    // rest kommt von View_X

    /**
     * @description scheme_find: Spezialfunktion f. View_Observation um direkt auf die hinterlegten Visiten Schemata zuzugreifen: Table CODE_LOOKPUP und COLUMN_CD = "SCHEME_CD"
     * @param {object or empty} payload - empty => gibt alle schemes zurück oder object mit Suchbegriff f. scheme, ie. {CODE_CD: 'biomag_standard'}
     * @returns {object} {status: true, error: undefined, data: [...]}
     * @example
     * const res = await OBSERVATION.scheme_find()
     */
    async scheme_find(payload) {
        if (!this._check()) return {error: error_codes.instance_invalid}

        if (!payload || payload.CODE_CD !== undefined) {  
            var sql_query = undefined
            if (!payload) {sql_query = SCHEME_CODE_LOOKUP.read({COLUMN_CD: 'SCHEME_CD'})}
            else {sql_query = SCHEME_CODE_LOOKUP.read({COLUMN_CD: 'SCHEME_CD', CODE_CD: payload.CODE_CD})}

            if (sql_query.error) return sql_query

            //weiter
            this._DB_MAN.connect(this._DB_FILENAME)
            const result = await this._DB_MAN.get_all(sql_query.query)
            this._DB_MAN.close() 
            
            return result
        } else return {error: error_codes.invalid_payload}
    }

    /**
     * @description scheme_resolve: Spezialfunktion f. View_Observation um direkt auf die hinterlegten Visiten Schemata zuzugreifen: Table CODE_LOOKPUP und COLUMN_CD = "SCHEME_CD"
     * und diese aufzulösen (d.h. alle Daten abrufen und f. Anzeige in VIEW vorbereiten)
     * @param {object} payload - {CODE_CD: string}
     * @returns {object} {status: true, error: undefined, data: [...]}
     * @example
     * const res = await OBSERVATION.scheme_resolve()
     */
    async scheme_resolve(payload) {
        if (!this._check()) return {error: error_codes.instance_invalid}
        if (!payload.CODE_CD) return {error: error_codes.invalid_payload}

        //* 1. Frage das SCHEME aus der DB ab
        var sql_query = undefined
        sql_query = SCHEME_CODE_LOOKUP.read({COLUMN_CD: 'SCHEME_CD', CODE_CD: payload.CODE_CD})
        if (sql_query.error) return sql_query
        //weiter
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.get_all(sql_query.query)
        this._DB_MAN.close() 
        if (result.data.length === 0) return {error: error_codes.query_was_empty}
        if (result.data.length > 1) return {error: error_codes.query_more_than_one_result}

        const SCHEME_CD = JSON.parse(unstringify(result.data[0].LOOKUP_BLOB))
        if (!SCHEME_CD.title || !SCHEME_CD.data) return {error: error_codes.invalid_json_object}

        //* 2. Jetzt löse die Einträge in SCHEME_CD.data [...] auf
        const CONCEPTS = []
        for (let i=0; i<SCHEME_CD.data.length; i++) {
            let concept = await this._return_concept(SCHEME_CD.data[i])
            CONCEPTS.push(concept)
        }

        return {status: true, data: CONCEPTS}

    }

    /**
     * EXPORT FUNCTION >> to CSV
     * Exportiere alle in payload.PATIENTS definierten Patienten in ein CSV entsprechend des DB Standards zum erneuten IMPORT
     * @param {object} payload -ie: {PATIENTS: [{PATIENT_NUM: 1}]}
     * @param {string} mode - modus des export: 'csv', 'hl7/json'
     */
    async export(payload, mode, meta) {
        if (!payload || !mode) return {error: error_codes.invalid_payload}
        if (!payload.PATIENTS || !Array.isArray(payload.PATIENTS)) return {error: error_codes.invalid_payload}
        var supported_modes = {csv: 'csv', hl7: 'hl7/json'}
        var EXCLUDE_CONCEPTS = []
        if (payload.CONCEPTS) EXCLUDE_CONCEPTS = payload.CONCEPTS
        //erzeuge zunächst alle Daten
        var data = [] //will contain a list of all patients / results
        var concepts = [] //will contain a list of unique objects: {CONCEPT_CD, CONCEPT_NAME_CHAR, UNIT_CD}
        for (let patient of payload.PATIENTS) {
            let res = await this.read({PATIENT_NUM: patient.PATIENT_NUM, _view: true})
            res.data.forEach(d => {
                data.push(d)
                //build a list of all concepts
                let obj = concepts.find(el => el.CONCEPT_CD === d.CONCEPT_CD)
                let include_concept = EXCLUDE_CONCEPTS.find(el => el.CONCEPT_CD === d.CONCEPT_CD)
                if (!obj && (EXCLUDE_CONCEPTS.length === 0 || include_concept)) {
                    let TMPDATA = undefined
                    if (include_concept)TMPDATA = {CONCEPT_CD: d.CONCEPT_CD, CONCEPT_NAME_CHAR: d.CONCEPT_NAME_CHAR, UNIT_CD: d.UNIT_CD, UNIT_RESOLVED: d.UNIT_RESOLVED, VALTYPE_CD: d.VALTYPE_CD, CONCEPT_PATH: include_concept.CONCEPT_PATH}
                    else TMPDATA = {CONCEPT_CD: d.CONCEPT_CD, CONCEPT_NAME_CHAR: d.CONCEPT_NAME_CHAR, UNIT_CD: d.UNIT_CD, UNIT_RESOLVED: d.UNIT_RESOLVED, VALTYPE_CD: d.VALTYPE_CD}
                    if (!TMPDATA.CONCEPT_PATH) TMPDATA.CONCEPT_PATH = '\\undefined'
                    if (TMPDATA) concepts.push(TMPDATA)
                }
            })
        }


        // SORTY BY CONCEPT_PATH
        concepts = concepts.sort((a, b) => {
            const nameA = a.CONCEPT_PATH.toUpperCase();
            const nameB = b.CONCEPT_PATH.toUpperCase();
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0;
          });

        // console.log('DATEN:', data)
        var DATA = undefined
        if (mode === supported_modes.csv) DATA = exportCSVTable(data, concepts)
        else if (mode === supported_modes.hl7) DATA = exportHL7JSON(data, concepts, meta)
        else return {error: error_codes.invalid_payload, status: false}
        return {status: true, data: DATA}
    }

    /**
     * HELPER FUNCTION f. this.scheme_resolve(payload)
     * @param {object} payload - ie: {CONCEPT_CD: 'LID: 63900-5, multiselection: true, selection: [{CONCEPT_CD: 'ICD10: F06.7'}, {CONCEPT_CD: 'ICD10:I11.0'}]}
     * @returns {object} - gibt den CONCEPT EIntrag aus dem Table CONCEPT_DIMENSION zurück
     * undefined - wenn nix gefunden
     */
    async _return_concept(payload) {
        // prepare the query
        var sql_query = undefined
        if (payload.CONCEPT_CD) sql_query = SCHEME_CONCEPT_DIMENSION.read({CONCEPT_CD: payload.CONCEPT_CD})
        // query empty? could not query the db
        if (sql_query === undefined) return Object.assign({}, payload, {error: error_codes.could_not_resolve_concept})
        // else
        const res = await this._query_db(sql_query, payload)
        if (res === undefined) return Object.assign({}, payload, {error: error_codes.could_not_resolve_concept})
        if (res.VALTYPE_CD === 'S' && !res.selection) {
            const selection = await this._find_concept_answers(res)
            if (selection) res.selection = selection
        }
        return res
    }

    /**
     * 
     * @param {string} sql_query - SQL Query: ie: SELECT * from CONCEPT_DIMENSION WHERE "CONCEPT_CD" = "LID: 46463-6"
     * @param {object} concept - the payload from _return_concept
     * @returns the ENTRY or undefined
     */
    async _query_db(sql_query, concept) {
        if (!sql_query.query) return undefined
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.get_all(sql_query.query)
        this._DB_MAN.close() 
        if (result.data && result.data.length>0) {
            const RESULT = result.data[0]
            //add some special tags from concept
            if (concept.multiselection) RESULT.multiselection = concept.multiselection
            // and resolve concepts in the selection array
            if (concept.selection) {
                const SELECTION = []
                for (let i = 0; i < concept.selection.length; i++) {
                    let sel = await this._return_concept(concept.selection[i])
                    if (sel) SELECTION.push(sel)
                }
                RESULT.selection = SELECTION
            }
            return RESULT
        }
        return undefined
    }

    /**
     * this will try to find answers for a CONCEPT_CD db entry >> FOUND by looking ahead in the CONCEPT_PATH: PATH+'\\LA'
     * @param {object} concept - CONCEPT_CD db entry
     * @returns {the concept object }
     */
    async _find_concept_answers(concept) {
        if (concept === undefined) return undefined
        var sql_query = undefined
        if (concept.CONCEPT_PATH) {
            sql_query = SCHEME_CONCEPT_DIMENSION.read({CONCEPT_PATH: `${concept.CONCEPT_PATH}\\LA`, _like: true})
            if (sql_query.error) return undefined
            this._DB_MAN.connect(this._DB_FILENAME)
            const result = await this._DB_MAN.get_all(sql_query.query)
            this._DB_MAN.close() 
            if (result.error) return
            if (result.data.length > 0) return result.data
        } 
        //keine Antworten gefunden? 
        if (!concept.RELATED_CONCEPT) return undefined
        // => versuche dann den RELATED_CONCEPT
        else {
            sql_query = SCHEME_CONCEPT_DIMENSION.read({CONCEPT_CD: concept.RELATED_CONCEPT})
            if (sql_query.error) return undefined
            this._DB_MAN.connect(this._DB_FILENAME)
            const result = await this._DB_MAN.get_all(sql_query.query)
            this._DB_MAN.close() 
            if (result.error || result.data.length < 1) return undefined
            return this._find_concept_answers({CONCEPT_PATH: result.data[0].CONCEPT_PATH})
        }

        //else
        return undefined

    }
}
