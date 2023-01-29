export function ACTIVE_QUEST_LABEL(state) {
  if (state.QuestMan.activeQuest === undefined) return undefined
  if (state.QuestMan.activeQuest.label === undefined) return undefined
  return state.QuestMan.activeQuest.label
}

export function ACTIVE_QUEST(state) {
  if (state.QuestMan.activeQuest === undefined) return undefined
  if (state.QuestMan.activeQuest.value === undefined) return undefined
  return state.QuestMan.activeQuest.value
}


export function QUEST_LIST(state) {
  return state.QuestMan.quest_list
}

export function QUESTMAN(state) {
  return state.QuestMan
}

export function TEXT(state) {
  return state.TEXT
}

export function ENV(state) {
  return state.ENV
}

export function SETTINGS(state) {
  return state.SETTINGS
}

export function PROTECTED_MODE(state) {
  return state.PROTECTED_MODE
}

export function PRESET_STORE(state) {
  return state.STORAGE.get_presets()
}

export function STORAGE(state) {
  return state.STORAGE
}

export function DEBUG_MODE(state) {
  return state.debug
}