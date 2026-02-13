#!/bin/bash
set -e

# Hardcoded user based on environment
TARGET_USER="nguyentantai"
SUDOERS_FILE="/etc/sudoers.d/openlinuxmanager"

echo "Setting up passwordless sudo for user: $TARGET_USER"

# Content with ALL required commands
# useradd: for creating users
# userdel: for deleting users
# chpasswd: for setting passwords
# usermod: for modifying groups/etc if needed
# rm: allowed for cleanup in the script itself (optional, but good for debugging)
SUDOERS_CONTENT="$TARGET_USER ALL=(root) NOPASSWD: /usr/sbin/useradd, /usr/sbin/userdel, /usr/sbin/chpasswd, /usr/sbin/usermod, /usr/bin/cat, /usr/bin/rm, /usr/bin/systemctl"

echo "Writing configuration to $SUDOERS_FILE..."
echo "$SUDOERS_CONTENT" | sudo tee $SUDOERS_FILE > /dev/null

echo "Setting file permissions to 0440..."
sudo chmod 0440 $SUDOERS_FILE

echo "Verifying syntax..."
if sudo visudo -c -f $SUDOERS_FILE; then
    echo "Syntax Verified."
else
    echo "Syntax Error! Dumping content for inspection before removal:"
    sudo cat $SUDOERS_FILE
    sudo rm $SUDOERS_FILE
    exit 1
fi

echo "Verifying active configuration..."
# Check specifically for systemctl which is needed for service management
if sudo -l -U $TARGET_USER | grep "systemctl"; then
    echo "SUCCESS: 'systemctl' is now allowed without password."
else
    echo "WARNING: 'systemctl' is NOT listed in 'sudo -l'. Configuration might be overridden."
    sudo -l -U $TARGET_USER
fi

echo "Done."
