
import { Injectable, Logger } from '@nestjs/common';
import { StorageData, SystemProcess } from '../system-stats.interface';

@Injectable()
export class LinuxParser {
    private static readonly logger = new Logger(LinuxParser.name);

    static parseMemInfo(data: string): { total: number; used: number; free: number; available: number } {
        const lines = data.split('\n');
        let total = 0;
        let free = 0;
        let available = 0;
        let buffers = 0;
        let cached = 0;

        lines.forEach(line => {
            const parts = line.split(/\s+/);
            if (parts.length < 2) return;

            const key = parts[0].replace(':', '');
            const value = parseInt(parts[1], 10) * 1024;

            switch (key) {
                case 'MemTotal': total = value; break;
                case 'MemFree': free = value; break;
                case 'MemAvailable': available = value; break;
                case 'Buffers': buffers = value; break;
                case 'Cached': cached = value; break;
            }
        });

        if (available === 0) {
            available = free + buffers + cached;
        }

        const used = total - available;

        return { total, used, free, available };
    }

    static parseCpuStats(data: string): { total: number; idle: number } {
        const lines = data.split('\n');
        const cpuLine = lines.find(line => line.startsWith('cpu '));

        if (!cpuLine) {
            return { total: 0, idle: 0 };
        }

        const stats = cpuLine.split(/\s+/).slice(1).map(val => parseInt(val, 10));

        // user + nice + system + idle + iowait + irq + softirq + steal
        const idle = stats[3] + stats[4]; // idle + iowait
        const total = stats.reduce((acc, val) => acc + val, 0);

        return { total, idle };
    }

    static parseDfOutput(data: string): StorageData {
        const lines = data.trim().split('\n');
        const dataLines = lines.slice(1);

        let totalBytes = 0;
        let usedBytes = 0;
        const partitions = [];

        dataLines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length < 6) return;

            const source = parts[0];
            const size = parseInt(parts[1], 10);
            const used = parseInt(parts[2], 10);
            const pcent = parseInt(parts[4].replace('%', ''), 10);
            const target = parts.slice(5).join(' ');

            totalBytes += size;
            usedBytes += used;

            partitions.push({
                name: source,
                mountPoint: target,
                type: 'unknown', // df doesn't give type easily with this command, might need -T
                size: (size / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                used: (used / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                avail: ((size - used) / 1024 / 1024 / 1024).toFixed(1) + ' GB',
                usePercent: pcent,
            });
        });

        return {
            total: parseFloat((totalBytes / 1024 / 1024 / 1024).toFixed(1)),
            used: parseFloat((usedBytes / 1024 / 1024 / 1024).toFixed(1)),
            free: parseFloat(((totalBytes - usedBytes) / 1024 / 1024 / 1024).toFixed(1)),
            partitions,
        };
    }

    static parsePsOutput(data: string): SystemProcess[] {
        const lines = data.trim().split('\n');
        const processLines = lines.slice(1);

        return processLines.map(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length < 11) return null;

            const user = parts[0];
            const pid = parseInt(parts[1], 10);
            const cpu = parseFloat(parts[2]);
            const memPercent = parseFloat(parts[3]);
            const rss = parseInt(parts[5], 10); // in KB
            const stat = parts[7];
            const command = parts.slice(10).join(' ');

            // Map Linux process status codes
            // R: Running, S: Sleeping, D: Disk Sleep, T: Stopped, Z: Zombie, I: Idle
            let status = 'unknown';
            const firstChar = stat.charAt(0).toUpperCase();
            switch (firstChar) {
                case 'R': status = 'running'; break;
                case 'S': status = 'sleeping'; break;
                case 'D': status = 'disk-sleep'; break;
                case 'T': status = 'stopped'; break;
                case 'Z': status = 'zombie'; break;
                case 'I': status = 'idle'; break;
                default: status = 'unknown'; break;
            }

            return {
                pid,
                name: command.substring(0, 50), // Truncate for display
                user,
                status,
                cpu,
                memory: rss / 1024, // Convert KB to MB
            };
        }).filter(p => p !== null) as SystemProcess[];
    }
}
