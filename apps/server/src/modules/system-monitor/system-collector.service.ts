
import { Injectable, Logger, OnModuleDestroy, Inject, forwardRef } from '@nestjs/common';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { SystemStats, SystemProcess, StorageData } from './system-stats.interface';
import { SystemMonitorService } from './system-monitor.service';

@Injectable()
export class SystemCollectorService implements OnModuleDestroy {
    private readonly logger = new Logger(SystemCollectorService.name);

    private readonly stats$ = new BehaviorSubject<SystemStats | null>(null);
    private readonly processes$ = new BehaviorSubject<SystemProcess[]>([]);
    private readonly storage$ = new BehaviorSubject<StorageData | null>(null);

    private subscribers = 0;
    private statsInterval: NodeJS.Timeout | null = null;
    private processesInterval: NodeJS.Timeout | null = null;
    private storageInterval: NodeJS.Timeout | null = null;

    constructor(
        @Inject(forwardRef(() => SystemMonitorService))
        private readonly monitorService: SystemMonitorService
    ) { }

    onModuleDestroy() {
        this.stopMonitoring();
    }

    subscribe(): { stats$: Observable<SystemStats>, processes$: Observable<SystemProcess[]>, storage$: Observable<StorageData> } {
        this.subscribers++;
        this.logger.log(`Client subscribed. Total subscribers: ${this.subscribers}`);

        if (this.subscribers === 1) {
            this.startMonitoring();
        }

        return {
            stats$: this.stats$.asObservable().pipe(filter((data): data is SystemStats => data !== null)),
            processes$: this.processes$.asObservable(),
            storage$: this.storage$.asObservable().pipe(filter((data): data is StorageData => data !== null))
        };
    }

    unsubscribe() {
        this.subscribers = Math.max(0, this.subscribers - 1);
        this.logger.log(`Client unsubscribed. Total subscribers: ${this.subscribers}`);

        if (this.subscribers === 0) {
            this.stopMonitoring();
        }
    }

    private startMonitoring() {
        this.logger.log('Starting lazy system monitoring...');

        // Initial fetch
        this.fetchStats();
        this.fetchProcesses();
        this.fetchStorage();

        // Setup intervals
        this.statsInterval = setInterval(() => this.fetchStats(), 2000);
        this.processesInterval = setInterval(() => this.fetchProcesses(), 5000);
        this.storageInterval = setInterval(() => this.fetchStorage(), 60000);
    }

    private stopMonitoring() {
        this.logger.log('Stopping lazy system monitoring...');

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

    public async fetchStats() {
        try {
            const data = await this.monitorService.getSystemStats();
            this.stats$.next(data);
        } catch (error) {
            this.logger.error('Failed to fetch system stats', error);
        }
    }

    public async fetchProcesses() {
        try {
            const data = await this.monitorService.getSystemProcesses();
            this.processes$.next(data);
        } catch (error) {
            this.logger.error('Failed to fetch processes', error);
        }
    }

    public async fetchStorage() {
        try {
            const data = await this.monitorService.getStorageData();
            this.storage$.next(data);
        } catch (error) {
            this.logger.error('Failed to fetch storage', error);
        }
    }

    /**
     * Trigger an immediate process list update
     */
    async triggerProcessRefresh() {
        // Wait a bit for the system to reflect the changes (especially after signals)
        await new Promise(resolve => setTimeout(resolve, 250));
        await this.fetchProcesses();
    }
}
