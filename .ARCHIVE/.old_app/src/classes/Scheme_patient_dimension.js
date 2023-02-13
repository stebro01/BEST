/**
 * @description Klasse um den Table PATIENT_DIMENSION zu beschreiben und Querys zu erstellen
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


class Scheme_patient_dimension extends Scheme_X {

    _TABLE_NAME = 'PATIENT_DIMENSION'
    _VIEW_NAME = 'patient_list'
    _CLASS_NAME = 'Scheme_patient_dimension'
    _PRIMARY_KEY = 'PATIENT_NUM'
    _UNIQUE = []
    _NOT_NULL = []
    _PRIVATE = ['PATIENT_NUM', 'UPLOAD_ID', 'IMPORT_DATE', 'DOWNLOAD_DATE', 'UPDATE_DATE']
    _FIELDS = {
        "PATIENT_NUM": dtypes.numeric,
        "PATIENT_CD": dtypes.string,
        "VITAL_STATUS_CD": dtypes.string,
        "BIRTH_DATE": dtypes.date,
        "DEATH_DATE": dtypes.date,
        "AGE_IN_YEARS": dtypes.numeric,
        "SEX_CD": dtypes.string,
        "LANGUAGE_CD": dtypes.string,
        "RACE_CD": dtypes.string,
        "MARITAL_STATUS_CD": dtypes.string,
        "RELIGION_CD": dtypes.string,
        "STATECITYZIP_PATH": dtypes.string,
        "PATIENT_BLOB": dtypes.blob,
        "UPDATE_DATE": dtypes.date,
        "DOWNLOAD_DATE": dtypes.date,
        "IMPORT_DATE": dtypes.date,
        "SOURCESYSTEM_CD": dtypes.string,
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]
}

export const SCHEME_PATIENT_DIMENSION = new Scheme_patient_dimension()
