/**
 * @jest-environment jsdom
 */

/**
 * @depends Der Test SSRS_TOOLS_01_db_export_obs.test.js sollte erfolgreich durchgelaufen sein
 * @description lädt u.a. ein HL7 JSON File und testet die Funktionen verifyCDA, importHL7toObject und addHL7ObjectToDB
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/vitest/__tests__/SSRS_TOOLS_02_HL7import.test.js
 */

// Import Vitest and other necessary modules
import { describe, expect, it, beforeAll, vi } from "vitest";
const fs = require("fs");
const path = require("path");

// LOAD HL7 JSON FILE
const path_to_mockups = "/Users/ste/MyProjects/BEST/db/app/test/mockups";
const db_fn = path.join(path_to_mockups, "test_DB_v20231222.db");

const hl7_json = JSON.parse(
  fs.readFileSync(
    path.join(path_to_mockups, "/tmp/result_exporthl7.txt"),
    "utf-8"
  )
);

const dbman = require("../../../src/tools/dbman");

// LOAD SOME PREQUISITES
import { View_Concept } from "src/classes/View_Concept";
import { View_Patient } from "src/classes/View_Patient";
import { View_Visit } from "src/classes/View_Visit";
import { View_Observation } from "src/classes/View_Observation";
const VIEW_CONCEPT = new View_Concept(dbman, db_fn);
const VIEW_PATIENT = new View_Patient(dbman, db_fn);
const VIEW_VISIT = new View_Visit(dbman, db_fn);
const VIEW_OBSERVATION = new View_Observation(dbman, db_fn);

// FUNCTIONS TO TEST
import {
  verifyCDA,
  importHL7toObject,
  addHL7ObjectToDB,
} from "src/tools/hl7_import";

describe("Teste HL7 import und verify Funktion", () => {
  // beforeAll(() => {

  // })

  it(`Das Testfile wurde korrekt eingelesen`, () => {
    expect(hl7_json).toBeDefined();
    expect(hl7_json[0].cda).toBeDefined();
    expect(hl7_json[0].hash).toBeDefined();
  });

  it(`Teste die hl7-Verify Funktion: true for original data`, () => {
    expect(verifyCDA(hl7_json[0])).toBeTruthy();
  });

  it(`Teste die hl7-Verify Funktion: false for changed data`, () => {
    const hl7_copy = JSON.parse(JSON.stringify(hl7_json));
    hl7_copy[0].cda.id = "123";
    expect(verifyCDA(hl7_copy[0])).toBeFalsy();
  });

  it(`Teste importHL7toObject funktion mit gültigen Daten`, async () => {
    const DATA = await importHL7toObject(hl7_json[0].cda, VIEW_CONCEPT);
    expect(DATA).toBeDefined();
    expect(DATA.PATIENT.PATIENT_CD).toBeDefined();
    expect(DATA.VISITS.length).toBeGreaterThan(0);
    expect(DATA.OBSERVATIONS.length).toBeGreaterThan(0);

    // check the RAW DATA ...
    const OBS = DATA.OBSERVATIONS[0];
    expect(OBS).toBeDefined();
    // find element with {CONCEPT_CD: 'RAW_DATA'}
    const obs_raw = OBS.find((el) => el.CONCEPT_CD === "CUSTOM: RAW_DATA");
    expect(obs_raw).toBeDefined();
    expect(obs_raw.OBSERVATION_BLOB).toBeDefined();
    // console.log(obs_raw);
    // find assessment score
    const obs_score = OBS.find((el) => el.CONCEPT_CD === "SCTID: 273249006");
    expect(obs_score).toBeDefined();
    expect(obs_score.OBSERVATION_BLOB).toBeDefined();
  });

  it(`Teste addHL7ObjectToDB funktion mit gültigen Daten`, async () => {
    //lösche Patienten (wenn vorhanden)
    const res_delete = await VIEW_PATIENT.delete({
      PATIENT_CD: "sdfjlke",
      _force: true,
    });
    //import
    const DATA = await importHL7toObject(hl7_json[0].cda, VIEW_CONCEPT);
    //write to db

    const status = await addHL7ObjectToDB(
      DATA,
      VIEW_PATIENT,
      VIEW_VISIT,
      VIEW_OBSERVATION
    );
    expect(status.status).toBeTruthy();
    console.log(status);
  });
});
