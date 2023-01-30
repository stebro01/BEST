/* eslint-disable jest/expect-expect */
// Run Test with:
// * npm run test:unit test/jest/__tests__/storage_export_hl7.test.js 

import { STORAGE } from "../../../src/tools/Storage"
import { QUESTMAN } from "../../../src/tools/QuestMan"
import { USER } from "../../../src/tools/User"

import * as CDA from "../../../src/tools/CDA_H7_JSON"


describe('Test the CDA-HL7-JSON Export', () => {

  it('Perform hl7 json export', () => {
    QUESTMAN.activeQuest = 'biomag1'; // sf36
    expect(QUESTMAN.activeQuest).not.toBe(undefined)
    expect(QUESTMAN.random_fill()).toBeTruthy()

    const summary = QUESTMAN.summary
    
    USER.create()
    
    const document = CDA.import_quest({
      data: {
        PID: 'someRandomPID',
        quest: summary
      },
      investigator: {
        uid: USER.uid,
        keyPair: USER.keyPair
      }
    })

    expect(document).not.toBe(undefined)
    expect(document.cda).not.toBe(undefined)
    expect(document.hash).not.toBe(undefined)
    expect(document.exported).not.toBe(undefined)

    STORAGE.clear()
    STORAGE.add(document)
  })

  it('can get a cda from the STORAGE', () => {
    const document = STORAGE.get(0)

    expect(document).not.toBe(undefined)
    expect(document.cda).not.toBe(undefined)
    expect(document.hash).not.toBe(undefined)
    expect(document.exported).not.toBe(undefined)

  })
    
})
