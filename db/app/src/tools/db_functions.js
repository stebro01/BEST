import { log, info } from "src/tools/logger";

import { SCHEME_CODE_LOOKUP } from "src/classes/Scheme_code_lookup";
import { SCHEME_CONCEPT_DIMENSION } from "src/classes/Scheme_concept_dimension";
import { SCHEME_PATIENT_DIMENSION } from "src/classes/Scheme_patient_dimension";
import { SCHEME_VISIT_DIMENSION } from "src/classes/Scheme_visit_dimension";
import { SCHEME_PROVIDER_DIMENSION } from "src/classes/Scheme_provider_dimension";
import { SCHEME_OBSERVATION_FACT } from "src/classes/Scheme_observation_fact";
import { SCHEME_USER_MANAGEMENT } from "src/classes/Scheme_user_management";
import { SCHEME_USER_PATIENT_LOOKUP } from "src/classes/Scheme_user_patient_lookup";
import { SCHEME_CQL_FACT } from "src/classes/Scheme_cql_fact";
import { SCHEME_CONCEPT_CQL_LOOKUP } from "src/classes/Scheme_concept_cql_lookup";
import { SCHEME_NOTE_FACT } from "src/classes/Scheme_note_fact";
const SCHEMES = {
  SCHEME_CODE_LOOKUP,
  SCHEME_CONCEPT_DIMENSION,
  SCHEME_PATIENT_DIMENSION,
  SCHEME_VISIT_DIMENSION,
  SCHEME_PROVIDER_DIMENSION,
  SCHEME_OBSERVATION_FACT,
  SCHEME_USER_MANAGEMENT,
  SCHEME_USER_PATIENT_LOOKUP,
  SCHEME_CQL_FACT,
  SCHEME_CONCEPT_CQL_LOOKUP,
  SCHEME_NOTE_FACT,
};

export async function resetDatabase(dbman, readFile, PATH) {
  info({ method: "db_tools/resetDatabase" });

  // rebuild the tables
  var promises = [];
  Object.keys(SCHEMES).forEach(async (scheme) => {
    let sql_query = SCHEMES[scheme].init();
    promises.push(dbman.run(sql_query.query));
  });
  await Promise.all(promises);

  //now ADD Data to empty tables
  // await importJSON({JSON: DBJSON, dbman: dbman, db_fn})

  // // now fill with presets
  // // CODE_LOOKUP
  // const CODE_LOOKUP = readFile(PATH.CODE_LOOKUP, 'utf-8')
  // const IMPORTED_CODE_LOOKUP = csvJSON(CODE_LOOKUP, ';')
  // promises = []
  // IMPORTED_CODE_LOOKUP.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_CODE_LOOKUP.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // // CONCEPT_DIMENSION
  // const CONCEPT_DIMENSION = readFile(PATH.CONCEPT_DIMENSION, 'utf-8')
  // const IMPORTED_CONCEPT_DIMENSION = csvJSON(CONCEPT_DIMENSION, ';')
  // promises = []
  // IMPORTED_CONCEPT_DIMENSION.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_CONCEPT_DIMENSION.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // // PROVIDER_DIMENSION
  // const PROVIDER_DIMENSION = readFile(PATH.PROVIDER_DIMENSION, 'utf-8')
  // const IMPORTED_PROVIDER_DIMENSION = csvJSON(PROVIDER_DIMENSION, ';')
  // promises = []
  // IMPORTED_PROVIDER_DIMENSION.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_PROVIDER_DIMENSION.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // // USER_MANAGEMENT
  // const USER_MANAGEMENT = readFile(PATH.USER_MANAGEMENT, 'utf-8')
  // const IMPORTED_USER_MANAGEMENT = csvJSON(USER_MANAGEMENT, ';')
  // promises = []
  // IMPORTED_USER_MANAGEMENT.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_USER_MANAGEMENT.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // // CQL_FACT
  // const CQL_FACT = readFile(PATH.CQL_FACT, 'utf-8')
  // const IMPORTED_CQL_FACT = csvJSON(CQL_FACT, ';')
  // promises = []
  // IMPORTED_CQL_FACT.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_CQL_FACT.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // // CQL LOOKUP
  // const CONCEPT_CQL_LOOKUP = readFile(PATH.CONCEPT_CQL_LOOKUP, 'utf-8')
  // const IMPORTED_CONCEPT_CQL_LOOKUP = csvJSON(CONCEPT_CQL_LOOKUP, ';')
  // promises = []
  // IMPORTED_CONCEPT_CQL_LOOKUP.forEach(item => {
  //     let sql_query = SCHEMES.SCHEME_CONCEPT_CQL_LOOKUP.create(item)
  //     promises.push(dbman.run(sql_query.query))
  // })
  // await Promise.all(promises)

  // VIEW patient_observations
  await dbman.run("DROP VIEW IF EXISTS patient_observations");
  const VIEW_patient_observations = readFile(
    PATH.VIEW_patient_observations,
    "utf-8"
  );
  await dbman.run(VIEW_patient_observations);

  // VIEW patient_list
  await dbman.run("DROP VIEW IF EXISTS patient_list");
  const VIEW_patient_list = readFile(PATH.VIEW_patient_list, "utf-8");
  await dbman.run(VIEW_patient_list);

  // VIEW cql_concept_list
  await dbman.run("DROP VIEW IF EXISTS cql_concept_list");
  const VIEW_cql_concept_list = readFile(PATH.VIEW_cql_concept_list, "utf-8");
  await dbman.run(VIEW_cql_concept_list);

  // TRIGGER
  await dbman.run("DROP TRIGGER IF EXISTS delete_patient_cascade");
  const TRIGGER_delete_patient_cascade = readFile(
    PATH.TRIGGER_delete_patient_cascade,
    "utf-8"
  );
  await dbman.run(TRIGGER_delete_patient_cascade);
  await dbman.run("DROP TRIGGER IF EXISTS delete_visit_cascade");
  const TRIGGER_delete_visit_cascade = readFile(
    PATH.TRIGGER_delete_visit_cascade,
    "utf-8"
  );
  await dbman.run(TRIGGER_delete_visit_cascade);
  await dbman.run("DROP TRIGGER IF EXISTS delete_concept_cql_lookup");
  const TRIGGER_delete_concept_cql_lookup = readFile(
    PATH.TRIGGER_delete_concept_cql_lookup,
    "utf-8"
  );
  await dbman.run(TRIGGER_delete_concept_cql_lookup);

  return true;
}

export async function resetDatabase_Views(dbman, readFile, PATH) {
  info({ method: "db_tools/resetViews" });

  // VIEW patient_observations
  await dbman.run("DROP VIEW IF EXISTS patient_observations");
  const VIEW_patient_observations = readFile(
    PATH.VIEW_patient_observations,
    "utf-8"
  );
  await dbman.run(VIEW_patient_observations);

  // VIEW patient_list
  await dbman.run("DROP VIEW IF EXISTS patient_list");
  const VIEW_patient_list = readFile(PATH.VIEW_patient_list, "utf-8");
  await dbman.run(VIEW_patient_list);

  // VIEW cql_concept_list
  await dbman.run("DROP VIEW IF EXISTS cql_concept_list");
  const VIEW_cql_concept_list = readFile(PATH.VIEW_cql_concept_list, "utf-8");
  await dbman.run(VIEW_cql_concept_list);

  return {status: true, data: "Views resetted"};
}
