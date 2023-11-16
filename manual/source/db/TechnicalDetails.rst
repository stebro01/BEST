Technical Description of JCRdb (Jena Clinical Research Database) v1.0 
======================================================================

1. Motivation:
--------------

To provide a user-friendly, clean interface for the storage, retrieval, and visualization of multimodal clinical data at the Jena University Hospital.

2. Overview:
------------

The research database is specifically engineered for seamless integration into the desktop workspaces at Jena University Hospital. It features a streamlined, intuitive frontend for user interaction, facilitating the storage, retrieval, and visualization of multimodal clinical data. The backend employs a relational database management system optimized for efficient data handling.

Due to stringent local IT infrastructure constraints, driven primarily by the need to adhere to General Data Protection Regulations (GDPR), the database resides within the secure local network of Jena University Hospital. It is encapsulated in a single SQLite file, ensuring ease of management and high-speed access. User authentication is mandatory for database access, and connections are limited to those originating from within the hospital's local network.

The frontend operates independently from a self-contained folder and requires no installation. To interact with the SQLite database, users must have read and write permissions. Importantly, all data remains securely stored in the backend database, while the frontend serves solely as an access and manipulation tool.

The database is available to a group of staff at the University Hospital of Jena. It is not available to the public. Multiple instances (i.e. database files) can be used to manage different projects independently. The database is designed to be easily extensible, allowing the addition of new data types and functionalities. Data can also be exchanged with other database instances or other systems using a defined HL7 JSON file standard.

The following figure illustrates the principle architecture of the database:

.. figure:: _img/img_db_scheme_jena.png
   :width: 100%
   :align: center

   Overview to the database employed at the Jena University Hospital

3. Architecture:
----------------

Database templates and build software are available at: [GitHub](https://github.com/stebro01/research_database_sqlite_i2b2.git)

Frontend
........

- Technology: Developed using the Quasar/Vue.js 3 Framework, with builds available for MacOS, Linux, and Windows.
- User Interface: Intuitive and responsive, custom-built for the fast-paced, demanding environment of clinical research.
- Functionalities: Equipped with data input forms, robust search and query capabilities, and specialized data visualization tools (coming soon) designed for clinical scientists.
- Data Policy: Adheres to a strict data policy ensuring that all data remains local, fortifying user trust and GDPR compliance.


Database
........

- Database Engine: SQLite
- Data Model: Utilizes the i2b2 Common Data Model (CDM) 16 star schema, optimized for the agile storage and retrieval of multimodal clinical data.

.. figure:: _img/img_db_scheme.png
   :width: 100%
   :align: center

   Modified i2b2 Common Data Model (CDM) 16 star schema with additional tables for user management and CQL rules application.

4. Technical Details:
---------------------

======================  ==============  =========  =============  =========================================================================
Section                 Description      Version    License        Website / Additional Info
======================  ==============  =========  =============  =========================================================================
**Frontend**                                                        
VueJS 3 Framework                        3.0.5      MIT            `VueJS Official Website <https://vuejs.org/>`
Quasar Framework                         2.0.0      MIT            `Quasar Official Website <https://quasar.dev/>`
Libraries               crypto-js        4.1.1                      
                        fs               0.0.1                      
                        sqlite3          5.1.4                      
**Database**                                                        
SQLite                                   3.36.0     Public         `SQLite Official Website <https://www.sqlite.org/index.html>`
Tables                  11 Tables                                  (view figure above)
Views                   3 Views                                    cql_concept_list, patient_list, patient_observations
Triggers                3 Triggers                                 delete_concept_cql_lookup, delete_patient_cascade, delete_visite_cascade
Suggested Editor        DB Browser for  3.12.2     Public         `DB Browser for SQLite Official Website <https://sqlitebrowser.org/>`
                        SQLite
======================  ==============  =========  =============  =========================================================================

5. Key Features:
----------------

=============================  ======================  ============================================
Features                        Description             Details
=============================  ======================  ============================================
1. UI                           lightweight frontend    VueJS 3, Quasar Framework
- multiplatform                 Electron Framework      precompiled versions for 
                                                        MacOS, Linux, Windows
- adaptable                     Easy customable         HTML/CSS based design

2. Database                     SQLite DB               predefined tables, views, triggers, 
                                                        `see Appendix for details`
- lightweight                   single file             no installation required
- fast                          optimized queries       i2b2 CDM 16 star schema
- secure                        user authentication     user management is realized via access rights
                                                        to the database file, pure offline solution
                                                        without internet connection required

5. Standardized concepts                                redefined concepts based on LOINC, SNOMED/CT,
                                                        ICD10, custom definitions

4. Data Input                   via UI                  customable input forms
- single observations           add observations        available
- set of observations           via schemes             predefined sets of Concepts and observations
- meta data                                             each observation is linked to a visit and 
                                                        a patient including additional meta data, 
                                                        timestamps, and user information
                                                        AND is defined by a concept (e.g. LOINC)
                                                        defining the type of observation
- CQL rules                                             CQL rules can be applied concepts and will
                                                        be executed automatically when a new 
                                                        observation is added, `see Appendix for details`
- supported data types                                  all data types supported by SQLite
                                                        (e.g. text, integer, float, blob)
                                                        added support for Images and RAW data

5. Data Search          
- within the UI                 searching for subject   customable search form with SQLite query 
                                data and properties     available
- via SQL                       performing complex      SQL queries can be executed directly in the
                                search queries and      database using the suggested editor 
                                joints                  `DB Browser for SQLite`

6. Data Export                  via UI                  export of data in CSV format
                                via SQL                 export of data in HL7 JSON format

7. DB Management                                        Multiple functions for database management
- Concepts                                              add, edit, delete concepts within the UI
                                                        API for adding concepts from snomed/ct
- User and Rules                                        add, edit, delete users within the UI
- CQL rules                                             add, edit, delete CQL rules within the UI
=============================  ======================  ============================================

.. include:: TechnicalDetails_InputData.rst

.. include:: TechnicalDetails_Concepts.rst

Export and Import of Data
.........................

The database supports the export of data in CSV format and HL7 JSON format. The CSV format is a simple text format that can be opened with any text editor or spreadsheet program. The HL7 JSON format is a standardized format for the exchange of clinical data. The database uses the HL7 JSON format to exchange data with other instances of the database or other systems.

.. NOTE::

   In the Appendix you will find exemplary CSV and HL7 JSON files.

6. Security and Compliance:
---------------------------

In its intended use within the network of the University Hospital Jena, the database is protected by the following security measures
- the database is only available within the local network of the hospital
- the location of the database is shared only within the research study group
- only authorised users have access to the database

The database is designed to be used in a secure environment. It is not recommended to use the database in an unsecured environment. The database is not designed for use in a public environment.

By default, the research database is designed to work with data that is not considered personal data under the GDPR. However, the database may be used to store personal data. In this case, the user is responsible for compliance with the GDPR. The database is not designed for use in a public environment.

7. Integration & Extensibility:
-------------------------------

The UI front-end is a standalone application and can connect to any SQLite database file structured according to the template provided. The database file can be exchanged with other instances of the database or other systems using the HL7 JSON file standard.

There are currently no APIs available for direct interaction with the user interface. However, the database can be accessed directly via SQL queries using the suggested `DB Browser for SQLite` editor: https://sqlitebrowser.org.

.. include:: TechnicalDetails_IntegrationHL7.rst

.. include:: TechnicalDetails_IntegrationKnime.rst

.. include:: TechnicalDetails_IntegrationRDM.rst

8. Testing & Validation:
------------------------

Testing Frameworks:

- Unit Tests: using the Jest Framework (https://jestjs.io/) for testing
   - data import and export
   - CRUD operations on the database
   - CQL rules application
- Integration Tests: using the Cypress Framework (https://www.cypress.io/) for testing
   - UI testing (e.g. data input, data search, data export)

9. Conclusion & Future Work:
-----------------------------

The Research Database is a simple yet powerful tool for storing all types of clinical data in a single place. It is designed to be easily extensible, allowing new data types and functionalities to be added. Data can also be exchanged with other database instances or other systems using a defined HL7 JSON file standard.

The status as is is a first version of the database. It is already in use at the University Hospital of Jena and will be further developed in the future.

*The following features are planned for future releases:*

- Data Visualisation
- Built-in image and RAW data viewer
- Enhanced security and compliance through database file encryption

10. Acknowledgements:
---------------------

The development of the database was supported by the following institutions
- Department of Neurology, University Hospital Jena
- IMSID - Institute for Medical Statistics, Informatics and Data Science, University Hospital Jena

The following persons contributed to the development of the database
- PD Dr. Stefan Brodoehl
- Anna Schweinar, cand. med.


11. Appendix:
-------------

.. toctree::
   :maxdepth: 2

   TechnicalDetails_Appendix_Concepts
   TechnicalDetails_Appendix_SQL
   TechnicalDetails_Appendix_CQL
   TechnicalDetails_Appendix_KNIME_phyton
   TechnicalDetails_Appendix_Exports


