const cql = require("cql-execution");
var axios = require('axios');

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
    if (!payload || !payload.lib || !payload.parameters) return {status: false, error: 'invalid payload'}
    if (typeof(payload.lib) !== 'object') return {status: false, error: 'invalid payload'}
    if (typeof(payload.parameters) !== 'object') return {status: false, error: 'invalid payload'}
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
          return {status: true, data: {check, data}}
        }
        else return {status: true, data: {data: res, check: false}}
    } catch(err) {
        return {status: false, error: err}
    }
}

/**
 * Fragt die cql-translate API an >> hierfür muss der Docker in ./cql/cql-translate gestartet sein und die API unter http://localhost:8082/cql/translator erreichbar sein
 * Ein Beispiel eines POST-Request ist in ./cql/cql-translation/cql to elm json.postman_collection.json hinterlegt
 * @param {object} payload - payload.cql = CQL Statement als String
 * @returns {object} JSON Object als Ergebnis der API Anfrage
 */
export async function query_api(payload) {
    if (!payload || !payload.cql) return {status: false, error: 'invalid payload'}
    

    var data = payload.cql


    var config = {
        method: 'post',
      maxBodyLength: Infinity,
        url: 'http://localhost:8082/cql/translator',
        headers: { 
          'Content-Type': 'application/cql', 
          'Accept': 'application/elm+json'
        },
        data : data
      };

      try {
        const res = await axios(config)
        return {status: true, data: res.data}
        }
        catch (err) {
            return {status: false, error: err}
        }


}
