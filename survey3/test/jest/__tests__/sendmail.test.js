/* eslint-disable jest/expect-expect */

// Run Test with:
// npm run test:unit test/jest/__tests__/sendmail.test.js

import { sendMail } from "src/tools/mail";

describe('SendMail', () => {

  it('can send some mail', async () => {
    const res = await sendMail({ email: 'stefan.brodoehl@gmail.com', data: 'test' });
    console.log(res)

  });


})
