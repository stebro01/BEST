// Run Test with:
// npm run test:unit test/jest/__tests__/questman_all_quests.test.js 

import { QUESTMAN } from "../../../src/tools/QuestMan"

describe('QuestMAN: all', () => {

  //   // FILL QUESTS
  //   var i = 0
  //   QUESTMAN.quest_list.forEach(quest =>{
  //     it(`can fill a ${quest} with random data`, () => {
        
        
  //         console.log('QUEST: ' + quest)
  //         QUESTMAN.activeQuest = quest;
  //         expect(QUESTMAN.activeQuest).not.toBe(undefined)
  //         expect(QUESTMAN.random_fill()).toBeTruthy()
  //         let summary = QUESTMAN.summary
          
        
  //     })
  //     i++
  // })

    // it('can fill a PSQI with random data', () => {
    //   // https://www.sleep.pitt.edu/instruments/
    //   QUESTMAN.activeQuest = 'psqi';
    //   expect(QUESTMAN.activeQuest).not.toBe(undefined)
    //   expect(QUESTMAN.random_fill()).toBeTruthy()
    //   const summary = QUESTMAN.summary
    //   console.log(summary)

    //   // expect(summary.results[0].value > 0).toBeTruthy()
    // });

    it('can fill a QUEST with random data', () => {

      // console.log(QUESTMAN.quest_list)
      QUESTMAN.activeQuest = 'cfsme';
      expect(QUESTMAN.activeQuest).not.toBe(undefined)
      expect(QUESTMAN.random_fill()).toBeTruthy()
      const summary = QUESTMAN.summary
      console.log(summary)

      // expect(summary.results[0].value > 0).toBeTruthy()
    });
   

})

