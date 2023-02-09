const {log} = require('src/tools/logger')

/**
 * @class
 * @description Klasse für die Verwaltung der APP-Einstellungen im LocalStorage
 * Gespeichert werden: 
 * - Nutzerdaten
 * - Anfragen
 * - Einstellungen etc.
 */
class Settings {
    _data = undefined

    storage_name = 'dbbest_settings'

    constructor() {

    }

    /**
     * @description Initialisiert die Settings
     * @example const SETTINGS = new Settings()
     * SETTINGS.init()
     */
    init() {
        log({method: 'Settings', message: 'init'})
        // 1. lade alte Einstellungen
        this.load()
        if (this._data !== undefined) return true

        // 2. Stelle Standardeinstellungen her
        this.clear()
        // 3. Speichere Einstellungen
        this.save()

    }

    /**
     * @description Lade Einstellungen aus dem Speicher
     * @example const SETTINGS = new Settings()
     * SETTINGS.load()
     */
    load() {
        log({method: 'Settings', message: 'load'})
        const data = localStorage.getItem(this.storage_name)
        if (!data) return false
        this._data = JSON.parse(data)
    }

    /**
     * @description Speichere Einstellungen in den lokalen Speicher
     * @example const SETTINGS = new Settings()
     * SETTINGS.save()
     */
    save() {
        log({method: 'Settings', message: 'save'})
        if (!this._data) return false
        localStorage.setItem(this.storage_name, JSON.stringify(this._data))
    }

    /**
     * @description Leert die Einstellungen
     */
    clear() {
        const data = { //values should be initialized with null!!!
            filename: null,
            user: null,
            user_type: null,
            show_hidden: false,
            search: null
        }
        this._data = data
    }

    /**
     * @description GETTER für die Einstellungen
     * @returns Object oder undefined
     */
    get data() {
        return this._data
    }

    /**
     * @example SETTINGS.data = {label: 'user', value: './db.db'}
     */
    set data(payload) {
        log({method: 'Settings', message: 'set data', data: payload})
        if (!payload) return false
        // if (this._data[payload.label] === undefined) return false
        this._data[payload.label] = payload.value
        this.save()
    }

}

export const SETTINGS = new Settings()
