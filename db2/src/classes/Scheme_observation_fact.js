/**
 * @description Klasse um den Table OBSERVATION_FACT zu beschreiben und Querys zu erstellen
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


class Scheme_observation_fact extends Scheme_X {

    _TABLE_NAME = 'OBSERVATION_FACT'
    _VIEW_NAME = 'patient_observations'
    _CLASS_NAME = 'Scheme_observation_fact'
    _PRIMARY_KEY = 'OBSERVATION_ID'
    _UNIQUE = []
    _NOT_NULL = ['PATIENT_NUM', 'ENCOUNTER_NUM', 'PROVIDER_ID']
    _PRIVATE = ['PATIENT_NUM', 'ENCOUNTER_NUM', 'UPLOAD_ID', 'IMPORT_DATE', 'DOWNLOAD_DATE', 'UPDATE_DATE']
    _FIELDS = {
        "OBSERVATION_ID": dtypes.numeric,
        "ENCOUNTER_NUM": dtypes.numeric,
        "PATIENT_NUM": dtypes.numeric,
        "CATEGORY_CHAR": dtypes.string,
        "CONCEPT_CD": dtypes.string,
        "PROVIDER_ID": dtypes.string,
        "START_DATE": dtypes.date,
        "MODIFIER_CD": dtypes.string,
        "INSTANCE_NUM": dtypes.numeric,
        "VALTYPE_CD": dtypes.string,
        "TVAL_CHAR": dtypes.string,
        "NVAL_NUM": dtypes.numeric,
        "VALUEFLAG_CD": dtypes.string,
        "QUANTITY_NUM": dtypes.string,
        "UNIT_CD": dtypes.string,
        "END_DATE": dtypes.date,
        "LOCATION_CD": dtypes.string,
        "CONFIDENCE_NUM": dtypes.string,
        "OBSERVATION_BLOB": dtypes.blob,
        "UPDATE_DATE": dtypes.date,
        "DOWNLOAD_DATE": dtypes.date,
        "IMPORT_DATE": dtypes.date,
        "SOURCESYSTEM_CD": dtypes.string,
        "UPLOAD_ID": dtypes.numeric
    }

    _INIT_SQLite_QUERY = SQLite_QUERY[this._TABLE_NAME]

}

export const SCHEME_OBSERVATION_FACT = new Scheme_observation_fact()
