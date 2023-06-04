/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Teste Funktionen um ein JSON mit Tables einzulesen => erzeug von DBFunctions_Transfer/export
 * @description 
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/DataTransfer.test.js 
 */

//DB Connection
const db_fn = 'test/jest/mockups/db/template_DB.db'
const dbman = require('src/tools/dbman')

// SOME MOCKUP DATA
const JSON_DATA = require('../mockups/DataTransfer/export_dbBEST_1685739172477.json')

// FUNKTION zu testen:
import { importJSON, _check_obj_for_update } from "src/tools/db_datatransfer";

describe('Teste Import DB Funktion', () => {
  
  beforeAll(() => {
    
  })

  it (`Das Testfile enthält Daten und DB Connection geht`, () => {
    expect(JSON_DATA).not.toBeUndefined()
  })

  it (`importJSON kann Daten korrekt in DB importieren: invalid payload`,async () => {
    const res_1 = await importJSON({JSON: undefined, db_fn: undefined, dbman: undefined})
    expect(res_1.status).toBeFalsy()
  })

  it (`teste die update Checkfunktion f. die Objekte`, () => {
    const TEST = [
      { // new is newer
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: new Date(2023, 6, 2)},
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 5, 1), UPDATE_DATE: new Date(2023, 5, 2)},
        expect: true
      },
      { //new is newer
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 5, 1), UPDATE_DATE: new Date(2023, 6, 2)},
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: new Date(2023, 6, 3)},
        expect: true
      },
      { //old is newer
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 5, 1), UPDATE_DATE: new Date(2023, 6, 3)},
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: new Date(2023, 6, 2)},
        expect: false
      }, {
        //new is newer
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 5, 1), UPDATE_DATE: null},
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: new Date(2023, 6, 2)},
        expect: true
      },
      {
        //new is newer
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 2), UPDATE_DATE: null},
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: new Date(2023, 6, 3)},
        expect: true
      }, {
        // old is newer
        oldObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 2), UPDATE_DATE: null},
        newObj: {id: 1, IMPORT_DATE: new Date(2023, 6, 1), UPDATE_DATE: null},
        expect: false

      }
    ]

    TEST.forEach(test => expect(_check_obj_for_update(test.newObj, test.oldObj)).toBe(test.expect))

  })

  it (`importJSON kann Daten korrekt in DB importieren: einzelner Datensatz`,async () => {
    //adding PROVIDER_DIMENSINO
    const res = await importJSON( {JSON: [JSON_DATA[3]], db_fn: db_fn, dbman: dbman})
    expect(res).not.toBeUndefined()
    expect(res.status).toBeTruthy()
    console.log(res)
  })

  it (`importJSON kann Daten korrekt in DB importieren: kompletter Datensatz`,async () => {
    //adding PROVIDER_DIMENSINO
    const res = await importJSON( {JSON: JSON_DATA, db_fn: db_fn, dbman: dbman})
    expect(res).not.toBeUndefined()
    expect(res.status).toBeTruthy()
    expect(res.data.IGNORED.length).toBeGreaterThan(10)
    console.log(res.data)
  })

  it (`importJSON kann Daten korrekt in DB importieren: kompletter Datensatz / forceUpdate`,async () => {
    //adding PROVIDER_DIMENSINO
    const res = await importJSON( {JSON: JSON_DATA, db_fn: db_fn, dbman: dbman, force: true, UPLOAD_ID: 7912})
    expect(res).not.toBeUndefined()
    expect(res.status).toBeTruthy()
    expect(res.data.UPDATED.length).toBeGreaterThan(10)
    console.log(res)
  })

  
})

