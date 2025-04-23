#!/bin/bash

# SSH connection details
SSH_USER="ubuntu"
SSH_HOST="138.2.147.185"
SSH_KEY="~/.ssh/ssh-key-2025-03-08.key"

# Local source directory
LOCAL_DIR="./dist/pwa"

# Remote target directory
REMOTE_DIR="/home/ubuntu/MyProjects/SERVER_STE_2025/www/surveybest"

# Create remote directory if it doesn't exist
ssh -C -i $SSH_KEY $SSH_USER@$SSH_HOST "mkdir -p $REMOTE_DIR"

# Copy files using SCP with compression
scp -C -i $SSH_KEY -r $LOCAL_DIR/* $SSH_USER@$SSH_HOST:$REMOTE_DIR/

echo 'Upload erfolgreich'
exit 0
