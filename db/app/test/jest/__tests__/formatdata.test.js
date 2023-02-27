/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @method myDate
 * @description Testen der Funktionen in **formatdata.js**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/formatdata.test.js 
 */


import {importCSV, importSurveyBest, splitVisits, importConceptFromCSV, parse_date} from "src/tools/formatdata"
const fs = require("fs");
const path = require("path")

const csv = fs.readFileSync(path.join(global.MOCKUP_PATH, "/TEMPLATE_CSV.csv"), 'utf-8')
const html = fs.readFileSync(path.join(global.MOCKUP_PATH, "/surveyBEST/quest_bdi2.html"), 'utf-8')
const concept_csv = fs.readFileSync(path.join(global.MOCKUP_PATH, "/formdata/CONCEPT_DIMENSION.csv"), 'utf-8')

describe('Teste formatdata', () => {

  it ('importCSV: TEST csv kann eingelesen werden: 2 Subjects und je 2 Visiten',  () => {
    const obs = importCSV(csv)
    expect(obs.length).toBeGreaterThan(5)
    check_obs(obs)
  })

  it ('splitVisits: TEST csv wird eingelesen und einzelne Visiten werden getrennt',  () => {
    const obs = importCSV(csv)
    expect(obs.length).toBeGreaterThan(5)
    const visits = splitVisits(obs)
    expect(visits).toBeDefined()
    var c = 0
    visits.forEach(v => {
      let ENCOUNTER_NUM = v.ENCOUNTER_NUM
      let PATIENT_NUM = v.PATIENT_NUM
      v.OBSERVATIONS.forEach(o => {
        c++
        expect(o.ENCOUNTER_NUM).toBe(ENCOUNTER_NUM)
        expect(o.PATIENT_NUM).toBe(PATIENT_NUM)
      })
    })

    expect(c).toBe(14)

  })

  it ('importSurveyBest: TEST survey HTML kann eingelesen werden: 1 Quest: bdi2',  () => {
    const obs = importSurveyBest(html)
    expect(obs).toBeDefined()
    check_obs([obs])
    expect(obs.NVAL_NUM).toBe(32)
  })

  it ('importConcept: Lese ein CONCEPT.csv ein und stelle es in einem TABLE dar',  () => {
    const CONCEPTS = importConceptFromCSV(concept_csv)
    expect(CONCEPTS).toBeDefined()
    expect(CONCEPTS.length).toBeGreaterThan(0)
    CONCEPTS.forEach(c => {
      expect(c.CONCEPT_CD).toBeDefined()
      expect(c.CONCEPT_PATH).toBeDefined()
    })
  })

  it ('parse_date: verschiedenen Datumsformate werden korrekt umgesetzt',  () => {
    const DATES = [
      {value: '2022-12-02', expected: '2022-12-02'},
      {value: '2021-07-20T21:30:12:00', expected: '2021-07-20'},
      {value: '01.02.2023', expected: '2023-02-01'},
      {value: '01.02.23', expected: '2023-02-01'},
      {value: '01/02/2023', expected: '2023-02-01'},
      {value: '01/02/23', expected: '2023-02-01'},
    ]

    for (let date of DATES) {
      let new_date = parse_date(date.value)
      expect(new_date).toBe(date.expected)
    }
    
  })


})

//überprüft die Felder einer Observatoin
function check_obs(obs) {
  obs.forEach(o => {
    // expect(o.PATIENT_NUM).toBeDefined()
    expect(o.VALTYPE_CD).toBeDefined()
    expect(o.CONCEPT_CD).toBeDefined()
    expect(o.START_DATE).toBeDefined()
    if (o.VALTYPE_CD === 'N') expect(o.NVAL_NUM).toBeDefined()
    else expect(o.TVAL_CHAR).toBeDefined()
  })
}

