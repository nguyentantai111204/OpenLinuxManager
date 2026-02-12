import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { SystemStats, SystemProcess, StorageData } from './system-stats.interface';
import { LinuxParser } from './utils/linux-parser';
import { ExecUtil } from '../../common/utils/exec.util';

@Injectable()
export class SystemMonitorService {
    private readonly logger = new Logger(SystemMonitorService.name);

    constructor() { }

    /**
     * Get system statistics (CPU, RAM, Uptime, OS Info)
     */
    async getSystemStats(): Promise<SystemStats> {
        try {
            const memInfo = fs.readFileSync('/proc/meminfo', 'utf-8');
            const ramStats = LinuxParser.parseMemInfo(memInfo);

            const cpuStat1 = fs.readFileSync('/proc/stat', 'utf-8');
            const startCpu = LinuxParser.parseCpuStats(cpuStat1);

            await new Promise(r => setTimeout(r, 500));

            const cpuStat2 = fs.readFileSync('/proc/stat', 'utf-8');
            const endCpu = LinuxParser.parseCpuStats(cpuStat2);

            const idleDiff = endCpu.idle - startCpu.idle;
            const totalDiff = endCpu.total - startCpu.total;
            const cpuPercent = totalDiff === 0 ? 0 : 100 * (1 - idleDiff / totalDiff);

            const uptime = parseFloat(fs.readFileSync('/proc/uptime', 'utf-8').split(' ')[0]);

            // Simple OS identification
            let osName = 'Linux';
            let osVersion = 'Unknown';
            let osDistro = 'Unknown';
            try {
                const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
                const lines = osRelease.split('\n');
                lines.forEach(line => {
                    if (line.startsWith('NAME=')) osDistro = line.split('=')[1].replace(/"/g, '');
                    if (line.startsWith('VERSION=')) osVersion = line.split('=')[1].replace(/"/g, '');
                    if (line.startsWith('ID=')) osName = line.split('=')[1].replace(/"/g, '');
                });
            } catch (e) {
                // Ignore if /etc/os-release doesn't exist
            }

            return {
                cpu: parseFloat(cpuPercent.toFixed(2)),
                ram_total: ramStats.total,
                ram_used: ramStats.used,
                ram_free: ramStats.free,
                uptime: uptime,
                os_name: osName,
                os_version: osVersion,
                os_pretty_name: osDistro,
                timestamp: Date.now(),
            };
        } catch (error) {
            this.logger.error('Error getting system stats', error);
            // We should probably throw here so the global exception filter catches it, 
            // OR return a partial object if we want to be resilient.
            // The original code returned an object with error field. 
            // Let's stick to the interface, which might accept error string or incomplete data.
            // But strict typing says SystemStats.
            throw new InternalServerErrorException((error as Error).message);
        }
    }

    /**
     * Get running processes
     */
    async getSystemProcesses(): Promise<SystemProcess[]> {
        try {
            const stdout = await ExecUtil.run('ps aux --sort=-%cpu | head -n 51');
            return LinuxParser.parsePsOutput(stdout);
        } catch (error) {
            this.logger.error('Error getting processes', error);
            throw new InternalServerErrorException('Failed to retrieve processes');
        }
    }

    /**
     * Get storage data
     */
    async getStorageData(): Promise<StorageData> {
        try {
            // -B1 for bytes
            // output custom columns
            // exclude tmpfs and devtmpfs
            const stdout = await ExecUtil.run('df -B1 --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs');
            return LinuxParser.parseDfOutput(stdout);
        } catch (error) {
            this.logger.error('Error getting storage data', error);
            throw new InternalServerErrorException('Failed to retrieve storage data');
        }
    }

    /**
     * Kill a process by PID
     */
    async killProcess(pid: number): Promise<{ message: string }> {
        if (!pid || isNaN(pid)) {
            throw new BadRequestException('Invalid PID');
        }

        try {
            await ExecUtil.run(`kill -9 ${pid}`);
            return { message: `Process ${pid} killed successfully` };
        } catch (error) {
            this.logger.error(`Error killing process ${pid}`, error);
            throw new InternalServerErrorException(`Failed to kill process ${pid}`);
        }
    }
}

