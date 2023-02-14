
/**
 * @description Klasse für die Arbeit an einer View_cql
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({ENCOUNTER_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_CQL_FACT } from './Scheme_cql_fact'

export class View_cql extends View_X {
    _VIEW_NAME = 'CQL'
    _CLASS_NAME = 'View_cql'
    _SCHEME = SCHEME_CQL_FACT
    _RESOLVE_CONCEPT_CD = []
   
    // rest kommt von View_X
}
