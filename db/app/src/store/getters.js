import {public_id} from 'src/tools/my_env'

export function PUBLIC_ID() {
    return public_id()
}

export function ENV(state) {
    return state.ENV
}

export function TEXT(state) {
    return state.ENV.text
}

export function SHOW_SPINNER(state) {
    return state.SHOW_SPINNER
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
    if (state.USER === undefined) return false
    if (state.USER.COLUMN_CD !== 'admin') return false
    return true
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

export function MODE_VISITS() {
    return { new: 'new', add: 'add' }
}

export function IMPORT_OPTIONS() {
    return [
        { value: "hl7", label: "HL7 JSON/HTML" },
        { value: "csv", label: "CSV Tabellenformat" },
        { value: "raw", label: "Rohdaten" },
    ]
}

export function IMPORT_MODES() {
    return { hl7: 'hl7', csv: 'csv', raw: 'raw' }
}

export function SESSION_MULTIEDIT(state) {
    return state.SESSION_MULTIEDIT
}

//  SOME OPTIONS FOR PATIENT_VIEW
export function PATIENT_VIEW(state) {
    return state.PATIENT_VIEW
}

//  SOME OPTIONS FOR PATIENT_VIEW
export function PATIENT_VIEW_SQL_STATEMENT(state) {
    return state.PATIENT_VIEW.SQL_STATEMENT
}

export function PATIENT_VIEW_SQL_STATEMENT_RAW(state) {
  const statement = `${state.ENV.app.env.patient_view.sql_statement} WHERE USER_ID=${USER(state).USER_ID} OR USER_ID=${PUBLIC_ID(state)}`
  return statement
}


export function ANSWER_ABSENT() {
    return { value: 'SCTID: 2667000', label: 'k.A.' }
}
