/**
 * Funktionen um JSON Daten in die DB zu integrieren
 */

const IMPORT_PRIORITY = ["CONCEPT_DIMENSION", "USER_MANAGEMENT", "PROVIDER_DIMENSION", "CODE_LOOKUP", "CQL_FACT"]
import { log, error, error_codes } from "./logger"
import { View_Provider } from "src/classes/View_Provider"
import { View_Code_Lookup } from "src/classes/View_Code_Lookup"
import { View_Concept } from "src/classes/View_Concept"
import { View_User } from "src/classes/View_User"
import { View_cql } from "src/classes/View_CQL"
import { View_Concept_CQL_Lookup } from "src/classes/View_Concept_CQL_Lookup"

export const TRANSFER_OPTIONS = [
        {
          table: "CONCEPT_DIMENSION",
          label: "Klinische Konzepte / CONCEPTS",
          fields: ["CONCEPT_CD", "NAME_CHAR"],
        },
        {
          table: "CQL_FACT",
          label: "CQL FAC",
          fields: ["CODE_CD", "NAME_CHAR"],
          lookup: {table: "CONCEPT_CQL_LOOKUP", key_from: "CQL_ID", key_to: "CONCEPT_CD"}
        },
        { table: "USER_MANAGEMENT",
          label: "Nutzerverwaltung",
          fields: ["USER_CD", "NAME_CHAR"]
        },
        { table: "PROVIDER_DIMENSION",
          label: "Provider",
          fields: ["PROVIDER_ID", "NAME_CHAR", "PROVIDER_PATH"]
        },
        { table: "CODE_LOOKUP",
          label: "Allgemeine Codes",
          fields: ["CODE_CD", "NAME_CHAR", "COLUMN_CD"]
        }
      ]

export async function importJSON_fromFile(payload) {
    log({ method: 'db_datatransfer/importJSON_fromFile', message: 'importiere Daten', data: payload !== undefined })
    const TXT = payload.readFile(payload.PATH.TEMPLATE_JSON, 'utf-8')
    const JSON_DATA = JSON.parse(TXT)
    return await importJSON({JSON: JSON_DATA, dbman: payload.dbman, db_fn: payload.db_fn})
}

/**
 * 
 * @param {object} payload - {JSON: [..], dbman: {}, db_fn: 'templatedb.db'}
 * @example
 * //the option force: false will worce the update, even if the new data is older
 * const res = await importJSON( {JSON: [JSON_DATA[3]], db_fn: db_fn, dbman: db_man, force: false})
 */
export async function importJSON(payload) {
    log({ method: 'db_datatransfer/importJSON', message: 'importiere Daten', data: payload !== undefined })
    if (!payload || !payload.JSON || !payload.dbman || !payload.db_fn) return _report_error(error_codes.invalid_payload)

    //expect JSON to be an array of Objects, the value OBJ.table contains the type of the table
    //therefore i will us through a list that gives the correct order, in which fields should be added
    const ERRORS = []
    const DATA = {}
    for (let key of IMPORT_PRIORITY) {
        let table = payload.JSON.find(el => el.table === key)
        if (table !== undefined) {
            let res = await _add_to_db({ table: table, dbman: payload.dbman, db_fn: payload.db_fn, force: payload.force, UPLOAD_ID: payload.UPLOAD_ID })
            if (res.error) ERRORS.push(res)
            if (res.data) _add_data_for_result(res.data, DATA)
        }
    }
    return { status: true, data: DATA }
}

// PREPARES THE OUTPUT STRUCTURE: DATA = {ERRORS: [], UPDATED: [], IGNORED: [], ADDED: []}
function _add_data_for_result(data, DATA) {
    Object.keys(data).forEach(key => {
        if (!DATA[key]) DATA[key] = data[key]
        else DATA[key] = DATA[key].concat(data[key])
    })
}

// MAIN FUNCTION FOR THE ADDING DATE
async function _add_to_db(payload) {
    log({ method: '_add_to_db', message: `Table with ${payload.table.data.length} entries` })

    //Überprüfe zunächt, ob der Wert schon in der DB enthalten
    const VIEW = _return_view(payload)
    if (!VIEW) return _report_error(`table '${payload.table.table}' not found`)
    // loop through data
    const ERRORS = []
    const UPDATED = []
    const ADDED = []
    const IGNORED = []
    const LOOKUP = []
    for (let data of payload.table.data) {
        data = _remove_null(data)
        if (payload.UPLOAD_ID) data.UPLOAD_ID = payload.UPLOAD_ID
        let PK = VIEW._SCHEME._PRIMARY_KEY
        if (data[PK]) {
            //existiert der Eintrag schon?
            let res_exist = await VIEW.read({ [PK]: data[PK] })
            if (res_exist.status && res_exist.data.length === 0) {
                // ADD DATE
                if (data.IMPORT_DATE) delete data.IMPORT_DATE
                let res_add = await VIEW.create(data)
                if (!res_add.status) ERRORS.push(`could not add: ${PK} = ${data[PK]}`)
                else ADDED.push(`ADDED: ${PK} = "${data[PK]}"`)
                // LOOKUPS ????
            } else {
                // UPDATE DATA
                let old_data = res_exist.data[0]
                // // ! TESTING => change Date of new obj
                // data.IMPORT_DATE = '2023-06-04 22:38:40'
                // // ! END TESTING
                // console.log('update', {new: data, old: old_data})
                if (payload.force || _check_obj_for_update(data, old_data)) {
                    //new is newer
                    let where = {[PK]: data[PK]}
                    // console.log('UPDATE: => new is newer', {where, data, old_data})
                    if (data.IMPORT_DATE) delete data.IMPORT_DATE
                    if (data.UPDATE_DATE) delete data.UPDATE_DATE
                    // delete data[PK]
                    let set = data
                    let res_update = await VIEW.update({where, set})
                    if (!res_update.status) ERRORS.push(`Could not UPDATE: ${PK} = "${data[PK]}"`)
                    else UPDATED.push(`UPDATE ${PK} = "${where[PK]}"`)
                } else {
                    //old is newer
                    IGNORED.push(`DB entry is more up-to-date: ${PK} = "${data[PK]}"`)
                }
            }

            //fuege jetzt noch den LOOKUP hinzu
            if (data.lookup) await _add_lookup(data, payload, LOOKUP)

        } else ERRORS.push(`Primarykey "${VIEW._SCHEME._PRIMARY_KEY}" not found`)
    }
    return { status: true, data: {ERRORS, UPDATED, ADDED, IGNORED, LOOKUP} }
}

/**
 * Schaut in dem Datenfeld nach dem Feld .lookup und fügt dann die entspechende LOOKUP (Verknüpfung zwischen 2 Tables) hinzu
 * @param {*} data      - ein kompletter DB Wert mit einem Feld Lookup
 * @param {*} payload   - DB Information
 * @param {array} LOOKUP - Informationen über Lookups werde hier zurueckgegeben
 * @example
 * _add_lookup({"CQL_ID":8,"CODE_CD":"RANGE_0_to_6",..., lookup: {}} ,{"db_fn":"test/jest/mockups/db/template_DB.db","force":true,"UPLOAD_ID":7912})
 */
async function _add_lookup(data, payload, LOOKUP) {
    // get the corret view for the lookup table
    const VIEW_FROM = _return_view({table:{table: data.lookup.table_from}, dbman: payload.dbman, db_fn: payload.db_fn})
    const VIEW_LOOKUP = _return_view({table:{table: data.lookup.table_to}, dbman: payload.dbman, db_fn: payload.db_fn}) //sieht etwas doof aus, ist aber so
    // LOOP THROUGH THE ELEMENTS
    for (let data_to of data.lookup.data) {
        // check, get the ref. element
        let res_from = await VIEW_FROM.read({[VIEW_FROM._SCHEME._PRIMARY_KEY]: data[VIEW_FROM._SCHEME._PRIMARY_KEY]})
        if (res_from.status && res_from.data.length > 0) {
            let data_from = res_from.data[0]
            // check, if the lookup already exists
            let WHERE = {[data.lookup.key_from]: data_from[data.lookup.key_from], [data.lookup.key_to]: data_to}
            let res_exist = await VIEW_LOOKUP.read(WHERE)
            if (res_exist.status && res_exist.data.length < 1) {
                await VIEW_LOOKUP.create(WHERE)
                LOOKUP.push(`ADDED LOOKUP: ${JSON.stringify(WHERE)}`)
            }
        }
    }
}

/**
 * is newObj newer? => true, 
 * ! tested by DataTransfer.test.js
 * @param {object} newObj - {IMPORT_DATE: '2023', UPDATE_DATE: '2022'}
 * @param {object} oldObj - {IMPORT_DATE: '2023', UPDATE_DATE: '2022'}
 * @returns newObj is newer return TRUE, sonst FALSE
 */
export function _check_obj_for_update(newObj, oldObj) {
    if (newObj.IMPORT_DATE > (oldObj.UPDATE_DATE || oldObj.IMPORT_DATE) ||
        (newObj.UPDATE_DATE && newObj.UPDATE_DATE > (oldObj.UPDATE_DATE || oldObj.IMPORT_DATE))) return true
        else return false
}

/**
 * 
 * @param {string} table 
 * @returns SCHEME
 */
function _return_view(payload) {
    switch (payload.table.table) {
        case 'PROVIDER_DIMENSION':
            return new View_Provider(payload.dbman, payload.db_fn)
        case 'CQL_FACT':
            return new View_cql(payload.dbman, payload.db_fn)
        case 'CONCEPT_DIMENSION':
            return new View_Concept(payload.dbman, payload.db_fn)
        case 'CODE_LOOKUP':
            return new View_Code_Lookup(payload.dbman, payload.db_fn)
        case 'USER_MANAGEMENT':
            return new View_User(payload.dbman, payload.db_fn)
        case 'CONCEPT_CQL_LOOKUP':
            return new View_Concept_CQL_Lookup(payload.dbman, payload.db_fn)
        default:
            return undefined
    }
}

function _remove_null(data) {
    Object.keys(data).forEach(key => {
        if (data[key] === null) delete data[key]
    })
    return data
}

function _report_error(err) {
    error({ method: 'db_datatransfer/importJSON', data: err })
    return { status: false, data: err }
}