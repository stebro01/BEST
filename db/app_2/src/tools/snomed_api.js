import axios from "axios";

const url_full =
  "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2023-02-28/concepts";
const url_short =
  "https://browser.ihtsdotools.org/snowstorm/snomed-ct/MAIN/2023-02-28/concepts";
const url_descriptions =
  "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions";

export async function resolve(SNOMED_ID) {
  console.log("snomed_api/resolve: ", SNOMED_ID);
  if (!SNOMED_ID || typeof SNOMED_ID !== "number") return undefined;

  let res = await _query_full(SNOMED_ID);
  if (!res) return undefined; //nothing found
  //else

  let url = `${SNOMED_ID}`;
  let parentId = _get_parent(res);
  let cc = 0;
  while (parentId !== undefined && cc < 10) {
    cc++; //sicherheitsabbruch
    url = `${parentId}\\${url}`;
    // console.log(url)
    //
    let res = await _query_full(parentId);
    if (res) parentId = _get_parent(res);
  }

  return `\\SNOMED-CT\\${url}`;
}

function _get_parent(res) {
  if (!res || !res.relationships) return undefined;
  let relationships = res.relationships;
  if (relationships.length > 0) {
    let destinationId = relationships[0].destinationId;
    return destinationId;
  } else return undefined;
}

async function _query_full(SNOMED_ID) {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url_full}/${SNOMED_ID}`,
    headers: {},
  };
  try {
    const res = await axios(config);
    if (res && res.data) return res.data;
    else return undefined;
  } catch (err) {
    return undefined;
  }
}

/**
 *
 * @param {number} SNOMED_ID - ie: 433178008
 * @returns Object - answer from query
 * @example const res = await SNOMED.query(433178008)
 * //returns: {conceptID: '433178008', ..., pt: {term: 'city of residence, ...}, ...}
 */
export async function query(SNOMED_ID) {
  console.log("snomed_api/query: ", SNOMED_ID);
  if (!SNOMED_ID || typeof SNOMED_ID !== "number") return undefined;

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url_short}/${SNOMED_ID}`,
    headers: {},
  };
  try {
    const res = await axios(config);
    if (res && res.data) return res.data;
    else return undefined;
  } catch (err) {
    return undefined;
  }
}

// curl --silent "https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions?&limit=50&term=heart%20attack&conceptActive=true&lang=english&skipTo=0&returnLimit=100"
export async function queryby_string(TXT) {
  console.log("snomed_api/queryby_string: ", TXT);
  if (!TXT || typeof TXT !== "string") return undefined;

  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${url_descriptions}?&limit=50&term=${TXT}&conceptActive=true&lang=english&skipTo=0&returnLimit=50`,
    headers: {},
  };
  try {
    const res = await axios(config);
    if (res && res.data) return res.data;
    else return undefined;
  } catch (err) {
    return undefined;
  }
}
