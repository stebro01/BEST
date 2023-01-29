// Run Test with:
// npm run test:unit test/jest/__tests__/questman.test.js 

import { QUESTMAN } from "../../../src/tools/QuestMan"

describe('QuestMAN Class', () => {

  // GENERAL FUNCTOIN
  it('QuestMAN main functions', () => {
    expect(QUESTMAN.check()).toBeTruthy()
    expect(QUESTMAN.quest_list.length > 0).toBeTruthy()
    // console.log(QUESTMAN.quest_list)
    expect(QUESTMAN.get('bfi').short_title).toBe('bfi')
  });

    // ACTIVE QUEST
    it('QuestMAN active Quest', () => {
      expect(QUESTMAN.activeQuest).toBe(undefined)
      QUESTMAN.activeQuest = 'bsssfi';
      expect(QUESTMAN.activeQuest).toBe(undefined)
      QUESTMAN.activeQuest = 'bfi';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.activeQuest.label).toBe('bfi')
      expect(QUESTMAN.activeQuest.value.short_title).toBe('bfi')
    });

      // TEST RPESETS
    it('QuestMAN PRESETS', () => {
      expect(QUESTMAN.presets.length).toBe(0)
      QUESTMAN.presets = 'bdi2'
      QUESTMAN.presets = 'bdi'
      expect(QUESTMAN.presets.length).toBe(1)
      QUESTMAN.clear_preset()
      QUESTMAN.presets = ['bdi2', 'bdi', 'nihss']
      expect(QUESTMAN.presets.length).toBe(2)
      expect(QUESTMAN.next_preset).toBe('bdi2')
      expect(QUESTMAN.presets.length).toBe(1)
      expect(QUESTMAN.next_preset).toBe('nihss')
      expect(QUESTMAN.next_preset).toBe(undefined)
    });

    it('manipulation in active Quest does not alter the QUEST LIST', () => {
      QUESTMAN.activeQuest = 'bfi';
      QUESTMAN.activeQuest.value.short_title = 'bfi2'
      expect(QUESTMAN.activeQuest.value.short_title).toBe('bfi2')
      expect(QUESTMAN.get('bfi').short_title).toBe('bfi')
    });

    // RESULTS
    it('results creates a list with all results', () => {
      QUESTMAN.activeQuest = undefined;
      expect(QUESTMAN.activeQuest).toBe(undefined)
      expect(QUESTMAN.summary).toBe(undefined)
      QUESTMAN.activeQuest = 'bfi';
      const results = QUESTMAN.summary
      expect(results).not.toBe(undefined)
    });

    // FILL QUESTS
    it('can fill a NIHS with random data', () => {
      QUESTMAN.activeQuest = 'nihss';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      expect(QUESTMAN.summary.results[0].value > 0).toBeTruthy()
    });

    it('can fill HANDEDNESS with random data', () => {
      QUESTMAN.activeQuest = 'handedness';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      expect(QUESTMAN.summary.results.length > 0).toBeTruthy()
    });

    it('can fill sf36 with random data', () => {
      QUESTMAN.activeQuest = 'sf36';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      // QUESTMAN.random_fill()
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      expect(QUESTMAN.summary.results.length > 0).toBeTruthy()
      expect(QUESTMAN.summary.results[0].label).toBe('Physical functioning')
    });

    it('can fill hadsd with random data', () => {
      QUESTMAN.activeQuest = 'hadsd';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      expect(QUESTMAN.summary.results.length > 0).toBeTruthy()
    });

    it('can fill mwtb with random data', () => {
      QUESTMAN.activeQuest = 'mwtb';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      // QUESTMAN.random_fill()
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      expect(QUESTMAN.summary.results.length > 0).toBeTruthy()
    });



})
