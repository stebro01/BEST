// KLASSE ZUR VERWALTUNG DER QUESTS > einschl. Durchlaufen von Presets etc.
import { QUESTS } from 'src/assets/questionnaires/list_quest'

// ich musste die Klasse auslagern, um sie in dbBEST verwenden zu können
import {QuestMan} from 'src/tools/QuestMan_class'

export const QUESTMAN = new QuestMan()

