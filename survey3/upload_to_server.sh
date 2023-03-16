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
ncftp -u $FTP_USER -p $FTP_PASS $FTP_HOST <<EOF
cd $REMOTE_DIR
lcd $LOCAL_DIR
put -R *
quit
EOF

exit 0

echo 'upload erfolgreich'