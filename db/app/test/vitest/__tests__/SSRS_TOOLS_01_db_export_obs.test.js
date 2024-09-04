/**
 * @jest-environment node
 */

/* eslint-disable */

/**
 * @description Hiermit teste ich den Export von HL7 Dateien als CDA => Module `db_export_obs.js`
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/vitest/__tests__/SSRS_TOOLS_01_db_export_obs.test.js
 */
// Import Vitest and other necessary modules
import { describe, expect, it, beforeAll, vi } from "vitest";

// Mock the jsencrypt module
vi.mock("jsencrypt", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      sign: vi.fn().mockReturnValue("mocked-signature"), // Mock the sign function
      setPrivateKey: vi.fn(), // Mock setPrivateKey
      setPublicKey: vi.fn(), // Mock setPublicKey
      encrypt: vi.fn().mockReturnValue("mocked-encrypted-key"), // Mock encrypt if needed
      decrypt: vi.fn().mockReturnValue("mocked-decrypted-key"), // Mock decrypt if needed
    })),
  };
});

// Mock the generateKeys function in your module
vi.mock("src/tools/db_export_obs", async () => {
  const actual = await vi.importActual("src/tools/db_export_obs");
  return {
    ...actual,
    generateKeys: vi.fn().mockReturnValue({
      privateKey: "mocked-private-key",
      publicKey: "mocked-public-key",
    }),
  };
});

import { exportHL7JSON } from "src/tools/db_export_obs";

const path_to_mockups = "/Users/ste/MyProjects/BEST/db/app/test/mockups";

const fs = require("fs");
const path = require("path");
const raw_fn_meta = path.join(
  path_to_mockups,
  "/exportHL7JSON/meta_exporthl7.txt"
);
const raw_fn_data = path.join(
  path_to_mockups,
  "/exportHL7JSON/data_exporthl7.txt"
);
const raw_fn_concepts = path.join(
  path_to_mockups,
  "/exportHL7JSON/concepts_exporthl7.txt"
);

// SOME MOCKUPS
// mockup jsencrypt.js

describe("Teste `db_export_obs.js`", () => {
  var meta = undefined;
  var data = undefined;
  var concepts = undefined;

  beforeAll(async () => {
    // lade die Testdaten: meta
    console.log(`Lade Testdaten aus ${raw_fn_meta}`);
    meta = JSON.parse(fs.readFileSync(raw_fn_meta));
    // lade die Testdaten: data
    console.log(`Lade Testdaten aus ${raw_fn_data}`);
    data = JSON.parse(fs.readFileSync(raw_fn_data));
    // lade die Testdaten: concepts
    console.log(`Lade Testdaten aus ${raw_fn_concepts}`);
    concepts = JSON.parse(fs.readFileSync(raw_fn_concepts));
  });

  it(`Die Testdaten sind gültig`, async () => {
    // meta
    expect(meta).toBeDefined();
    expect(meta).toBeInstanceOf(Object);
    // data
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Object);
    // concepts
    expect(concepts).toBeDefined();
    expect(concepts).toBeInstanceOf(Object);
  });

  it(`Die Funktion exportHL7JSON liefert ein Ergebnis`, async () => {
    const res = exportHL7JSON(data, concepts, meta);
    expect(res).toBeDefined();
    console.log(res);
    // save the result to a file
    const fn = path.join(path_to_mockups, "/tmp/result_exporthl7.txt");
    fs.writeFileSync(fn, JSON.stringify(res, null, 2));
  });
});
