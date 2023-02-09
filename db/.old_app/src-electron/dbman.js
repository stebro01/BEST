const sqlite3 = require('sqlite3')
const {log, info} = require('../src/tools/logger')
const fs = require("fs")
const readFile = fs.readFileSync

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
    info({method: 'dbman', message: 'connect', data: filename})
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
    info({method: 'dbman', message: 'close'})
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
    info({method: 'dbman', message: 'get_all', data: sql_query})
    return new Promise((resolve, reject) => {
        database.all(sql_query, [], (err, rows) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve({status: true, error: undefined, data: rows})
            }
        })
    })
}
  
const run = async (sql_query) => {
    if (!sql_query) return undefined
    info({method: 'dbman', message: 'run', sql_query})
    return new Promise((resolve, reject) => {
        database.run(sql_query, function(err) {
        if (err) {
            console.error(err.message);
            close()
            return reject(err)
        }
        
        return resolve({message: 'SQL: Aktion erfolgreich', status: true, data: this.lastID})
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

const removeAllTables = async() => {
    //conectino must be done
    const QUERY = "SELECT * FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    const result = await get_all(QUERY)
    // remove all tables
    for (let i = 0; i < result.data.length; i ++) {
        let res = await run(`DROP TABLE IF EXISTS ${result.data[i].name}`)
    }

    return true
}

/**
 * 
 * @param {object} PATH 
 * @param {function} resetDatabase 
 * @returns 
 * import { resetDatabase } from 'src/tools/db_functions';
 * const PATH = prepare_path(TEMPLATES, publicFolder, path)
 * dbman.connect(db_fn)
 * const status = await dbman.resetDB(PATH, resetDatabase)
 * dbman.close()
 */

const resetDB = async(PATH, resetDatabase) => {
    await removeAllTables()
    return resetDatabase({run}, readFile, PATH)
}





// EXPORT THE MODULES
exports.connect = connect;
exports.close = close;
exports.get_all = get_all;
exports.run = run;
exports.status = status;
exports.create = create;
exports.removeAllTables = removeAllTables;
exports.resetDB = resetDB