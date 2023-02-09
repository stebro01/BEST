/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @depends Der Test SchemeX.test.js sollte erfolgreich durchgelaufen sein
 * @description Testet alle Views um: Patienten / Visiten / Obervations zu erzeugen / abzurufen etc.
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/Reset_DB.test.js 
 */

const fs = require("fs");
const dbman = require('../../../src-electron/dbman')
import path from 'path'
import { resetDatabase } from 'src/tools/db_functions';

const ENV = require('../../../public/env.json')
const TEMPLATES = ENV.app.templates

import { prepare_path } from "src/tools/prepare_sql_template_path";


describe('Teste RESET DB Funktion', () => {
  const db_fn = global.DB_TEST_PATH

  beforeAll(() => {
    // erzeuge eine leere neue DB
    if (fs.existsSync(db_fn)) {
      fs.unlinkSync(db_fn)
    }
    dbman.create(db_fn)
   })



  it (`Lösche alle Tables`, async() => {
    dbman.connect(db_fn)    
    expect(await dbman.removeAllTables()).toBe(true)
    dbman.close()
  
  })

  it (`bereite den Pfad vor`, async() => {
    const publicFolder = '/Users/ste/MyProjects/dbBEST/app/public'

    const PATH = prepare_path({super: 'super', super2: 'super2'}, publicFolder, path)
    expect(Object.keys(PATH).length).toBe(2)
    expect(PATH.super).toBe(`${publicFolder}/${'super'}`)
  })

  it (`Fülle jetzt die ganze DB`, async() => {
    const publicFolder = '/Users/ste/MyProjects/dbBEST/app/public'
    const PATH = prepare_path(TEMPLATES, publicFolder, path)
    
    dbman.connect(db_fn)

    const status = await dbman.resetDB(PATH, resetDatabase)

    dbman.close()

  })




  
})

