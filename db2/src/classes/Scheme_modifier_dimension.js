/**
 * @description Klasse um den Table MODIFIER_DIMENSION zu beschreiben und Querys zu erstellen
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


class Scheme_modifier_dimension extends Scheme_X {

    _TABLE_NAME = 'MODIFIER_DIMENSION'
    _CLASS_NAME = 'Scheme_modifier_dimension'
    _PRIMARY_KEY = 'MODIFIER_CD'
    _UNIQUE = ['MODIFIER_CD']
    _NOT_NULL = []
    _FIELDS = {
        "MODIFIER_PATH": dtypes.string, 
        "MODIFIER_CD": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "VALTYPE_CD": dtypes.string, // Gibt an, welcher Datentyp: S - Selection, N - Number, B - Boolean, T - Text, A - Answer, D - Diagnosis
        "UNIT_CD": dtypes.string,
        "MODIFIER_BLOB": dtypes.blob, 
        "UPDATE_DATE": dtypes.date, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]

}

export const SCHEME_MODIFIER_DIMENSION = new Scheme_modifier_dimension()
