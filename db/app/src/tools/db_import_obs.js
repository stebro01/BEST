import { log, error_codes } from "./logger";
import { unstringify_json } from "src/classes/sqltools";
/**
 *
 * @param {*} OBSERVATIONS
 * @param {*} VIEW_CONCEPT
 * @param {object} options - ie: {check_for_doubles: true} => ruft noch die Funktino CheckObservationsForDoubles auf und überpruuft die Observations nach Doppelungen
 * @returns {object} List auf Observatinos
 * const db_fn = './test/jest/mockups/testdb.db'
 * const dbman = require('../../../src-electron/dbman')
 * const VIEW_CONCEPT = new View_Concept(dbman, db_fn)
 * //READ DATA
 * const csv = fs.readFileSync("/Users/ste/MyProjects/dbBEST/app/test/jest/mockups/OBS_MULTIPLE_PATIENTS.csv", 'utf-8')
 * // KONVERT TO JSON
 * var OBS = importCSV(csv)
 * // BEARBEITE DIE OBSERVATIONS
 * OBS = await Process_Observations(OBS, VIEW_CONCEPT)
 */
export async function Process_Observations(OBSERVATIONS, VIEW_CONCEPT) {
  if (!OBSERVATIONS) return undefined;
  //erzeuge ers eine List mit CONCEPT_CDs damit ich alle aufeinmal auflösen kann und keine Doppelten Abfragen notwendig sind
  const CONCEPT_LIST = prepare_CONCEPT_LIST(OBSERVATIONS);
  if (!CONCEPT_LIST) return undefined;
  //frage jetzt die Conzepts in der DB ab
  const CONCEPT_LIST_RESOLVED = await resolve_CONCEPT_LIST(
    CONCEPT_LIST,
    VIEW_CONCEPT
  );
  if (!CONCEPT_LIST) return undefined;
  //gehe jetzt durch alle OBSERVATIONS und SCHAUE NACH DEN CONCEPTS
  resolve_OBSERVATIONS(OBSERVATIONS, CONCEPT_LIST_RESOLVED);

  return OBSERVATIONS;
}

async function resolve_CONCEPT_LIST(CONCEPT_LIST, VIEW_CONCEPT) {
  const CONCEPT_LIST_RESOLVED = [];
  for (let concept of CONCEPT_LIST) {
    await _rcl(concept, CONCEPT_LIST_RESOLVED, VIEW_CONCEPT);
  }

  //return
  return CONCEPT_LIST_RESOLVED;
}

async function _rcl(concept, CONCEPT_LIST_RESOLVED, VIEW_CONCEPT) {
  let res = await VIEW_CONCEPT.read({ ...concept });
  if (res.data.length > 0) CONCEPT_LIST_RESOLVED.push(res.data[0]);
  let c = res.data[0];
  if (c === undefined) return;
  if (c.VALTYPE_CD === "S") {
    res = await VIEW_CONCEPT.read({
      CONCEPT_PATH: `${c.CONCEPT_PATH}\\LA`,
      _like: true,
    });
    if (res.status) res.data.forEach((d) => CONCEPT_LIST_RESOLVED.push(d));
  }

  //RELATED_CONCEPTS ?
  if (c.RELATED_CONCEPT) {
    let obj = CONCEPT_LIST_RESOLVED.find(
      (el) => el.CONCEPT_CD === c.RELATED_CONCEPT
    );
    if (!obj)
      await _rcl(
        { CONCEPT_CD: c.RELATED_CONCEPT },
        CONCEPT_LIST_RESOLVED,
        VIEW_CONCEPT
      );
  }
}

function prepare_CONCEPT_LIST(observation) {
  const CONCEPT_LIST = [];
  observation.forEach((obs) => {
    if (obs.CONCEPT_CD) {
      let value = undefined;
      if (obs.CONCEPT_CD.value) value = obs.CONCEPT_CD.value;
      else value = obs.CONCEPT_CD;
      let obj = CONCEPT_LIST.find((el) => el.CONCEPT_CD === value);
      if (!obj) CONCEPT_LIST.push({ CONCEPT_CD: value });
    }
  });
  return CONCEPT_LIST;
}

function resolve_OBSERVATIONS(observation, CONCEPT_LIST) {
  observation.forEach((obs) => {
    if (obs.CONCEPT_CD) {
      let value = undefined;
      if (obs.CONCEPT_CD.value) value = obs.CONCEPT_CD.value;
      else value = obs.CONCEPT_CD;
      let obj = CONCEPT_LIST.find((el) => el.CONCEPT_CD === value);
      if (obj) {
        obs.CONCEPT_CD = obj.CONCEPT_CD;
        obs.CONCEPT_PATH = obj.CONCEPT_PATH;
        obs.RELATED_CONCEPT = obj.RELATED_CONCEPT;
        obs.CONCEPT_NAME_CHAR = obj.NAME_CHAR;
        if (obs.VALTYPE_CD !== obj.VALTYPE_CD) {
          obs.VALTYPE_CD = obj.VALTYPE_CD;
          //CHANGE OF VALTYPE: > F
          if (obj.VALTYPE_CD === "F") {
            if (
              obs.NVAL_NUM === 0 ||
              (obs.TVAL_CHAR &&
                typeof obs.TVAL_CHAR === "string" &&
                obs.TVAL_CHAR.toLowerCase() === "no")
            ) {
              obs.TVAL_CHAR = "SCTID: 373067005";
              obs.TVAL_RESOLVED = "No";
            } else if (obs.NVAL_NUM === 1) {
              obs.TVAL_CHAR = "SCTID: 373066001";
              obs.TVAL_RESOLVED = "Yes";
            }
            obs.NVAL_NUM = undefined;
          }
          // CHANGE: > S
          else if (obj.VALTYPE_CD === "S") {
            let obj = CONCEPT_LIST.find(
              (el) => el.CONCEPT_CD === obs.TVAL_CHAR
            );
            if (obj) obs.TVAL_RESOLVED = obj.NAME_CHAR;
            // der NAME_CHAR ist bereits ein gueltiger Wert als CONCEPT_CD
            else {
              //muss noch suchen
              if (obs.TVAL_CHAR) {
                //suche zunaechst in der vorbereiteten Liste ob Pfad enthalten und der Wert stimmen
                obj = CONCEPT_LIST.find(
                  (el) =>
                    el.CONCEPT_PATH.includes(obs.CONCEPT_PATH) &&
                    el.NAME_CHAR.toLowerCase() === obs.TVAL_CHAR.toLowerCase()
                );
                if (obj) {
                  obs.TVAL_CHAR = obj.CONCEPT_CD;
                  obs.TVAL_RESOLVED = obj.NAME_CHAR;
                } //der Wert konnte nicht gefunden werden
                else {
                  //ist ein RELATED_CONCEPT vorhanden?
                  if (obs.RELATED_CONCEPT) {
                    let related_obj = CONCEPT_LIST.find(
                      (el) => el.CONCEPT_CD === obs.RELATED_CONCEPT
                    ); //suche das relate element in der CONCEPT_LIST
                    if (related_obj) {
                      obj = CONCEPT_LIST.find(
                        (el) =>
                          el.CONCEPT_PATH.includes(related_obj.CONCEPT_PATH) &&
                          el.NAME_CHAR.toLowerCase() ===
                            obs.TVAL_CHAR.toLowerCase()
                      );
                      if (obj) {
                        obs.TVAL_CHAR = obj.CONCEPT_CD;
                        obs.TVAL_RESOLVED = obj.NAME_CHAR;
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          if (obs.VALTYPE_CD === "F") {
            if (obs.TVAL_CHAR) {
              if (typeof obs.TVAL_CHAR === "string") {
                if (obs.TVAL_CHAR.toLowerCase() === "no") {
                  obs.TVAL_CHAR = "SCTID: 373067005";
                  obs.TVAL_RESOLVED = "No";
                } else if (obs.TVAL_CHAR.toLowerCase() === "yes") {
                  obs.TVAL_CHAR = "SCTID: 373066001";
                  obs.TVAL_RESOLVED = "Yes";
                }
              }
            } else if (obs.NVAL_NUM === 1 || obs.NVAL_NUM === 0) {
              if (obs.NVAL_NUM === 1) {
                obs.TVAL_CHAR = "SCTID: 373066001";
                obs.TVAL_RESOLVED = "Yes";
              } else {
                obs.TVAL_CHAR = "SCTID: 373067005";
                obs.TVAL_RESOLVED = "No";
              }
            }
          }
        }
      }
    }
  });
}

/**
 * @description speichert den Patienten komplett ab
 * @param {array} PATIENT
 * @param {function} VIEW_VISIT => new View_Visit(dbman, db_fn)
 * @param {function} VIEW_OBSERVATION => new View_Observation(dbman, db_fn)
 * @returns
 */
export async function Save_PatientVisitObservation(
  PATIENT,
  VIEW_VISIT,
  VIEW_OBSERVATION
) {
  if (!PATIENT) return { status: false, error: error_codes.invalid_payload };

  const patient = { PATIENT_NUM: PATIENT.PATIENT_NUM };

  const errors = [];
  for (let i = 0; i < PATIENT.VISITS.length; i++) {
    let visit_info = PATIENT.VISIT_INFO[i];
    let visit = PATIENT.VISITS[i];
    // console.log(`VISITE: ${i}`, visit_info)
    //VISITE ANLEGEN
    let NEW_VISIT = await addVisit(
      { ...visit_info, PATIENT_NUM: patient.PATIENT_NUM },
      VIEW_VISIT
    );
    if (NEW_VISIT) {
      // Füge OBSERVATIONS der VISITE hinzu
      for (let i_obs = 0; i_obs < visit.length; i_obs++) {
        let obs = visit[i_obs];
        if (typeof obs.CONCEPT_CD === "object")
          errors.push(
            `${error_codes.invalid_concept_cd}: ${JSON.stringify(
              obs.CONCEPT_CD
            )}`
          );
        else {
          obs.ENCOUNTER_NUM = NEW_VISIT.ENCOUNTER_NUM;
          let NEW_OBS = await addObservation(obs, VIEW_OBSERVATION);
          if (!NEW_OBS)
            errors.push(
              `${error_codes.could_not_add_observation}: ENCOUNTER_NUM=${obs.ENCOUNTER_NUM}, CONCEPT_CD=${obs.CONCEPT_CD}}`
            );
        }
      }
    } else errors.push(error_codes.could_not_add_visit);
  }

  //etwas wurde vermutlich gemacht; errors enthält auflistung der Fehler
  return { status: true, error: errors };
}

async function addVisit(visit_info, VIEW_VISIT) {
  const res = await VIEW_VISIT.create(visit_info);
  if (!res.status) return undefined;
  return res.data;
}

async function addObservation(obs, VIEW_OBSERVATION) {
  const res = await VIEW_OBSERVATION.create(obs);
  return res.status === true;
}

/**
 *
 * @param {Array} OBSERVATIONS - array of Objects >> output from Process_Observations: [{PATIENT_NUM:2, START_DATE: '2022-04-15', TVAL_CHAR: 'hallo'}]
 * @param {*} VIEW_OBSERVATION - eine aktive VIEW_INSTANCE, z.b. VIEW_OBSERVATION
 * @returns {object} OBSERVATIONS, an jedes Element wurde die Eigenschaft: ._double_found mit true | false angehangen
 */
export async function CheckObservationsForDoubles(OBSERVATIONS, VIEW_INSTANCE) {
  for (let obs of OBSERVATIONS) {
    let query = `SELECT COUNT(*)  FROM patient_observations WHERE`;
    if (obs.PATIENT_CD) query += ` PATIENT_CD = '${obs.PATIENT_CD}' AND`;
    if (obs.CONCEPT_CD) query += ` CONCEPT_CD = '${obs.CONCEPT_CD}' AND`;
    if (obs.START_DATE) query += ` START_DATE = '${obs.START_DATE}' AND`;

    if (obs.VALTYPE_CD === "N") query += ` NVAL_NUM = ${obs.NVAL_NUM}`;
    else query += ` TVAL_CHAR = '${unstringify_json(obs.TVAL_CHAR)}'`;
    let res = await VIEW_INSTANCE.run_query(query);
    if (res.data && res.data.length > 0) {
      let count = res.data[0]["COUNT(*)"];
      obs._double_found = count > 0;
    }
  }
  return OBSERVATIONS;
}
