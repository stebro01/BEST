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

class Scheme_user_management extends Scheme_X {

    _TABLE_NAME = 'USER_MANAGEMENT'
    _CLASS_NAME = 'Scheme_user_management'
    _PRIMARY_KEY = 'USER_ID'
    _UNIQUE = []
    _NOT_NULL = []
    _FIELDS = {
        "USER_ID": dtypes.numeric, 
        "COLUMN_CD": dtypes.string, 
        "USER_CD": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "PASSWORD_CHAR": dtypes.string, 
        "USER_BLOB": dtypes.blob, 
        "UPDATE_DATE": dtypes.date, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]


}

export const SCHEME_USER_MANAGEMENT = new Scheme_user_management()
