# Über diese App

Diese App soll ein einfaches Ausfüllen von Online-Fragebögen ermöglichen. Sollten Sie ein Template verwenden, dass auf einem Fragebogen mit Copyright beruht, bitten wir Sie, den Rechteinhaber selber zu kontaktieren. Diese App ist nur ein Hilfsmittel!

Diese App sendet keine Daten zu einem Server, alle erhobenen Daten bleiben auf dem lokalen Gerät. Der Nutzer ist für die Verwendung der Daten selber zuständig.

**Features**: 
- Einfaches und schnelles Design
- optimiert für mobile Endgeräte (mobile first)
- Fragebögen als offenes Format (JSON)
- kompatible zu medizinischen Standards: lokales Speichern und Exportieren in 
    - HL7: [https://www.hl7.org](https://www.hl7.org)
    - CDA-JSON: [zur Beschreibung](https://build.fhir.org/ig/HL7/cda-core-2.0/branches/master/StructureDefinition-ClinicalDocument.profile.json.html)
- Sicherheit:
    - RSA/AES verschlüsselter Export / Import von Dokumenten
    - Audit-ready: jedes Dokument wird intern mit einer Sicherheitssignatur versehen und ist Fälschungssicher
    - RSA signature mit private und publicKey
- FHIR-HL7 ready (bereit für Kommunikation mit einer FHIR-HL7 kompatiblen REST-API)

**PRIVACY**: 
- Diese Web-App **sendet keinerlei Daten** an Dritte. 
- Alle erhobenenen Fragebögen werden im lokalen Browserspeicher gespeichert und werden beim Löschen komplett entfernt.
- **Cookies: werden nicht angelegt und nicht gespeichert**.
- Fragebogentemplates können als JSON vom Server der Webapp abgerufen werden bzw. neu als Text/JSON importiert werden. Dabei werden **zu keinem Zeitpunkt Daten versendet**.