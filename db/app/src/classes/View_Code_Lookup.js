
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

import { SCHEME_CODE_LOOKUP } from './Scheme_code_lookup'

export class View_Code_Lookup extends View_X {
    _VIEW_NAME = 'CODE_LOOKUP'
    _CLASS_NAME = 'View_Code_Lookup'
    _SCHEME = SCHEME_CODE_LOOKUP
    _RESOLVE_CONCEPT_CD = []
   
    // rest kommt von View_X
}
