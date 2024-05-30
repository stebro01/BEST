export const template = {
  "resourceType": "Composition",
  "id": "QUESTIONNAIRE-surveyBEST",
  "meta": {
    "versionId": "1.3",
    "lastUpdated": "2021-07-20T21:30:12:00",
    "source": "#surveyBEST",
    "profile": [
      //   "http://hl7.org/fhir/us/ccda/StructureDefinition/Diagnostic-Imaging-Report"
    ]
  },
  "language": "de-DE",
  "text": {

  },
  "identifier": {
    "system": "urn:ietf:rfc:3986",
    "value": "urn:uuid:895f6f22-f7d6-4feb-90d4-dbfd49b5471e"
  },
  "status": "preliminary",
  "type": {
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "273249006",
      //   https://browser.ihtsdotools.org/?perspective=full&conceptId1=273249006&edition=MAIN/2021-01-31&release=&languages=en
      "display": "Assessment-Scale"
    }]
  },
  "subject": {
    // "reference": "Patient/example",
    "display": "Anonym"
  },
  "date": "2016-05-16T09:10:14Z",
  "author": [{
    // "reference": "PractitionerRole/ccda-practitionerrole-example",
    "display": "surveyBEST"
  }],
  "title": "Questionnaire - surveyBEST",
  "attester": [{
    "mode": "legal",
    "time": "2016-06-15T09:10:14Z",
    "party": {
      //   "reference": "PractitionerRole/ccda-practitionerrole-example",
      "display": "uid: 1234567-123456-123456"
    }
  }],
  "custodian": {
    // "reference": "Organization/acme-lab",
    "display": "surveyBEST"
  },
  "event": [{
    "code": [{
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "718366000",
        "display": "BDI 2"
      }]
    }],
    "period": {
      "start": "2021-07-16",
      "end": "2016-07-16"
    }
  }],
  "section": [{
      "title": "Findings Section",
      "code": {
        "coding": [{
          "system": "http://dicom.nema.org/resources/ontology/DCM",
          "code": "121070",
          "display": "Findings"
        }]
      },
      "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n                <p>The cardiomediastinum is within normal limits. The trachea is\n                                midline. The previously described opacity at the medial right lung\n                                base has cleared. There are no new infiltrates. There is a new round\n                                density at the left hilus, superiorly (diameter about 45mm). A CT\n                                scan is recommended for further evaluation. The pleural spaces are\n                                clear. The visualized musculoskeletal structures and the upper\n                                abdomen are stable and unremarkable.</p>\n            </div>"
      }
    },
    {
      "title": "Results Section",
      "code": {
        "coding": [{
          "system": "http://dicom.nema.org/resources/ontology/DCM",
          "code": "121070",
          "display": "Results"
        }]
      },
      "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n                <p>The cardiomediastinum is within normal limits. The trachea is\n                                midline. The previously described opacity at the medial right lung\n                                base has cleared. There are no new infiltrates. There is a new round\n                                density at the left hilus, superiorly (diameter about 45mm). A CT\n                                scan is recommended for further evaluation. The pleural spaces are\n                                clear. The visualized musculoskeletal structures and the upper\n                                abdomen are stable and unremarkable.</p>\n            </div>"
      }
    }
  ]
}
