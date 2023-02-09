const {log, info} = require('src/tools/logger')

import {SCHEME_CODE_LOOKUP} from 'src/classes/Scheme_code_lookup'
import { SCHEME_CONCEPT_DIMENSION } from 'src/classes/Scheme_concept_dimension';
import { SCHEME_MODIFIER_DIMENSION } from 'src/classes/Scheme_modifier_dimension';
import { SCHEME_PATIENT_DIMENSION } from 'src/classes/Scheme_patient_dimension';
import { SCHEME_VISIT_DIMENSION } from 'src/classes/Scheme_visit_dimension';
import { SCHEME_PROVIDER_DIMENSION } from 'src/classes/Scheme_provider_dimension';
import { SCHEME_OBSERVATION_FACT } from 'src/classes/Scheme_observation_fact';
import { SCHEME_USER_MANAGEMENT } from 'src/classes/Scheme_user_management';
import { SCHEME_USER_PATIENT_LOOKUP } from 'src/classes/Scheme_user_patient_lookup';
const SCHEMES = {SCHEME_CODE_LOOKUP, SCHEME_CONCEPT_DIMENSION, SCHEME_MODIFIER_DIMENSION, SCHEME_PATIENT_DIMENSION, SCHEME_VISIT_DIMENSION, SCHEME_PROVIDER_DIMENSION, SCHEME_OBSERVATION_FACT, SCHEME_USER_MANAGEMENT, SCHEME_USER_PATIENT_LOOKUP}

import {csvJSON} from 'src/tools/formatdata'


export async function resetDatabase(dbman, readFile, PATH ) {
    info({method: 'db_tools/resetDatabase'})
   
    // rebuild the tables
    var promises = []
    Object.keys(SCHEMES).forEach(async(scheme) => {
        let sql_query = SCHEMES[scheme].init()
        promises.push(dbman.run(sql_query.query))
    })
    await Promise.all(promises)

    // now fill with presets 
    // CODE_LOOKUP
    const CODE_LOOKUP = readFile(PATH.CODE_LOOKUP, 'utf-8')
    const IMPORTED_CODE_LOOKUP = csvJSON(CODE_LOOKUP, ';')
    promises = []
    IMPORTED_CODE_LOOKUP.forEach(item => {
        let sql_query = SCHEMES.SCHEME_CODE_LOOKUP.create(item)
        promises.push(dbman.run(sql_query.query))
    })
    await Promise.all(promises)

    // CONCEPT_DIMENSION
    const CONCEPT_DIMENSION = readFile(PATH.CONCEPT_DIMENSION, 'utf-8')
    const IMPORTED_CONCEPT_DIMENSION = csvJSON(CONCEPT_DIMENSION, ';')
    promises = []
    IMPORTED_CONCEPT_DIMENSION.forEach(item => {
        let sql_query = SCHEMES.SCHEME_CONCEPT_DIMENSION.create(item)
        promises.push(dbman.run(sql_query.query))
    })
    await Promise.all(promises)

    // PROVIDER_DIMENSION
    const PROVIDER_DIMENSION = readFile(PATH.PROVIDER_DIMENSION, 'utf-8')
    const IMPORTED_PROVIDER_DIMENSION = csvJSON(PROVIDER_DIMENSION, ';')
    promises = []
    IMPORTED_PROVIDER_DIMENSION.forEach(item => {
        let sql_query = SCHEMES.SCHEME_PROVIDER_DIMENSION.create(item)
        promises.push(dbman.run(sql_query.query))
    })
    await Promise.all(promises)

    // USER_MANAGEMENT
    const USER_MANAGEMENT = readFile(PATH.USER_MANAGEMENT, 'utf-8')
    const IMPORTED_USER_MANAGEMENT = csvJSON(USER_MANAGEMENT, ';')
    promises = []
    IMPORTED_USER_MANAGEMENT.forEach(item => {
        let sql_query = SCHEMES.SCHEME_USER_MANAGEMENT.create(item)
        promises.push(dbman.run(sql_query.query))
    })
    await Promise.all(promises)
    
    // VIEW
    await dbman.run('DROP VIEW IF EXISTS patient_observations')
    const VIEW_patient_observations = readFile(PATH.VIEW_patient_observations, 'utf-8')
    await dbman.run(VIEW_patient_observations)

    // VIEW
    await dbman.run('DROP VIEW IF EXISTS patient_list')
    const VIEW_patient_list = readFile(PATH.VIEW_patient_list, 'utf-8')
    await dbman.run(VIEW_patient_list)

    // TRIGGER
    await dbman.run('DROP TRIGGER IF EXISTS delete_patient_cascade')
    const TRIGGER_delete_patient_cascade = readFile(PATH.TRIGGER_delete_patient_cascade, 'utf-8')
    await dbman.run(TRIGGER_delete_patient_cascade)
    await dbman.run('DROP TRIGGER IF EXISTS delete_visit_cascade')
    const TRIGGER_delete_visit_cascade = readFile(PATH.TRIGGER_delete_visit_cascade, 'utf-8')
    await dbman.run(TRIGGER_delete_visit_cascade)

    return true

}