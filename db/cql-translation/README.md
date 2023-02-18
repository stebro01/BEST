

## Resources:


[https://cql.hl7.org/2017Jul/04-logicalspecification.html#date-and-time-operators]

[https://cql.hl7.org/02-authorsguide.html#list-values]

## Usage
to translate CQL > EML/JSON use: ../cql-translation/docker-compose up
>>> service is available via port 8082

ie:

curl --location --request POST 'localhost:8082/cql/translator' \
--header 'Content-Type: application/cql' \
--header 'Accept: application/elm+json' \
--data-raw 'using QDM // version '\''4.2'\''

parameter MeasurementPeriod Interval<DateTime>

context Patient

define "In Demographic":
  AgeInYearsAt(start of MeasurementPeriod) >= 2
  and AgeInYearsAt(start of MeasurementPeriod) < 18

'