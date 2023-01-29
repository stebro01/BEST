SQLite Datenbank
================

Grundlage der Forschungsdatenbank ist eine standardisierte SQLite Datenbank.

Die folgende Abbildung zeigt den grundlegenden Aufbau.

.. figure:: _img/sqlitedb_overview.png
   :height: 300px
   :align: center

   STAR-Schema der Forschungsdatenbank.

   Im Zentrum liegt die klinische Beobachtung (OBSERVATION_FACT). Dieser ist dann eindeutig ein Patient (PATIENT_DIMENSION) und ein Erhebungszeitpunkt / Visite (VISIT_DIMENSION) zugeordnet. Jeder klinische Fakt wird eindeutig durch ein Konzept (CONCEPT_DIMENSION) definiert.

Die folgenden Abbildung zeigen nocheinmal Erläuterungen zu den Tabels der DB.

.. figure:: _img/sqlitedb_details01.png
   :height: 100px
   :align: center


.. figure:: _img/sqlitedb_details02.png
   :height: 100px
   :align: center