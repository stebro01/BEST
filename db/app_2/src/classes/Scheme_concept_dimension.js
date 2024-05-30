/**
 * @description Klasse um den Table CONCEPT_DIMENSION zu beschreiben und Querys zu erstellen
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


class Scheme_concept_dimension extends Scheme_X {

    _TABLE_NAME = 'CONCEPT_DIMENSION'
    _CLASS_NAME = 'Scheme_concept_dimension'
    _PRIMARY_KEY = 'CONCEPT_CD'
    _UNIQUE = ['CONCEPT_CD']
    _NOT_NULL = ['CONCEPT_PATH', 'CONCEPT_CD', 'NAME_CHAR', 'VALTYPE_CD']
    _FIELDS = {
        "CONCEPT_PATH": dtypes.string, 
        "CONCEPT_CD": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "VALTYPE_CD": dtypes.string, // Gibt an, welcher Datentyp: S - Selection, N - Number, T - Text
        "UNIT_CD": dtypes.string,  // gibt die Default Unit ein >> 
        "RELATED_CONCEPT": dtypes.string, 
        "CONCEPT_BLOB": dtypes.blob, 
        "UPDATE_DATE": dtypes.date, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }
    _VALTYPE_CD_LIST = [
        {value: 'N', label: 'numeric'}, 
        {value: 'T', label: 'text'},
        {value: 'F', label: 'finding'},
        {value: 'S', label: 'selection'}, 
        {value: 'A', label: 'answer'}
    ]

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]
}

export const SCHEME_CONCEPT_DIMENSION = new Scheme_concept_dimension()
