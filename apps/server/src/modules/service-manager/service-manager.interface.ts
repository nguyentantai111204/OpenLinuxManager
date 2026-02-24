export interface SystemService {
    name: string;
    description: string;
    status: 'Đang chạy' | 'Đã dừng' | 'Lỗi' | 'Không xác định' | 'active' | 'inactive' | 'failed' | 'unknown';
    running: boolean;
    enabled: boolean;
}

export interface SystemctlUnit {
    unit: string;
    description: string;
    active: string;
    sub: string;
    load?: string;
}

export interface SystemctlUnitFile {
    unit_file: string;
    state: string;
}
