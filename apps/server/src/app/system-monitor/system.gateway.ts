import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SystemMonitorService } from './system-monitor.service';

@WebSocketGateway({
    cors: {
        origin: '*', // In production, specify your frontend URL
    },
})
export class SystemGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(SystemGateway.name);
    private monitoringInterval: NodeJS.Timeout | null = null;
    private connectedClients = 0;

    constructor(private readonly systemMonitorService: SystemMonitorService) { }

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.connectedClients++;
        this.logger.log(`Client connected: ${client.id} (Total: ${this.connectedClients})`);

        // Start monitoring when first client connects
        if (this.connectedClients === 1) {
            this.startMonitoring();
        }
    }

    handleDisconnect(client: Socket) {
        this.connectedClients--;
        this.logger.log(`Client disconnected: ${client.id} (Total: ${this.connectedClients})`);

        // Stop monitoring when no clients are connected
        if (this.connectedClients === 0) {
            this.stopMonitoring();
        }
    }

    /**
     * Start emitting system stats every 2 seconds
     */
    private startMonitoring() {
        this.logger.log('Starting system monitoring...');

        // Emit immediately
        this.emitSystemStats();

        // Then emit every 2 seconds
        this.monitoringInterval = setInterval(() => {
            this.emitSystemStats();
        }, 2000);
    }

    /**
     * Stop monitoring interval
     */
    private stopMonitoring() {
        if (this.monitoringInterval) {
            this.logger.log('Stopping system monitoring...');
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Fetch and emit system stats to all connected clients
     */
    private async emitSystemStats() {
        try {
            const stats = await this.systemMonitorService.getSystemStats();
            this.server.emit('systemStats', stats);

            // Log only errors or every 30 seconds to avoid spam
            if (stats.error) {
                this.logger.warn('System stats error:', stats.error);
            }
        } catch (error) {
            this.logger.error('Failed to emit system stats', error);
        }
    }

    /**
     * Cleanup on module destroy
     */
    onModuleDestroy() {
        this.stopMonitoring();
    }
}
