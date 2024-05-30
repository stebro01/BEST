/**
 * @description Klasse um den Table CQL_FACT zu beschreiben und Querys zu erstellen
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

class Scheme_cql_fact extends Scheme_X {

    _TABLE_NAME = 'CQL_FACT'
    _CLASS_NAME = 'Scheme_cql_fact'
    _PRIMARY_KEY = 'CQL_ID'
    _UNIQUE = []
    _NOT_NULL = []
    _FIELDS = {
        "CQL_ID": dtypes.numeric, 
        "CODE_CD": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "CQL_BLOB":  dtypes.blob, 
        "CQL_CHAR": dtypes.blob,
        "JSON_CHAR": dtypes.blob, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]

}

export const SCHEME_CQL_FACT = new Scheme_cql_fact()
