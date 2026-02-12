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
    private statsInterval: NodeJS.Timeout | null = null;
    private processesInterval: NodeJS.Timeout | null = null;
    private storageInterval: NodeJS.Timeout | null = null;
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
        } else {
            // For subsequent clients, emit immediate data so they don't wait for interval
            this.emitSystemStats();
            this.emitProcesses();
            this.emitStorage();
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

    private startMonitoring() {
        this.logger.log('Starting system monitoring...');

        this.emitSystemStats();
        this.statsInterval = setInterval(() => this.emitSystemStats(), 2000);

        this.emitProcesses();
        this.processesInterval = setInterval(() => this.emitProcesses(), 5000);

        this.emitStorage();
        this.storageInterval = setInterval(() => this.emitStorage(), 60000);
    }

    private stopMonitoring() {
        this.logger.log('Stopping system monitoring...');

        if (this.statsInterval) {
            clearInterval(this.statsInterval);
            this.statsInterval = null;
        }

        if (this.processesInterval) {
            clearInterval(this.processesInterval);
            this.processesInterval = null;
        }

        if (this.storageInterval) {
            clearInterval(this.storageInterval);
            this.storageInterval = null;
        }
    }

    private async emitSystemStats() {
        try {
            const stats = await this.systemMonitorService.getSystemStats();
            this.server.emit('systemStats', stats);
        } catch (error) {
            this.logger.error('Failed to emit system stats', error);
        }
    }

    private async emitProcesses() {
        try {
            const processes = await this.systemMonitorService.getSystemProcesses();
            this.server.emit('systemProcesses', processes);
        } catch (error) {
            this.logger.error('Failed to emit processes', error);
        }
    }

    private async emitStorage() {
        try {
            const storage = await this.systemMonitorService.getStorageData();
            this.server.emit('systemStorage', storage);
        } catch (error) {
            this.logger.error('Failed to emit storage data', error);
        }
    }

    onModuleDestroy() {
        this.stopMonitoring();
    }
}
