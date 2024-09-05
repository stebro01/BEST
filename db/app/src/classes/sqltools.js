// import { date } from 'quasar'

// export function get_date_from_timeStamp(timeStamp) {
//     return date.formatDate(timeStamp, 'YYYY-MM-DD')
// }

// export function prepareSQLSearch(payload) {
//     let where_string = undefined
//     Object.keys(payload).forEach(key => {
//         if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
//             let condition = make_condition(payload[key], key)
//             if (where_string === undefined) where_string = condition
//             else where_string += ` AND ${condition}`
//         }
//     })
//     return where_string
// }

// function make_condition(val, key) {
//     let condition = null

//     if (typeof(val) === 'string') {
//         const lc = val.charAt(val.length-1)
//         if (lc === '*' || lc === '%') condition = `${key} LIKE '${val.slice(0, val.length-1)}%'`
//         else condition = `${key}='${val}'`
//     }
//     else condition = `${key}=${val}`

//     return condition
// }

/**
 * @param {object} obj
 * @returns the stringified String but compatible with SQL queries, ie. " => '
 */
export function stringify(obj) {
  var str = JSON.stringify(obj);
  str = str.replace(/"/g, "'");
  str = str.replace(/\\\\/g, "\\");
  return str;
}

/**
 * a string stored as STRING BLOB in SQL >> make compatible for JSON.parse again
 * >> undoes function stringify:
 * JSON_OBJ -> JSON.stringify -> stringify -> write to sql
 * read from sql -> unstringify -> JSON.parse -> JSON_OBJ
 * @param {object} obj
 * @returns {string}
 *
 */
export function unstringify(obj) {
  var str = JSON.stringify(obj);
  str = str.replace(/'/g, '"');
  return str.substring(1, str.length - 1);
}

export function stringify_char(str) {
  str = str.replace(/\n/g, "\\n");
  return str;
}

export function unstringify_char(str) {
  str = str.replace(/\\n/g, "\n");
  return str;
}

export function stringify_json(str) {
  str = str.replace(/"/g, "'");
  return str;
}

export function unstringify_json(str) {
  if (str === null) return null;
  str = str.replace(/'/g, '"');
  return str;
}

export function blob_to_json(val) {
  val = val.replace(/'/g, '"');
  val = val.replace(/\\"/g, "'");
  val = val.replace(/\\/g, "_");
  val = JSON.parse(val);
  return val;
}
