/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @description Hiermit teste ich den Export von HL7 Dateien als CDA => Module `db_export_obs.js`
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/SSRS_TOOLS_01_db_export_obs.test.js
 */

const fs = require("fs");
const path = require("path");
const raw_fn_meta = path.join(
  global.MOCKUP_PATH,
  "/exportHL7JSON/meta_exporthl7.txt"
);

// FUNCTIONS TO TEST
import { exportHL7JSON } from "src/tools/db_export_obs";

describe("Teste `db_export_obs.js`", () => {
  beforeAll(async () => {
    // lade die Testdaten
    console.log(`Lade Testdaten aus ${raw_fn_meta}`);
    const meta = JSON.parse(fs.readFileSync(raw_fn_meta));
  });

  it(`Die Testdaten sind gültig`, async () => {
    expect(meta).toBeDefined();
    expect(meta).toBeInstanceOf(Object);
    console.log(meta);
  });
});
