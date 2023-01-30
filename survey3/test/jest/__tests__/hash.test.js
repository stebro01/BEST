// Run Test with:
// npm run test:unit test/jest/__tests__/hash.test.js 

import { sign, generateKeys, verify } from "../../../src/tools/hhash"

const data = {
  CDA: {
    name: "ste",
    age: 10,
    master: 'aslkdfjlkasdjfklsdjfflkasjfdlkejlksefj09u93f093fjf'
  },
  hash: undefined
}

describe('Hash some JSON Data', () => {

  it('can can create some keys', () => {
    const keyPair = generateKeys()
    expect(keyPair.privateKey).not.toBe(undefined)
    expect(keyPair.publicKey).not.toBe(undefined)
  });

  it('can can hash some data', () => {
    const keyPair = generateKeys()
    data.hash = sign(data.CDA, keyPair.privateKey, keyPair.publicKey)
    expect(data.hash).not.toBe(undefined)
  });

  it('can can verify some data', () => {
    // create data hash with new keys
    const keyPair = generateKeys()
    data.hash = sign(data.CDA, keyPair.privateKey, keyPair.publicKey)

    // verify the data
    const isVerified = verify(data.CDA, data.hash)
    expect(isVerified).toBe(true)
    // console.log(`Is signature verified: ${isVerified}`);
  });

  it('can can detect data alterations', () => {
    // create data hash with new keys
    const keyPair = generateKeys()
    data.hash = sign(data.CDA, keyPair.privateKey, keyPair.publicKey)

    const tmpData = JSON.parse(JSON.stringify(data.CDA))
    tmpData.age = 9

    // verify the data
    const isVerified = verify(tmpData, data.hash)
    expect(isVerified).toBe(false)
  });
})
