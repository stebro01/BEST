// https://github.com/cqframework/cql-execution/tree/master/examples/node

var cql = require("cql-execution");
const lib_age = require('./cql/date.json');

const lib = new cql.Library(lib_age);
const patientSource = new cql.PatientSource([]);
const codeService = new cql.CodeService([]);
const executionDateTime = null


// PARAMETER!!!
const parameters = {"A": 10, "B": 20, text: '2020-12-22', datum: '2007-08-02T11:47'}

const executor = new cql.Executor(lib, codeService, parameters);

const res = executor.exec(patientSource, executionDateTime);
console.log(res.unfilteredResults)

// for (let key of Object.keys(res.patientResults)) {
//   let tmp = res.patientResults[key]
//   result.push({...tmp.Patient.json, check: tmp.check })
  
// }

// console.log(result)

