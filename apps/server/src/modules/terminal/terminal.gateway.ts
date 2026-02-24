import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TerminalService } from './terminal.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/terminal',
})
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(TerminalGateway.name);

    constructor(private readonly terminalService: TerminalService) { }

    handleConnection(client: Socket) {
        this.logger.log(`Terminal client connected: ${client.id}`);

        const session = this.terminalService.createSession(client.id);

        session.ptyProcess.on('data', (data: string) => {
            client.emit('terminal:output', data);
        });

        session.ptyProcess.on('exit', (code: number) => {
            this.logger.log(`PTY process exited with code ${code} for client ${client.id}`);
            client.emit('terminal:exit', { code });
            this.terminalService.killSession(client.id);
        });

        this.logger.log(`Session established for client: ${client.id}`);

        // Welcome message with improved styling
        client.emit('terminal:output', '\r\n\x1b[1;36m┌──────────────────────────────────────────┐\x1b[0m');
        client.emit('terminal:output', '\r\n\x1b[1;36m│\x1b[0m \x1b[1;32mOpenLinuxManager Web Terminal\x1b[0m   \x1b[1;36m│\x1b[0m');
        client.emit('terminal:output', '\r\n\x1b[1;36m└──────────────────────────────────────────┘\x1b[0m\r\n\r\n');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Terminal client disconnected: ${client.id}`);
        this.terminalService.killSession(client.id);
    }

    @SubscribeMessage('terminal:input')
    handleInput(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): void {
        const session = this.terminalService.getSession(client.id);
        if (!session) {
            client.emit('terminal:error', 'Session not found');
            return;
        }
        this.terminalService.writeToSession(client.id, data);
    }

    @SubscribeMessage('terminal:resize')
    handleResize(
        @MessageBody() data: { cols: number; rows: number },
        @ConnectedSocket() client: Socket,
    ): void {
        const { cols, rows } = data;
        const success = this.terminalService.resizeSession(client.id, cols, rows);
        if (!success) {
            client.emit('terminal:error', 'Failed to resize terminal');
        }
    }
}
