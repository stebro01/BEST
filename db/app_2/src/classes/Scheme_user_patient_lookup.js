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


class Scheme_user_patient_lookup extends Scheme_X {

    _TABLE_NAME = 'USER_PATIENT_LOOKUP'
    _CLASS_NAME = 'Scheme_user_patient_lookup'
    _PRIMARY_KEY = 'USER_PATIENT_ID'
    _UNIQUE = []
    _NOT_NULL = []
    _PRIVATE = []
    _FIELDS = {
        "USER_PATIENT_ID": dtypes.numeric ,
        "USER_ID": dtypes.numeric,
        "PATIENT_NUM": dtypes.numeric,
        "NAME_CHAR": dtypes.string,
        "USER_PATIENT_BLOB": dtypes.blob,
        "UPDATE_DATE": dtypes.date,
        "DOWNLOAD_DATE": dtypes.date,
        "IMPORT_DATE": dtypes.date,
        "UPLOAD_ID": dtypes.numeric
    }
    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]
}

export const SCHEME_USER_PATIENT_LOOKUP = new Scheme_user_patient_lookup()
