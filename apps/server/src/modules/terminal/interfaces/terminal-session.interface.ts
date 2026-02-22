export interface TerminalSession {
    socketId: string;
    ptyProcess: any; // IPty from node-pty
    cols: number;
    rows: number;
    createdAt: Date;
}
