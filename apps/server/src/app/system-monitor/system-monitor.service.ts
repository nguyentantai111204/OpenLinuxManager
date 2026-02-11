import { Injectable, Logger } from '@nestjs/common';
import * as si from 'systeminformation';
import { SystemStats, SystemProcess, StorageData } from './system-stats.interface';

@Injectable()
export class SystemMonitorService {
    private readonly logger = new Logger(SystemMonitorService.name);

    constructor() { }

    /**
     * Get system statistics (CPU, RAM, Uptime, OS Info)
     */
    async getSystemStats(): Promise<SystemStats> {
        try {
            const [cpu, mem, osInfo, time] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.osInfo(),
                si.time(),
            ]);

            return {
                cpu: cpu.currentLoad,
                ram_total: mem.total,
                ram_used: mem.active,
                ram_free: mem.available,
                uptime: time.uptime,
                os_name: osInfo.platform,
                os_version: osInfo.release,
                os_pretty_name: osInfo.distro,
                timestamp: Date.now(),
            };
        } catch (error) {
            this.logger.error('Error getting system stats', error);
            return {
                cpu: 0,
                ram_total: 0,
                ram_used: 0,
                ram_free: 0,
                uptime: 0,
                os_name: 'Error',
                os_version: 'N/A',
                os_pretty_name: 'System monitoring error',
                timestamp: Date.now(),
                error: (error as Error).message,
            };
        }
    }

    /**
     * Get running processes
     */
    async getSystemProcesses(): Promise<SystemProcess[]> {
        try {
            const data = await si.processes();
            // Sort by CPU usage descending by default
            return data.list
                .sort((a, b) => b.cpu - a.cpu)
                .slice(0, 50) // Limit to top 50 to avoid sending too much data
                .map((proc) => ({
                    pid: proc.pid,
                    name: proc.name,
                    user: proc.user,
                    status: proc.state,
                    cpu: proc.cpu,
                    memory: proc.memRss / 1024 / 1024, // Convert bytes to MB
                }));
        } catch (error) {
            this.logger.error('Error getting processes', error);
            return [];
        }
    }

    /**
     * Get storage data
     */
    async getStorageData(): Promise<StorageData> {
        try {
            const fsSize = await si.fsSize();

            // Calculate totals (approximate, summing all mounted filesystems might double count if binds exist, 
            // but for simple display usually sufficient or filter by type)
            // Filter out loop devices, tmpfs, etc. if needed.
            // For now, let's filter to physical-ish drives: logical, ext4, ntfs, apfs, xfs, btrfs
            // Common types: 'ext4', 'xfs', 'btrfs', 'apfs', 'hfs', 'ntfs', 'fat32', 'exfat'
            // And avoid mounts like /var/lib/docker...

            // Just take all returned by si.fsSize() as it usually filters reasonable ones or provides type.

            let totalBytes = 0;
            let usedBytes = 0;

            const partitions = fsSize.map((fs) => {
                totalBytes += fs.size;
                usedBytes += fs.used;
                return {
                    name: fs.fs,
                    mountPoint: fs.mount,
                    type: fs.type,
                    size: (fs.size / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                    used: (fs.used / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                    avail: (fs.available / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                    usePercent: Math.round(fs.use),
                };
            });

            return {
                total: parseFloat((totalBytes / 1024 / 1024 / 1024).toFixed(1)),
                used: parseFloat((usedBytes / 1024 / 1024 / 1024).toFixed(1)),
                free: parseFloat(((totalBytes - usedBytes) / 1024 / 1024 / 1024).toFixed(1)),
                partitions,
            };
        } catch (error) {
            this.logger.error('Error getting storage data', error);
            return {
                total: 0,
                used: 0,
                free: 0,
                partitions: [],
            };
        }
    }
}
