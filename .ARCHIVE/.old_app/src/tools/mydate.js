// Funktionen, um Datum zu formatieren

export const FORMAT_DATE = 'YYYY-MM-DD'
export const FORMAT_TIME = 'HH:MM:SS'
export const FORMAT_DATE_TIME = `${FORMAT_DATE} ${FORMAT_TIME}` // YYYY-MM-DD HH:MM:SS

export function now() {
    const d = new Date()
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date} ${time}`
}

export function createUUID() { //status: tested util.test.js
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
  }

/**
 * 
 * @returns {string} im Format YYYY-MM-DD
 */
export function datenow_isostring(payload) {
    payload = undefined
    var date
    if (!payload) date = new Date
    else date = new Date(payload)

    date = date.toISOString()
    date = date.substring(0, date.indexOf('T'))
    return date
}