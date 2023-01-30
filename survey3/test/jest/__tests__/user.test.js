// Run Test with:
// npm run test:unit test/jest/__tests__/user.test.js 

import { USER } from "../../../src/tools/User"


describe('User Class', () => {

  it('can use empty User', () => {
    expect(USER.uid).toBe(undefined)
  });

  it('can create new User', () => {
    USER.create()
    expect(USER.uid).not.toBe(undefined)
    expect(USER.keyPair).not.toBe(undefined)
  });

  it('can export User', () => {
    const exp = USER.export();
    const exp_user = JSON.parse(exp)
    USERDATA = exp_user
    expect(exp_user.uid).not.toBe(undefined)
  });

  it('can import User', () => {
    USER.clear()
    expect(USER.uid).toBe(undefined)
    USER.import(JSON.stringify(USERDATA))
    expect(USER.uid).toBe(USERDATA.uid)
  });

})


var USERDATA = {}