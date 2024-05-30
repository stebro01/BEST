/**
 * @description Klasse um den Table Scheme_concept_cql_lookup zu beschreiben und Querys zu erstellen
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

class Scheme_concept_cql_lookup extends Scheme_X {

    _TABLE_NAME = 'CONCEPT_CQL_LOOKUP'
    _CLASS_NAME = 'Scheme_concept_cql_lookup'
    _PRIMARY_KEY = 'CONCEPT_CQL_ID'
    _VIEW_NAME = 'cql_concept_list'
    _UNIQUE = []
    _NOT_NULL = []
    _FIELDS = {
        "CONCEPT_CQL_ID": dtypes.numeric, 
        "CONCEPT_CD": dtypes.string, 
        "CQL_ID": dtypes.numeric, 
        "NAME_CHAR": dtypes.string, 
        "RULE_BLOB":  dtypes.blob, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]

}

export const SCHEME_CONCEPT_CQL_LOOKUP = new Scheme_concept_cql_lookup()
