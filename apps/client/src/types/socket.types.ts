/**
 * Shared socket event payload types.
 * Single source of truth — import from here everywhere.
 */

export interface SystemStats {
    cpu: number;
    ram_total: number; // in bytes
    ram_used: number;  // in bytes
    ram_free: number;  // in bytes
    uptime: number;    // in seconds
    os_name: string;
    os_version: string;
    os_pretty_name: string;
    timestamp: number;
    error?: string;
}

export interface SystemProcess {
    pid: number;
    name: string;
    user: string;
    status: string;
    cpu: number;
    memory: number; // in MB
}

export interface StoragePartition {
    name: string;
    mountPoint: string;
    type: string;
    size: string;
    used: string;
    avail: string;
    usePercent: number;
}

export interface StorageData {
    total: number; // in GB
    used: number;  // in GB
    free: number;  // in GB
    partitions: StoragePartition[];
}
