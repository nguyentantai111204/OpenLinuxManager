import { Injectable, Logger, HttpException, HttpStatus, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { CommandRunnerService } from '../../system/services/command-runner.service';

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
    private readonly debugLogFile = '/home/nguyentantai/OpenLinuxManager/debug-users.log';

    constructor(private readonly commandRunner: CommandRunnerService) { }

    private logToFile(message: string) {
        try {
            fs.appendFileSync(this.debugLogFile, `${new Date().toISOString()} - ${message}\n`);
        } catch (e) {
            this.logger.error('Failed to write to debug log file', e);
        }
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

                if (uid >= 1000 && username !== 'nobody') {
                    users.push({ username, uid, gid, home, shell });
                }
            });

            this.logToFile(`Total users found: ${users.length}`);
            return users;
        } catch (error) {
            this.logger.error('Error getting users', error);
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }

    /**
     * Create a new system user
     */
    async createUser(username: string, password?: string): Promise<{ message: string }> {
        if (!username) {
            throw new BadRequestException('Username is required');
        }

        try {
            this.logToFile(`Attempting to create user: ${username}`);

           
            await this.commandRunner.run('sudo', ['-n', 'useradd', '-m', '-s', '/bin/bash', username]);

            if (password) {
                try {
                    
                    const input = `${username}:${password}`;
                    await this.commandRunner.runWithInput('sudo', ['-n', 'chpasswd'], input);
                } catch (pwdError) {
                    this.logToFile(`Error setting password for ${username}: ${(pwdError as Error).message}`);
                    try {
                        await this.commandRunner.run('sudo', ['-n', 'userdel', '-r', username]);
                        this.logToFile(`Cleaned up user ${username} after password failure`);
                    } catch (cleanupError) {
                        this.logToFile(`Failed to cleanup user ${username}: ${(cleanupError as Error).message}`);
                    }
                    throw pwdError;
                }
            }

            this.logToFile(`User ${username} created successfully`);
            return { message: `User ${username} created successfully` };
        } catch (error) {
            const errorMessage = (error as Error).message;
            this.logToFile(`Error creating user: ${errorMessage}`);
            this.logger.error(`Error creating user ${username}`, error);

            if (errorMessage.includes('password is required') || errorMessage.includes('sudo: a password is required')) {
                throw new HttpException(
                    `Permission denied. Please run './setup-sudo.sh' in the project root to configure passwordless sudo.`,
                    HttpStatus.FORBIDDEN
                );
            }

            throw new InternalServerErrorException(`Failed to create user: ${errorMessage}`);
        }
    }

    async deleteUser(username: string): Promise<{ message: string }> {
        if (!username) {
            throw new BadRequestException('Username is required');
        }

        try {
            await this.commandRunner.run('sudo', ['-n', 'userdel', '-r', username]);
            return { message: `User ${username} deleted successfully` };
        } catch (error) {
            const errorMessage = (error as Error).message;
            this.logger.error(`Error deleting user ${username}`, error);

            if (errorMessage.includes('password is required') || errorMessage.includes('sudo: a password is required')) {
                throw new HttpException(
                    `Permission denied. Please run './setup-sudo.sh' in the project root to configure passwordless sudo.`,
                    HttpStatus.FORBIDDEN
                );
            }

            throw new InternalServerErrorException(`Failed to delete user: ${errorMessage}`);
        }
    }
}

