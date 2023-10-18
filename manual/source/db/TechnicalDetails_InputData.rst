
Entering Data / Data Types
..........................

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

