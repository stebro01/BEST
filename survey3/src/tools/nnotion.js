import axios from 'axios'
import {log} from '../../../db/app/src/tools/logger.js'
// KLASSE FUER API NOTION
// ICH verwende hier meine eigene REST-API für die Kommunikation mit Notion: http://www.jenai.de/api/notion <= Authentifizierung mit api_token
// Verwendung:
// NOTION = new nnotion()
// NOTION.init({token: 'token from NOTION integrator', link: 'link to NOTION DB'})
// NOTION.check() > returns true, wenn alle Werte korrekt und eine get Anfrage funktioniert hat
// NOTION.get() > gibt den Table zurück
// NOTION.post(payload) => payload = {feldname1: value, feldname2: value}
//                      es gibt eine wrapper Funktion prepare_data(payload), die ausgehend von den Feldern aus dem Table (mit get() erhalten) vergleicht und nur gültige Werte verwendet
//                      unterstützt werden: select, rich_text, number, title, date
// NOTION.quest() > gibt den Table zurück

class nnotion {
  // SOME PRIVATE DATA
  #api_token = 'sjdlfj39039ujkelfjekl9393' //token zum Authentifizieren mit der REST API
  #notion_string_start = 'https://www.notion.so/'
  #notion_string_end = '?v='
  #api_link = 'http://www.jenai.de/api/notion'

  // GLOBAL DATA
  db_id = undefined //ie: "6cc26a44-9a1b-4069-856d-c1f38923fbf5"
  bearer_token = undefined //ie: 'Bearer secret_LtVepME0JezmnphF4O7eAlc9nbtXtwr2Zp8enNSvdqV'
  data_model = undefined

  constructor() {
    // do nothing
  }

  // INIT WITH A TOKEN AND A LINK
  async init(payload) {
    if (payload === undefined) return false
    if (payload.link === undefined || payload.token === undefined) return false

    this.db_id = this.link2id(payload.link)
    this.bearer_token = get_bearer_token(payload.token)
    if (this.db_id === undefined || this.bearer_token === undefined) return false

    // LOAD THE DATA MODEL
    const data = await this.get()
    this.data_model = data.data
    return true
  }

  // CHECK THE TOKENS / LINK
  check() {
    if (this.db_id === undefined || this.bearer_token === undefined || this.data_model === undefined) return false
    return true
  }

  // GET DATA FROM DB
  async get() {
    if (this.db_id === undefined || this.bearer_token === undefined) return undefined

    return await get_axios({
      id: this.db_id,
      token: this.bearer_token,
      data: '',
      api_token: this.#api_token,
      api_link: this.#api_link
    })
  }

  // SEND DATA TO DB
  async post(data) {
    // SOME CHECKS
    if (this.check() === false) return undefined
    if (typeof data === undefined) return undefined
    // EVERYTHIN IS OK
    log({message: 'nnotion>post'})

    // PREPARE THE DATA ...
    if (this.check() === false) return undefined

    const some_data = prepare_data(data, this.data_model, this.db_id)

    // NOW PUSH THE DATA
    return await post_axios({
      data: some_data, 
      id: this.db_id,
      token: this.bearer_token,
      api_token: this.#api_token,
      api_link: this.#api_link
    })
  }

   // GET DATA FROM DB
   async query(query) {
    if (this.db_id === undefined || this.bearer_token === undefined) return undefined

    return await query_axios({
      id: this.db_id,
      token: this.bearer_token,
      data: query,
      api_token: this.#api_token,
      api_link: this.#api_link,
      query: true
    })
  }

  // LINK2ID => in: notion-db link => out: db id
  link2id(link) { // this function can transform a notion table link to an id
    // iE: "https://www.notion.so/98b5242cdd734f92902af5d8a59976e1?v=8a95249a47704b428e4ead061f318b70" => '98b5242cdd734f92902af5d8a59976e1'
    if (link === undefined) return undefined
    const pos1 = link.indexOf(this.#notion_string_start)
    const pos2 = link.indexOf(this.#notion_string_end)
    if (pos1 < 0 || pos2 < 0) return undefined
    const res = link.substring(this.#notion_string_start.length, pos2)
    return res
  }

}

export const NOTION = new nnotion()

async function post_axios(payload) {
  // payload.data.properties.json = undefined
  var config = {
    method: 'post',
    url: `${payload.api_link}?token=${payload.token}&api_token=${payload.api_token}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(payload.data)
  };

  return new Promise((res, rej) => {
    axios(config)
      .then(function (response) {
        // log({message: "post_axios", data: response});
        res(response)
      })
      .catch(function (error) {
        log({error: "post_axios", data: error});
        rej(error)
      });
  })
}

// SOME PRIVATE FUNCTIONS ETC
function get_axios(payload) {
  var config = {
    method: 'get',
    url: `${payload.api_link}`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: payload
  };
  return new Promise((res, rej) => {
    axios(config).then(data => res(data)).catch(err => rej(err))
  })
}

// SOME PRIVATE FUNCTIONS ETC
  // bearer_token: in: Notion-TOKEN, out: 'Bearer ' + token
function get_bearer_token(token) {
    return 'Bearer ' + token
  }

function query_axios(payload) {
  var config = {
    method: 'get',
    url: `${payload.api_link}`,
    headers: {
      'Content-Type': 'application/json',
    },
    params: payload
  };

  return new Promise((res, rej) => {
    axios(config).then(data => res(data)).catch(err => rej(err))
  })
}

// PREPARE THE DATA
function prepare_data(data_input, data_model, db_id) {

  // some rudimentaery data
  const data = {
    "parent": {
      "database_id": db_id
    },
    "properties": {
    }
  }

  var field_str = ''
  const json_data = JSON.parse(data_input)

  console.log(data_model)

  // ADD THE PID
  field_str = 'PID_quest'
  if (item_is_in_model(field_str, data_model)) add_key_to_model(data, json_data.info.PID, field_str, data_model)
  
  // KATEGORY
  field_str = 'Kategorie'
  if (item_is_in_model(field_str, data_model)) add_key_to_model(data, json_data.info.label, field_str, data_model)

  // ANNOTATION
  field_str = 'annotation'
  if (item_is_in_model(field_str, data_model)) add_key_to_model(data, json_data.info.title, field_str, data_model)
  
  // DIV
  field_str = 'json'
  if (item_is_in_model(field_str, data_model)) add_key_to_model(data, json_data.cda.text.div, field_str, data_model)
  

  // // DATE
  // field_str = 'date'
  // if (item_is_in_model(field_str, data_model)) add_key_to_model(data, json_data.cda.date, field_str, data_model)

  // // MORE FIELDS ...
  // field_str = 'type'
  // field_str = 'value'
  // field_str = 'json'
  // field_str = 'date'

  console.log(data)

  return data
}

function add_key_to_model(data, entry, entry_tag, data_model) {//gets input from prepare_data(data=> data structure for output, entry => input data, entry_tag => entry tag)
  const type = data_model.properties[entry_tag].type
  switch (type) {
    // title
    case 'title': 
        if (typeof entry === 'number') entry = entry.toString()
        data.properties[entry_tag] = {
          "type": "title",
          "title": [{
            "type": "text",
            "text": {"content": entry}
          }]
        }
        break
        // rich_text
      case 'rich_text':
        if (typeof entry === 'string') {
          data.properties[entry_tag] = {
            "type": "rich_text",
            "rich_text": [{
              "type": "text",
              "text": {"content": entry}
            }]
          }
        }
        break

        // select
      case 'select': 
        if (typeof entry === 'string') data.properties[entry_tag] = {
          "type": "select",
          "id": "select",
          "select": {
            "name": entry
          }
        }
        break

      // number
      case 'number': 
        if (typeof entry === 'number') data.properties[entry_tag] = {
          "type": "number",
          "id": "value",
          "number": entry
        }
        break

      //date
      case 'date':
        data.properties[entry_tag] = {
          "type": "date",
          "date": {
            "start": entry, //format should be: "2021-05-13"
            "end": null
          }
        }
        break
      // default
    default:
      console.info('entry: ' + entry + 'type: ' + type)
      console.info(`add_key_to_model: ${type} => not supported`)
      break
  }
  return data

}

// PRIVATE FUNCTIONS PRIVATE FUNCTIONS PRIVATE FUNCTIONS
function get_keys_in_model(data_model) {
  if (data_model === undefined) return undefined
  return Object.keys(data_model.properties)
}

function item_is_in_model(item, data_model){
  const keys = get_keys_in_model(data_model)
  if (keys.indexOf(item) >= 0) return true
  return false
}

function compress(data) {
  data = data.replaceAll('label', 'l')
  data = data.replaceAll('value', 'v')
  return data
}