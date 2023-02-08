/**
 * @description Klasse um den Table VISIT_DIMENSION zu beschreiben und Querys zu erstellen
 * inheritance from Scheme_X.js
 * Funktionen: 
 * - init() => erzeugt den Table
 * - create({obj}) => fügt einen DB Eintrag hinzu
 * - read({obj}) => führt eine DB Suche aus
 * - update({where: {obj}, set: {obj}}) => aktualisiert einen DB Eintrag
 * - delete({obj}) => löscht einen DB Eintrag
 */

import {Scheme_X} from './Scheme_X'
import {dtypes} from './more/dtypes'
import {SQLite_QUERY} from './more/sql_queries'


class Scheme_visit_dimension extends Scheme_X {

    _TABLE_NAME = 'VISIT_DIMENSION'
    _CLASS_NAME = 'Scheme_visit_dimension'
    _PRIMARY_KEY = 'ENCOUNTER_NUM'
    _UNIQUE = []
    _NOT_NULL = ['PATIENT_NUM']
    _PRIVATE = ['PATIENT_NUM', 'UPLOAD_ID', 'IMPORT_DATE', 'DOWNLOAD_DATE', 'UPDATE_DATE', 'SOURCESYSTEM_CD']
    _FIELDS = {
        "ENCOUNTER_NUM": dtypes.numeric ,
        "PATIENT_NUM": dtypes.numeric,
        "ACTIVE_STATUS_CD": dtypes.string,
        "START_DATE": dtypes.date,
        "END_DATE": dtypes.date,
        "INOUT_CD": dtypes.string,
        "LOCATION_CD": dtypes.string,
        "VISIT_BLOB": dtypes.blob,
        "UPDATE_DATE": dtypes.date,
        "DOWNLOAD_DATE": dtypes.date,
        "IMPORT_DATE": dtypes.date,
        "SOURCESYSTEM_CD": dtypes.string,
        "UPLOAD_ID": dtypes.numeric
    }
    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]
}

export const SCHEME_VISIT_DIMENSION = new Scheme_visit_dimension()
