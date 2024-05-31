// https://www.geeksforgeeks.org/node-js-crypto-verify-function/
// https://www.programmersought.com/article/92151699932/
// https://www.npmjs.com/package/jsencrypt
// https://www.npmjs.com/package/jsrsasign

import rs from "jsrsasign";
import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

const LENGTH = 512;

// USAGE:
// keyPair = generateKeys()
// const hash = sign(JSONDATA, keyPair.privateKey, keyPair.publicKey)
// const isVerfied = verify(JSONDATA, hash)

export function generateKeys() {
  //    log({message: 'generateKeys'})
  var kp = rs.KEYUTIL.generateKeypair("RSA", LENGTH);

  const keyPair = {
    privateKey: rs.KEYUTIL.getPEM(kp.prvKeyObj, "PKCS8PRV"),
    publicKey: rs.KEYUTIL.getPEM(kp.pubKeyObj),
  };

  return keyPair;
}

export function sign(jsondata, privateKey, publicKey) {
  var signatory = new JSEncrypt();
  signatory.setPrivateKey(privateKey);
  var signature = signatory.sign(JSON.stringify(jsondata), CryptoJS.SHA256);
  // console.log('sign: '+ signature)
  return {
    signature: signature,
    method: "SHA256",
    publicKey: publicKey,
  };
}

export function verify(jsondata, hash) {
  var verify = new JSEncrypt();
  verify.setPublicKey(hash.publicKey);
  var isVerified = verify.verify(
    JSON.stringify(jsondata),
    hash.signature,
    CryptoJS.SHA256
  );
  return isVerified;
}

// https://jamesrwilliams.ca/posts/javascript-encryption-with-rsa-and-aes
// https://stackoverflow.com/questions/22875419/cryptojs-how-to-generate-aes-passphrase/22876250#22876250
export function encrypt(data, publicKey) {
  // log({message: 'encrypt'})

  // 1. cipher the data using a secretKEY
  var secret_key = create_aes_key();
  var encrypted_data = CryptoJS.AES.encrypt(data, secret_key).toString();

  // 2. RSE encrypt the secret_key using a publicKEY
  var enc = new JSEncrypt();
  enc.setKey(publicKey);
  var encrypted_key = enc.encrypt(secret_key);

  return { encrypted_data, encrypted_key };
}

function create_aes_key() {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var passphrase = CryptoJS.lib.WordArray.random(128 / 8).toString();
  var key128Bits = CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 128 / 32,
  }).toString();
  return key128Bits;
}

export function decrypt(payload, privateKey) {
  // log({message: 'decrypt'})

  // 1. DECRYPT the KEY
  var dec = new JSEncrypt();
  dec.setKey(privateKey);
  var decrypted_key = dec.decrypt(payload.encrypted_key);
  if (decrypted_key === null) {
    log({ message: "failed" });
    return undefined; //could not decrypt key
  }

  // 2. DECIPHER the DATA using the decrypted KEY
  var bytes = CryptoJS.AES.decrypt(payload.encrypted_data, decrypted_key);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  log({ message: "success" });
  return originalText;
}

// SOME More FUNCTIONS
export function uuidv4() {
  // https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
