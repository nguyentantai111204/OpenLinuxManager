#!/bin/bash

# Get the actual user (not root if run with sudo)
ACTUAL_USER=$(logname || echo $SUDO_USER || echo $USER)

if [ -z "$ACTUAL_USER" ]; then
    echo "Error: Could not detect user."
    exit 1
fi

echo "Configuring passwordless sudo for user: $ACTUAL_USER"

# Define the sudoers content
SUDOERS_CONTENT="$ACTUAL_USER ALL=(root) NOPASSWD: /usr/sbin/useradd, /usr/sbin/userdel, /usr/sbin/chpasswd, /usr/sbin/usermod"
SUDOERS_FILE="/etc/sudoers.d/openlinuxmanager"

# Create the sudoers file
echo "Creating $SUDOERS_FILE..."
echo "$SUDOERS_CONTENT" | sudo tee $SUDOERS_FILE > /dev/null

# Validate sudoers file
echo "Validating sudoers configuration..."
if sudo visudo -c -f $SUDOERS_FILE; then
    echo "Success! Passwordless sudo configured for user management commands."
    echo "You can now create and delete users from the web interface without password prompts."
else
    echo "Error: Sudoers file validation failed. Removing..."
    sudo rm $SUDOERS_FILE
    exit 1
fi
