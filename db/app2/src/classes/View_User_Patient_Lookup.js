
/**
 * @description Klasse für die Arbeit an einer View_Code_Lookup
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({ENCOUNTER_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_USER_PATIENT_LOOKUP } from './Scheme_user_patient_lookup'

export class View_user_patient_lookup extends View_X {
    _VIEW_NAME = 'USER_PATIENT_LOOKUP'
    _CLASS_NAME = 'View_user_patient_lookup'
    _SCHEME = SCHEME_USER_PATIENT_LOOKUP
    _RESOLVE_CONCEPT_CD = []
   
    // rest kommt von View_X
}
