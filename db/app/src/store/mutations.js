const {log, error} = require('src/tools/logger')


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

export function SESSION_MULTI_EDIT_CLEAR(state) {
    localStorage.setItem('dbBEST_multiedit_session', null)
    state.SESSION_MULTIEDIT = undefined
}

export function SESSION_MULTI_EDIT_SET({}, payload) {
    localStorage.setItem('dbBEST_multiedit_session', JSON.stringify(payload))
}

export function SESSION_MULTI_EDIT_LOAD(state) {
    var item = localStorage.getItem('dbBEST_multiedit_session')
    if (!item) state.SESSION_MULTIEDIT = undefined
    else state.SESSION_MULTIEDIT = JSON.parse(item)
}

export function SPINNER_SET (state, payload) {
    state.SHOW_SPINNER = payload === true
}

// PATIENT_VIEW
export function PATIENT_VIEW_PROTECTED_MODE_SET (state, payload) {
    state.PATIENT_VIEW.protected_mode = payload
}

export function PATIENT_VIEW_HIDEN_MODE_SET (state, payload) {
    state.PATIENT_VIEW.hiden_mode = payload
}

export function PATIENT_VIEW_LAYOUT_CHANGED_SET (state, payload) {
    state.PATIENT_VIEW.layout_changed = payload
}

export function PATIENT_VIEW_LAYOUTS_SET (state, payload) {
    state.PATIENT_VIEW.LAYOUTS = payload
}   

export function PATIENT_VIEW_ACTIVE_LAYOUT_VALUE_SET (state, payload) {
    state.PATIENT_VIEW.active_layout_value = payload
}   

export function PATIENT_VIEW_ACTIVE_LAYOUT_SET (state, payload) {
    state.PATIENT_VIEW.active_layout = payload
}   

export function PATIENT_VIEW_EDIT_CATEGORIES_SET (state, payload) {
    const removeArray = state.ENV.app.env.patient_view.forbidden_categories
    console.log('removeArray', removeArray, payload)
    state.PATIENT_VIEW.EDIT.CATEGORIES = payload.filter(item => !removeArray.includes(item));
}

export function PATIENT_VIEW_EDIT_UNITCD_SET (state, payload) {
    state.PATIENT_VIEW.EDIT.UNIT_CD = payload
}   

export function PATIENT_VIEW_SQLSTATEMENT_SET (state, payload) {
    state.PATIENT_VIEW.SQL_STATEMENT = payload
}   