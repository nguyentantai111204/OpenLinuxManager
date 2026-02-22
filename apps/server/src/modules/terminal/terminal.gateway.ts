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

    /**
     * Handle new WebSocket connection
     */
    handleConnection(client: Socket) {
        this.logger.log(`Terminal client connected: ${client.id}`);

        // Create a new PTY session for this client
        const session = this.terminalService.createSession(client.id);

        // Listen to PTY output and send to client
        session.ptyProcess.on('data', (data: string) => {
            client.emit('terminal:output', data);
        });

        // Handle PTY exit
        session.ptyProcess.on('exit', (code: number) => {
            this.logger.log(`PTY process exited with code ${code} for client ${client.id}`);
            client.emit('terminal:exit', { code });
            this.terminalService.killSession(client.id);
        });

        // Send welcome message
        client.emit('terminal:output', '\r\n\x1b[1;32m=== OpenLinuxManager Web Terminal ===\x1b[0m\r\n\r\n');
    }

    /**
     * Handle WebSocket disconnection
     */
    handleDisconnect(client: Socket) {
        this.logger.log(`Terminal client disconnected: ${client.id}`);
        this.terminalService.killSession(client.id);
    }

    /**
     * Handle input from client (user typing)
     */
    @SubscribeMessage('terminal:input')
    handleInput(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): void {
        const success = this.terminalService.writeToSession(client.id, data);
        if (!success) {
            client.emit('terminal:error', 'Session not found');
        }
    }

    /**
     * Handle terminal resize
     */
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
