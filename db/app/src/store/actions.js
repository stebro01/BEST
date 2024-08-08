import { View_Observation } from "src/classes/View_Observation";
import { View_Patient } from "src/classes/View_Patient";
import { View_Visit } from "src/classes/View_Visit";
import { View_Concept } from "src/classes/View_Concept";
import { View_Provider } from "src/classes/View_Provider";
import { View_Code_Lookup } from "src/classes/View_Code_Lookup";
import { View_User } from "src/classes/View_User";
import { View_user_patient_lookup } from "src/classes/View_User_Patient_Lookup";
import { View_cql } from "src/classes/View_CQL";
import { View_Concept_CQL_Lookup } from "src/classes/View_Concept_CQL_Lookup";
import { View_note } from "src/classes/View_Note";

// SOME ACTION IMPORTS
import {
  getGender,
  getConceptBy_CONCEPT_CD,
  getConceptList,
  getLookupBy_CODE_CD,
  getProviderBy_PROVIDER_ID,
  getCodeLookupList,
  resetDB,
  resetViews,
  getAnswers,
  getAnswersForObservation,
  saveVisitObservation_to_Patient,
  createDB,
  getDistinctPatientList,
} from "./actions/db_queries";
export {
  getGender,
  getConceptBy_CONCEPT_CD,
  getConceptList,
  getLookupBy_CODE_CD,
  getProviderBy_PROVIDER_ID,
  getCodeLookupList,
  resetDB,resetViews,
  getAnswers,
  getAnswersForObservation,
  saveVisitObservation_to_Patient,
  createDB,
  getDistinctPatientList,
};

import {
  addUser,
  deleteUser,
  updateUser,
  loginUser,
} from "./actions/user_queries";
export { addUser, deleteUser, updateUser, loginUser };

import {
  exportObservationsCSV,
  exportObservationsHL7,
} from "./actions/export_queries";
export { exportObservationsCSV, exportObservationsHL7 };

import {
  importObjectsFromCSVFile,
  importObjectsFromHL7File,
  saveHL7ObjectsToDB,
  importSurveyBEST,
  importRAWdata_from_file,
  exportRAWdata_to_file,
  importJSON_DataTransfer,
} from "./actions/import_data";
export {
  importObjectsFromCSVFile,
  importObjectsFromHL7File,
  saveHL7ObjectsToDB,
  importSurveyBEST,
  importRAWdata_from_file,
  exportRAWdata_to_file,
  importJSON_DataTransfer,
};

import {
  execCQL,
  query_CQLAPI,
  checkCQLRule,
  checkDoubles,
} from "./actions/cql_functions";
export { execCQL, query_CQLAPI, checkCQLRule, checkDoubles };

export function initApp({ commit }) {
  commit("LOG", { method: "action -> initApp" });
  // set PLATFORM
  commit("ELECTRON_SET", window.electron);
  commit("SPINNER_SET", false);
}

/**
 * @description setzt die Einstellung zurück
 * @param {}
 * @example this.$store.dispatch('clearSettings')
 */
export function clearSettings({ commit }) {
  commit("LOG", { method: "action -> clearSettings" });

  return new Promise((res, rej) => {
    return res("Einstellungen erfolgreich zurückgesetzt");
  });
}

/**
 * Diese Funktion baut die Verbindung zur DB auf
 * @method
 */

export function connectDB({ commit, state }) {
  commit("LOG", {
    method: "action -> connectDB",
    message: "connectDB",
    data: JSON.stringify(state.SETTINGS.data.filename),
  });
  const filename = state.SETTINGS.data.filename;

  return new Promise((res, rej) => {
    if (!window.electron) return rej("Electron nicht verfügbar!");
    if (!filename) return rej("Keine DB ausgewählt");
    if (!window.electron.exists(filename.path)) {
      commit("SETTINGS_SET", { label: "filename", value: undefined });
      return rej("DB nicht gefunden");
    }
    const status = window.electron.dbman.connect(filename.path);
    if (!status) return rej("DB konnte nicht geladen werden");
    commit("CONNECTED_SET", true);
    return res("DB konnte erfolgreich geladen werden");
  });
}

export function closeDB({ commit }) {
  commit("LOG", { method: "action -> closeDB" });
  const status = window.electron.dbman.close();
  commit("CONNECTED_SET", false);
  return new Promise((res, rej) => {
    if (!status) return rej("Verbindung war bereits getrennt.");
    return res("Verbindung erfoglreich getrennt.");
  });
}

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('searchDB', { query_string: {PATIENT_NUM:1}, table: "PATIENT_DIMENSION"})
 */
export function searchDB({ commit, state }, payload) {
  commit("LOG", { method: "action -> searchDB", data: payload });
  if (state.connected === false)
    return { status: false, data: "Keine Verbindung zur DB" };
  commit("SPINNER_SET", true);

  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    // TABLE NICHT DEFINIERT
    if (!TABLE) {
      commit("LOG", {
        method: "action -> searchDB",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej(`TABLE <<${payload.table}>> not defined`);
    } //else
    else {
      if (payload.table === "PATIENT_DIMENSION") {
        //FILTER FOR USER / ADMIN MAY SEE EVERYTHING
        if (state.USER && state.USER.COLUMN_CD !== "admin")
          payload.query_string.USER_ID = state.USER.USER_ID;
      }

      TABLE.read(payload.query_string)
        .then((query) => {
          if (query.status) res(query.data);
          else rej(query.error);
        })
        .catch((err) => rej(err.message));
    }
  }).finally(() => commit("SPINNER_SET", false));
}

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('updateDB', {query_string: {where: {PATIENT_NUM: PATIENT_NUM}, set: data}, table:"PATIENT_DIMENSION"})
 */
export function updateDB({ commit, state }, payload) {
  commit("LOG", { method: "action -> updateDB", data: payload });
  commit("SPINNER_SET", true);
  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    // TABLE NICHT DEFINIERT
    if (!TABLE) {
      commit("LOG", {
        method: "action -> updateDB",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej(`TABLE <<${payload.table}>> not defined`);
    } //else
    else {
      TABLE.update(payload.query_string)
        .then((query) => {
          if (query.status) res("Update war erfolgreich");
          else rej(query.error);
        })
        .catch((err) => rej(err.message));
    }
  }).finally(() => commit("SPINNER_SET", false));
}

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('deleteDB', {"query_string":{"PATIENT_NUM":1},"table":"PATIENT_DIMENSION"})
 */
export function deleteDB({ commit, state }, payload) {
  commit("LOG", { method: "action -> deleteDB", data: payload });

  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    if (!TABLE) {
      commit("LOG", {
        method: "action -> deleteDB",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej("TABLE not defined");
    } else {
      TABLE.delete(payload.query_string)
        .then((query) => {
          if (query.status) res(query.data);
          else rej(query.error);
        })
        .catch((err) => rej(err.message));
    }
  }).finally(() => commit("SPINNER_SET", false));
}

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - PRIMARY_KEY des hinzugefügten Datensatzes
 * @example
 * this.$store.dispatch('addDB', {"query_string":{"STATECITYZIP_PATH":"45"},"table":"PATIENT_DIMENSION"})
 */
export function addDB({ commit, state }, payload) {
  commit("LOG", { method: "action -> addDB", data: payload });

  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    if (!TABLE) {
      commit("LOG", {
        method: "action -> addDB",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej("TABLE not defined");
    } else {
      TABLE.create(payload.query_string)
        .then((query) => {
          if (!query.status) return rej(query.error);
          if (payload.table === "PATIENT_DIMENSION") {
            const TABLE_USER_PATIENT_LOOKUP = getTable(
              "USER_PATIENT_LOOKUP",
              state
            );
            TABLE_USER_PATIENT_LOOKUP.create({
              USER_ID: state.USER.USER_ID,
              PATIENT_NUM: query.data.PATIENT_NUM,
            });
          }
          res(query.data);
        })
        .catch((err) => rej(err.message));
    }
  }).finally(() => commit("SPINNER_SET", false));
}

export const runQuery = async ({ commit, state }, payload) => {
  commit("LOG", { method: "action -> runQuery", data: payload });
  commit("SPINNER_SET", true);
  const TABLE = getTable("CONCEPT_DIMENSION", state);
  commit("SPINNER_SET", false);
  return TABLE.run_query(payload);
};

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('resolveCD', {"table":"PATIENT_DIMENSION"})
 */
export function resolveCD({ commit, state }, payload) {
  commit("LOG", { method: "action -> resolveCD", data: payload });

  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    if (!TABLE) {
      commit("LOG", {
        method: "action -> searchDB",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej("TABLE not defined");
    } else {
      TABLE.resolve_cd().then((query) => {
        if (query.status) res({ resolve: query.data, scheme: TABLE._SCHEME });
        else rej(query.error);
      });
    }
  });
}

/**
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('searchDB', {"query_string":{"PATIENT_NUM":1},"table":"PATIENT_DIMENSION"})
 */
export function obs_schemeFind({ commit, state }, payload) {
  commit("LOG", { method: "action -> obs_schemeFind", data: payload });

  return new Promise((res, rej) => {
    const TABLE = new View_Observation(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );

    TABLE.scheme_find(payload).then((query) => {
      if (query.status) res(query.data);
      else rej(query.error);
    });
  });
}

/**
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('obs_schemeResolve', {"query_string":{"PATIENT_NUM":1},"table":"PATIENT_DIMENSION"})
 */
export function obs_schemeResolve({ commit, state }, payload) {
  commit("LOG", { method: "action -> obs_schemeResolve", data: payload });

  return new Promise((res, rej) => {
    const TABLE = new View_Observation(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );

    TABLE.scheme_resolve(payload).then((query) => {
      if (query.status) res(query.data);
      else rej(query.error);
    });
  });
}

/**
 *
 * @param {object} param0
 * @param {object} payload - payload: {query_string: {}, table: 'TABLENAME'}
 * @returns {promise} object - ergebnis der Suche
 * @example
 * this.$store.dispatch('findPath', {"query_string":{CONCEPT_CD: 'SCTID: 263495000'},"table":"CONCEPT_DIMENSION"})
 */
export function findPath({ commit, state }, payload) {
  commit("LOG", { method: "action -> findPath", data: payload });

  return new Promise((res, rej) => {
    const TABLE = getTable(payload.table, state);

    // TABLE NICHT DEFINIERT
    if (!TABLE) {
      commit("LOG", {
        method: "action -> findPath",
        message: "TABLE nicht bekannt",
        data: payload.table,
      });
      rej(`TABLE <<${payload.table}>> not defined`);
    } //else
    else {
      TABLE.read(payload.query_string).then((query) => {
        if (query.status) {
          if (query.data.length > 0) {
            TABLE.read({
              CONCEPT_PATH: `${query.data[0].CONCEPT_PATH}\\LA`,
              _like: true,
            })
              .then((path) => {
                if (path.status) res(path.data);
                else rej(path.error);
              })
              .catch((err) => rej(err));
          }
        } else rej(query.error);
      });
    }
  });
}

// this function will change the visibility of a patient
export const changePatientVisibility = async ({ commit, state }, payload) => {
  commit("LOG", { method: "action -> changePatientVisibility", data: payload });
  // get the table USER_PATIENT_LOOKUP
  if (!payload) return { status: false, data: "Ungültige Daten" };
  const USER_PATIENT_LOOKUP = new View_user_patient_lookup(
    window.electron.dbman,
    state.SETTINGS.data.filename.path,
    state.UPLOAD_ID
  );
  // first check, if the patient is already in the table
  const query = await USER_PATIENT_LOOKUP.read({
    PATIENT_NUM: payload.PATIENT_NUM,
  });
  if (query.status && query.data.length > 0) {
    // update the patient
    const update = await USER_PATIENT_LOOKUP.update({
      where: { USER_PATIENT_ID: query.data[0].USER_PATIENT_ID },
      set: { USER_ID: payload.USER_ID },
    });
    return update;
  } else {
    // insert the patient
    const insert = await USER_PATIENT_LOOKUP.create({
      USER_ID: payload.USER_ID,
      PATIENT_NUM: payload.PATIENT_NUM,
    });
    return insert;
  }
};

// function to clean up the USER_PATIENT_LOOKUP table by finding all Lookups for a given PATIENT_NUM and deleting all entries with USER_ID not matching the payload
export const cleanPatientVisibility = async ({ commit, state }, payload) => {
  commit("LOG", { method: "action -> cleanPatientVisibility", data: payload });
  // get the table USER_PATIENT_LOOKUP
  if (!payload) return { status: false, data: "Ungültige Daten" };
  const USER_PATIENT_LOOKUP = new View_user_patient_lookup(
    window.electron.dbman,
    state.SETTINGS.data.filename.path,
    state.UPLOAD_ID
  );
  // first check, if the patient is already in the table
  const query = await USER_PATIENT_LOOKUP.read({
    PATIENT_NUM: payload.PATIENT_NUM,
  });
  if (query.status && query.data.length > 0) {
    // update the patient
    query.data.forEach(async (entry) => {
      if (entry.USER_ID !== payload.USER_ID) {
        await USER_PATIENT_LOOKUP.delete({
          USER_PATIENT_ID: entry.USER_PATIENT_ID,
        });
      }
    });
  }
  return { status: true, data: "Patienten erfolgreich bereinigt" };
};

// LAYOUTS FOR THE VIEWS

import { stringify } from "src/classes/sqltools";
import { my_uid } from "src/tools/db_tools";

export const initLayout = async ({ commit, state }) => {
  commit("LOG", { method: "action -> initLayout" });
  var res = await searchDB(
    { commit, state },
    { table: "CODE_LOOKUP", query_string: { COLUMN_CD: "VIEW_LAYOUT" } }
  );
  if (res && res.length > 0) {
    res = res.map((item) => {
      return { value: item.CODE_CD, label: item.NAME_CHAR };
    });
    res.unshift({ value: null, label: "Alles anzeigen" });
    commit("PATIENT_VIEW_LAYOUTS_SET", res);
  }
};

export const updateLayout = async ({ commit, state }, payload) => {
  commit("LOG", { method: "action -> updateLayout", data: payload });
  if (!payload) return { status: false, data: "Ungültige Daten" };
  // get the table CODE_LOOKUP
  const CODE_LOOKUP = new View_Code_Lookup(
    window.electron.dbman,
    state.SETTINGS.data.filename.path,
    state.UPLOAD_ID
  );
  // first check, if the entry is already in the table
  const res_layout = await CODE_LOOKUP.read({
    CODE_CD: payload.value,
    COLUMN_CD: "VIEW_LAYOUT",
  });
  if (res_layout && res_layout.data.length > 0) {
    // update the entry
    const update = await CODE_LOOKUP.update({
      where: { CODE_CD: res_layout.data[0].CODE_CD },
      set: { LOOKUP_BLOB: stringify(removeDuplicates(payload.DATA)) },
    });
    return update;
  } else {
    // insert the entry
    const insert = await CODE_LOOKUP.create({
      CODE_CD: payload.value,
      TABLE_CD: "VIEW_LAYOUT",
      COLUMN_CD: "VIEW_LAYOUT",
      LOOKUP_BLOB: stringify(removeDuplicates(payload.DATA)),
      NAME_CHAR: payload.value,
    });
    return insert;
  }
};

export const saveLayout = async ({ commit, state }, payload) => {
  commit("LOG", { method: "action -> saveLayout", data: payload });
  if (!payload) return { status: false, data: "Ungültige Daten" };
  // get the table CODE_LOOKUP
  const CODE_LOOKUP = new View_Code_Lookup(
    window.electron.dbman,
    state.SETTINGS.data.filename.path,
    state.UPLOAD_ID
  );

  const tmp = {
    CODE_CD: my_uid(),
    TABLE_CD: "VIEW_LAYOUT",
    COLUMN_CD: "VIEW_LAYOUT",
    LOOKUP_BLOB: stringify(removeDuplicates(payload.DATA)),
    NAME_CHAR: payload.value,
  };

  const insert = await CODE_LOOKUP.create(tmp);
  return insert;
};

function removeDuplicates(arr) {
  const uniqueJSONStrings = new Set();

  return arr.filter((obj) => {
    const jsonObjStr = JSON.stringify(obj);

    if (uniqueJSONStrings.has(jsonObjStr)) {
      return false;
    } else {
      uniqueJSONStrings.add(jsonObjStr);
      return true;
    }
  });
}

// ie: const TABLE = getTable('PATIENT_DIMENSION', state)
export function getTable(table, state) {
  if (table === "PATIENT_DIMENSION") {
    return new View_Patient(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "VISIT_DIMENSION") {
    return new View_Visit(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "OBSERVATION_FACT") {
    return new View_Observation(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "CONCEPT_DIMENSION") {
    return new View_Concept(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "PROVIDER_DIMENSION") {
    return new View_Provider(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "CODE_LOOKUP") {
    return new View_Code_Lookup(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "USER_MANAGEMENT") {
    return new View_User(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "USER_PATIENT_LOOKUP") {
    return new View_user_patient_lookup(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "CQL_FACT") {
    return new View_cql(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "CONCEPT_CQL_LOOKUP") {
    return new View_Concept_CQL_Lookup(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else if (table === "NOTE_FACT") {
    return new View_note(
      window.electron.dbman,
      state.SETTINGS.data.filename.path,
      state.UPLOAD_ID
    );
  } else return undefined;
}

// query SNOMED API
import * as SNOMED_API from "src/tools/snomed_api";
export const resolve_SNOMED_API = async ({ commit }, payload) => {
  commit("LOG", { method: "action -> resolve_SNOMED_API", data: payload });
  commit("SPINNER_SET", true);
  const res = await SNOMED_API.resolve(payload);
  commit("SPINNER_SET", false);
  return res;
};

export const query_SNOMED_API = async ({ commit }, payload) => {
  commit("LOG", { method: "action -> query_SNOMED_API", data: payload });
  commit("SPINNER_SET", true);
  const res = await SNOMED_API.query(payload);
  commit("SPINNER_SET", false);
  return res;
};

export const query_SNOMED_API_byName = async ({ commit }, payload) => {
  commit("LOG", { method: "action -> query_SNOMED_API_byName", data: payload });
  commit("SPINNER_SET", true);
  const res = await SNOMED_API.queryby_string(payload);
  commit("SPINNER_SET", false);
  return res;
};
