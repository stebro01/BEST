#!/bin/bash

# FTP-Verbindungsinformationen
FTP_HOST="webhosting17.1blu.de"
FTP_USER="ftp332184-2755677"
FTP_PASS="E1NJyzbsi@p9Zgl"

# Pfad zur lokalen Quellendatei
LOCAL_DIR="./dist/spa"

# Pfad zum entfernten Zielordner
REMOTE_DIR="www"

# FTP-Verbindung aufbauen
ftp -n $FTP_HOST <<END_SCRIPT
quote USER $FTP_USER
quote PASS $FTP_PASS

# Lokales Verzeichnis ändern
lcd $LOCAL_DIR

# Remote-Verzeichnis ändern
cd $REMOTE_DIR

# Dateien hochladen
prompt
binary
hash

# GEHT NOCH TNICHT!!!!

quit
END_SCRIPT

exit 0

echo 'upload erfolgreich'