import ENV from '../../public/env.json'
import { SETTINGS } from 'src/classes/Settings'

SETTINGS.init()
export default function () {
  return {
    ENV,
    SETTINGS,
    USER: undefined,
    connected: false,
    QUESTS_PRESETS: undefined,
    PATIENT_PINNED: undefined,
    VISIT_PINNED: undefined,
    PROVIDER_LIST: undefined,
    PROVIDER_PINNED: undefined,
    OBSERVATION_PINNED: undefined,
    UPLOAD_ID: '79190712',
    IS_ELECTRON: false,
    SESSION_MULTIEDIT: undefined,
    SHOW_SPINNER: true,
    PATIENT_VIEW: {
      protected_mode: false, //boolean
      hiden_mode: false, //boolean
      layout_changed: false, //boolean
      LAYOUTS: undefined, // expect an array
      active_layout: undefined, //expect an object
      active_layout_value: undefined, //expect a string
      EDIT: {
        CATEGORIES: undefined, //expect an array
        UNIT_CD: undefined, //expect an array of objects
      }
    }
  }
}