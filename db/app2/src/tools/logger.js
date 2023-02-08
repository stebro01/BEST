/**
 * 
 * @param {*} arg 
 * @example
 * const {log} = require('../src/tools/logger')
 * log({method: 'action -> checkDB', message: 'checkDB', data: JSON.stringify(payload)})
 */
const log = (arg, mode) => {
    var txt = ''
    if (mode === 'error') txt = 'ERROR: '
    if (arg.method) txt += `method: ${arg.method}, `
    if (arg.message) txt += `message: ${arg.message}, `
    if (arg.data) txt += `data: ${JSON.stringify(arg.data)}, `
    if (txt) console.log(txt)
}

const info = (arg) => {
    // log(arg)
}

const error = (arg) => {
    log(arg, 'error')
}

const error_codes = {
    no_payload: 'no payload',
    invalid_payload: 'invalid payload',
    instance_invalid: 'instance was not instanciated correctly',
    query_was_empty: 'query gave no result',
    query_more_than_one_result: 'a query gave more than one result, unique result was expected',
    invalid_json_object: 'an expected JSON Object is not valid >> essential fields are missing',
    invalid_html_object: 'HTML file is not valid -> essential data is missing',
    could_not_resolve_concept: 'a CONCEPT_CD or MODIFIER_CD could not be resolved in the DB',
    primary_key_already_used: 'Primary Key is already in use',
    could_not_add_visit: 'neue Visite konnte nicht angelegt werden',
    invalid_concept_cd: 'Invalid CONCEPT_CD',
    could_not_add_observation: 'Observation konnte nicht hinzugefügt werden',
    could_not_get_patient_num: 'PATIENT_NUM konnte nicht bestimmt werden',
    folder_does_not_exist: "Verzeichnis existiert nicht",
    could_not_create_db: "Konnte die DB nicht erzeugen",
    user_does_not_exist: "Nutzer konnte nicht gefunden werden.",
    user_invalid_password: "Passwort nicht gültig",
    observations_added_sucessfully: "Observations erfolgreich hinzugefügt",
    h7cda_not_valid: "H7 Dokument -> Signatur stimmt nicht überein; das Dokument wurde verändert"
}

exports.log = log
exports.info = info
exports.error = error
exports.error_codes = error_codes