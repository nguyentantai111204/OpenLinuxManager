import { Injectable, Logger, HttpException, HttpStatus, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { CommandRunnerService } from '../../system/services/command-runner.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { SystemUser } from './user-management.interface';

export { SystemUser };

@Injectable()
export class UserManagementService {
    private readonly logger = new Logger(UserManagementService.name);

    constructor(
        private readonly commandRunner: CommandRunnerService,
        private readonly auditLogService: AuditLogService,
    ) { }

    /**
     * Get list of physical users (UID >= 1000)
     */
    async getUsers(): Promise<SystemUser[]> {
        try {
            const content = fs.readFileSync('/etc/passwd', 'utf-8');
            const users: SystemUser[] = [];

            for (const line of content.split('\n')) {
                const parts = line.split(':');
                if (parts.length < 7) continue;

                const username = parts[0];
                const uid = parseInt(parts[2], 10);
                const gid = parseInt(parts[3], 10);
                const home = parts[5];
                const shell = parts[6];

                if (uid >= 1000 && username !== 'nobody') {
                    users.push({ username, uid, gid, home, shell });
                }
            }

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
            await this.commandRunner.run('sudo', ['-n', 'useradd', '-m', '-s', '/bin/bash', username]);

            if (password) {
                try {
                    const input = `${username}:${password}`;
                    await this.commandRunner.runWithInput('sudo', ['-n', 'chpasswd'], input);
                } catch (pwdError) {
                    this.logger.error(`Failed to set password for "${username}", rolling back`, pwdError);
                    try {
                        await this.commandRunner.run('sudo', ['-n', 'userdel', '-r', username]);
                    } catch (cleanupError) {
                        this.logger.warn(`Failed to clean up user "${username}" after password error`, cleanupError);
                    }
                    throw pwdError;
                }
            }

            await this.auditLogService.createLog('CREATE_USER', username, 'User created successfully');
            return { message: `User ${username} created successfully` };
        } catch (error) {
            this.logger.error(`Error creating user "${username}"`, error);
            this.handleSudoError(error);
            throw new InternalServerErrorException(`Failed to create user: ${(error as Error).message}`);
        }
    }

    async deleteUser(username: string): Promise<{ message: string }> {
        if (!username) {
            throw new BadRequestException('Username is required');
        }

        try {
            await this.commandRunner.run('sudo', ['-n', 'userdel', '-r', username]);
            await this.auditLogService.createLog('DELETE_USER', username, 'User deleted successfully');
            return { message: `User ${username} deleted successfully` };
        } catch (error) {
            this.logger.error(`Error deleting user "${username}"`, error);
            this.handleSudoError(error);
            throw new InternalServerErrorException(`Failed to delete user: ${(error as Error).message}`);
        }
    }

    /**
     * Throws a 403 HttpException when the error indicates missing sudo privileges.
     * Call this before any generic fallback throw.
     */
    private handleSudoError(error: unknown): void {
        const msg = (error as Error).message ?? '';
        if (msg.includes('password is required') || msg.includes('sudo: a password is required')) {
            throw new HttpException(
                `Permission denied. Please run './setup-sudo.sh' in the project root to configure passwordless sudo.`,
                HttpStatus.FORBIDDEN,
            );
        }
    }
}
