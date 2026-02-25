export interface TerminalSession {
    socketId: string;
    ptyProcess: any;
    cols: number;
    rows: number;
    createdAt: Date;
    lastActivityAt: number;
}
