#!/bin/bash

# Configuration
APP_DIR="/home/ichangeboss/ERP-ichangeboss"
DATA_DIR="$APP_DIR/data"
BACKUP_DIR="$APP_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/erp_backup_$TIMESTAMP.tar.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ -f "$DATA_DIR/erp.db" ]; then
    echo "Starting backup of ERP Database..."
    # Create tar.gz archive of the data directory
    tar -czf "$BACKUP_FILE" -C "$APP_DIR" data/
    
    # Verify backup was created
    if [ -f "$BACKUP_FILE" ]; then
        echo "Backup successfully created: $BACKUP_FILE"
        
        # Keep only the last 7 backups (delete older ones)
        ls -tp "$BACKUP_DIR"/erp_backup_*.tar.gz | grep -v '/$' | tail -n +8 | xargs -I {} rm -- {} 2>/dev/null
        echo "Old backups cleaned up (kept last 7)."
    else
        echo "Error: Backup failed!"
        exit 1
    fi
else
    echo "Warning: Database file not found at $DATA_DIR/erp.db. Nothing to backup yet."
fi
