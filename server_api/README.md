# README - WebAPI und Email-Server in einem Docker-Container

## Beschreibung

WebAPI und Email-Server in einem Docker-Container

Der Dienst läuft auf port:3000 und kann mit folgendem Call getestet werden:

```bash
curl --location 'localhost:3000/sendEmail'
```

Der Dienst kann mit folgendem Call getestet werden:

```bash
curl --location 'localhost:3000/sendEmail' \
--header 'Content-Type: application/json' \
--data-raw '{
    "TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJqMzMyMTg0XzAtc3VydmV5IiwiaWF0IjoxNjI0NjU0NjQyLCJleHAiO",
    "to": "stefan.brodoehl@gmail.com",
    "subject": "Report surveyBEST",
    "message": "Vielen Dank für die Nutzung von surveyBEST. Anbei ein Report.",
    "attachment": {
        "name": "demodata",
        "data": "today",
        "id": 123
    }
}'
```

## Installation

- Docker starten

- Docker-Container bauen und starten

```bash
docker-compose up --build
```

- Docker-Container stoppen

```bash
docker-compose down
```

## API

### GET /api

```bash
curl http://localhost:3000/api
```

