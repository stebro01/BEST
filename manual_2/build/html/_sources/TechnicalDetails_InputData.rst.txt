
Entering Data / Data Types
..........................

A major focus of this research database application/concept is the collection of different types of data. Therefore, this section will focus on this aspect.

Data Types and definition of schemes
++++++++++++++++++++++++++++++++++++

The data type of a variable is defined by the CONCEPT_CD field in the CONCEPT_DIMENSION table (`please refer to the appendix of this section for further details`). The following principle data types are supported:

===========  =========================================================
Data Type     Description
===========  =========================================================
N             Coded for numeric data.
T             Coded for textual data.
D             Encoded for date types and follows the YYYY-MM-DD 
              format.
R             Coded for raw data, to accommodate unprocessed or 
              unformatted information directly from the data source. 
              This type is used for variable images and other binary 
              data.
F             Coded for findings, indicating whether a particular 
              clinical feature is present, with options such as 
              'yes', 'no' and 'unknown'.
S             Coded for choices, often showing answers attached in 
              the CONCEPT_PATH.
A             Coded for answers to choices ('S'), often showing 
              answers attached in the CONCEPT_PATH
===========  =========================================================

The following figures show the definition of a scheme using various data types:

.. figure:: _img/img_data_input_example01.png
   :align: center
   :width: 100%

   Screenshot from the user interface showing the definition of a schema with different data types.

.. figure:: _img/img_data_input_example02.png
   :align: center
   :width: 400 px

   Further details of the example scheme.

.. NOTE:: 

    The different observations are associated with different data types. Note that there are different types of `MoCA`, one representing a `finding` (indicating that the patient has been tested for `MoCA`), the other representing the `numeric value` of the test. 

    LID indicates a LOINC-ID, which is a unique identifier for a particular LOINC concept.

Scheme definition
.................

.. NOTE::

    `Schemes` represent a set of observations. Defining a scheme and consequently using the scheme for data input is a fast and efficient way to enter data. However, it is also possible to enter data without defining a scheme. This is useful for one-time data entry or for data that is not part of a scheme.

The `Schemes` can be managed using the UI in the `Settings / Schemes` tab. Administrative rights are required to manage the schemas.

The scheme definition is stored within the database in the `CODE_LOOKUP` table.

The following image shows the scheme definition of the example scheme from the previous section:

.. figure:: _img/img_data_input_schemeindb.png
   :align: center
   :width: 100%

   Screenshot created using SQL DB Browser showing the scheme definition in the database.


Entering data using a scheme
............................

To **input observations using a scheme**, a `patient` and a `visit` must be selected in the UI. By clicking on the `Add` button, the user can select a scheme from the list of available schemes.

.. figure:: _img/img_data_input_scheme.png
   :align: center
   :width: 100%

   Screenshot from the user interface showing a scheme.

The data is then stored in the database to the `OBSERVATION_FACT` table. The following images shows the data that was entered using the scheme from the previous section:

.. figure:: _img/img_data_input_db.png
   :align: center
   :width: 100%

   Screenshots from the user interface display data entered according to the schema outlined in the previous section, as viewed through `SQL DB Browser`.

.. NOTE::

    Instead of using the column `OBSERVATION_FACT`, the view `patient_observations` is employed. This view translates `CONCEPT_CD` to `CONCEPT_NAME_CHAR` and `TVAL_CHAR` to `TVAL_RESOLVED`.
