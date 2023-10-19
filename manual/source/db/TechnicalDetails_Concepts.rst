
Concepts
........

.. NOTE::

   Further details can be found in the Appendix.

In our database design, the CONCEPT_DIMENSION plays a key role in defining the nature of observations derived from various sources such as LOINC or Snomed/CT. Each concept is identified by a unique CONCEPT_CD, which serves as a definitive code for the observed data. To further specify the type of data an observation contains, we introduce the VALTYPE_CD field.

Overview
++++++++

The following table provides an overview of the concepts that have been implemented.

============  ========================================== ============= ===================================================================
 Concept       Description                                API           External Reference       
============  ========================================== ============= ===================================================================
 LOINC         Logical Observation Identifiers                          [LOINC Website](https://loinc.org)
 SNOMED-CT     Systematized Nomenclature of Medicine        X          [SNOMED Website](https://www.snomed.org)
 ICD10         International Classification of Diseases                 [ICD10 Website](https://www.who.int/classifications/icd/en/)
 CUSTOM        Customized Codes                                          N/A
============  ========================================== ============= ===================================================================

Managing Concepts
+++++++++++++++++

.. NOTE::

   For SNOMED, we offer an access to the SNOMED-CT API from the user interface during concept editing.

   .. figure:: ./_img/img_db_concept_api.png
      :width: 100%
      :align: center

      When you select `SNOMED` as the `SOURCESYSTEM_CD`, an API query option becomes available, symbol is denoted by a green arrow. This query feature allows you to search for `SNOMED` concepts and obtain the corresponding `CONCEPT_CD` and `CONCEPT_PATH`, or to retrieve information associated with a specific `CONCEPT_CD`.

   .. WARNING::

      This marks the sole external connection the database currently utilizes. Only information related to concepts will be transmitted. The URLs for this functionality are hardcoded in the corresponding JavaScript file.

      .. code-block:: javascript

         const url_full = 'https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/2023-02-28/concepts'
         const url_short = 'https://browser.ihtsdotools.org/snowstorm/snomed-ct/MAIN/2023-02-28/concepts'
         const url_descriptions = 'https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/descriptions'




.. NOTE::

   Concepts are stored with the SQLite database in the table CONCEPT_DIMENSION. The table is created when the database is initialized. 

   The UI allows concepts to be managed (added, edited, deleted). In addition, concepts can be exported and imported from the UI using a JSON file.

Related Concepts
++++++++++++++++

When using concepts of the VALTYPE_CD = 'S' (selection) answers are defined by the hierarchy of the concept in the CONCEPT_PATH.

Sometimes, similar answers should be provided for different concepts, i.e.

- NIHS Score Item: 4a. Left Arm (LID: 70190-4)
- NIHS Score Item: 4b. Right Arm (LID: 70967-5)

Therefore we introduced the concept of concept aliases or `related concepts`. This is illustrated in the following figure.

.. figure:: ./_img/img_db_concept_related.png
   :width: 100%
   :align: center

   The concept `LID: 70190-4` serves as the primary concept, whereas `LID: 70967-5` functions as an alias. These two are linked through the `RELATED_CONCEPT` column. Consequently, the alias inherits the same set of answers as the primary concept.