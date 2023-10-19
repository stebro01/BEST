
exemplary export / import data in csv and hl7 json format
.........................................................

CSV export / import
++++++++++++++++++++

.. code-block:: text

    FIELD_NAME;PATIENT_NUM;PATIENT_CD;ENCOUNTER_NUM;START_DATE;END_DATE;PROVIDER_ID;LOCATION_CD;CUSTOM: ANAMNESE_EDUCATION;CUSTOM: ASSESSMENT_PARK_MOVE;CUSTOM: BNT_CHANGED;CUSTOM: RAW_IMAGE;CUSTOM: RAW_MID_PART_2;CUSTOM: SCORES_DNMSQUEST;LID: 72166-2;LID: 99222-2T;LID: 63900-5;LID: 72133-2;LID: 72172-0;SCTID: 273249006;SCTID: 443322002;SCTID: 444781002;SCTID: 8319008;SCTID: 276734006;CUSTOM: 277267003_MOD_AF6B2644-F2DA-42AF-8444-400E1ADD2AA8;SCTID: 184099003;SCTID: 443125007;SCTID: 444680009;SCTID: 1153637007;SCTID: 27113001;SCTID: 298348009;SCTID: 445035000;SCTID: 165263003;SCTID: 718970003;SCTID: 513881000000106;SCTID: 443544006;SCTID: 443544006_MOD_FBCAF68A-599E-43FD-AFA8-A4B28CB1BEC9;SCTID: 78629008;SCTID: 300758009;SCTID: 298343000;SCTID: 298343000_MOD_CC982444-8E6B-43B3-9F55-1AD30B8BE728;SCTID: 445036004;SCTID: 446009008;SCTID: 717268000;SCTID: 246261001;SCTID: 263495000
    VALTYPE_CD;numeric;numeric;numeric;date;date;text;text;text;text;finding;text;text;numeric;text;text;numeric;finding;numeric;text;text;text;text;text;numeric;date;numeric;numeric;numeric;numeric;numeric;numeric;numeric;numeric;text;finding;numeric;numeric;text;text;text;text;text;numeric;text;text
    UNIT_CD;;;;;;;;;;;;;POINTS;;;years;;POINTS;;;;;;years;;POINTS;POINTS;cm;kg;last 12 month;POINTS;meter;POINTS;;;daily;POINTS;;;;;;POINTS;;
    NAME_CHAR;Patient (lfd. Nummer);Patient Code;Visten Nr.;Vistendatum;Ende Viste;Untersucher;Ort;Bildungsgrad;Fragebogen PARK_MOVE Studie;BNT wurde geändert;Bilddatei (nicht genauer spezifiziert);Monetary Incentive Delay (MID) / Part 2;DNMSQuest - Dystonia Non-Motor Symptoms Questionnaire;Tabacco Smoking status;Employment;Age;MOCA;MOCA Total Score;Assessment scales;Activities specific balance confidence scale;Timed up and go mobility test;Principal diagnosis;Hilfsmittel / Mechanical assistance;Jahr der Diagnose / year of diagnosis;Date of birth;Activities specific balance confidence score;Timed up and go mobility test score;Body height;Body weight;Number of falls;Short falls efficacy scale - international score;Walking distance;McGill Pain Questionnaire score;Current medication as reported by patient;Freezing of gait;Freezing of gait /frequency daily;Pflegegrad / Total self-care deficit;Does engage in a hobby;Finding related to falls;Sturzkomplikationen / complications of falling;Assessment using short falls efficacy - international scale;Assessment using McGill pain questionnaire;BDI II - Beck Depression Inventory II;Gruppe;Gender
    ;66;DEMO;231;2022-08-30;;admin;;;;;{"filename":"Screenshot 2023-09-27 at 09.16.42.png","ext":".png","sizeKB":97.150390625,"source_dir":"/Users/ste/Desktop"};{"filename":"MID_Teil2_2022-08-30_13-37-40.txt","ext":".txt","sizeKB":10.89453125,"source_dir":"/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/raw"};;;;;;;;Activities specific balance confidence scale;Timed up and go mobility test;;;;;0;1;;;;42;;28;;;;;;;;Assessment using short falls efficacy - international scale;Assessment using McGill pain questionnaire;;;
    ;66;DEMO;232;2023-09-09;;hl7import;;;;;;;;;;;;;6MWT;;;;;;;;;;;;;;;;;;;;;;;;;;
    ;66;DEMO;233;2023-09-09;;hl7import;;;Fragebogen PARK_MOVE Studie;;;;;former smoker;random;;;;;;;;random;1970;;;;77;50;84;;6;;random;Yes;41;5;random;words;random;;;;;
    ;66;DEMO;239;2023-09-27;;admin;undefined;;;Yes;;;22;;;45;Yes;28;;;;Alzheimer dementia;;;2000-01-01;;;;;;;;;;;;;;;;;;22;Gruppe1;Female
    ;66;DEMO;240;2023-10-18;;admin;;;;;;;;;;33;Yes;29;;;;;;;2000-01-01;;;;;;;;;;;;;;;;;;;;Female

    
HL7 export / import
++++++++++++++++++++

The HL7 json consists of the following fields:

- `cda`: the CDA document
- `hash`: including a signature of the CDA document and a `publicKey` to verify the signature

.. code-block:: json

    {
        "cda":
        {
            "resourceType": "Composition",
            "id": "dbBEST",
            "meta":
            {
                "versionId": "v20230926",
                "lastUpdated": "2023-09-26",
                "source": "https://github.com/stebro01/research_database_sqlite_i2b2.git",
                "profile":
                []
            },
            "language": "de-DE",
            "text":
            {
                "status": "generated",
                "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n<h1>Export von dbBEST (v20230926) - Klinische Beobachtungen)</h1>\n<table id=\"summary_table\" >\n<tbody>\n<tr><td>Visiten:</td><td></td></tr>\n<tr><td>code:</td><td>308335008</td></tr>\n<tr><td>system:</td><td>http://snomed.info/sct</td></tr>\n</tbody>\n</table>\n<br>\n<table id=\"description_table\">\n<tbody>\n<tr><td>Document-ID:</td><td>urn:uuid:895f6f22-f7d6-4feb-90d4-dbfd49b5471e</td></tr>\n<tr><td>date:</td><td>2023-10-18</td></tr>\n<tr><td>ressource:</td><td>https://github.com/stebro01/dbBEST.git_v20230926_2023-09-26</td></tr>\n</tbody>\n</table>\n<br>\n<table id=\"subjects_table\">\n<tbody>\n<tr><td>Subject:</td><td>DEMO</td></tr>\n<tr><td>Investigator:</td><td>admin</td></tr>\n<tr><td>start time:</td><td>2022-08-30</td></tr>\n<tr><td>end time:</td><td>undefined</td></tr>\n</tbody>\n</table>\n<h2>Visiten</h2>\n<h3>Visite: 1</h3>\n<table id=\"visite_1\">\n<tr><td>start time</td><td>Monetary Incentive Delay (MID) / Part 2</td><td>Assessment using McGill pain questionnaire</td><td>McGill Pain Questionnaire score</td><td>Activities specific balance confidence scale</td><td>Activities specific balance confidence score</td><td>Assessment using short falls efficacy - international scale</td><td>Short falls efficacy scale - international score</td><td>Timed up and go mobility test</td><td>Timed up and go mobility test score</td><td>Bilddatei (nicht genauer spezifiziert)</td></tr>\n<tr><td>2022-08-30</td><td>{\"filename\":\"MID_Teil2_2022-08-30_13-37-40.txt\",\"ext\":\".txt\",\"sizeKB\":10.89453125,\"source_dir\":\"/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/raw\"}</td><td>Assessment using McGill pain questionnaire</td><td>28</td><td>Activities specific balance confidence scale</td><td>0</td><td>Assessment using short falls efficacy - international scale</td><td>42</td><td>Timed up and go mobility test</td><td>1</td><td>{\"filename\":\"Screenshot 2023-09-27 at 09.16.42.png\",\"ext\":\".png\",\"sizeKB\":97.150390625,\"source_dir\":\"/Users/ste/Desktop\"}</td></tr>\n</table>\n<h3>Visite: 2</h3>\n<table id=\"visite_2\">\n<tr><td>start time</td><td>Assessment scales</td></tr>\n<tr><td>2023-09-09</td><td>6MWT</td></tr>\n</table>\n<h3>Visite: 3</h3>\n<table id=\"visite_3\">\n<tr><td>start time</td><td>Bildungsgrad</td><td>Body height</td><td>Body weight</td><td>Current medication as reported by patient</td><td>Does engage in a hobby</td><td>Employment</td><td>Finding related to falls</td><td>Fragebogen PARK_MOVE Studie</td><td>Freezing of gait</td><td>Freezing of gait /frequency daily</td><td>Hilfsmittel / Mechanical assistance</td><td>Jahr der Diagnose / year of diagnosis</td><td>Number of falls</td><td>Pflegegrad / Total self-care deficit</td><td>Sturzkomplikationen / complications of falling</td><td>Tabacco Smoking status</td><td>Walking distance</td></tr>\n<tr><td>2023-09-09</td><td>null</td><td>77</td><td>50</td><td>random</td><td>random</td><td>random</td><td>words</td><td>Fragebogen PARK_MOVE Studie</td><td>Yes</td><td>41</td><td>random</td><td>1970</td><td>84</td><td>5</td><td>random</td><td>former smoker</td><td>6</td></tr>\n</table>\n<h3>Visite: 4</h3>\n<table id=\"visite_4\">\n<tr><td>start time</td><td>Age</td><td>BDI II - Beck Depression Inventory II</td><td>BNT wurde geändert</td><td>DNMSQuest - Dystonia Non-Motor Symptoms Questionnaire</td><td>Date of birth</td><td>Gender</td><td>Gruppe</td><td>MOCA</td><td>MOCA Total Score</td><td>Principal diagnosis</td></tr>\n<tr><td>2023-09-27</td><td>45</td><td>22</td><td>Yes</td><td>22</td><td>2000-01-01</td><td>Female</td><td>Gruppe1</td><td>Yes</td><td>28</td><td>Alzheimer dementia</td></tr>\n</table>\n<h3>Visite: 5</h3>\n<table id=\"visite_5\">\n<tr><td>start time</td><td>Age</td><td>Date of birth</td><td>Gender</td><td>MOCA</td><td>MOCA Total Score</td></tr>\n<tr><td>2023-10-18</td><td>33</td><td>2000-01-01</td><td>Female</td><td>Yes</td><td>29</td></tr>\n</table>\n</div>"
            },
            "identifier":
            {
                "system": "urn:undefined",
                "value": "urn:uuid:895f6f22-f7d6-4feb-90d4-dbfd49b5471e"
            },
            "status": "preliminary",
            "type":
            {
                "coding":
                [
                    {
                        "system": "http://snomed.info/sct",
                        "code": 404684003,
                        "display": "Klinische Beobachtungen"
                    }
                ]
            },
            "subject":
            {
                "display": "DEMO",
                "code":
                {
                    "coding":
                    [
                        {
                            "system": "http://snomed.info/sct",
                            "code": 422549004,
                            "display": "Patient Code"
                        }
                    ]
                }
            },
            "date": "2023-10-18",
            "author":
            [
                {
                    "display": "dbBEST"
                }
            ],
            "title": "Export von dbBEST (v20230926) - Klinische Beobachtungen)",
            "attester":
            [
                {
                    "mode": "legal",
                    "time": "2022-08-30",
                    "party":
                    {
                        "display": "admin"
                    }
                },
                {
                    "mode": "legal",
                    "time": "2023-09-09",
                    "party":
                    {
                        "display": "hl7import"
                    }
                }
            ],
            "custodian":
            {},
            "event":
            [
                {
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 1"
                                }
                            ]
                        }
                    ],
                    "period":
                    {
                        "start": "2022-08-30"
                    }
                },
                {
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 2"
                                }
                            ]
                        }
                    ],
                    "period":
                    {
                        "start": "2023-09-09"
                    }
                },
                {
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 3"
                                }
                            ]
                        }
                    ],
                    "period":
                    {
                        "start": "2023-09-09"
                    }
                },
                {
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 4"
                                }
                            ]
                        }
                    ],
                    "period":
                    {
                        "start": "2023-09-27"
                    }
                },
                {
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 5"
                                }
                            ]
                        }
                    ],
                    "period":
                    {
                        "start": "2023-10-18"
                    }
                }
            ],
            "section":
            [
                {
                    "title": "Visite: 1",
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 1"
                                }
                            ]
                        }
                    ],
                    "text":
                    {
                        "status": "generated",
                        "div": "<h1>Visite: 1</h1>"
                    },
                    "entry":
                    [
                        {
                            "title": "Monetary Incentive Delay (MID) / Part 2",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: RAW_MID_PART_2",
                                            "display": "Monetary Incentive Delay (MID) / Part 2"
                                        }
                                    ]
                                }
                            ],
                            "value": "{\"filename\":\"MID_Teil2_2022-08-30_13-37-40.txt\",\"ext\":\".txt\",\"sizeKB\":10.89453125,\"source_dir\":\"/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/raw\"}",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Monetary Incentive Delay (MID) / Part 2</td></tr><tr><td>{\"filename\":\"MID_Teil2_2022-08-30_13-37-40.txt\",\"ext\":\".txt\",\"sizeKB\":10.89453125,\"source_dir\":\"/Users/ste/MyProjects/BEST/db/app/test/jest/mockups/raw\"}</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Assessment using McGill pain questionnaire",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 446009008",
                                            "display": "Assessment using McGill pain questionnaire"
                                        }
                                    ]
                                }
                            ],
                            "value": "Assessment using McGill pain questionnaire",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Assessment using McGill pain questionnaire</td></tr><tr><td>Assessment using McGill pain questionnaire</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "McGill Pain Questionnaire score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 718970003",
                                            "display": "McGill Pain Questionnaire score"
                                        }
                                    ]
                                }
                            ],
                            "value": 28,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>McGill Pain Questionnaire score</td></tr><tr><td>28</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Activities specific balance confidence scale",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 443322002",
                                            "display": "Activities specific balance confidence scale"
                                        }
                                    ]
                                }
                            ],
                            "value": "Activities specific balance confidence scale",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Activities specific balance confidence scale</td></tr><tr><td>Activities specific balance confidence scale</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Activities specific balance confidence score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 443125007",
                                            "display": "Activities specific balance confidence score"
                                        }
                                    ]
                                }
                            ],
                            "value": 0,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Activities specific balance confidence score</td></tr><tr><td>0</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Assessment using short falls efficacy - international scale",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 445036004",
                                            "display": "Assessment using short falls efficacy - international scale"
                                        }
                                    ]
                                }
                            ],
                            "value": "Assessment using short falls efficacy - international scale",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Assessment using short falls efficacy - international scale</td></tr><tr><td>Assessment using short falls efficacy - international scale</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Short falls efficacy scale - international score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 445035000",
                                            "display": "Short falls efficacy scale - international score"
                                        }
                                    ]
                                }
                            ],
                            "value": 42,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Short falls efficacy scale - international score</td></tr><tr><td>42</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Timed up and go mobility test",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 444781002",
                                            "display": "Timed up and go mobility test"
                                        }
                                    ]
                                }
                            ],
                            "value": "Timed up and go mobility test",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Timed up and go mobility test</td></tr><tr><td>Timed up and go mobility test</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Timed up and go mobility test score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 444680009",
                                            "display": "Timed up and go mobility test score"
                                        }
                                    ]
                                }
                            ],
                            "value": 1,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Timed up and go mobility test score</td></tr><tr><td>1</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Bilddatei (nicht genauer spezifiziert)",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: RAW_IMAGE",
                                            "display": "Bilddatei (nicht genauer spezifiziert)"
                                        }
                                    ]
                                }
                            ],
                            "value": "{\"filename\":\"Screenshot 2023-09-27 at 09.16.42.png\",\"ext\":\".png\",\"sizeKB\":97.150390625,\"source_dir\":\"/Users/ste/Desktop\"}",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Bilddatei (nicht genauer spezifiziert)</td></tr><tr><td>{\"filename\":\"Screenshot 2023-09-27 at 09.16.42.png\",\"ext\":\".png\",\"sizeKB\":97.150390625,\"source_dir\":\"/Users/ste/Desktop\"}</td></tr></tbody></table>"
                            }
                        }
                    ]
                },
                {
                    "title": "Visite: 2",
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 2"
                                }
                            ]
                        }
                    ],
                    "text":
                    {
                        "status": "generated",
                        "div": "<h1>Visite: 2</h1>"
                    },
                    "entry":
                    [
                        {
                            "title": "Assessment scales",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 273249006",
                                            "display": "Assessment scales"
                                        }
                                    ]
                                }
                            ],
                            "value": "6MWT",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Assessment scales</td></tr><tr><td>6MWT</td></tr></tbody></table>"
                            }
                        }
                    ]
                },
                {
                    "title": "Visite: 3",
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 3"
                                }
                            ]
                        }
                    ],
                    "text":
                    {
                        "status": "generated",
                        "div": "<h1>Visite: 3</h1>"
                    },
                    "entry":
                    [
                        {
                            "title": "Bildungsgrad",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: ANAMNESE_EDUCATION",
                                            "display": "Bildungsgrad"
                                        }
                                    ]
                                }
                            ],
                            "value": null,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Bildungsgrad</td></tr><tr><td>null</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Body height",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 1153637007",
                                            "display": "Body height"
                                        }
                                    ]
                                }
                            ],
                            "value": 77,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Body height</td></tr><tr><td>77</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Body weight",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 27113001",
                                            "display": "Body weight"
                                        }
                                    ]
                                }
                            ],
                            "value": 50,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Body weight</td></tr><tr><td>50</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Current medication as reported by patient",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 513881000000106",
                                            "display": "Current medication as reported by patient"
                                        }
                                    ]
                                }
                            ],
                            "value": "random",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Current medication as reported by patient</td></tr><tr><td>random</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Does engage in a hobby",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 300758009",
                                            "display": "Does engage in a hobby"
                                        }
                                    ]
                                }
                            ],
                            "value": "random",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Does engage in a hobby</td></tr><tr><td>random</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Employment",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 99222-2T",
                                            "display": "Employment"
                                        }
                                    ]
                                }
                            ],
                            "value": "random",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Employment</td></tr><tr><td>random</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Finding related to falls",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 298343000",
                                            "display": "Finding related to falls"
                                        }
                                    ]
                                }
                            ],
                            "value": "words",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Finding related to falls</td></tr><tr><td>words</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Fragebogen PARK_MOVE Studie",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: ASSESSMENT_PARK_MOVE",
                                            "display": "Fragebogen PARK_MOVE Studie"
                                        }
                                    ]
                                }
                            ],
                            "value": "Fragebogen PARK_MOVE Studie",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Fragebogen PARK_MOVE Studie</td></tr><tr><td>Fragebogen PARK_MOVE Studie</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Freezing of gait",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 443544006",
                                            "display": "Freezing of gait"
                                        }
                                    ]
                                }
                            ],
                            "value": "Yes",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Freezing of gait</td></tr><tr><td>Yes</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Freezing of gait /frequency daily",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 443544006_MOD_FBCAF68A-599E-43FD-AFA8-A4B28CB1BEC9",
                                            "display": "Freezing of gait /frequency daily"
                                        }
                                    ]
                                }
                            ],
                            "value": 41,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Freezing of gait /frequency daily</td></tr><tr><td>41</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Hilfsmittel / Mechanical assistance",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 276734006",
                                            "display": "Hilfsmittel / Mechanical assistance"
                                        }
                                    ]
                                }
                            ],
                            "value": "random",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Hilfsmittel / Mechanical assistance</td></tr><tr><td>random</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Jahr der Diagnose / year of diagnosis",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: 277267003_MOD_AF6B2644-F2DA-42AF-8444-400E1ADD2AA8",
                                            "display": "Jahr der Diagnose / year of diagnosis"
                                        }
                                    ]
                                }
                            ],
                            "value": 1970,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Jahr der Diagnose / year of diagnosis</td></tr><tr><td>1970</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Number of falls",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 298348009",
                                            "display": "Number of falls"
                                        }
                                    ]
                                }
                            ],
                            "value": 84,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Number of falls</td></tr><tr><td>84</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Pflegegrad / Total self-care deficit",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 78629008",
                                            "display": "Pflegegrad / Total self-care deficit"
                                        }
                                    ]
                                }
                            ],
                            "value": 5,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Pflegegrad / Total self-care deficit</td></tr><tr><td>5</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Sturzkomplikationen / complications of falling",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 298343000_MOD_CC982444-8E6B-43B3-9F55-1AD30B8BE728",
                                            "display": "Sturzkomplikationen / complications of falling"
                                        }
                                    ]
                                }
                            ],
                            "value": "random",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Sturzkomplikationen / complications of falling</td></tr><tr><td>random</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Tabacco Smoking status",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 72166-2",
                                            "display": "Tabacco Smoking status"
                                        }
                                    ]
                                }
                            ],
                            "value": "former smoker",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Tabacco Smoking status</td></tr><tr><td>former smoker</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Walking distance",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 165263003",
                                            "display": "Walking distance"
                                        }
                                    ]
                                }
                            ],
                            "value": 6,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Walking distance</td></tr><tr><td>6</td></tr></tbody></table>"
                            }
                        }
                    ]
                },
                {
                    "title": "Visite: 4",
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 4"
                                }
                            ]
                        }
                    ],
                    "text":
                    {
                        "status": "generated",
                        "div": "<h1>Visite: 4</h1>"
                    },
                    "entry":
                    [
                        {
                            "title": "Age",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 63900-5",
                                            "display": "Age"
                                        }
                                    ]
                                }
                            ],
                            "value": 45,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Age</td></tr><tr><td>45</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "BDI II - Beck Depression Inventory II",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 717268000",
                                            "display": "BDI II - Beck Depression Inventory II"
                                        }
                                    ]
                                }
                            ],
                            "value": 22,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>BDI II - Beck Depression Inventory II</td></tr><tr><td>22</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "BNT wurde geändert",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: BNT_CHANGED",
                                            "display": "BNT wurde geändert"
                                        }
                                    ]
                                }
                            ],
                            "value": "Yes",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>BNT wurde geändert</td></tr><tr><td>Yes</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "DNMSQuest - Dystonia Non-Motor Symptoms Questionnaire",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "CUSTOM: SCORES_DNMSQUEST",
                                            "display": "DNMSQuest - Dystonia Non-Motor Symptoms Questionnaire"
                                        }
                                    ]
                                }
                            ],
                            "value": 22,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>DNMSQuest - Dystonia Non-Motor Symptoms Questionnaire</td></tr><tr><td>22</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Date of birth",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 184099003",
                                            "display": "Date of birth"
                                        }
                                    ]
                                }
                            ],
                            "value": "2000-01-01",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Date of birth</td></tr><tr><td>2000-01-01</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Gender",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 263495000",
                                            "display": "Gender"
                                        }
                                    ]
                                }
                            ],
                            "value": "Female",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Gender</td></tr><tr><td>Female</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Gruppe",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 246261001",
                                            "display": "Gruppe"
                                        }
                                    ]
                                }
                            ],
                            "value": "Gruppe1",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Gruppe</td></tr><tr><td>Gruppe1</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "MOCA",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 72133-2",
                                            "display": "MOCA"
                                        }
                                    ]
                                }
                            ],
                            "value": "Yes",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>MOCA</td></tr><tr><td>Yes</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "MOCA Total Score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 72172-0",
                                            "display": "MOCA Total Score"
                                        }
                                    ]
                                }
                            ],
                            "value": 28,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>MOCA Total Score</td></tr><tr><td>28</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Principal diagnosis",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 8319008",
                                            "display": "Principal diagnosis"
                                        }
                                    ]
                                }
                            ],
                            "value": "Alzheimer dementia",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Principal diagnosis</td></tr><tr><td>Alzheimer dementia</td></tr></tbody></table>"
                            }
                        }
                    ]
                },
                {
                    "title": "Visite: 5",
                    "code":
                    [
                        {
                            "coding":
                            [
                                {
                                    "system": "http://snomed.info/sct",
                                    "code": 308335008,
                                    "display": "Visite: 5"
                                }
                            ]
                        }
                    ],
                    "text":
                    {
                        "status": "generated",
                        "div": "<h1>Visite: 5</h1>"
                    },
                    "entry":
                    [
                        {
                            "title": "Age",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 63900-5",
                                            "display": "Age"
                                        }
                                    ]
                                }
                            ],
                            "value": 33,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Age</td></tr><tr><td>33</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Date of birth",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 184099003",
                                            "display": "Date of birth"
                                        }
                                    ]
                                }
                            ],
                            "value": "2000-01-01",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Date of birth</td></tr><tr><td>2000-01-01</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "Gender",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "SCTID: 263495000",
                                            "display": "Gender"
                                        }
                                    ]
                                }
                            ],
                            "value": "Female",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>Gender</td></tr><tr><td>Female</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "MOCA",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 72133-2",
                                            "display": "MOCA"
                                        }
                                    ]
                                }
                            ],
                            "value": "Yes",
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>MOCA</td></tr><tr><td>Yes</td></tr></tbody></table>"
                            }
                        },
                        {
                            "title": "MOCA Total Score",
                            "code":
                            [
                                {
                                    "coding":
                                    [
                                        {
                                            "system": "http://snomed.info/sct",
                                            "code": "LID: 72172-0",
                                            "display": "MOCA Total Score"
                                        }
                                    ]
                                }
                            ],
                            "value": 29,
                            "text":
                            {
                                "status": "generated",
                                "div": "<table><tbody><tr><td>MOCA Total Score</td></tr><tr><td>29</td></tr></tbody></table>"
                            }
                        }
                    ]
                }
            ]
        },
        "hash":
        {
            "signature": "FJp3wM+k+qrJ8V0TxkXrFEYiYuIu5TGNK0trRCr2cfejIiIOTM0mUqtkGEzXML8jhryC0Dgq7kNJ/2Hmn8+iCw==",
            "method": "SHA256",
            "publicKey": "-----BEGIN PUBLIC KEY-----\r\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJIh5mgzXTSMvIxB55giNK0KDEbMlUIS\r\njvDI1RN8mmmsDifvpvq499rxDy4y4hk3pDHXP4HHlnuvmw2beERg2UkCAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n"
        }
    }