/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @description Hiermit teste ich den FileExplorer
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/FileExplorer.test.js 
 */

const fs = require("fs");
const path = require("path")

import { FileExplorer } from "src/tools/FileExplorer";

const explorer = new FileExplorer(path, fs);

describe('Teste RAW import', () => {
  
  beforeAll( () => {
    

  })

  // afterAll(async () => {
  //   const status = await VIEW_PATIENT.delete({PATIENT_NUM: DUMMY.PATIENT_NUM})
  //   console.log('Deleting DUMMY Patient: ', status.status)
  // })

  it (`Der Explorer geht`, async () => {
    const res = explorer.getCurrentPath()
    console.log('Current Path:', res)
    expect(res).not.toBeUndefined()
    console.log(explorer.info())
  })

  it (`Anzeige von Ordnern: getDirectoryContents`, async () => {
    const res = explorer.getDirectoryContents()
    console.log('getDirectoryContents:', res)
    expect(res).not.toBeUndefined()
  })

  it (`can change the folder and list the contents`, async () => {  
    explorer.setCurrentPath('/Users/ste/MyProjects/BEST/db/app')
    const res = explorer.getDirectoryContents()
    expect(res).not.toBeUndefined()
    console.log('getDirectoryContents:', res)
  })

  it (`can go up one level`, async () => {  
    explorer.setCurrentPath('/Users/ste/MyProjects/BEST/db/app')
    const res = explorer.getDirectoryContents()
    expect(res).not.toBeUndefined()
    console.log('getDirectoryContents:', res)

    // go up one level
    explorer.goUpOneLevel()
    const res2 = explorer.getDirectoryContents()
    expect(res2).not.toBeUndefined()
    console.log('getDirectoryContents:', res2)

    // go up to root
    explorer.setCurrentPath('/Users/ste/MyProjects/')
    explorer.goUpOneLevel()
    var resup = explorer.getDirectoryContents()
    expect(resup).not.toBeUndefined()
    console.log('getDirectoryContents:', resup)
    explorer.goUpOneLevel()
    var resup = explorer.getDirectoryContents()
    expect(resup).not.toBeUndefined()
    console.log('getDirectoryContents:', resup)
    explorer.goUpOneLevel()
    var resup = explorer.getDirectoryContents()
    expect(resup).not.toBeUndefined()
    console.log('getDirectoryContents:', resup)
    //should not work, should be root
    explorer.goUpOneLevel()
    var resup = explorer.getDirectoryContents()
    expect(resup).not.toBeUndefined()
    console.log('getDirectoryContents:', resup)

  })

  
})

