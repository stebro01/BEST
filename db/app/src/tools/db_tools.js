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
