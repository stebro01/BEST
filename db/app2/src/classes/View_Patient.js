
/**
 * @description Klasse für die Arbeit an einem Patienten
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({PATIENT_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_PATIENT_DIMENSION } from './Scheme_patient_dimension'

export class View_Patient extends View_X {
    _VIEW_NAME = 'PATIENT'
    _CLASS_NAME = 'View_Patient'
    _SCHEME = SCHEME_PATIENT_DIMENSION
    _RESOLVE_CONCEPT_CD = [{FIELD: 'SEX_CD', CONCEPT_CD: 'SCTID: 263495000'}, {FIELD: 'RACE_CD', CONCEPT_CD: 'LID: 46463-6'}, {FIELD: 'MARITAL_STATUS_CD', CONCEPT_CD: 'LID: 45404-1'}, {FIELD: 'LANGUAGE_CD', data: ['german', 'english', 'other']}, {FIELD: 'SOURCESYSTEM_CD', data: ['LOINC', 'SNOMED-CT', 'ICD10-2019', 'ICD10-*', 'other']}]
   
    // rest kommt von View_X
}
