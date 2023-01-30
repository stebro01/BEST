// Run Test with:
// npm run test:unit test/jest/__tests__/notion_api.test.js 

import {
  NOTION
} from "../../../src/tools/nnotion"

const biomag_token = "secret_Aj82oDGkp6lUL7tPpGru22izDDFiNkquMRK1Cw5DNwv"
const table_link = "https://www.notion.so/98b5242cdd734f92902af5d8a59976e1?v=8a95249a47704b428e4ead061f318b70"

jest.setTimeout(10000);

describe('NOTION JS is found an works properly', () => {

  // GENERAL FUNCTOIN
  it('notion is a valid OBJECT', () => {
    expect(NOTION.check()).toBeFalsy()
  });

  // GET / POST with not properly iniatliazed object will return undefed
  it('NOTION without proper initialization cannot get/send', async () => {
    expect(NOTION.check()).toBeFalsy()
    expect(await NOTION.get()).toBe(undefined)
    expect(await NOTION.post({
      somedata: 123
    })).toBe(undefined)
  });

  // INITIALISE DATA
  it('can init the NOTION object correctly', async () => {
    // falsy init
    expect(await NOTION.init(undefined)).toBeFalsy()
    expect(await NOTION.init('some random string')).toBeFalsy()

    //wrong link
    expect(await NOTION.init({
      token: '23432',
      link: 'asldkfje'
    })).toBeFalsy()

    //correct data
    expect(await NOTION.init({
      token: biomag_token,
      link: table_link
    })).toBeTruthy()
    expect(NOTION.db_id).toBe('98b5242cdd734f92902af5d8a59976e1')
    expect(NOTION.bearer_token).toBe('Bearer ' + biomag_token)
    expect(NOTION.check()).toBeTruthy()
  });

  // PREPARE DATA
  it('prepare the data correctly', () => {
    expect(NOTION.prepare_data()).toBe(undefined)
    expect(NOTION.prepare_data('hi')).toBe(undefined)
    const data = NOTION.prepare_data({
      PID: 12020,
      PID_quest: 332
    })
    expect(data.properties.PID_quest.title[0].text.content).toBe('332')
    const data2 = NOTION.prepare_data({
      PID_quest: 332,
      json: '{some json data ...}',
      value: 30,
      type: 'sum',
      Kategorie: 'sf36',
      annotation: 'some annotations ...'
    })
    expect(data2.properties.value.number).toBe(30)
    expect(data2.properties.PID_quest.title[0].text.content).toBe('332')
    expect(data2.properties.json.rich_text[0].text.content).toBe('{some json data ...}')
    expect(data2.properties.type.select.name).toBe('sum')
  });

  // GET DAATA
  it('GET with correct initialized Object works fine', async () => {
    expect(NOTION.check()).toBeTruthy()
    var res = await NOTION.get()
    expect(res.status).toBe(200)
  });

  // QUERY DAATA
  it('QUERY with correct initialized Object works fine', async () => {
    expect(NOTION.check()).toBeTruthy()
    var res = await NOTION.query()
    expect(res.status).toBe(200)
  });

  // SEND DATA WORKS
  it('POST: works with real data', async () => {
    const somedata = {
      PID_quest: 332,
      json: '{some json data ...}',
      value: 30,
      type: 'sum',
      Kategorie: 'sf36',
      annotation: 'some annotations ...',
      date: '2021-05-21'
    }
    const res = await NOTION.post(somedata)
    expect(res.status).toBe(200)
  });

})
