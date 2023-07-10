/**
 * @description Sammlung von Funktionen, um Rohdaten einzulesen und in die DB einzufuegen sowie wieder zu extrahieren
 */

import { log } from "./logger";

/**
 * 
 * @param {string} fn 
 * @param {library} fs 
 * @returns promise with: {data, status, error}
 */
export async function raw_read(filepath, fs, path) {
    log({method: 'raw_import -> raw_read', message: 'import data', data: filepath})
    // file exists?
    if (!await fs.existsSync(filepath)) return {error: `File not found: ${filepath}`}
    // else
    var buffer = fs.readFileSync(filepath);
    var parsedPath = path.parse(filepath);
    return {status: true, data: {ext: parsedPath.ext, dir: parsedPath.dir, filename: parsedPath.name, buffer: buffer}}
}

export async function raw_write(data, fs, path) {
    log({method: 'raw_import -> raw_write', message: 'write data', data: data})

    var outpath = path.join(data.dir, data.filename + data.ext)
    log({method: 'raw_import -> raw_write', message: `write data to: ${outpath}`})
    fs.writeFileSync(outpath, data.buffer);
    return {status: true, data: outpath}
}