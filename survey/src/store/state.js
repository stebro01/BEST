import TEXT from 'src/statics/Text.json'
import {SETTINGS} from 'src/tools/settings'

import { QUESTMAN } from 'src/tools/QuestMan'
import {STORAGE} from 'src/tools/Storage'
// CREATE ID list FOR QUEST with FALSE

STORAGE.load()
STORAGE.load_presets()



export default function () {
  return {
    TEXT: TEXT,
    leftDrawerOpen: true,
    QuestMan: QUESTMAN,
    STORAGE: STORAGE,
    SETTINGS: SETTINGS,
    debug: false,
    PROTECTED_MODE: false,
    editquest: undefined,
    EXPORT_DATA: []
  }
}