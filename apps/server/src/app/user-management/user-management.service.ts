
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

    /**
     * Get list of physical users (UID >= 1000)
     */
    async getUsers(): Promise<SystemUser[]> {
        try {
            const content = fs.readFileSync('/etc/passwd', 'utf-8');
            const lines = content.split('\n');
            const users: SystemUser[] = [];

            lines.forEach(line => {
                const parts = line.split(':');
                if (parts.length < 7) return;

                const username = parts[0];
                const uid = parseInt(parts[2], 10);
                const gid = parseInt(parts[3], 10);
                const home = parts[5];
                const shell = parts[6];

                // Filter for regular users (typically UID >= 1000) and avoid nobody
                if (uid >= 1000 && username !== 'nobody') {
                    users.push({ username, uid, gid, home, shell });
                }
            });

            return users;
        } catch (error) {
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
            // Create user with home directory and bash shell
            await exec(`sudo useradd -m -s /bin/bash ${username}`);

            // Set password if provided
            if (password) {
                // Pipe password to chpasswd
                const cmd = `echo "${username}:${password}" | sudo chpasswd`;
                await exec(cmd);
            }

            return { success: true, message: `User ${username} created successfully` };
        } catch (error) {
            this.logger.error(`Error creating user ${username}`, error);
            return { success: false, message: `Failed to create user: ${(error as Error).message}` };
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
            await exec(`sudo userdel -r ${username}`);
            return { success: true, message: `User ${username} deleted successfully` };
        } catch (error) {
            this.logger.error(`Error deleting user ${username}`, error);
            return { success: false, message: `Failed to delete user: ${(error as Error).message}` };
        }
    }
}
