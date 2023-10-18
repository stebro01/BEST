
Integration der SQLite DB in KNIME
..................................

To analyze the data directly from the database, the SQLite DB can be seamlessly integrated into KNIME 5.1 (https://www.knime.com).

Below is an example illustrating how to incorporate the data from the SQLite DB into KNIME.


.. figure:: _img/img_data_integration_knime01.png
   :align: center
   :width: 100%

   Sample KNIME workspace to connect to the DB and transform the data into a tabular format suitable for further analysis.

.. figure:: _img/img_data_integration_knime02.png
   :align: center
   :width: 100%

   Screenshot from the output of a python script node, which is used to transform the data into a tabular format suitable for further analysis.

.. NOTE:: 

   The SQL Statement for the `DB Query Reader` is stated below:

   .. code-block:: sql

      SELECT *, CAST(NVAL_NUM AS REAL) as NVAL_NUM_REAL
      FROM patient_observations;

.. NOTE:: 

   The python script to transform the data is provided in the appendix.

   