/**
 * @description Klasse um den Table NOTE_FACT zu beschreiben und Querys zu erstellen
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

class Scheme_note_fact extends Scheme_X {

    _TABLE_NAME = 'NOTE_FACT'
    _CLASS_NAME = 'Scheme_note_fact'
    _PRIMARY_KEY = 'NOTE_ID'
    _UNIQUE = []
    _NOT_NULL = []
    _FIELDS = {
        "NOTE_ID": dtypes.numeric, 
        "CATEGORY_CHAR": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "NOTE_BLOB":  dtypes.blob, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]

}

export const SCHEME_NOTE_FACT = new Scheme_note_fact()
