// https://github.com/cqframework/cql-execution/tree/master/examples/node

var cql = require("cql-execution");
const lib_age = require('./age.json');

const lib = new cql.Library(lib_age);
const executor = new cql.Executor(lib);
const psource = new cql.PatientSource([
  {
    id: '1',
    recordType: 'Patient',
    type: "age", 
    value: -10

  },
  {
    id: '2',
    recordType: 'Patient',
    type: "age", 
    value: 300
  },
  {
    id: '3',
    recordType: 'Patient',
    type: "age", 
    value: 45
  }
]);

const res = executor.exec(psource);
const result = []
for (let key of Object.keys(res.patientResults)) {
  let tmp = res.patientResults[key]
  result.push({...tmp.Patient.json, check: tmp.check })
  
}

console.log(result)

