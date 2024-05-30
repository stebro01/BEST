import CryptoJS from 'crypto-js'

const mySalt = 'lksjdfklekj30023--!!'

/**
 * 
 * @param {string} password 
 * @returns {string} - salted and hashed Passwort
 */
export function hash_salt_password(password) {
    var algo = CryptoJS.algo.SHA256.create();
    algo.update(password, 'utf-8');
    algo.update(CryptoJS.SHA256(mySalt), 'utf-8');
    var drowssap = algo.finalize().toString(CryptoJS.enc.Base64);
    return drowssap
}