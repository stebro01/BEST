import cql from "cql-execution"; //make sure to install cql-execution@2.4.0
import axios from "axios";
import { dtypes } from "src/classes/more/dtypes";
import { error_codes } from "src/tools/logger";
import { unstringify_json } from "src/classes/sqltools";

/**
 * TESTED BY: CQL.test.js
 * Führt eine CQL Aktion aus
 * @param {object} payload - {lib, parameters}
 * const parameters = { "A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47' }
 * const lib = require('cql_lib.json')
 * var res = exec({parameters: parameters, lib: lib})
 *  @returns {object} - {status: true | false, data: {check: true | false, data: {Ergebnis des CQL EXEC}}}
 *  ie: {"status":true,"data":{"check":true,"data":{"STRING":true,"SPLIT":true,"SPLIT_1":true,"SPLIT_2":true,"SPLIT_3":true}}}
 */
export async function exec(payload) {
  // console.log('exec cql', payload)
  if (!payload || !payload.lib || !payload.parameters)
    return { status: false, error: "invalid payload" };
  if (typeof payload.lib !== "object")
    return { status: false, error: "invalid payload" };
  if (typeof payload.parameters !== "object")
    return { status: false, error: "invalid payload" };
  // INIT THE LIB
  var lib = null;
  try {
    // console.log('init lib', JSON.stringify(payload.lib))
    // console.log(cql.Library)
    lib = new cql.Library(payload.lib);
    // console.log('init lib done')
    // console.log(lib)
  } catch (err) {
    // console.log('init lib error', err)
    return { status: false, error: err };
  }

  const patientSource = new cql.PatientSource([]);
  const codeService = new cql.CodeService([]);
  const executionDateTime = null;

  // PARAMETER!!!
  const executor = new cql.Executor(lib, codeService, payload.parameters);
  try {
    const res = await executor.exec(patientSource, executionDateTime);
    // console.log('exec cql done', res)
    if (res && Object.keys(res.unfilteredResults).length > 0) {
      var data = res.unfilteredResults;
      var check = true;
      Object.keys(data).forEach((k) => {
        if (data[k] === false) check = false;
      });
      return { status: true, data: { check, data } };
    } else return { status: true, data: { data: res, check: false } };
  } catch (err) {
    if (err) {
      if (err.message) return { status: false, error: err.message };
      else return { status: false, error: err };
    }
    return { status: false, error: "unbekannter Fehler" };
  }
}

/**
 * Fragt die cql-translate API an >> hierfür muss der Docker in ./cql/cql-translate gestartet sein und die API unter http://localhost:8082/cql/translator erreichbar sein
 * Ein Beispiel eines POST-Request ist in ./cql/cql-translation/cql to elm json.postman_collection.json hinterlegt
 * @param {object} payload - payload.cql = CQL Statement als String
 * @returns {object} JSON Object als Ergebnis der API Anfrage
 */
export async function query_api(payload) {
  if (!payload || !payload.cql)
    return { status: false, error: "invalid payload" };

  var data = payload.cql;

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8082/cql/translator",
    headers: {
      "Content-Type": "application/cql",
      Accept: "application/elm+json",
    },
    data: data,
  };

  try {
    const res = await axios(config);
    return { status: true, data: res.data };
  } catch (err) {
    return { status: false, error: err };
  }
}

/**
 * TESTED BY: CQL.test.js
 * @param {object} - {data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP}
 * @returns {object} - {status: true | false, data: [] | error: ''}
 */
export async function checkRule(payload) {
  // console.log("checkRule", payload);
  if (
    !payload ||
    !payload.VIEW_CQL ||
    !payload.VIEW_CONCEPT_CQL_LOOKUP ||
    !payload.data
  )
    return { status: false, error: "invalid payload" };

  //first check the data-type
  const data = payload.data;
  const VIEW_CQL = payload.VIEW_CQL;
  const VIEW_CONCEPT_CQL_LOOKUP = payload.VIEW_CONCEPT_CQL_LOOKUP;

  //check data type
  const CHECKS = { check: true, data: [] };
  if (payload.data.type) {
    let res = await _check_type_cql(data, VIEW_CQL);
    if (!res.status) CHECKS.data.push({ check: false, data: res });
    else CHECKS.data.push(res.data);
  }

  //check concept
  if (payload.data.CONCEPT_CD !== undefined) {
    let res = await _check_concept_cql(data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP);
    if (!res.status) CHECKS.data.push({ check: false, data: res.error });
    else {
      for (let dd of res.data) CHECKS.data.push(dd);
    }
  }

  // collect results
  CHECKS.check = CHECKS.data.find((el) => el.check === false) === undefined;
  const results = { status: CHECKS.check, data: CHECKS.data };
  return results;
}

/**
 *
 * @param {object} data
 * @param {isntance of VIEW_CQL} VIEW_CQL
 * @param {isntance of VIEW_CONCEPT_CQL_LOOKUP} VIEW_CONCEPT_CQL_LOOKUP
 * @returns {object}, ie: { status: true, data: { check: true, data: { TEXT: true } } }
 * @exampe _check_type_cql({type: 'string', value: '123', CONCEPT_CD: 'LID: 72172-0'}, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP)
 * sample outputs:
 * -  {"status":true,"data":[{"check":true,"data":{"RANGE":true}}]}
 * -  {"status":true,"data":[{"check":false,"data":{"RANGE":false}}]}
 */
async function _check_concept_cql(data, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP) {
  if (data.CONCEPT_CD === undefined)
    return { status: false, error: error_codes.ivalid_type };

  //first find the rules
  let res_rules = await VIEW_CONCEPT_CQL_LOOKUP.read({
    CONCEPT_CD: data.CONCEPT_CD,
  });
  const CHECK = [];
  if (res_rules.status && res_rules.data.length > 0) {
    for (let rule of res_rules.data) {
      let res_cql = await VIEW_CQL.read({ CQL_ID: rule.CQL_ID });
      if (res_cql.status && res_cql.data.length > 0) {
        let JSON_CHAR = JSON.parse(unstringify_json(res_cql.data[0].JSON_CHAR));
        let res = await exec({
          lib: JSON_CHAR,
          parameters: { VALUE: data.value },
        });
        if (res.status) CHECK.push(res.data);
      }
    }
  }

  return { status: true, data: CHECK };
}

/**
 *
 * @param {object} data
 * @param {isntance of VIEW_CQL} VIEW_CQL
 * @returns {object}, ie: { status: true, data: { check: true, data: { TEXT: true } } }
 * @exampe _check_type_cql({type: 'string', value: '123'}, VIEW_CQL)
 * //sample outputs:
 * - { status: true, data: { check: true, data: { NUMBER: true } } }
 * - { status: false, error: "Passed in parameter 'VALUE' is wrong type" }
 */
async function _check_type_cql(data, VIEW_CQL) {
  if (data.type === undefined || dtypes[data.type] === undefined)
    return { status: false, error: error_codes.ivalid_type };

  let res = await VIEW_CQL.read({ CODE_CD: data.type });
  if (!res || !res.status || res.data.length === 0)
    return { status: false, error: error_codes.ivalid_type };
  let JSON_CHAR = JSON.parse(unstringify_json(res.data[0].JSON_CHAR));
  // exec
  let res_cql = await exec({
    lib: JSON_CHAR,
    parameters: { VALUE: data.value },
  });
  return res_cql;
}

/**
 * TESTED BY: CQL.test.js
 * @param {object} payload = {VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP}
 * @returns {object} - {status: true | false, data: []}
 */
export async function exportCQL(payload) {
  if (!payload || !payload.VIEW_CQL || !payload.VIEW_CONCEPT_CQL_LOOKUP)
    return { status: false, error: "invalid payload" };

  const VIEW_CQL = payload.VIEW_CQL;
  const VIEW_CONCEPT_CQL_LOOKUP = payload.VIEW_CONCEPT_CQL_LOOKUP;

  // FIRST GENERATE A LIST OF ALL THE DATA
  const res_cql = await VIEW_CQL.read({ CQL_ID: 0, _greater: true });
  if (!res_cql.status)
    return { status: false, error: error_codes.query_was_empty };
  const CQL_DATA = res_cql.data;

  // laufe jetzt durch die DATEN und sammle die Concepts ein
  for (let cql of CQL_DATA) {
    let CONCEPT_CD = [];
    let res_concepts = await VIEW_CONCEPT_CQL_LOOKUP.read({
      CQL_ID: cql.CQL_ID,
    });
    if (res_concepts.status && res_concepts.data.length > 0) {
      for (let concept of res_concepts.data) {
        CONCEPT_CD.push(concept.CONCEPT_CD);
      }
    }

    // add the data
    cql.CONCEPT_CD = CONCEPT_CD;
  }

  return { status: true, data: CQL_DATA };
}

/**
 * TESTED BY: CQL.test.js
 * @param {object} payload = {IMPORT_DATA, VIEW_CQL, VIEW_CONCEPT_CQL_LOOKUP}
 * @returns {object} - {status: true | false, data: [{CODE_CD, data, status}, ..]}
 */
export async function importCQL(payload) {
  if (
    !payload ||
    !payload.data ||
    !payload.VIEW_CQL ||
    !payload.VIEW_CONCEPT_CQL_LOOKUP
  )
    return { status: false, error: "invalid payload" };
  if (typeof payload.data !== "object")
    return { status: false, error: "invalid payload" };

  const VIEW_CQL = payload.VIEW_CQL;
  const VIEW_CONCEPT_CQL_LOOKUP = payload.VIEW_CONCEPT_CQL_LOOKUP;

  //loop through the data and add the rules
  const DATA = [];
  for (let cql of payload.data) {
    //first check, if ID exists
    let res_cql = await VIEW_CQL.read({ CODE_CD: cql.CODE_CD });
    if (res_cql.status && res_cql.data.length === 0) {
      let res_add = await VIEW_CQL.create(cql);
      if (res_add.status && res_add.data) {
        //now add the Lookups
        for (let cc of cql.CONCEPT_CD) {
          await VIEW_CONCEPT_CQL_LOOKUP.create({
            CQL_ID: cql.CQL_ID,
            CONCEPT_CD: cc,
          });
        }
        DATA.push({ CODE_CD: cql.CODE_CD, data: "added", status: true });
      }
    } else
      DATA.push({
        CODE_CD: cql.CODE_CD,
        data: "already in use",
        status: false,
      });
  }
  //finished
  return { status: true, data: DATA };
}
