// https://github.com/cqframework/cql-execution/tree/master/examples/node

var cql = require("cql-execution");
const lib_age = require('./age.json');

const lib = new cql.Library(lib_age);
const executor = new cql.Executor(lib);
const psource = new cql.PatientSource([
  {
    id: '1',
    recordType: 'Patient',
    name: 'John Smith',
    gender: 'M',
    birthDate: '1980-02-17T06:15',
    age: -10

  },
  {
    id: '2',
    recordType: 'Patient',
    name: 'Sally Smith',
    gender: 'F',
    birthDate: '2007-08-02T11:47',
    age: 20
  }
]);

const result = executor.exec(psource);
console.log(result.patientResults)
console.log(JSON.stringify(result, undefined, 2));