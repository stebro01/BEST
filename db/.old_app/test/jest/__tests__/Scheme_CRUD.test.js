/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class Scheme_...
 * @description Testen der Klassen: **Scheme_code_lookup.js** als Inheritance von Scheme_X.js
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Scheme_CRUD.test.js 
 */

const fs = require("fs");
const dbman = require('../../../src-electron/dbman')

// schemes
import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'

// MOCKUP DATA
import {MOCKUP_CODE_LOOKUP} from '../mockups/db_mockup_data'


describe('Teste Scheme_XXX', () => {
  const db_fn = global.DB_TEST_PATH


  beforeAll(() => {
    // erzeuge eine leere neue DB
    console.log('erzeuge neue DB: ' + db_fn)
    if (fs.existsSync(db_fn)) {
      fs.unlinkSync(db_fn)
    }
    dbman.create(db_fn)
   })


  // teste Scheme_code_lookup
  it ('Teste Scheme_code_lookup: private variables', () => {
    expect(SCHEME_CODE_LOOKUP._TABLE_NAME).toBe('CODE_LOOKUP')
    expect(SCHEME_CODE_LOOKUP._PRIMARY_KEY).toBe('CODE_CD')
    expect(typeof(SCHEME_CODE_LOOKUP._FIELDS)).toBe('object')
  })

  it ('Teste Scheme_code_lookup: erzeuge den Table', async() => {
    dbman.connect(db_fn)
    const sql_query = SCHEME_CODE_LOOKUP.init()
    expect(sql_query.query).not.toBe(undefined)
    const res = await dbman.run(sql_query.query)
    expect(res.status).toBe(true)
    dbman.close()
  })

  it ('Teste Scheme_code_lookup: füge Daten hinzu', async() => {
    dbman.connect(db_fn)
    // add single entrz
    const sql_query = SCHEME_CODE_LOOKUP.create(MOCKUP_CODE_LOOKUP[0])
    const res = await dbman.run(sql_query.query)
    expect(res.status).toBe(true)

    //add array
    const sql_query2 = SCHEME_CODE_LOOKUP.create(MOCKUP_CODE_LOOKUP[1])
    const res2 = await dbman.run(sql_query2.query)
    expect(res2.status).toBe(true)

    //add array ohne primary&unique
    const sql_query3 = SCHEME_CODE_LOOKUP.create(MOCKUP_CODE_LOOKUP[2])
    const res3 = await dbman.run(sql_query3.query)
    expect(res3.status).toBe(true)
    
    //close
    dbman.close()
  })

  it ('Teste Scheme_code_lookup: lese Daten ', async() => {
    dbman.connect(db_fn)
    // add single entrz
    const query = SCHEME_CODE_LOOKUP.read({CODE_CD: 'UKJ_Neuro', COLUMN_CD: 'LOCATION_CD'})
    const res = await dbman.get_all(query.query)
    expect(res.data).not.toBe(undefined)
    expect(res.data[0].CODE_CD).toBe('UKJ_Neuro')
    //close
    dbman.close()
  })

  it ('Teste Scheme_code_lookup: update Daten ', async() => {
    dbman.connect(db_fn)
    // add single entrz
    const query = SCHEME_CODE_LOOKUP.update({where: {CODE_CD: 'UKJ_Neuro'}, set: {NAME_CHAR: 'Neurologie Jena', LOOKUP_BLOB: 'some random data'}})
    const res = await dbman.run(query.query)
    expect(res.status).toBe(true)
 
    //überprüfe die Änderung
    const query2 = SCHEME_CODE_LOOKUP.read({CODE_CD: 'UKJ_Neuro'})
    const res2 = await dbman.get_all(query2.query)
    expect(res2.status).toBe(true)
    expect(res2.data[0].NAME_CHAR).toBe('Neurologie Jena')

    //close
    dbman.close()
  })

  it ('Teste Scheme_code_lookup: lösche Daten ', async() => {
    dbman.connect(db_fn)
    // add single entrz
    const query = SCHEME_CODE_LOOKUP.delete({CODE_CD: 'UKJ_HNO', COLUMN_CD: 'LOCATION_CD'})
    const res = await dbman.run(query.query)
    expect(res.status).toBe(true)

    //überprüfe die Änderung
    const query2 = SCHEME_CODE_LOOKUP.read({CODE_CD: 'UKJ_HNO'})
    const res2 = await dbman.get_all(query2.query)
    expect(res2.data.length).toBe(0)

    //close
    dbman.close()
  })




})

