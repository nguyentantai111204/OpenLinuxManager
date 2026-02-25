import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as pty from 'node-pty';
import { TerminalSession } from './interfaces/terminal-session.interface';

@Injectable()
export class TerminalService implements OnModuleInit {
    private readonly logger = new Logger(TerminalService.name);
    private sessions: Map<string, TerminalSession> = new Map();
    private readonly SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    private readonly CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

    onModuleInit() {
        this.startCleanupInterval();
    }

    private startCleanupInterval() {
        setInterval(() => {
            this.cleanupOrphanedSessions();
        }, this.CLEANUP_INTERVAL_MS);
        this.logger.log('Terminal session cleanup interval started');
    }

    private cleanupOrphanedSessions() {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [socketId, session] of this.sessions.entries()) {
            const inactiveTime = now - session.lastActivityAt;
            if (inactiveTime > this.SESSION_TIMEOUT_MS) {
                this.logger.log(`Cleaning up orphaned/inactive terminal session: ${socketId} (Inactive for ${Math.round(inactiveTime / 1000 / 60)} mins)`);
                this.killSession(socketId);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            this.logger.log(`Cleaned up ${cleanedCount} inactive sessions. Total sessions remaining: ${this.sessions.size}`);
        }
    }

    /**
     * Create a new PTY session for a socket
     */
    createSession(socketId: string, cols: number = 80, rows: number = 30): TerminalSession {
        this.logger.log(`Creating terminal session for socket: ${socketId}`);

        // Spawn a new shell process
        const shell = process.env.SHELL || '/bin/bash';
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols,
            rows,
            cwd: process.env.HOME || process.cwd(),
            env: process.env as any,
        });

        const session: TerminalSession = {
            socketId,
            ptyProcess,
            cols,
            rows,
            createdAt: new Date(),
            lastActivityAt: Date.now(),
        };

        this.sessions.set(socketId, session);
        this.logger.log(`Terminal session created. Total sessions: ${this.sessions.size}`);

        return session;
    }

    /**
     * Write data to a PTY session
     */
    writeToSession(socketId: string, data: string): boolean {
        const session = this.sessions.get(socketId);
        if (!session) {
            this.logger.warn(`Session not found for socket: ${socketId}`);
            return false;
        }

        session.lastActivityAt = Date.now();
        session.ptyProcess.write(data);
        return true;
    }

    /**
     * Resize a PTY session
     */
    resizeSession(socketId: string, cols: number, rows: number): boolean {
        const session = this.sessions.get(socketId);
        if (!session) {
            this.logger.warn(`Session not found for socket: ${socketId}`);
            return false;
        }

        try {
            session.lastActivityAt = Date.now();
            session.ptyProcess.resize(cols, rows);
            session.cols = cols;
            session.rows = rows;
            this.logger.log(`Resized terminal ${socketId} to ${cols}x${rows}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to resize terminal: ${error.message}`);
            return false;
        }
    }

    /**
     * Kill a PTY session and clean up
     */
    killSession(socketId: string): boolean {
        const session = this.sessions.get(socketId);
        if (!session) {
            this.logger.warn(`Session not found for socket: ${socketId}`);
            return false;
        }

        try {
            session.ptyProcess.kill();
            this.sessions.delete(socketId);
            this.logger.log(`Terminal session killed for socket: ${socketId}. Remaining: ${this.sessions.size}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to kill terminal session: ${error.message}`);
            return false;
        }
    }

    /**
     * Get a session by socket ID
     */
    getSession(socketId: string): TerminalSession | undefined {
        return this.sessions.get(socketId);
    }
}

