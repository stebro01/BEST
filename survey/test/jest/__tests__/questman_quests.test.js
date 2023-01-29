// Run Test with:
// npm run test:unit test/jest/__tests__/questman_quests.test.js 

import { QUESTMAN } from "../../../src/tools/QuestMan"

describe('QuestMAN: DEX, IQCODE', () => {

    // FILL QUESTS
    it('can fill a DEX with random data', () => {
      QUESTMAN.activeQuest = 'dex_self';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      // expect(summary.results[0].value > 0).toBeTruthy()
    });

    it('can fill a DEX with random data', () => {
      QUESTMAN.activeQuest = 'dex_female';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      console.log(summary)
      // expect(summary.results[0].value > 0).toBeTruthy()
    });


    it('can fill a DEX with random data', () => {
      QUESTMAN.activeQuest = 'iqcode';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      expect(summary.results[0].value > 0).toBeTruthy()
    });

})

