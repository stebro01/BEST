# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

### v1.7.2

#### Added

- [2025-04-23] Added a new questionnaire: PDSS
- [2025-04-04] Added a new questionnaire: PD On/Demand for documenting on-demand therapy in Parkinson's disease, MNA
- [2025-03-06] Added a new questionnaire: VR Study for Max Schulze
- [2025-01-31] Added a new questionnaire: more scale
- [2024-12-10] Added a new questionnaire: AEB
- [2024-06-30] Added a new button to export a json file.
- [2024-02-06] Added a new questionnaire: BSI, CBI, PSQ18, QOL-AD
- [2024-01-26] Added a new questionnaire: VAS
- [2023-12-21] Added a new questionnaire: MDS-UPDRS I - IV
- [2023-12-21] Presets can be edited and deleted
- [2023-12-21] Filter for stored questionnaires includes an option for filtering by export status

#### Changed

- [2024-05-30] Changes: Parkinson/Anamnese
- [2024-02-05] Changed: AES
- [2024-01-11] Changed: AES, PNAS
- [2024-01-02] QuestMan class is now a singleton to avoid multiple instances and be usable in dbBEST, Logger.js is now a reference to the logger.js from dbBEST to avoid multiple software versions
- [2024-01-02] minor bugfixes and new quests
- [2023-12-24] export fileformat is now: `PID_quest_UID.html/json`

#### Fixed

- [2024-01-31] Fixed: AES (some value were changed from string to number)
- [2024-01-11] Fixed a bug, that the export button was not working

### v1.7.1

#### Added

- [2023-09-09] Added a new questionnaire: FIM, TINETTI, 6MWT, McGill, ParkMove

#### Changed

- [2023-09-09] Numeric values will be checked for validity (not string) and will be converted to numbers if nessesary
- [2023-09-09] switched from emailjs to a custom email service on http://178.254.43.96:3000/sendEmail via POST request and nodemailer

#### Fixed

- [2023-09-09] Fixed a bug, that if different questionnaires were stored from within different tabs, some data got lost
