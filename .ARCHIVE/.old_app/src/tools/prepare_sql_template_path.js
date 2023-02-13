
/**
 * wandelt eine Liste mit relativen Pfaden in neue Pfade um
 * @param {array} ARR_TEMPLATE - List mit Verzeichnissen
 * @param {string} publicFolder - public folder
 * @param {obj} path - const path = require("path");
 * @return {array}
 * @example
 * const path = require("path");
 * const publicFolder = '/Users/ste/MyProjects/dbBEST/app/public'
 * const PATH = prepare_path({super: 'super', super2: 'super2'}, publicFolder, path)
 * 
 */
export function prepare_path(ARR_TEMPLATE, publicFolder, path) {
    const OUT_PATH = {}
    Object.keys(ARR_TEMPLATE).forEach(p => {
        OUT_PATH[p] = path.resolve(publicFolder, ARR_TEMPLATE[p])
    })
    
    return OUT_PATH

}   