import ENV from '../../public/env.json'
import {SETTINGS} from 'src/classes/Settings'

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
      SESSION_MULTIEDIT: undefined
    }
  }