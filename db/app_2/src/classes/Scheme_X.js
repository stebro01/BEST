/**
 * @description Haupt-Klasse für alle Tables, alle anderen Scheme_X Klassen erben von dieser
 * Funktionen:
 * - init() => erzeugt den Table
 * - create({obj}) => fügt einen DB Eintrag hinzu
 * - read({obj}) => führt eine DB Suche aus
 * - update({where: {obj}, set: {obj}}) => aktualisiert einen DB Eintrag
 * - delete({obj}) => löscht einen DB Eintrag
 */

import { log, info, error_codes } from "src/tools/logger";

import { now, createUUID } from "../tools/mydate";
import { stringify } from "./sqltools";
import { hri } from "src/tools/db_tools";
import { public_id } from "src/tools/my_env";

export class Scheme_X {
  _TABLE_NAME = "TEMPLATE";
  _VIEW_NAME = undefined;
  _CLASS_NAME = "Scheme_X";
  _PRIMARY_KEY = "CODE_CD";
  _UNIQUE = ["CODE_CD"];
  _PRIVATE = ["UPLOAD_ID", "IMPORT_DATE", "DOWNLOAD_DATE", "UPDATE_DATE"];
  _NOT_NULL = [];
  _FIELDS = {
    TABLE_CD: "string",
    CODE_CD: "string",
  };
  _INIT_SQLite_QUERY = undefined;

  /**
   * @returns {object} - {query: string | undefined, error: undefined | error_code}
   */
  init() {
    info({ method: this._CLASS_NAME, message: "init" });
    return { query: this._INIT_SQLite_QUERY, error: undefined };
  }

  /**
   * @param {object} payload
   * @returns {object} - {query: string | undefined, error: undefined | error_code}
   * @example _add_obj({CODE_CD: 'neuroUKJ', NAME_CHAR: 'Uniklinik'})
   */
  create(payload) {
    info({
      method: this._CLASS_NAME,
      message: "create",
      data: JSON.stringify(payload),
    });
    if (!payload) return { query: undefined, error: error_codes.no_payload };

    // UPDATE_DATE hinzufuegen
    if (this._FIELDS["IMPORT_DATE"] && !payload["IMPORT_DATE"])
      payload["IMPORT_DATE"] = now();
    // UNIQUE Feld sollte nicht leer sein
    this._UNIQUE.forEach((u) => {
      if (!payload[u]) payload[u] = createUUID();
    });

    //entferne leere felder
    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === undefined ||
        payload[key] === null ||
        payload[key] === ""
      )
        delete payload[key];
    });

    //SOMETHIN SPECIAL FOR THE PATIENTS_TABLE
    if (this._TABLE_NAME === "PATIENT_DIMENSION") {
      if (!payload.PATIENT_CD) payload.PATIENT_CD = hri();
    }

    // prepare the statement
    var FIELDS = "";
    var VALUES = "";
    Object.keys(payload).forEach((key) => {
      if (this._FIELDS[key]) {
        if (FIELDS !== "") FIELDS += ", ";
        if (VALUES !== "") VALUES += ", ";
        FIELDS += `"${key}"`;
        if (payload[key] === "NULL") VALUES += "NULL";
        else if (typeof payload[key] === "string")
          VALUES += `"${payload[key]}"`;
        else if (typeof payload[key] === "object")
          VALUES += `"${stringify(payload[key])}"`;
        else VALUES += `${payload[key]}`;

        // if (typeof(payload[key]) !== this._FIELDS[key]) info({method: this._CLASS_NAME, message: '_add_obj', data: `invalid types: ${this._FIELDS[key]}(expected) !== ${typeof(payload[key])}(is)`})
      }
    });
    if (!VALUES || VALUES === "" || !FIELDS || FIELDS === "")
      return { query: undefined, error: error_codes.invalid_payload };
    var QUERY = `INSERT INTO "main"."${this._TABLE_NAME}" (${FIELDS}) VALUES (${VALUES})`;
    return { query: QUERY, error: undefined };
  }

  /**
   * @param {object} payload - JSON Object mit den Feldern des neuen Eintrages
   * @returns {object} - {query: string | undefined, error: undefined | error_code}
   * @example
   * const query = SCHEME_CODE_LOOKUP.read({CODE_CD: 'UKJ_Neuro', COLUMN_CD: 'LOCATION_CD'})
   * //LIKE
   * const query = SCHEME_CODE_LOOKUP.read({_like: true, CODE_CD: 'UKJ_Neuro', COLUMN_CD: 'LOCATION_CD'})
   * //verwende den VIEW:
   * * const query = SCHEME_CODE_LOOKUP.read({_like: true, CODE_CD: 'UKJ_Neuro', COLUMN_CD: 'LOCATION_CD'})
   */
  read(payload) {
    info({
      method: this._CLASS_NAME,
      message: "read",
      data: JSON.stringify(payload),
    });
    if (!payload) return { query: undefined, error: error_codes.no_payload };
    var EL = "";
    var _like = payload._like === true;
    Object.keys(payload).forEach((key) => {
      if (this._FIELDS[key]) {
        if (EL !== "") EL += " AND ";
        if (this._FIELDS[key] === "numeric") {
          if (payload._greater === true) EL += `"${key}" > ${payload[key]}`;
          else EL += `"${key}" = ${payload[key]}`;
        } else {
          if (!_like) EL += `"${key}" = "${payload[key]}"`;
          else EL += `"${key}" LIKE "${payload[key]}%"`;
        }
      }
    });
    //SELECT THE TABLE if payload._view try too use a special VIEW
    var TABLE_NAME = this._TABLE_NAME;
    if (this._VIEW_NAME && payload._view) {
      TABLE_NAME = this._VIEW_NAME;
      if (payload.USER_ID)
        EL += ` AND \"USER_ID\" = ${
          payload.USER_ID
        } OR "USER_ID" = ${public_id()}`; //ADDED FOR USER_MANAGEMENT (only current user but all public)
    }

    if (payload._sort) EL += ` ORDER BY \"${payload._sort}\"`;

    if (EL === "")
      return { query: undefined, error: error_codes.invalid_payload };

    // DETERMINE THE COLUMNS
    var COLUMNS = "*";
    if (payload._columns) COLUMNS = payload._columns.join(", ");
    return {
      query: `SELECT ${COLUMNS} from ${TABLE_NAME} WHERE ${EL}`,
      error: undefined,
    };
  }

  /**
   *
   * @param {object} payload - JSON Object mit den Feldern des neuen Eintrages
   * @returns {object} - {query: string | undefined, error: undefined | error_code}
   * @example
   * const query = SCHEME_CODE_LOOKUP.update({where: {CODE_CD: 'UKJ_Neuro'}, set: {NAME_CHAR: 'Neurologie Jena'}})
   */
  update(payload) {
    info({
      method: this._CLASS_NAME,
      message: "update",
      data: JSON.stringify(payload),
    });
    if (!payload) return { query: undefined, error: error_codes.no_payload };
    if (!payload.set || !payload.where) {
      info({
        method: this._CLASS_NAME,
        message: "update",
        data: "payload must be an object: {where: {}, set: {}}",
      });
      return { query: undefined, error: error_codes.invalid_payload };
    }

    // SETZE EIN UPDATE_DATUM
    if (this._FIELDS["UPDATE_DATE"] && !payload.set["UPDATE_DATE"])
      payload.set["UPDATE_DATE"] = now();

    var WHERE = "";
    var SET = "";
    Object.keys(payload.where).forEach((key) => {
      if (this._FIELDS[key]) {
        if (WHERE !== "") WHERE += " AND ";
        if (this._FIELDS[key] === "numeric")
          WHERE += `"${key}" = ${payload.where[key]}`;
        else WHERE += `"${key}" = "${payload.where[key]}"`;
      }
    });
    Object.keys(payload.set).forEach((key) => {
      if (this._FIELDS[key]) {
        if (SET !== "") SET += ", ";
        if (payload.set[key] === "NULL") SET += `"${key}" = NULL`;
        else if (this._FIELDS[key] === "numeric")
          SET += `"${key}" = ${_validate_numeric(payload.set[key])}`;
        else SET += `"${key}" = "${payload.set[key]}"`;
      }
    });
    if (WHERE === "" || SET === "")
      return { query: undefined, error: error_codes.invalid_payload };

    return {
      query: `UPDATE "${this._TABLE_NAME}" SET ${SET} WHERE ${WHERE}`,
      error: undefined,
    };
  }

  /**
   *
   * @param {object} payload - JSON Object mit den Feldern des neuen Eintrages
   * @returns {object} - {query: string | undefined, error: undefined | error_code}
   * @example
   * const query = SCHEME_CODE_LOOKUP.delete({CODE_CD: 'UKJ_Neuro', COLUMN_CD: 'LOCATION_CD'})
   */
  delete(payload) {
    info({
      method: this._CLASS_NAME,
      message: "delete",
      data: JSON.stringify(payload),
    });
    if (!payload) return { query: undefined, error: error_codes.no_payload };
    var WHERE = "";
    Object.keys(payload).forEach((key) => {
      if (this._FIELDS[key]) {
        if (WHERE !== "") WHERE += " AND ";
        if (this._FIELDS[key] === "numeric")
          WHERE += `"${key}" = ${payload[key]}`;
        else WHERE += `"${key}" = "${payload[key]}"`;
      }
    });
    if (WHERE === "")
      return { query: undefined, error: error_codes.invalid_payload };
    return {
      query: `DELETE FROM "${this._TABLE_NAME}" WHERE ${WHERE}`,
      error: undefined,
    };
  }
}

// prüft den inputwert und gibt ihn als Zahl zurück (wenn er eine Zahl ist) oder als hexadez. Wert, wenn er ein String ist
function _validate_numeric(input) {
  return isNaN(input)
    ? input
        .split("")
        .map((char) => char.charCodeAt(0))
        .join("")
    : input;
}
