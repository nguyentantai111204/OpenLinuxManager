export interface SystemStats {
    cpu: number;
    ram_total: number;
    ram_used: number;
    ram_free: number;
    uptime: number;
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

export interface StorageData {
    total: number; // in GB
    used: number; // in GB
    free: number; // in GB
    partitions: {
        name: string;
        mountPoint: string;
        type: string;
        size: string;
        used: string;
        avail: string;
        usePercent: number;
    }[];
}
