const sqlite3 = require('sqlite3')
const { log, info, error_codes } = require("./logger")
const fs = require('fs');
const exp = require('constants');
let database = undefined

/**
 *
 * @returns {boolean} true - wenn DB verbunden, false / wenn nicht
 * @example const status = dbman.status()
 */
const status = () => {
  if (!database) return false
  else return true
};

/**
 * @description Stelle eine Verbindung zur DB her
 * @param {string} filename
 * @return {boolean} true, wenn erfolgreich, false ...
 * @example const status = dbman.connect('./mydb.db')
 * // DBMAN.db enthält die DBVerbindung
 */
const connect = (filename) => {
  info({
    method: 'dbman',
    message: 'connect',
    data: filename
  })
  if (database) database.close()

  if (fs.existsSync(filename)) {
    database = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
        return false
      }
    });
    return true
  } else {
    console.error(`${filename} does not exist.`);
    return
  }

};

/**
 * @description Schließt eine Verbindung
 * @return {boolean} true, wenn erfolgreich
 * @example dbman.close()
 */
const close = () => {
  info({
    method: 'dbman',
    message: 'close'
  })
  if (!database) return false
  if (database) database.close()
  database = undefined
  return true
}


/**
 * @description Gibt alle Einträge einer Query als Promise zurück
 * @param {string} sql_query
 * @returns {async} Array mit Ergebnis der Anfrage: {status: true, data: ROWS, error: undefined}
 * @example const result = await dbman.get_all(`SELECT * FROM patients`)
 *
 */
const get_all = async (sql_query) => {
  info({
    method: 'dbman',
    message: 'get_all',
    data: sql_query
  })
  return new Promise((resolve, reject) => {
    database.all(sql_query, [], (err, rows) => {
      if (err) {
        console.log(sql_query)
        console.error(err)
        reject(err)
      } else {
        resolve({
          status: true,
          error: undefined,
          data: rows
        })
      }
    })
  })
}

/**
 * @description Führt eine SQL-Query aus unter Verwendung von sqlite3.run und zuätzlichen Daten (VALUES)
 * @param {*} sql - SQL-Query
 * @param {*} VALUES - Array mit Daten
 * @returns Promise mit {status, error, data}
 * @example
 * const sql = INSERT INTO OBSERVATION_FACT (PATIENT_NUM, ENCOUNTER_NUM, PROVIDER_ID, CATEGORY_CHAR, TVAL_CHAR, OBSERVATION_BLOB, UPLOAD_ID, SOURCESYSTEM_CD, IMPORT_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
 * const VALUES = [PATIENT_NUM, ENCOUNTER_NUM, PROVIDER_ID, CATEGORY_CHAR, TVAL_CHAR, OBSERVATION_BLOB, UPLOAD_ID, SOURCESYSTEM_CD, IMPORT_DATE]
 * const result = await dbman.run_with_data(sql, VALUES)
 */
const run_with_data = async (sql, VALUES) => {
  log ({method: 'dbman -> run_with_data', data: sql})
  return new Promise ((resolve, reject) => {
    if (!sql || !VALUES) return  resolve({status: false, error: error_codes.invalid_payload})
    database.run(sql, VALUES, function (err) {
      if (err) {
        console.error(err.message);
        close()
        return resolve({status: false, error: err})
      }
      return resolve({
        message: 'SQL: Aktion erfolgreich',
        status: true,
        data: this.lastID
      })
    })

  })
 }

const run = async (sql_query) => {
  if (!sql_query) return undefined
  info({
    method: 'dbman',
    message: 'run',
    sql_query
  })

  return new Promise((resolve, reject) => {
    database.run(sql_query, function (err) {
      if (err) {
        console.error(err.message);
        close()
        return resolve({status: false, error: err})
      }

      return resolve({
        message: 'SQL: Aktion erfolgreich',
        status: true,
        data: this.lastID
      })
    })
  })
}

/**
 *
 */
const create = (filename) => {
  let userDB = new sqlite3.Database(filename,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      return false
    });
  return true
};

const removeAllTables = async () => {
  //conectino must be done
  const QUERY = "SELECT * FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  const result = await get_all(QUERY)
  // remove all tables
  for (let i = 0; i < result.data.length; i++) {
    let res = await run(`DROP TABLE IF EXISTS ${result.data[i].name}`)
  }

  return true
}

const removeAllViews = async () => {
  log({method: 'dbman -> removeAllViews'})
  //connection must be done
  const QUERY = "SELECT * FROM sqlite_schema WHERE type = 'view' AND name NOT LIKE 'sqlite_%'"
  const result = await get_all(QUERY)
  // remove all tables
  for (let i = 0; i < result.data.length; i++) {
    console.log(`DROP VIEW IF EXISTS ${result.data[i].name}`)
    let res = await run(`DROP VIEW IF EXISTS ${result.data[i].name}`)
  }

  return true
}


// EXPORT THE MODULES
exports.connect = connect;
exports.close = close;
exports.get_all = get_all;
exports.run = run;
exports.status = status;
exports.create = create;
exports.removeAllTables = removeAllTables;
exports.removeAllViews = removeAllViews;
exports.run_with_data = run_with_data;
