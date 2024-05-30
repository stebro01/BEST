import { public_id } from "src/tools/my_env";

export function PUBLIC_ID() {
  return public_id();
}

export function ENV(state) {
  return state.ENV;
}

export function TEXT(state) {
  return state.ENV.text;
}

export function SHOW_SPINNER(state) {
  return state.SHOW_SPINNER;
}

export function SETTINGS(state) {
  return state.SETTINGS.data;
}

export function USER(state) {
  return state.USER;
}

export function SETTINGS_FILENAME(state) {
  const file = state.SETTINGS.data.filename;
  if (!file) return undefined;
  return file.path;
}

export function CONNECTED(state) {
  return state.connected;
}

export function ISADMIN(state) {
  if (state.USER === undefined) return false;
  if (state.USER.COLUMN_CD !== "admin") return false;
  return true;
}

export function SYSTEM_ID(state) {
  return "<SYSTEM>";
}

export function QUESTS_PRESETS(state) {
  return state.QUESTS_PRESETS;
}

export function PATIENT_PINNED(state) {
  return state.PATIENT_PINNED;
}

export function VISIT_PINNED(state) {
  return state.VISIT_PINNED;
}

export function PROVIDER_LIST(state) {
  return state.PROVIDER_LIST;
}

export function PROVIDER_PINNED(state) {
  return state.PROVIDER_PINNED;
}

export function OBSERVATION_PINNED(state) {
  return state.OBSERVATION_PINNED;
}

export function ELECTRON_MODE(state) {
  return state.IS_ELECTRON;
}

export function MODE_VISITS() {
  return { new: "new", add: "add" };
}

export function IMPORT_OPTIONS() {
  return [
    { value: "hl7", label: "HL7 JSON/HTML" },
    { value: "csv", label: "CSV Tabellenformat" },
    { value: "raw", label: "Rohdaten" },
  ];
}

export function IMPORT_MODES() {
  return { hl7: "hl7", csv: "csv", raw: "raw" };
}

export function SESSION_MULTIEDIT(state) {
  return state.SESSION_MULTIEDIT;
}

//  SOME OPTIONS FOR PATIENT_VIEW
export function PATIENT_VIEW(state) {
  return state.PATIENT_VIEW;
}

export function PATIENT_XLS_VIEWS(state) {
  return state.PATIENT_VIEW.XLS_VIEWS;
}

export function PATIENT_VIEW_COLUMNS() {
  return [
    { label: "PATIENT_CD", value: "PATIENT_CD" },
    { label: "BIRTH_DATE", value: "BIRTH_DATE" },
    { label: "ENCOUNTER_NUM", value: "ENCOUNTER_NUM" },
    { label: "START_DATE", value: "START_DATE" },
    { label: "VISIT_BLOB", value: "VISIT_BLOB" },
  ];
}

//  SOME OPTIONS FOR PATIENT_VIEW
export function PATIENT_VIEW_SQL_STATEMENT(state) {
  return state.PATIENT_VIEW.SQL_STATEMENT;
}

export function PATIENT_VIEW_SQL_STATEMENT_RAW(state) {
  const statement = `${
    state.ENV.app.env.patient_view.sql_statement
  } WHERE (USER_ID=${USER(state).USER_ID} OR USER_ID=${PUBLIC_ID(state)})`;
  return statement;
}

export function PATIENT_VIEW_SQL_STATEMENT_RAW_JOIN(state) {
  const statement = `SELECT pl.* FROM patient_list pl JOIN visit_dimension vd ON pl.PATIENT_NUM = vd.PATIENT_NUM WHERE (pl.USER_ID=${
    USER(state).USER_ID
  } OR pl.USER_ID=${PUBLIC_ID(state)})`;
  return statement;
}

export function PATIENT_VIEW_SQL_OPTIONS(state) {
  return state.PATIENT_VIEW.SQL_OPTIONS;
}

export function ANSWER_ABSENT() {
  return { value: "SCTID: 2667000", label: "k.A." };
}
export function STANDARD_XLS_VIEW() {
  return { font_size: 10, max_char_header: 20 };
}

export function FAVORITE_CONCEPTS() {
  return [
    {
      CONCEPT_CD: "SCTID: 273249006",
      NAME_CHAR: "Assessment scales",
      VALTYPE_CD: "T",
      SOURCESYSTEM_CD: "SNOMED-CT",
    },
    {
      CONCEPT_CD: "LID: 63900-5",
      NAME_CHAR: "Age",
      VALTYPE_CD: "N",
      UNITS_CD: "years",
      SOURCESYSTEM_CD: "LOINC",
    },
  ];
}
