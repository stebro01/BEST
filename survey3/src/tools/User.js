import { generateKeys, uuidv4 } from "./hhash"

class User {

    _keyPair = undefined
    _uid = undefined
    _email = undefined
    _notion = {
      db: undefined,
      token: undefined
    }

    constructor(val) {
      console.log('create User')
      if (val === undefined) return
      this.import(val)
    }

    // GETTER AND SOME SETTER
    get uid() { return this._uid }
    set uid(val) { this._uid = val }

    get keyPair() { return this._keyPair }
    set keyPair(val) { this._keyPair = val }

    get email() { return this._email }
    set email(val) { this._email = val }

    get notion_db() { return this._notion.db }
    set notion_db(val) { this._notion.db = val }

    get notion_token() { return this._notion.token }
    set notion_token(val) { this._notion.token = val }

    // PUBLIC FUNCTIONS

    clear() {
      this.keyPair = undefined
      this.uid = undefined
      this.email = undefined
      this.notion_db = undefined
      this.notion_token = undefined
    }

    create() {
      this.clear();
      this.uid = uuidv4();
      this.keyPair = generateKeys();
      
    }

    export() {
      const exp = {
        keyPair: this.keyPair,
        uid: this.uid,
        email: this.email,
        notion_db: this.notion_db,
        notion_token: this.notion_token
      }

      return JSON.stringify(exp)
    }

    import(jsondata) {
      // console.log('import: ' + jsondata)
      if (jsondata === undefined || jsondata === null) return false
      const data = JSON.parse(jsondata)
      // console.log(data)
      if (data.uid === undefined || data.keyPair === undefined) {
        console.info('JSON data not valid!')
        return false
      }

      this.clear();
      this.uid = data.uid
      this.keyPair = data.keyPair
      this.email = data.email
      this.notion_db = data.notion_db
      this.notion_token = data.notion_token
      
    }

    
  }

export const USER = new User()
