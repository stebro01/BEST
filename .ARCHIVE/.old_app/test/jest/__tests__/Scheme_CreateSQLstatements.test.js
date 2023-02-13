/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class Scheme_X
 * @description Testen der Klassen: **Scheme_code_lookup.js** als Inheritance von Scheme_X.js
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Scheme_CreateSQLstatements.test.js 
 */




// schemes
import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'
import { SCHEME_CONCEPT_DIMENSION } from 'src/classes/Scheme_concept_dimension';
import { SCHEME_MODIFIER_DIMENSION } from 'src/classes/Scheme_modifier_dimension';
import { SCHEME_PATIENT_DIMENSION } from 'src/classes/Scheme_patient_dimension';
import { SCHEME_VISIT_DIMENSION } from 'src/classes/Scheme_visit_dimension';
import { SCHEME_PROVIDER_DIMENSION } from 'src/classes/Scheme_provider_dimension';
import { SCHEME_OBSERVATION_FACT } from 'src/classes/Scheme_observation_fact';

// MOCKUP DATA
import {SQLite_QUERY} from 'src/classes/more/sql_queries'

describe('Teste Scheme SQL Statements', () => {

  it ('Teste SCHEME_CODE_LOOKUP', () => {
    //teste SQLite
    const sqlite_query = SCHEME_CODE_LOOKUP.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['CODE_LOOKUP'])
    
  })

  it ('Teste SCHEME_CONCEPT_DIMENSION', () => {
    //teste SQLite
    const sqlite_query = SCHEME_CONCEPT_DIMENSION.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['CONCEPT_DIMENSION'])
    
  })

  it ('Teste SCHEME_MODIFIER_DIMENSION', () => {
    //teste SQLite
    const sqlite_query = SCHEME_MODIFIER_DIMENSION.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['MODIFIER_DIMENSION'])
    
  })

  it ('Teste SCHEME_PATIENT_DIMENSION', () => {
    //teste SQLite
    const sqlite_query = SCHEME_PATIENT_DIMENSION.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['PATIENT_DIMENSION'])
    
  })

  it ('Teste SCHEME_VISIT_DIMENSION', () => {
    //teste SQLite
    const sqlite_query = SCHEME_VISIT_DIMENSION.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['VISIT_DIMENSION'])
  })

  it ('Teste SCHEME_PROVIDER_DIMENSION', () => {
    //teste SQLite
    const sqlite_query = SCHEME_PROVIDER_DIMENSION.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['PROVIDER_DIMENSION'])
  })

  it ('Teste SCHEME_OBSERVATION_FACT', () => {
    //teste SQLite
    const sqlite_query = SCHEME_OBSERVATION_FACT.init()
    expect(sqlite_query.query).toBe(SQLite_QUERY['OBSERVATION_FACT'])
  })

})
