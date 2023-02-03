
/**
 * @description TEMPLATE Klasse für Views: PATIENT, VISIT >> direkte Kommunikation mit DB_MAN und den SCHEMES
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({PATIENT_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

const {log, info, error_codes} = require('src/tools/logger')

import {SCHEME_CONCEPT_DIMENSION} from './Scheme_concept_dimension'
import { SCHEME_CODE_LOOKUP } from './Scheme_code_lookup'

export class View_X {
    _VIEW_NAME = 'VIEW_X'
    _CLASS_NAME = 'View_X'
    _SCHEME = undefined
    _RESOLVE_CONCEPT_CD = [{FIELD: 'SEX_CD', CONCEPT_CD: 'SCTID: 263495000'}, {FIELD: 'RACE_CD', CONCEPT_CD: 'LID: 46463-6'}, {FIELD: 'MARITAL_STATUS_CD', CONCEPT_CD: 'LID: 45404-1'}, {FIELD: 'LANGUAGE_CD', data: ['german', 'english', 'other']}]

    _DB_MAN = undefined // this should be the reference to the Module db_man.js
    _DB_FILENAME = undefined
    _UPLOAD_ID = undefined
    /**
     * SHOULD be initialized with db_man
     * @param {function} db_man 
     * @example
     * const VIEW_PATIENT = new View_Patient(db_man, '../db_fn.db', 'someUploadID')
     */
    constructor(db_man, db_fn, upload_id) {
        if (db_man === undefined || !db_fn) {
            log({method: `ERROR: ${this._CLASS_NAME} -> constructor`, message: 'payload is empty, no refrence to db_man.js or the db_filename'})
            return
        }
        
        //else
        this._DB_MAN = db_man
        this._DB_FILENAME = db_fn
        if (upload_id) this._UPLOAD_ID = upload_id
    }

    /**
     * @description Lade einen Patienten, vorzugsweise mit dem Primary_KEY
     * @param {object} payload - some JSON with the pair: FIELD_NAME: VALUE; in this version only the first elemnt will be used
     * @returns {status: true, data: {}, error: undefined}
     * @example
     * await const status = await PATIENT.read({PATIENT_NUM: 1})
     */
    async read(payload) {
        //check instanciation and payload
        if (!this._check()) return {error: error_codes.instance_invalid}
        info({method: `${this._CLASS_NAME} -> read`, data: payload})
        if (!payload) return {error: error_codes.no_payload}
        
        //jetzt erzeuge die QUERY
        const sql_query = this._SCHEME.read(payload)
        if (sql_query.error) return sql_query

        //weiter
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.get_all(sql_query.query)
        this._DB_MAN.close()
        return result
    }

    async run_query(payload) {
        if (!payload) return {error: error_codes.invalid_payload}
        info({method: `${this._CLASS_NAME} -> run_query`, data: payload})
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.get_all(payload)
        this._DB_MAN.close()
        return result

    }

    /**
     * @description Erzeuge einen Patienten mit den angebenen Keys
     * @param {object} payload - some JSON with the pair: FIELD_NAME: VALUE; in this version only the first elemnt will be used
     * @returns {status: true, data: {PATIENT_NUM: number}, error: undefined} - gibt den Primary Key in DATA zurück
     * @example
     * await const status = await PATIENT.read({AGE_IN_YEARS: 31})
     */
     async create(payload) {
        //check instanciation and payload
        if (!this._check()) return {error: error_codes.instance_invalid}
        info({method: `${this._CLASS_NAME} -> create`, data: payload})
        if (!payload) return {error: error_codes.no_payload}

        //checke for _SCHEME._NOT_NULL && PRIMARY_KEY
        var primary_key_is_to_be_set = false
        Object.keys(payload).forEach(p => {
            if (p === this._SCHEME._PRIMARY_KEY) primary_key_is_to_be_set = true
        })
        if (primary_key_is_to_be_set) {
            const status_pk = await this._check_primary_key(payload[this._SCHEME._PRIMARY_KEY])
            if (status_pk) return {error: error_codes.primary_key_already_used}
        }

        if (this._SCHEME._NOT_NULL) {
            var check_not_null = true
            this._SCHEME._NOT_NULL.forEach(el => {
                if (!payload[el]) check_not_null = false
            })
            if (payload.UPLOAD_ID === undefined) payload.UPLOAD_ID = this._UPLOAD_ID 
            if (!check_not_null) {
                log({method: `${this._CLASS_NAME} -> create`, message: `must not be undefined: ${JSON.stringify(this._SCHEME._NOT_NULL)}`, data: JSON.stringify(payload)})
                return {error: `${error_codes.invalid_payload}:: ${JSON.stringify(this._SCHEME._NOT_NULL)} must be defined`}
            }
        }
        
        //jetzt erzeuge die QUERY
        const sql_query = this._SCHEME.create(payload)
        if (sql_query.error) return sql_query
        //weiter
        try {
            this._DB_MAN.connect(this._DB_FILENAME)
            const result = await this._DB_MAN.run(sql_query.query)
            this._DB_MAN.close()
            return {status: true, error: undefined, data: {[this._SCHEME._PRIMARY_KEY]: result.data}}
        } catch(err) {
            return {status: false, error: err}
        }
    }

    /**
     * @description Update einen Patienten, Identifikation IMMER mit PrimaryKey
     * @param {object} payload - some JSON with the pair: {where: object, set: object}
     * @returns {status: true, data: undefined, error: undefined}
     * @example
     * res = await PATIENT.update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 45}})
     */
     async update(payload) {
        //check instanciation and payload
        if (!this._check()) return {error: error_codes.instance_invalid}
        info({method: `${this._CLASS_NAME} -> update`, data: payload})
        if (!payload) return {error: error_codes.no_payload}
        if (!payload.where || !payload.set ) return {error: error_codes.invalid_payload}
        
        //payload.set should be the primaryKey
        if (!payload.where[this._SCHEME._PRIMARY_KEY]) return {error: error_codes.invalid_payload}

        //jetzt erzeuge die QUERY
        const sql_query = this._SCHEME.update(payload)
        if (sql_query.error) return sql_query
console.log(sql_query)
        //weiter
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.run(sql_query.query)
        this._DB_MAN.close()

        return result
    }

     /**
     * @description Löscht einen Patienten mit den angebenen PrimaryKey
     * @param {object} payload - {PATIENT_NUM: integer}
     * @returns {status: true, data: true, error: undefined}
     * @example
     * await const status = await PATIENT.delete({PATIENT_NUM: 3})
     * await const status = await OBSERVATION.delete({ENCOUNTER_NUM: 3, _force: true}) //delete without uing the primary key
     */
      async delete(payload) {
        //check instanciation and payload
        if (!this._check()) return {error: error_codes.instance_invalid}
        info({method: `${this._CLASS_NAME} -> delete`, data: payload})
        if (!payload) return {error: error_codes.no_payload}
         //payload.set should be the primaryKey
         if (!payload[this._SCHEME._PRIMARY_KEY] && !payload._force) return {error: error_codes.invalid_payload}

        //jetzt erzeuge die QUERY
        const sql_query = this._SCHEME.delete(payload)
        if (sql_query.error) return sql_query

        //weiter
        this._DB_MAN.connect(this._DB_FILENAME)
        const result = await this._DB_MAN.run(sql_query.query)
        this._DB_MAN.close()

        return {status: true, error: undefined, data: true}
    }


    /**
     * Um View spezifische Lookups aufzulösen
     * @return {obj} resolve_cd - {SEX_CD: [...], LANGUAGE_CD: [...]}
     */
    async resolve_cd() {
        if (!this._check()) return {error: error_codes.instance_invalid}
        const result = {}
        this._DB_MAN.connect(this._DB_FILENAME)
        for (let i = 0; i<this._RESOLVE_CONCEPT_CD.length; i++) {
            let el = this._RESOLVE_CONCEPT_CD[i]
            if (el.data) result[el.FIELD] = el.data
            else if (el.CONCEPT_CD) {
                //try to resolve the CONCEPT_CD
                let sql_query = SCHEME_CONCEPT_DIMENSION.read({CONCEPT_CD: el.CONCEPT_CD})
                if (!sql_query.error) {
                    let res = await this._DB_MAN.get_all(sql_query.query)
                    if (!res.error && res.data.length > 0) {
                        let CONCEPT_PATH = res.data[0].CONCEPT_PATH
                        if (CONCEPT_PATH) {
                            let path_query = SCHEME_CONCEPT_DIMENSION.read({CONCEPT_PATH: `${CONCEPT_PATH}\\`, _like: true})
                            if (!path_query.error) {
                                let res_path = await this._DB_MAN.get_all(path_query.query)
                                result[el.FIELD] = res_path.data
                            }
                        }
                    }
                }
            }
            else if (el.COLUMN_CD) {
                //try to resolve the LOCATION_CD
                let sql_query = SCHEME_CODE_LOOKUP.read({COLUMN_CD: el.COLUMN_CD})
                if (!sql_query.error){
                    let res = await this._DB_MAN.get_all(sql_query.query)
                    if (!res.error && res.data.length > 0) {
                        result[el.FIELD] = res.data
                    }
                }

            }
            else result[el.FIELD] = undefined
        }
        this._DB_MAN.close()
        return {status: true, data: result}

    }

    /**
     * @description Ueberpruefe, ob der primary key schon in der DB vergeben wurde
     * @param {value} key - primary key
     * @returns {boolean} true - key ist enthalten, false - key ist nicht enthalten
     * @example
     * const status = this._check_primary_key(1)
     */
    async _check_primary_key(key) {
        if (!key) return false
        const res = await this.read({[this._SCHEME._PRIMARY_KEY]: key})
        if (res.error) return false
        if (res.data.length < 1) return false
        else return true
    }

    _check() {
        if (this._DB_FILENAME && this._DB_MAN) return true
        else return false
    }
}
