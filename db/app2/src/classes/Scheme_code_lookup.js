/**
 * @description Klasse um den Table CODE_LOOUP zu beschreiben und Querys zu erstellen
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

class Scheme_code_lookup extends Scheme_X {

    _TABLE_NAME = 'CODE_LOOKUP'
    _CLASS_NAME = 'Scheme_code_lookup'
    _PRIMARY_KEY = 'CODE_CD'
    _UNIQUE = ['CODE_CD']
    _NOT_NULL = []
    _FIELDS = {
        "TABLE_CD": dtypes.string, 
        "COLUMN_CD": dtypes.string, 
        "CODE_CD": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "LOOKUP_BLOB": dtypes.blob, 
        "UPDATE_DATE": dtypes.date, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]


}

export const SCHEME_CODE_LOOKUP = new Scheme_code_lookup()
