export function ENV(state) {
    return state.ENV
}

export function TEXT(state) {
    return state.ENV.text
}

export function SETTINGS(state) {
    return state.SETTINGS.data
}

export function USER(state) {
    return state.USER
}

export function SETTINGS_FILENAME(state) {
    const file = state.SETTINGS.data.filename
    if (!file) return undefined
    return file.path
}

export function CONNECTED(state) {
    return state.connected
}

export function ISADMIN(state) {
    return false
}

export function SYSTEM_ID(state) {
    return '<SYSTEM>'
}

export function QUESTS_PRESETS(state) {
    return state.QUESTS_PRESETS
}

export function PATIENT_PINNED(state) {
    return state.PATIENT_PINNED
}

export function VISIT_PINNED(state) {
    return state.VISIT_PINNED
}

export function PROVIDER_LIST(state) {
    return state.PROVIDER_LIST
}

export function PROVIDER_PINNED(state) {
    return state.PROVIDER_PINNED
}

export function OBSERVATION_PINNED(state) {
    return state.OBSERVATION_PINNED
}

export function ELECTRON_MODE(state) {
    return state.IS_ELECTRON
}

export function SESSION_MULTIEDIT(state) {
    return state.SESSION_MULTIEDIT
}