/**
 * @description Klasse um den Table PROVIDER_DIMENSION zu beschreiben und Querys zu erstellen
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


class Scheme_provider_dimension extends Scheme_X {

    _TABLE_NAME = 'PROVIDER_DIMENSION'
    _CLASS_NAME = 'Scheme_provider_dimension'
    _PRIMARY_KEY = 'PROVIDER_ID'
    _UNIQUE = ['PROVIDER_ID']
    _NOT_NULL = []
    _FIELDS = {
        "PROVIDER_ID": dtypes.string, 
        "PROVIDER_PATH": dtypes.string, 
        "NAME_CHAR": dtypes.string, 
        "CONCEPT_BLOB": dtypes.blob, 
        "UPDATE_DATE": dtypes.date, 
        "DOWNLOAD_DATE": dtypes.date, 
        "IMPORT_DATE": dtypes.date, 
        "SOURCESYSTEM_CD": dtypes.string, 
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]
}

export const SCHEME_PROVIDER_DIMENSION = new Scheme_provider_dimension()
