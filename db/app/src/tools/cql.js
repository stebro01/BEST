const cql = require("cql-execution");
var axios = require('axios');
const {dtypes} = require('src/classes/more/dtypes')
const {error_codes} = require('src/tools/logger')
import { unstringify_json } from "src/classes/sqltools";
/**
 * Führt eine CQL Aktion aus
 * @param {object} payload - {lib, parameters}
 * const parameters = { "A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47' }
 * const lib = require('cql_lib.json')
 * var res = exec({parameters: parameters, lib: lib})
 *  @returns {object} - {status: true | false, data: {check: true | false, data: {Ergebnis des CQL EXEC}}}
 *  ie: {"status":true,"data":{"check":true,"data":{"STRING":true,"SPLIT":true,"SPLIT_1":true,"SPLIT_2":true,"SPLIT_3":true}}}
 */
export function exec(payload) {
  if (!payload || !payload.lib || !payload.parameters) return { status: false, error: 'invalid payload' }
  if (typeof (payload.lib) !== 'object') return { status: false, error: 'invalid payload' }
  if (typeof (payload.parameters) !== 'object') return { status: false, error: 'invalid payload' }
  // INIT THE LIB
  const lib = new cql.Library(payload.lib);
  const patientSource = new cql.PatientSource([]);
  const codeService = new cql.CodeService([]);
  const executionDateTime = null

  // PARAMETER!!!
  const executor = new cql.Executor(lib, codeService, payload.parameters);
  try {
    const res = executor.exec(patientSource, executionDateTime);
    if (res && Object.keys(res.unfilteredResults).length > 0) {
      var data = res.unfilteredResults
      var check = true
      Object.keys(data).forEach(k => {
        if (data[k] === false) check = false
      })
      return { status: true, data: { check, data } }
    }
    else return { status: true, data: { data: res, check: false } }
  } catch (err) {
    if (err) {
      if (err.message) return { status: false, error: err.message }
      else  return { status: false, error: err }
    }
    return { status: false, error: 'unbekannter Fehler' }
  }
}

/**
 * Fragt die cql-translate API an >> hierfür muss der Docker in ./cql/cql-translate gestartet sein und die API unter http://localhost:8082/cql/translator erreichbar sein
 * Ein Beispiel eines POST-Request ist in ./cql/cql-translation/cql to elm json.postman_collection.json hinterlegt
 * @param {object} payload - payload.cql = CQL Statement als String
 * @returns {object} JSON Object als Ergebnis der API Anfrage
 */
export async function query_api(payload) {
  if (!payload || !payload.cql) return { status: false, error: 'invalid payload' }

  var data = payload.cql


  var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8082/cql/translator',
    headers: {
      'Content-Type': 'application/cql',
      'Accept': 'application/elm+json'
    },
    data: data
  };

  try {
    const res = await axios(config)
    return { status: true, data: res.data }
  }
  catch (err) {
    return { status: false, error: err }
  }
}

/**
 * 
 * @param {object} - {data, VIEW_CQL}
 * @returns {object} - {status: true | false, data: [] | error: ''}
 */
export async function checkRule(payload) {
  if (!payload || !payload.VIEW_CQL || !payload.data) return { status: false, error: 'invalid payload' }

  //first check the data-type
  const data = payload.data
  const VIEW_CQL = payload.VIEW_CQL
  const CHECKS = []
  if (payload.data.type) {
    let res = await _check_type_cql(data, VIEW_CQL)
    if (!res.status) return res
    CHECKS.push(res.data)
  }

  return {status: CHECKS.find(el => el.check === false) === undefined, data: CHECKS}

}

/**
 * 
 * @param {object} data 
 * @param {isntance of VIEW_CQL} VIEW_CQL 
 * @returns {object}, ie: { status: true, data: { check: true, data: { TEXT: true } } }
 * @exampe _check_type_cql({type: 'string', value: '123'}, VIEW_CQL)
 */
async function _check_type_cql(data, VIEW_CQL) {
  if (data.type === undefined || dtypes[data.type] === undefined) return {status: false, error: error_codes.ivalid_type}

  let res = await VIEW_CQL.read({CODE_CD: data.type})
  if (!res || !res.status || res.data.length === 0)  return {status: false, error: error_codes.ivalid_type}
  let JSON_CHAR = JSON.parse(unstringify_json(res.data[0].JSON_CHAR))
  // exec
  let res_cql = exec({lib: JSON_CHAR, parameters: {VALUE: data.value}})
  return res_cql
  
}