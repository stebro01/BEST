const cql = require("cql-execution");

/**
 * Führt eine CQL Aktion aus
 * @param {object} payload - {lib, parameters}
 * const parameters = { "A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47' }
 * const lib = require('cql_lib.json')
 * var res = exec({parameters: parameters, lib: lib})
 *
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
    const res = executor.exec(patientSource, executionDateTime);
    return {status: true, data: res}
}

