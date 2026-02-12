import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SystemCollectorService } from './system-collector.service';
import { Subscription } from 'rxjs';

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
    // Map socket ID to subscriptions
    private subscriptions: Map<string, Subscription[]> = new Map();

    constructor(private readonly systemCollectorService: SystemCollectorService) { }

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        this.subscribeClient(client);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.unsubscribeClient(client);
    }

    private subscribeClient(client: Socket) {
        const { stats$, processes$, storage$ } = this.systemCollectorService.subscribe();
        const clientSubs: Subscription[] = [];

        clientSubs.push(
            stats$.subscribe(data => {
                this.logger.debug(`Emitting systemStats: ${JSON.stringify(data)}`);
                client.emit('systemStats', data);
            }),
            processes$.subscribe(data => client.emit('systemProcesses', data)),
            storage$.subscribe(data => client.emit('systemStorage', data))
        );

        this.subscriptions.set(client.id, clientSubs);
    }

    private unsubscribeClient(client: Socket) {
        const clientSubs = this.subscriptions.get(client.id);
        if (clientSubs) {
            clientSubs.forEach(sub => sub.unsubscribe());
            this.subscriptions.delete(client.id);
        }
        this.systemCollectorService.unsubscribe();
    }
}
