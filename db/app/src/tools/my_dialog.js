import { Dialog } from 'quasar'

/**
 * Einfacher Dialog mit Quasar, der das Problem des Fokus (https://github.com/electron/electron/issues/19977) umgeht
 * @param {string} message 
 * @returns Promise: true (ok) OR false
 * @example
 * import { my_confirm } from "src/tools/my_dialog";
 * if (! await my_confirm(`Soll der Eintrag wirklich gelöscht werden?`)) return
 */

export function my_confirm(message) {
    return new Promise((res, rej) =>{
        Dialog.create({title: '', message: message, cancel: true})
        .onOk(() => {return res(true)})
        .onCancel(() => {return res(false)})
        .onDismiss(() => {return res(false)})
    })
    
}