/**
 * @description Sammlung von Funktionen, um Rohdaten einzulesen und in die DB einzufuegen sowie wieder zu extrahieren
 */

import { error_codes, log } from "./logger";
import CryptoJS from "crypto-js";

/**
 *
 * @param {string} fn
 * @param {library} fs
 * @returns promise with: {data, status, error}
 */
export async function raw_read(filepath, fs, path) {
  log({
    method: "raw_import -> raw_read",
    message: "import data",
    data: filepath,
  });
  // file exists?
  if (!(await fs.existsSync(filepath)))
    return { error: `File not found: ${filepath}` };
  // else
  var buffer = fs.readFileSync(filepath);
  var parsedPath = path.parse(filepath);
  return {
    status: true,
    data: {
      ext: parsedPath.ext,
      dir: parsedPath.dir,
      filename: parsedPath.name,
      buffer: buffer,
      signature: createBlobSignature(buffer),
      sizeKB: buffer.length / 1024,
    },
  };
}

/**
 *
 * @param {*} data - {ext, dir, filename, buffer}
 * @param {*} fs - library
 * @param {*} path - library
 * @returns promise with: {data, status, error}
 * @example
 *  const data = {ext: '.json', dir:'some_dir', filename: 'filetowrite', buffer: buffer}
 *  const status_write = await raw_write(data, fs, path)
 */
export async function raw_write(data, fs, path) {
  log({ method: "raw_import -> raw_write", message: "write data" });
  // data valid?
  if (!data || !data.buffer)
    return { error: error_codes.invalid_payload, status: false };
  // else
  var outpath = path.join(data.dir, data.filename);
  log({
    method: "raw_import -> raw_write",
    message: `write data to: ${outpath}`,
  });
  fs.writeFileSync(outpath, data.buffer);
  return { status: true, data: outpath };
}

// SOME LOCAL FUNCTIONS
function createBlobSignature(blob) {
  const wordArray = CryptoJS.lib.WordArray.create(blob);
  const hash = CryptoJS.SHA256(wordArray);
  return hash.toString();
}
