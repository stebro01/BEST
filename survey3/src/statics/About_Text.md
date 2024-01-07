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

## Disclaimer

Diese App ist ein **Prototyp** und wurde im Rahmen eines Forschungsprojektes entwickelt. Die App ist nicht für den produktiven Einsatz gedacht. Die App wird ohne jegliche Garantie zur Verfügung gestellt. Der Autor übernimmt keine Haftung für Schäden, die durch die Verwendung der App entstehen.

## Allgemein

Die Web-App "surveyBEST" wurde entwickelt, um Fragebögen abzufragen und gegebenenfalls auszuwerten. Wir bemühen uns, korrekte und aktuelle Informationen bereitzustellen, können jedoch keine Garantie für die Richtigkeit, Vollständigkeit, Aktualität oder Eignung der Inhalte dieser App für einen bestimmten Zweck übernehmen.

## Datenspeicherung

"surveyBEST" speichert alle eingegebenen Daten im lokalen Browser-Speicher im CDA JSON-Format. Diese Daten werden zu keinem Zeitpunkt an unsere Server oder Dritte gesendet, außer wenn dies auf ausdrücklichen Wunsch des Nutzers geschieht.

## Keine Links zu anderen Websites

"surveyBEST" enthält keine Links zu anderen Websites und leitet Nutzer nicht zu externen Webdiensten weiter. Nutzer können sicher sein, dass sie innerhalb der App bleiben, solange sie "surveyBEST" nutzen.

## Haftungsbeschränkung

Die Nutzung von "surveyBEST" erfolgt auf eigenes Risiko des Nutzers. Wir übernehmen keine Haftung für Schäden oder Verluste, die direkt oder indirekt durch die Nutzung dieser App entstehen könnten, einschließlich, aber nicht beschränkt auf, den Verlust von Daten oder Informationen, die in der App gespeichert sind.

## Kontakt

Bei Fragen oder Anmerkungen zum Datenschutz oder anderen relevanten Themen in Bezug auf "surveyBEST" kontaktieren Sie uns bitte unter

surveybest@info.de

## Lizenz

"surveyBEST" ist unter der MIT-Lizenz veröffentlicht.
