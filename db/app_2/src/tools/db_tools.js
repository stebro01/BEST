import * as HRI from 'human-readable-ids'
import {uid} from 'quasar'
/**
 * CREATE SOME HUMAN READABLE IDs
 * @returns {string} - ie. empty-grasshopper-84
 */
export function hri() {
    return HRI.hri.random()
}

export function my_uid() {
    return uid().toUpperCase()
}

/**
 * @param {string} data - The data to be saved
 * @param {string} fileName - The name of the file
 * @returns {void}
 * @description This function takes the data and the file name and creates a blob from the data.
 * Then it creates a URL from the blob and creates a link element with the URL as href and the fileName as download attribute.
 * @example from RawDatPreview.vue/downloadRaw():
    downloadRaw() {
      // get the object data
      const data = this.localData.OBSERVATION_BLOB;
      const fileName = JSON.parse(this.localData.TVAL_CHAR).filename;
      downloadBlob(data, fileName);
    },
 */
export function downloadBlob(data, fileName) {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a); // Füge den Link zum Dokument hinzu, damit Firefox ihn korrekt handhaben kann
  a.click();
  document.body.removeChild(a); // Entferne den Link nach dem Klicken
  URL.revokeObjectURL(url); // Bereinige die URL
}

/**
 * @param {string} filePath - The path to the file
 * @returns {Promise} - The data from the file
 * @description This function reads the file from the filePath and returns the data as a promise.
 * @example called by: SurveyAdd.vue/importSurvey
 */
export async function  readSurveyFile(filePath, store) {
  const txt = window.electron.readFile(filePath, "utf8");
  const DATA = await store.dispatch("importSurveyBEST", txt);
  return DATA
}
