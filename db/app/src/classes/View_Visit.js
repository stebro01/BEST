
/**
 * @description Klasse für die Arbeit an einer Visite
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({ENCOUNTER_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_VISIT_DIMENSION } from './Scheme_visit_dimension'

export class View_Visit extends View_X {
    _VIEW_NAME = 'VISIT'
    _CLASS_NAME = 'View_Visit'
    _SCHEME = SCHEME_VISIT_DIMENSION
    _RESOLVE_CONCEPT_CD = [{FIELD: 'ACTIVE_STATUS_CD', data: ['YD']}, {FIELD: 'LOCATION_CD', COLUMN_CD: 'LOCATION_CD'}]
   
    // rest kommt von View_X
}
