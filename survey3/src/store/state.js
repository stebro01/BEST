import TEXT from 'src/statics/Text.json'
import { SETTINGS } from 'src/tools/settings'

import { STORAGE } from 'src/tools/Storage'
// CREATE ID list FOR QUEST with FALSE

STORAGE.load()
STORAGE.load_presets()

import { QUESTS } from 'src/assets/questionnaires/list_quest'
import { QuestMan } from 'src/tools/QuestMan_class'

export default function () {
  return {
    ENV: TEXT.ENV,
    TEXT: TEXT,
    leftDrawerOpen: true,
    QuestMan: new QuestMan({ QUESTS: QUESTS }),
    STORAGE: STORAGE,
    SETTINGS: SETTINGS,
    debug: false,
    PROTECTED_MODE: false,
    editquest: undefined,
    EXPORT_DATA: []
  }
}
