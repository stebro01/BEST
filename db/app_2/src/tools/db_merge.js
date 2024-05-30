
const { log, info, error_codes } = require("./logger")

/**
 * fügt zwei DB zusammen => spezifizierter TABLE wird aus db_from nach db_target migriert
 * @param {object} payload - {fn_db_target: String mit komplettem Pfad der Ziel-DB, fn_db_from: String mit komplettem Pfad der From-DB, scheme: eine INstanz von SCHEME_X.js}
 * @param {MODULE} dbman - Module dbman.js
 * @returns {status: true} or {status: false}
 * @example //TEST: Merge_DB.test.js
 *     var res = await db_merge.mergeTable({fn_db_target: db_main_fn, fn_db_from: db_secondary_fn, scheme: SCHEME_CONCEPT_DIMENSION}, dbman)

 * 
 */
const mergeTable = async(payload, dbman) => {
    if (!payload || !payload.fn_db_target || !payload.fn_db_from || !payload.scheme) return {status: false, error: error_codes.invalid_payload}
    if (!dbman.fs.existsSync(payload.fn_db_target)) return {status: false, error: `${error_codes.file_does_not_exist}:${payload.fn_db_target}`}
    if (!dbman.fs.existsSync(payload.fn_db_from)) return {status: false, error: `${error_codes.file_does_not_exist}:${payload.fn_db_from}`}
  
    //else
    dbman.connect(payload.fn_db_target)
      //check if TABLE EXISTS
      const res = await dbman.get_all(`SELECT name FROM sqlite_master WHERE type='table' AND name='${payload.scheme._TABLE_NAME}';`)
      if (!res.status || res.data.length === 0) {
        dbman.close()
        return {status: false, error: `${error_codes.table_does_not_exist}: ${payload.table}`}
      }
      //ATTACH DATABASE
      const res_attach = await dbman.run(`ATTACH DATABASE '${payload.fn_db_from}' AS secondary;`)
      if (!res_attach.status) {
        dbman.close()
        return {status: false, error: error_codes.could_not_attach_db}
      }
      //Füge SECONDARY ein, wenn CONCEPT_DIMENSION NICHT ENTHALTEN IST:
      /** IE:
          INSERT INTO CONCEPT_DIMENSION 
          SELECT *
          FROM secondary.CONCEPT_DIMENSION
          WHERE CONCEPT_CD NOT IN (SELECT CONCEPT_CD FROM CONCEPT_DIMENSION);
       */
      const res_insert = await dbman.run(`INSERT INTO ${payload.scheme._TABLE_NAME} SELECT * FROM secondary.${payload.scheme._TABLE_NAME} WHERE ${payload.scheme._PRIMARY_KEY} NOT IN (SELECT ${payload.scheme._PRIMARY_KEY} FROM ${payload.scheme._TABLE_NAME});`)
  
  
      // UND JETZT SCHAUE, OB ES WERTE ZUM UPDATEN GIBT
      /**
       SELECT *
      FROM secondary.CONCEPT_DIMENSION
      WHERE EXISTS (
        SELECT 1 
        FROM CONCEPT_DIMENSION AS main
        WHERE main.CONCEPT_CD = secondary.CONCEPT_DIMENSION.CONCEPT_CD
        AND COALESCE(main.UPDATE_DATE, main.IMPORT_DATE) < COALESCE(secondary.CONCEPT_DIMENSION.UPDATE_DATE, secondary.CONCEPT_DIMENSION.IMPORT_DATE)
      );
       */
      const res_update = await dbman.get_all(`SELECT * FROM secondary.${payload.scheme._TABLE_NAME} WHERE EXISTS (SELECT 1 FROM ${payload.scheme._TABLE_NAME} AS main WHERE main.${payload.scheme._PRIMARY_KEY} = secondary.${payload.scheme._TABLE_NAME}.${payload.scheme._PRIMARY_KEY} AND COALESCE(main.UPDATE_DATE, main.IMPORT_DATE) < COALESCE(secondary.${payload.scheme._TABLE_NAME}.UPDATE_DATE, secondary.${payload.scheme._TABLE_NAME}.IMPORT_DATE));
      `)
      if (!res_update.status || res_update.data.length === 0) {
        dbman.close() 
        return {status: true}
      } else {
        log({message: 'update table', data: `table: ${payload.scheme._TABLE_NAME}, entries to update: ${res_update.data.length}`})
        for (let obj of res_update.data) {
          let sql = `UPDATE main.${payload.scheme._TABLE_NAME} SET `;
          for (let key in obj) {
              if (key !== payload.scheme._PRIMARY_KEY) {
                if (obj[key] === 'null' || obj[key] === null) sql += `${key} = NULL, `
                else if (typeof(obj[key]) === 'string') sql += `${key} = '${obj[key]}', `;
                else sql += `${key} = ${obj[key]}, `;
              }
          }
          sql = sql.slice(0, -2);
          sql += ` WHERE ${payload.scheme._PRIMARY_KEY} = '${obj.CONCEPT_CD}';`;
          
          let res_doupdate = await dbman.run(sql)
          
        }
      }
      // ENDE
      dbman.close()
    return {status: true}
  }

exports.mergeTable = mergeTable
