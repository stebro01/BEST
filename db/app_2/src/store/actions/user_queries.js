
import { View_Provider } from 'src/classes/View_Provider'
import { View_User} from 'src/classes/View_User'
import { error_codes } from 'src/tools/logger'

import { hash_salt_password } from "src/tools/passwort_salter"

 export const  addUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'addUser', data: payload})
    if (!payload || !payload.USER_CD || !payload.PASSWORD_CHAR) return {status: false, data: 'Ungültige Daten'}
    if (payload.PASSWORD_CHAR) payload.PASSWORD_CHAR = hash_salt_password(payload.PASSWORD_CHAR)

   //  USER_MANAGEMENT
    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await USER_VIEW.create(payload)

   //  PROVIDER_DIMENSION
   const PROVIDER_VIEW = new View_Provider(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID)
   const res2 = await PROVIDER_VIEW.create({PROVIDER_ID: payload.USER_CD, NAME_CHAR: payload.NAME_CHAR, PROVIDER_PATH: payload.PROVIDER_PATH, CONCEPT_BLOB: payload.USER_BLOB})
    return {status: res.status && res2.status, data: 'Speichern erfolgreich'}
 }

 export const  updateUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'updateUser', data: payload})
    if (!payload || !payload.USER_ID) return {status: false, data: 'Ungültige Daten'}
    var PASSWORD_CHAR = null
    if (payload.PASSWORD_CHAR) PASSWORD_CHAR = hash_salt_password(payload.PASSWORD_CHAR)

    //  USER_MANAGEMENT
    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
   //  FIRST GET THE OLD DB ENTRY
   const res_old = await USER_VIEW.read({USER_ID: payload.USER_ID})
   if (res_old.data.length === 0) return {status: false, data: 'Ungültige Daten'}
   // NOW UPDATE
   const sql_statement = {USER_CD: payload.USER_CD, NAME_CHAR: payload.NAME_CHAR, PASSWORD_CHAR: PASSWORD_CHAR, COLUMN_CD: payload.COLUMN_CD, USER_BLOB: payload.USER_BLOB}
   if (!PASSWORD_CHAR) delete(sql_statement.PASSWORD_CHAR)
    const res = await USER_VIEW.update({where: {USER_ID: payload.USER_ID}, set: sql_statement})

    //  PROVIDER_DIMENSION
    const PROVIDER_VIEW = new View_Provider(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res2 = await PROVIDER_VIEW.update({where: {PROVIDER_ID: res_old.data[0].USER_CD}, set: {PROVIDER_ID: payload.USER_CD, NAME_CHAR: payload.NAME_CHAR, PROVIDER_PATH: payload.PROVIDER_PATH, CONCEPT_BLOB: payload.USER_BLOB}})

    return {status: res.status, data: 'Speichern erfolgreich'}
 }

 export const  deleteUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'deleteUser', data: payload})
    if (!payload || !payload.USER_CD ) return {status: false, data: 'Ungültige Daten'}

   //  DELETE FROM USER_MANAGEMENT
    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res1 = await USER_VIEW.delete({USER_ID: payload.USER_ID})

   //  DELETE FROM PROVIDER_DIMENSION
   const PROVIDER_VIEW = new View_Provider(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
   const res2 = await PROVIDER_VIEW.delete({PROVIDER_ID: payload.USER_CD})

    return {status: res1.status && res2.status, data: 'Löschen erfolgreich'}
 }

 export const  loginUser = async ({commit, state}, payload) => {
   commit('LOG', {method: 'loginUser', data: payload.USER_CD})
   
   return new Promise((resolve, reject) => {
      if (!payload || !payload.USER_CD ) return reject(error_codes.instance_invalid)
      const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
      USER_VIEW.read({USER_CD: payload.USER_CD})
      .then(res => {
         if (res.data.length === 0) return reject(error_codes.user_does_not_exist)
         const USER = res.data[0]
         if (USER.PASSWORD_CHAR === payload.PASSWORD_CHAR || USER.PASSWORD_CHAR === hash_salt_password(payload.PASSWORD_CHAR)) {
            commit('USER_SET', USER)
            loadProvider({commit, state}, USER.USER_CD)
            resolve(state.ENV.text.msg.action_successful)
         } else return reject(error_codes.user_invalid_password)
      }).catch(err=> reject(err))
      
   })
}

// funtion to load the provider data and set it to the store
export const  loadProvider = async ({commit, state}, payload) => {
   commit('LOG', {method: 'loadProvider', data: payload})
   if (!payload) return {status: false, data: 'Ungültige Daten'}
   const PROVIDER_VIEW = new View_Provider(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
   const res = await PROVIDER_VIEW.read({PROVIDER_ID: payload})
   if (res.data.length === 0) return {status: false, data: 'Ungültige Daten'}
   commit('PROVIDER_PINNED_SET', res.data[0])
}
