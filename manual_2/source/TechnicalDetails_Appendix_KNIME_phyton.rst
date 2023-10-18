Python script to convert sqlite data to a KNIME data frame
...........................................................

.. code-block:: python

    # v20230825-1052 @sb
    
    import knime.scripting.io as knio
    import numpy as np
    import pandas as pd

    # create DATA Frame
    data = knio.input_tables[0].to_pandas()

    # create list of patients
    PATIENTS_unique = data['PATIENT_CD'].unique()
    print('Patienten gefunden:', len(PATIENTS_unique))

    # create list of encounters
    ENCOUNTERS_unique = data['ENCOUNTER_NUM'].unique()
    print('Visiten gefunden:', len(ENCOUNTERS_unique))

    # create list of concepts
    CONCEPTS_unique = data['CONCEPT_NAME_CHAR'].unique()
    print('CONCEPTS gefunden:', len(CONCEPTS_unique))

    # create a new DATA Frame
    columns = ['PATIENT_CD', 'ENCOUNTER_NUM', 'START_DATE'] + list(CONCEPTS_unique)
    DATA = pd.DataFrame(columns=columns)

    # loop through patients
    count = 0
    for patient in PATIENTS_unique:
        count += 1
        print('bearbeite:', patient)
        filtered_data = data[data['PATIENT_CD'] == patient]
        encounters = filtered_data['ENCOUNTER_NUM'].unique()
        enc_counter = 0
        for enc in encounters:
        enc_counter += 1
        new_row = {col: None for col in columns}
        new_row['PATIENT_CD'] = patient
        new_row['ENCOUNTER_NUM'] = enc_counter
        
        observations = filtered_data[filtered_data['ENCOUNTER_NUM'] == enc]
        cc = 0
        for index, obs in observations.iterrows():
                if obs['VALTYPE_CD'] == 'N':
                    val = obs['NVAL_NUM_REAL'] #i created this column to contain real data
    #                print(val, obs['NVAL_NUM_REAL'])
                else:
                    val = obs['TVAL_RESOLVED'] if pd.notnull(obs['TVAL_RESOLVED']) else obs['TVAL_CHAR']
                # set value
                new_row[obs['CONCEPT_NAME_CHAR']] = val
                
                # set date
                if cc == 1:
                    new_row['START_DATE'] = obs['START_DATE']
                cc += 1

    # add columns
        DATA = pd.concat([DATA, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    
    # prepare the output
    output_table = knio.Table.from_pandas(DATA)
    knio.output_tables[0] = output_table

