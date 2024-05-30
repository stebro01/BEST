import { log } from "src/tools/logger";

import { sign, uuidv4 } from "./hhash";

import { template } from "./CDA_template";
import dateFormat from "dateformat";

//  MAIN FUNCTION: payload = QuestMan.active_quest
export function import_quest(payload) {
  if (
    payload === undefined ||
    payload.investigator === undefined ||
    payload.data === undefined
  )
    return log({
      message: "CDA_H7>import: invalid payload",
      data: payload,
      error: true,
    });
  // check successfull ...
  log({ message: "import", data: payload });

  // LOAD THE TEMPLATE
  const cda = JSON.parse(JSON.stringify(template));

  // PREPARE THE HEADER
  prepare_header(cda, payload);

  // PREPARE TEXT ? TABLE
  prepare_text(cda, payload.data);

  // PREPARE SECTIONS
  cda.section = [];
  // findings
  prepare_findings(cda, payload.data);

  // results
  prepare_results(cda, payload.data);

  // evaluation
  prepare_evaluation(cda, payload.data);

  // NOW HASH THE TABLE
  const hash = sign(
    cda,
    payload.investigator.keyPair.privateKey,
    payload.investigator.keyPair.publicKey
  );
  hash.investigator_uid = payload.investigator.uid;
  return {
    cda,
    hash,
    exported: false,
    info: {
      title: payload.data.quest.title,
      label: payload.data.quest.label,
      PID: payload.data.PID,
      date: payload.data.quest.date_end,
      uid: uuidv4(),
    },
  };
}

// PREPARE EVALUATION
function prepare_evaluation(cda, data) {
  if (data.quest.results === undefined || data.quest.results.length < 1) return;
  if (!Array.isArray(data.quest.results)) return;
  // check successfull ...
  const evaluation = {
    title: "Evaluation Section",
    code: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "129265001",
            display: "Evaluation",
          },
        ],
      },
    ],
    text: {
      status: "generated",
      div: "",
    },
  };

  // now fill the entries
  data.quest.results.forEach((item) => {
    if (item.evaluation !== undefined)
      evaluation.text.div += `<div id="section_evaluation">${item.evaluation}</div>`;
  });

  // finally push the evaluation (if there were some ...)
  if (evaluation.text.div.length > 0) cda.section.push(evaluation);
}

// PREPARE FINDINGS
function prepare_results(cda, data) {
  // first check the data
  if (data.quest.results === undefined || data.quest.results.length < 1) return;
  if (!Array.isArray(data.quest.results)) return;

  // check successfull ...
  const results = {
    title: "Results Section",
    code: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "423100009",
            display: "Results",
          },
        ],
      },
    ],
    text: {
      status: "generated",
      div: "",
    },
    entry: [],
  };

  // now fill the entries
  var div = '<table id="section_results"><tbody>';
  var div_header = "";
  var div_main = "";
  // loop through the results
  data.quest.results.forEach((item) => {
    let entry = {
      title: item.label,
      code: [
        {
          coding: [
            {
              code: "782487009",
              display: item.label,
              system: "http://snomed.info/sct",
            },
          ],
        },
      ],
      value: item.value,
      text: { status: "generated", div: "" },
    };
    if (item.coding) entry.code = [{ coding: [item.coding] }];

    entry.text.div = `<table><tbody><tr><td>${entry.title}</td></tr><tr><td>${entry.value}</td></tr></tbody></table>`;

    div_header += `<td>${entry.title}</td>`;
    div_main += `<td>${entry.value}</td>`;
    // push entry
    results.entry.push(entry);
  });
  div += `<tr>${div_header}</tr><tr>${div_main}</tr>`;
  div += "</tbody></table>";
  results.text.div = div;
  // finally push the findings
  cda.section.push(results);
}

// PREPARE FINDINGS
function prepare_findings(cda, data) {
  const findings = {
    title: "Findings Section",
    code: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "260245000",
            display: "Findings",
          },
        ],
      },
    ],
    text: {
      status: "generated",
      div: "",
    },
    entry: [],
  };
  // eventually update the code[0].coding[0] = {system, code, display}
  if (data.quest.coding !== undefined)
    findings.code[0].coding[0] = data.quest.coding;

  // now fill the entries
  var div = '<table id="section_findings"><tbody>';
  var div_header = "";
  var div_main = "";
  data.quest.items.forEach((item) => {
    let entry = {
      title: item.label,
      code: [{ coding: [item.coding] }], //code[0].coding[0] = {system, code, display}
      value: extract_value(item.value),
      text: { status: "generated", div: "" },
    };

    if (item.coding !== undefined) entry.title = item.coding.display;
    entry.text.div = `<table><tbody><tr><td>${entry.title}</td></tr><tr><td>${entry.value}</td></tr></tbody></table>`;
    div_header += `<td>${entry.title}</td>`;
    div_main += `<td>${entry.value}</td>`;
    // push entry
    findings.entry.push(entry);
  });
  div += `<tr>${div_header}</tr><tr>${div_main}</tr>`;
  div += "</tbody></table>";
  findings.text.div = div;
  // finally push the findings
  cda.section.push(findings);
}

// PREPARE THE TEXT
function prepare_text(cda, data) {
  if (data === undefined) return undefined;
  // COLLECT THE DATA
  const { header, row, evaluation } = prepare_row(data);

  // NOW BUILD THE DIV TABLE
  var div = '<div xmlns="http://www.w3.org/1999/xhtml">';
  // Heading
  div += `<h1>${cda.title}</h1>`;
  // quest description
  div += '<table id="summary_table" >';
  div += "<tbody>";
  //line
  div += "<tr>";
  div += `<td>questionnaire:</td>`;
  div += `<td>${cda.event[0].code[0].coding[0].display}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>code:</td>`;
  div += `<td>${cda.event[0].code[0].coding[0].code}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>system:</td>`;
  div += `<td>${cda.event[0].code[0].coding[0].system}</td>`;
  div += "</tr>";
  div += "</tbody>";
  div += "</table><br>";
  // description document
  div += '<table id="description_table">';
  div += "<tbody>";
  //line
  div += "<tr>";
  div += `<td>Document-ID:</td>`;
  div += `<td>${cda.identifier.value}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>date:</td>`;
  div += `<td>${cda.date}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>ressource:</td>`;
  div += `<td>${cda.meta.source}_${cda.meta.versionId}_${cda.meta.lastUpdated}</td>`;
  div += "</tr>";
  div += "</tbody>";
  div += "</table><br>";

  // description investigator
  div += '<table id="subjects_table">';
  div += "<tbody>";
  //line
  div += "<tr>";
  div += `<td>Subject:</td>`;
  div += `<td>${cda.subject.display}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>Investigator:</td>`;
  div += `<td>${cda.attester[0].party.display}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>start time:</td>`;
  div += `<td>${cda.event[0].period.start}</td>`;
  div += "</tr>";
  div += "<tr>";
  div += `<td>end time:</td>`;
  div += `<td>${cda.event[0].period.end}</td>`;
  div += "</tr>";
  div += "</tbody>";
  div += "</table><br>";

  // Table & Results
  div += "<h2>Results</h2>";
  div += '<table id="results_table">';
  div += "<tbody>";
  //line 1
  div += "<tr>";
  header.forEach((h) => {
    div += `<td>${h}</td>`;
  });
  div += "</tr>";
  //line 2
  div += "<tr>";
  row.forEach((h) => {
    div += `<td>${h}</td>`;
  });

  div += "</tr>";
  div += "</tbody>";
  div += "</table><br>";

  // EVALUATION
  if (evaluation !== undefined && evaluation.length > 0) {
    div += "<h2>Evaluation</h2>";
    evaluation.forEach((e) => {
      div += `<div id="evaluation_div">${e}</div>`;
    });
  }

  // close the tags
  div += "</div>";

  // UPDATE THE CDA
  cda.text = {
    status: "generated",
    div: div,
  };
}

function prepare_row(data) {
  const header = [];
  const row = [];
  const evaluation = [];

  header.push("PID");
  row.push(data.PID); // PID
  header.push("quest");
  row.push(data.quest.label); // QUEST
  header.push("date");
  row.push(formatDate(data.date)); // date
  // results
  if (Array.isArray(data.quest.results))
    data.quest.results.forEach((res) => {
      header.push(res.label);
      row.push(res.value); // result
      if (res.evaluation !== undefined) evaluation.push(res.evaluation);
    });
  // items
  data.quest.items.forEach((item) => {
    header.push(item.label);
    row.push(extract_value(item.value));
  });

  return { header, row, evaluation };
}

// PREPARE_HEADER
function prepare_header(cda, payload) {
  cda.identifier.system = "";
  cda.identifier.value = `uuid:${uuidv4()}`;
  cda.status = "preliminary";
  cda.subject.display = payload.data.PID;
  cda.date = formatDate(payload.data.date);
  cda.attester[0] = {
    mode: "legal",
    time: formatDate(payload.data.date),
    party: {
      display: `uid: ${payload.investigator.uid}`,
    },
  };

  // event
  cda.event[0].period.start = formatDate(payload.data.quest.date_start);
  cda.event[0].period.end = formatDate(payload.data.quest.date_end);
  if (payload.data.quest.coding !== undefined) {
    cda.event[0].code[0].coding[0] = {
      system: payload.data.quest.coding.system,
      code: payload.data.quest.coding.code,
      display: payload.data.quest.coding.display,
    };
  } else {
    cda.event[0].code[0].coding[0] = {
      system: "",
      code: "",
      display: payload.data.quest.title,
    };
  }
}

// return item value
function extract_value(invalue) {
  var outvalue = "";
  if (!Array.isArray(invalue)) outvalue = invalue;
  else
    invalue.forEach((v) => {
      if (outvalue === "") outvalue = v;
      else outvalue += `, ${v}`;
    });

  return outvalue;
}

// SOME DATE FUNCTIONS
function formatDate(date_str) {
  return dateFormat(date_str, "yyyy-mm-dd'T'h:MM:ssZ");
}

// function formatDay(date_str) {
//   return dateFormat(date_str, "yyyy-mm-dd")
// }
