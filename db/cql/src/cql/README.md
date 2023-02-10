to translate CQL > EML/JSON use: ../cql-translation/docker-compose up
>>> service is available via port 8080

ie:

curl --location --request POST 'localhost:8080/cql/translator' \
--header 'Content-Type: application/cql' \
--header 'Accept: application/elm+json' \
--data-raw 'using QDM // version '\''4.2'\''

parameter MeasurementPeriod Interval<DateTime>

context Patient

define "In Demographic":
  AgeInYearsAt(start of MeasurementPeriod) >= 2
  and AgeInYearsAt(start of MeasurementPeriod) < 18

'