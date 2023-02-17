
/**
 * @description Klasse für die Arbeit an einer View_Concept_CQL_Lookup
 * Funktionen: 
 * - create({AGE_IN_YEARS: 40}) => {status: true, data: {PATIENT_NUM: 1}}
 * - read({ENCOUNTER_NUM: 1}) => {status: true, error: undefined, data: [...]}
 * - update({where: {PATIENT_NUM: 1}, set: {AGE_IN_YEARS: 10}}) => {status: true, ...}
 * - delete({PATIENT_NUM: 1}) => {status: true, ...}
 * - resolve_cd() => {status: true, data: ['aufgeloste Concepte aus _RESOLVE_CONCEPT_CD]}
 */

import {View_X} from './View_X'

import { SCHEME_CONCEPT_CQL_LOOKUP } from './Scheme_concept_cql_lookup'

export class View_Concept_CQL_Lookup extends View_X {
    _VIEW_NAME = 'CONCEPT_CQL_LOOKUP'
    _CLASS_NAME = 'View_Concept_CQL_Lookup'
    _SCHEME = SCHEME_CONCEPT_CQL_LOOKUP
    _RESOLVE_CONCEPT_CD = []
   
    // rest kommt von View_X
}
