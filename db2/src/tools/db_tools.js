import * as HRI from 'human-readable-ids'

/**
 * CREATE SOME HUMAN READABLE IDs
 * @returns {string} - ie. empty-grasshopper-84
 */
export function hri() {
    return HRI.hri.random()
}
