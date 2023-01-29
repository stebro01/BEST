

import {datenow_isostring} from 'src/tools/mydate'
import { generateKeys, sign } from '../../../../survey3/src/tools/hhash'

/**
 * 
 * @param {array of objects} data - list mit Ergebnissen der Abfrage von VIEW: patient_observations
 * @param {array of objects} concepts - ie: [{CONCEPT_CD: 'SCTID: 184099003',CONCEPT_NAME_CHAR: 'Date of birth',UNIT_CD: null,VALTYPE_CD: 'D'}]
 * @returns {string} - csv mit dem Export
 */
export function exportCSVTable(data, concepts) {
    
    var DATA = []
        //create the first line: FIELD_NAME
        var firstline = ['FIELD_NAME', 'PATIENT_NUM', 'PATIENT_CD', 'ENCOUNTER_NUM', 'START_DATE', 'END_DATE', 'PROVIDER_ID', 'LOCATION_CD'  ]
        for (let c of concepts) firstline.push(c.CONCEPT_CD)
        DATA.push(firstline.join(';'))
        //seconde LINE: VALTYPE_CD
        var secondline = ['VALTYPE_CD', 'numeric', 'numeric', 'numeric', 'date', 'date', 'text', 'text'  ]
        for (let c of concepts) {
            if (c.VALTYPE_CD === 'T') secondline.push('text')
            else if (c.VALTYPE_CD === 'D') secondline.push('date')
            else if (c.VALTYPE_CD === 'N') secondline.push('numeric')
            else if (c.VALTYPE_CD === 'F') secondline.push('numeric')
            else secondline.push('text')
        }
        DATA.push(secondline.join(';'))
        //third LINE: VALTYPE_CD
        var thirdline = ['UNIT_CD', '', '', '', '', '', '', ''  ]
        for (let c of concepts) {
            if (c.UNIT_CD) thirdline.push(c.UNIT_CD)
            else thirdline.push('')
        }
        DATA.push(thirdline.join(';'))
        //fourth LINE: NAME_CHAR
        var fourthline =['NAME_CHAR', 'Patient (lfd. Nummer)', 'Patient Code', 'Visten Nr.', 'Vistendatum', 'Ende Viste', 'Untersucher', 'Ort'  ]
        for (let c of concepts) {
            if (c.CONCEPT_NAME_CHAR) fourthline.push(c.CONCEPT_NAME_CHAR)
            else fourthline.push('')
        }
        DATA.push(fourthline.join(';'))
        // NOW FILL WITH DATA
        const TEMPLATE_LINE = new Array(fourthline.length)
        const PATIENTS = Array.from(new Set(data.map(item => item.PATIENT_NUM)))
        for (let PATIENT_NUM of PATIENTS) {
            let DATA_PATIENT = data.filter(el => el.PATIENT_NUM === PATIENT_NUM)
            let VISTS_PATIENT = Array.from(new Set(DATA_PATIENT.map(item => item.ENCOUNTER_NUM)))
            
            // console.log('bearbeite: PATIENT_NUM = ', PATIENT_NUM)
            for (let ENCOUNTER_NUM of VISTS_PATIENT) {
                // console.log('bearbeite: ENCOUNTER_NUM = ', ENCOUNTER_NUM)
                let DATA_VISIT = data.filter(el => el.ENCOUNTER_NUM === ENCOUNTER_NUM)
                let ACTIVE_LINE = JSON.parse(JSON.stringify(TEMPLATE_LINE))
                ACTIVE_LINE[1] = DATA_VISIT[0].PATIENT_NUM
                ACTIVE_LINE[2] = DATA_VISIT[0].PATIENT_CD
                ACTIVE_LINE[3] = DATA_VISIT[0].ENCOUNTER_NUM
                ACTIVE_LINE[4] = DATA_VISIT[0].START_DATE
                ACTIVE_LINE[6] = DATA_VISIT[0].PROVIDER_ID
                ACTIVE_LINE[7] = DATA_VISIT[0].LOCATION_CD
                // NOW FILL THE ACTIVE LINE
                DATA_VISIT.forEach(obs => {
                    let ind = firstline.indexOf(obs.CONCEPT_CD)
                    if (ind) {
                        if (obs.VALTYPE_CD === 'N') ACTIVE_LINE[ind] = _numToCSV(obs.NVAL_NUM)
                        else if (obs.VALTYPE_CD === 'F' || obs.VALTYPE_CD === 'S') ACTIVE_LINE[ind] = obs.TVAL_RESOLVED
                        else if (obs.TVAL_CHAR) ACTIVE_LINE[ind] = obs.TVAL_CHAR.replace(/;/g, ",") //make sure ';' > ','
                    }
                })
                DATA.push(ACTIVE_LINE.join(';'))
            }
        }

    return DATA.join('\n')
}


import {template} from '../../../../survey3/src/tools/CDA_template' 
/**
 * @param {array of objects} data - list mit Ergebnissen der Abfrage von VIEW: patient_observations
 * @param {array of objects} concepts - ie: [{CONCEPT_CD: 'SCTID: 184099003',CONCEPT_NAME_CHAR: 'Date of birth',UNIT_CD: null,VALTYPE_CD: 'D'}]
 * @param {object} meta - some data to fill to the CDA => i.e. ENV.app
*  @returns a String with hl7 compatible cda dokument
 */
export function exportHL7JSON(data, concepts, meta) {
    const keyPair = generateKeys()

    const cda_template = _hl7_prepare_template(meta)
    //create LIST of unique PATIENTS
    const PATIENTS = Array.from(new Set(data.map(item => item.PATIENT_NUM)))
    //loop through patiens
    var DATA =[]
    for (let PATIENT_NUM of PATIENTS) {
        let DATA_PATIENT = data.filter(el => el.PATIENT_NUM === PATIENT_NUM)
        let VISTS_PATIENT = Array.from(new Set(DATA_PATIENT.map(item => item.ENCOUNTER_NUM)))
        let CDA = JSON.parse(JSON.stringify(cda_template))
        //defineing the subject
        CDA.subject = _hl7_prepare_subject(DATA_PATIENT) 
        //defineing the attester
        CDA.attester = _hl7_prepare_attester(DATA_PATIENT) 
        // console.log('bearbeite: PATIENT_NUM = ', PATIENT_NUM)
        let EVENT = []
        let SECTION = []
        let visit_counter = 0
        for (let ENCOUNTER_NUM of VISTS_PATIENT) {
            visit_counter ++
            // console.log('bearbeite: ENCOUNTER_NUM = ', ENCOUNTER_NUM)
            let DATA_VISIT = data.filter(el => el.ENCOUNTER_NUM === ENCOUNTER_NUM)
            EVENT.push(_hl7_prepare_event(DATA_VISIT[0], visit_counter))
            SECTION.push(_hl7_prepare_section(DATA_VISIT, visit_counter, concepts))
        }

        //prepare text
        CDA.event = EVENT
        CDA.section = SECTION
        CDA.text = _hl7_prepare_textdiv(CDA)

        const hash = sign(CDA, keyPair.privateKey, keyPair.publicKey)
        hash.publicKey = keyPair.publicKey
        
        // console.log(CDA)
        DATA.push({cda: CDA, hash: hash})
    }

    return DATA
}

function _hl7_prepare_template(meta) {
    const cda_template = JSON.parse(JSON.stringify(template))
    // TITLE ETC
    cda_template.id = meta.title
    cda_template.meta.versionId = meta.version
    cda_template.meta.lastUpdated = meta.lastUpdated
    cda_template.meta.source = meta.source
    cda_template.language= "de-DE"
    cda_template.identifier.value = `urn:${meta.uuid}`
    cda_template.author = [{display: meta.title}]
    cda_template.title = `Export von ${meta.title} (${meta.version}) - Klinische Beobachtungen)`
    cda_template.status = "preliminary"
    cda_template.custodian = {display: undefined}
    //identifier
    cda_template.identifier.system = `urn:${undefined}`
    cda_template.date = datenow_isostring()
    //type
    cda_template.type = {
        coding: [
            {system: "http://snomed.info/sct", code: 404684003, display: "Klinische Beobachtungen"}
        ]
    }
    
    return cda_template

}

function _hl7_prepare_textdiv(cda) {
  // NOW BUILD THE DIV TABLE
  var div = '<div xmlns="http://www.w3.org/1999/xhtml">\n';
  // Heading
  div += `<h1>${cda.title}</h1>\n`;
  // quest description
  div += '<table id="summary_table" >\n';
  div += "<tbody>\n";
  //line
  div += `<tr><td>Visiten:</td><td></td></tr>\n`;
  div += `<tr><td>code:</td><td>${cda.event[0].code[0].coding[0].code}</td></tr>\n`;
  div += `<tr><td>system:</td><td>${cda.event[0].code[0].coding[0].system}</td></tr>\n`;
  div += "</tbody>\n";
  div += "</table>\n<br>\n";
  // description document
  div += '<table id="description_table">\n';
  div += "<tbody>\n";
  div += `<tr><td>Document-ID:</td><td>${cda.identifier.value}</td></tr>\n`;
  div += `<tr><td>date:</td><td>${cda.date}</td></tr>\n`;
  div += `<tr><td>ressource:</td><td>${cda.meta.source}_${cda.meta.versionId}_${cda.meta.lastUpdated}</td></tr>\n`;
  div += "</tbody>\n";
  div += "</table>\n<br>\n";

  // description investigator
  div += '<table id="subjects_table">\n';
  div += "<tbody>\n";
  //line
  div += `<tr><td>Subject:</td><td>${cda.subject.display}</td></tr>\n`;
  div += `<tr><td>Investigator:</td><td>${cda.attester[0].party.display}</td></tr>\n`;
  div += `<tr><td>start time:</td><td>${cda.event[0].period.start}</td></tr>\n`;
  div += `<tr><td>end time:</td><td>${cda.event[0].period.end}</td></tr>\n`;
  div += "</tbody>\n";
  div += "</table>\n";

  // Table & Results
  div += "<h2>Visiten</h2>\n";

  for (let i = 0; i < cda.event.length; i++) {
    div += `<h3>${cda.section[i].title}</h3>\n`
    div += `<table id="visite_${i+1}">\n`;    

    //first row
    div += '<tr>'
        div += `<td>start time</td>`
        for (let item of cda.section[i].entry) {
            div += `<td>${item.title}</td>`
        }
    div += '</tr>\n'

    //second row
    div += '<tr>'
        div += `<td>${cda.event[i].period.start}</td>`
        for (let item of cda.section[i].entry) {
            div += `<td>${item.value}</td>`
        }
    div += '</tr>\n'

    div += "</table>\n"
  }
  div += "</div>";
  return { status: "generated", div: div };
}

function _hl7_prepare_section(visit, id, concepts) {
    const section = {
        title: `Visite: ${id}`,
        code: [{coding: [{system: 'http://snomed.info/sct', code: 308335008, display: `Visite: ${id}`}]}],
        text: {status: 'generated', div: `<h1>Visite: ${id}</h1>`},
        entry: []
    }
    //fill entry
    visit.forEach(v => {
        let obj = concepts.find(el => el.CONCEPT_CD === v.CONCEPT_CD)
        if (obj){
            let val = ({
                title: v.CONCEPT_NAME_CHAR,
                code: [{coding: [{system: v.SOURCESYSTEM_CD || 'http://snomed.info/sct', code: v.CONCEPT_CD, display: v.CONCEPT_NAME_CHAR}]}],
                value: undefined,
                text: undefined
            })
            if (v.VALTYPE_CD === 'N') val.value = v.NVAL_NUM
            else if (v.VALTYPE_CD === 'S' || v.VALTYPE_CD === 'F') val.value = v.TVAL_RESOLVED
            else val.value = v.TVAL_CHAR
            val.text = {
                status: 'generated',
                div: `<table><tbody><tr><td>${v.CONCEPT_NAME_CHAR}</td></tr><tr><td>${val.value}</td></tr></tbody></table>`
            }
            section.entry.push(val)
        }
    })
    return section
}

function _hl7_prepare_event(data, id) {
    const event = {
        code: [{coding: [{system: 'http://snomed.info/sct', code: 308335008, display: `Visite: ${id}`}]}],
        period: {start: data.START_DATE, end: data.END_DATE}
    }
    return event
}

function _hl7_prepare_subject(data) {
    return {display: data[0].PATIENT_CD, code: {coding: [{system: 'http://snomed.info/sct', code: 422549004, display: 'Patient Code'}]}}
}

function _hl7_prepare_attester(data) {
   const LIST = Array.from(new Set(data.map(item => item.PROVIDER_ID)))
   const ATTESTER = []
   for (let item of LIST) {
    let val = data.find(el => el.PROVIDER_ID === item)
    ATTESTER.push({
        mode: 'legal', time: val.START_DATE, 
        party: {display: item}
    })
   }
   return ATTESTER
}

/**
 * 
 * @param {number} val 
 * @returns String mit ausTauschen . => , >>> damit im IMport Excel, die Zahl korrekt erkannt wird
 */
function _numToCSV(val) {
    if (val) val = val.toString().replace(".", ",")
    return val
}