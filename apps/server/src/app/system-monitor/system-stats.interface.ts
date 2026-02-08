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
