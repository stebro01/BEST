// angabe des Namens> quest_XXXXXX.json >> XXXXX ist der Name
const quest = [
  "6mwt",
  "abc",
  "aes",
  "badl",
  "brain_tremor",
  "bdi2",
  "bfi",
  "bfi10",
  "biomag_fw",
  "biomag_handedness",
  "bsi",
  "bss",
  "caide",
  "cdq24",
  "cfqg",
  "cfsme",
  "csas_e",
  "daily_activity",
  "demenz_biomag01",
  "dex_female",
  "dex_male",
  "dex_selbstbeurteilung",
  "dnms",
  "dynamic_gait_index",
  "ecoq",
  "eq5d",
  "ess",
  "fallstab",
  "fas",
  "feda",
  "fim",
  "fes",
  "flei",
  "fugl_mayr",
  "gas",
  "gds",
  "gdsrs",
  "hadsd",
  "health49a",
  "health49bd",
  "hoehnyahr",
  "hlq",
  "iqcode",
  "klein",
  "mcgill",
  "mfq",
  "moca",
  "mrs",
  "mwtb",
  "mymop2_pre",
  "mymop2_followup",
  "nihs",
  "nmsquest",
  "paq_50plus",
  "panas",
  "park_move",
  "pd_general",
  "pdq8",
  "pdq39",
  "phq9",
  "psqi",
  "quiprs",
  "fact",
  "ptss14", "ptss14_cov2",
  "sf36",
  "sf36_mod",
  "shapsd",
  "sus",
  "tinetti",
  "tug",
  "twstrs",
  "updrs_1",
  "updrs_2",
  "updrs_3",
  "updrs_4",
  "whoqol",
  "test"
]

export function QUESTS() {
  return quest.sort()
}

export const quest_template = {
  title: null,
  short_title: null,
  description: null,
  coding: {
    system: "http://snomed.info/sct",
    code: "225398001",
    display: "Blepharospasm severity scale"
  },
  manual: null,
  keywords: null,
  ref: null,
  items: [],
  results: { method: "sum" }
}

export const item_template = {
  "label": "",
  "id": null,
  "coding": { "display": "Untersuchung", "code": "302199004", "system": "http://snomed.info/sct" },
  "value": null,
  "type": "text",
  "inline": false,
  "force": false
}

export const item_types = ["text", "number", "date", "time", "radio", "checkbox", "slider", "multiple_radio", "separator"]
export const result_types = ["nothing", "sum", "count", "avg", "count_targets", "ids"]
export const result_method_templates = {
  targets: { label: 'correct', value: 1, score: 1 },
  scoring: { id: [], value: [], score: [] },
  domaine: { label: "sum", id: [], method: "sum" },
  evaluation: { range: [0, 12], label: "klinisch unauffällig" }


}
