
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as util from 'util';

const exec = util.promisify(child_process.exec);

export interface SystemUser {
    username: string;
    uid: number;
    gid: number;
    home: string;
    shell: string;
}

@Injectable()
export class UserManagementService {
    private readonly logger = new Logger(UserManagementService.name);
    private readonly debugLogFile = '/home/nguyentantai/OpenLinuxManager/debug-users.log'; // Absolute path for safety

    private logToFile(message: string) {
        fs.appendFileSync(this.debugLogFile, `${new Date().toISOString()} - ${message}\n`);
    }

    /**
     * Get list of physical users (UID >= 1000)
     */
    async getUsers(): Promise<SystemUser[]> {
        try {
            const content = fs.readFileSync('/etc/passwd', 'utf-8');
            const lines = content.split('\n');
            const users: SystemUser[] = [];

            this.logToFile(`Parsing /etc/passwd: ${lines.length} lines`);

            lines.forEach(line => {
                const parts = line.split(':');
                if (parts.length < 7) return;

                const username = parts[0];
                const uid = parseInt(parts[2], 10);
                const gid = parseInt(parts[3], 10);
                const home = parts[5];
                const shell = parts[6];

                // Log every user found for debugging
                // this.logToFile(`Found user: ${username} (UID: ${uid})`);
                this.logToFile(`Found user: ${username} (UID: ${uid})`);

                // Filter for regular users (typically UID >= 1000) and avoid nobody
                if (uid >= 1000 && username !== 'nobody') {
                    this.logToFile(`Including user: ${username} (UID: ${uid})`);
                    users.push({ username, uid, gid, home, shell });
                } else {
                    this.logToFile(`Skipping user: ${username} (UID: ${uid})`);
                }
            });

            this.logToFile(`Total users found: ${users.length}`);
            return users;
        } catch (error) {
            this.logToFile(`Error getting users: ${(error as Error).message}`);
            this.logger.error('Error getting users', error);
            throw error;
        }
    }

    /**
     * Create a new system user
     */
    async createUser(username: string, password?: string): Promise<{ success: boolean; message: string }> {
        if (!username) {
            return { success: false, message: 'Username is required' };
        }

        try {
            this.logToFile(`Attempting to create user: ${username}`);

            // Create user with home directory and bash shell
            // Use -n for non-interactive mode to fail fast if password is required
            await exec(`sudo -n useradd -m -s /bin/bash ${username}`);

            // Set password if provided
            if (password) {
                try {
                    // Pipe password to chpasswd
                    const cmd = `echo "${username}:${password}" | sudo -n chpasswd`;
                    await exec(cmd);
                } catch (pwdError) {
                    this.logToFile(`Error setting password for ${username}: ${(pwdError as Error).message}`);
                    // Cleanup: Delete the user we just created
                    try {
                        await exec(`sudo -n userdel -r ${username}`);
                        this.logToFile(`Cleaned up user ${username} after password failure`);
                    } catch (cleanupError) {
                        this.logToFile(`Failed to cleanup user ${username}: ${(cleanupError as Error).message}`);
                    }
                    throw pwdError; // Re-throw to be caught by outer catch
                }
            }

            this.logToFile(`User ${username} created successfully`);
            return { success: true, message: `User ${username} created successfully` };
        } catch (error) {
            this.logToFile(`Error creating user ${username}: ${(error as Error).message}`);
            this.logger.error(`Error creating user ${username}`, error);
            const errorMessage = (error as Error).message;

            if (errorMessage.includes('password is required') || errorMessage.includes('sudo: a password is required')) {
                return {
                    success: false,
                    message: `Permission denied. Please run './setup-sudo.sh' in the project root to configure passwordless sudo.`
                };
            }

            return { success: false, message: `Failed to create user: ${errorMessage}` };
        }
    }

    /**
     * Delete a system user
     */
    async deleteUser(username: string): Promise<{ success: boolean; message: string }> {
        if (!username) {
            return { success: false, message: 'Username is required' };
        }

        try {
            // Delete user and home directory
            await exec(`sudo -n userdel -r ${username}`);
            return { success: true, message: `User ${username} deleted successfully` };
        } catch (error) {
            this.logger.error(`Error deleting user ${username}`, error);
            const errorMessage = (error as Error).message;

            if (errorMessage.includes('password is required') || errorMessage.includes('sudo: a password is required')) {
                return {
                    success: false,
                    message: `Permission denied. Please run './setup-sudo.sh' in the project root to configure passwordless sudo.`
                };
            }

            return { success: false, message: `Failed to delete user: ${errorMessage}` };
        }
    }
}
