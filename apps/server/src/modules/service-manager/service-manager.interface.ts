export interface SystemService {
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'failed' | 'unknown';
    running: boolean;
    enabled: boolean;
}

/** Shape of a single entry from `systemctl list-units --output=json` */
export interface SystemctlUnit {
    unit: string;
    description: string;
    active: string;
    sub: string;
    load?: string;
}

/** Shape of a single entry from `systemctl list-unit-files --output=json` */
export interface SystemctlUnitFile {
    unit_file: string;
    state: string;
}
