
import { View_User} from 'src/classes/View_User'
import { error_codes } from 'src/tools/logger'

import { hash_salt_password } from "src/tools/passwort_salter"

 export const  addUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'addUser', data: payload})
    if (!payload || !payload.USER_CD || !payload.PASSWORD_CHAR) return {status: false, data: 'Ungültige Daten'}
    if (payload.PASSWORD_CHAR) payload.PASSWORD_CHAR = hash_salt_password(payload.PASSWORD_CHAR)

    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await USER_VIEW.create(payload)
    return res
 }

 export const  updateUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'updateUser', data: payload})
    if (!payload || !payload.where || !payload.set) return {status: false, data: 'Ungültige Daten'}
    if (payload.set.PASSWORD_CHAR) payload.set.PASSWORD_CHAR = hash_salt_password(payload.set.PASSWORD_CHAR)

    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await USER_VIEW.update(payload)
    return res
 }

 export const  deleteUser = async ({commit, state}, payload) => {
    commit('LOG', {method: 'deleteUser', data: payload})
    if (!payload || !payload.USER_ID ) return {status: false, data: 'Ungültige Daten'}

    const USER_VIEW = new View_User(window.electron.dbman, state.SETTINGS.data.filename.path, state.UPLOAD_ID) 
    const res = await USER_VIEW.delete(payload)
    return res
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
            resolve(state.ENV.text.msg.action_successful)
         } else return reject(error_codes.user_invalid_password)
      }).catch(err=> reject(err))
      
   })
   

 
}