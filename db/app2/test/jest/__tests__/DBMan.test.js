/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @class DBMan
 * @description Testen der Klasse **DBMan.js**
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/DBMan.test.js 
 */

const dbman = require('../../../src-electron/dbman')

// schemes
import {SCHEME_CODE_LOOKUP} from '../../../src/classes/Scheme_code_lookup'


describe('Teste dbman', () => {


  it ('Can connect to valid db file',  () => {
    expect(dbman.status()).toBe(false)
    dbman.connect(global.DB_DEFAULT_PATH)
    expect(dbman.status()).toBe(true)
    
  })

  it ('Tests the Schemes ...', () => {
    console.log(SCHEME_CODE_LOOKUP)
  })

  // it ('Can read from valid db file', async () => {
  //   expect(DBMAN.db).toBeUndefined()
  //   const status = DBMAN.connect(filename)
  //   expect(DBMAN.db).toBeDefined()
  //   expect(status).toBeTruthy()

  //   //query db
  //   const sql = `SELECT * FROM patients`
  //   const rows = await DBMAN.get_all(sql)
  //   expect(rows.length).toBeGreaterThan(0)

  //   DBMAN.close()
  // })




})

