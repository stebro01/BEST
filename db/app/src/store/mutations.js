const {log, error} = require('src/tools/logger')

export function SETTINGS_INIT (state) {
    state.SETTINGS.init()
}

export function USER_SET (state, payload) {
    state.USER = payload
}

/**
 * 
 * @example this.$store.commit('SETTINGS_SET', {label: 'user', value: this.active_user})
 */
export function SETTINGS_SET (state, payload) {
    if (!payload) return false
    state.SETTINGS.data = payload
}

export function PATIENT_PINNED_SET (state, payload) {
    state.PATIENT_PINNED = payload
}

export function VISIT_PINNED_SET (state, payload) {
    state.VISIT_PINNED = payload
}

export function PROVIDER_LIST_SET (state, payload) {
    state.PROVIDER_LIST = payload
}

export function PROVIDER_PINNED_SET (state, payload) {
    state.PROVIDER_PINNED = payload
}

export function OBSERVATION_PINNED_SET (state, payload) {
    state.OBSERVATION_PINNED = payload
}

export function SETTINGS_CLEAR (state) {
    state.SETTINGS.clear()
    state.SETTINGS.save()
}

// this.$store.commit('CONNECTED_SET', true)
export function CONNECTED_SET (state, payload) {
    state.connected = payload
} 

export function ELECTRON_SET (state, payload) {
    state.IS_ELECTRON = payload
}

export function QUESTS_PRESETS_SET (state, payload) {
    state.QUESTS_PRESETS = payload
}

export function LOG ({}, payload) {
    log(payload)
}

export function ERROR ({}, payload) {
    error(payload)
}