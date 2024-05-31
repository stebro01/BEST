import ENV from "../../public/env.json";
import { SETTINGS } from "src/classes/Settings";
import { datenow_isostring } from "src/tools/mydate";

SETTINGS.init();
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
    UPLOAD_ID: "79190712",
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
      },
      SQL_STATEMENT: undefined, //expect a string
      SQL_OPTIONS: {
        patient: {
          PATIENT_CD: {
            check: false,
            value: null,
          },
          SEX_CD: {
            check: false,
            value: null,
          },
          BIRTH_DATE: {
            check: false,
            start: "1900-01-01",
            end: datenow_isostring(),
          },
        },
        visit: {
          START_DATE: {
            check: false,
            start: "1900-01-01",
            end: datenow_isostring(),
          },
          VISIT_BLOB: {
            check: false,
            value: null,
          },
        },
      },
      XLS_VIEWS: {
        count: 0, //number of patients to load in total
        offset: 2, //number of patients to load at once
        index: 0, //
        current_count: 0,
        offset_min: 0,
        offset_max: 2,
      },
    },
  };
}
