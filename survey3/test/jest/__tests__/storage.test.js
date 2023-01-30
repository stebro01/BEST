// Run Test with:
// npm run test:unit test/jest/__tests__/storage.test.js 

import { STORAGE } from "../../../src/tools/Storage"

describe('Storage Class', () => {

    
    it('can work with the Presets', () => {
      expect(STORAGE.get_presets()).toEqual([])

      // ADD SOME DATA
      STORAGE.add_presets({label: 'hi', value: 'some data'})
      expect(STORAGE.get_presets().length).toBe(1)

      // SAVE THE DATA
      STORAGE.save_presets()

      // REMOVE DATA manually
      STORAGE._PRESETS = []
      expect(STORAGE.get_presets()).toEqual([])
      // LOAD THE DATA
      STORAGE.load_presets()
      expect(STORAGE.get_presets().length).toBe(1)

      // REMOVE DATA
      STORAGE.delete_presets(0)
      expect(STORAGE.get_presets()).toEqual([])

      // LOAD THE DATA
      STORAGE.load_presets()
      expect(STORAGE.get_presets().length).toBe(0)

      // CLEAR THE DATA
      STORAGE.clear_presets()
      expect(STORAGE.get_presets()).toEqual([])
    });

    // STORAGE
    it('can work with the STORAGE', () => {
      expect(STORAGE.get().length).toBe(0)

      const val = STORAGE.get(10)
      expect(val).toBe(undefined)
    })

})

const all_quest = require('../../mockdata/all_quests_30.json');