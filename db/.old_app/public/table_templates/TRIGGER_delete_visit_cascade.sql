CREATE TRIGGER [delete_visit_cascade]
BEFORE DELETE
ON [VISIT_DIMENSION]
FOR EACH ROW
BEGIN
DELETE FROM OBSERVATION_FACT WHERE OBSERVATION_FACT.ENCOUNTER_NUM = old.ENCOUNTER_NUM;
END