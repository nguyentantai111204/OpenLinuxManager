import { axiosClient } from '../../utils/axios-client';

export type ServiceAction = 'start' | 'stop' | 'restart' | 'enable' | 'disable';

export interface SystemService {
    name: string;
    description: string;
    status: 'Đang chạy' | 'Đã dừng' | 'Lỗi' | 'Không xác định' | 'active' | 'inactive' | 'failed' | 'unknown';
    running: boolean;
    enabled: boolean;
}

export const ServicesApi = {
    getAll: (): Promise<SystemService[]> =>
        axiosClient.get('/api/services').then((r) => {
            const payload = r.data as SystemService[] | { data: SystemService[] };
            return Array.isArray(payload) ? payload : payload.data;
        }),

    performAction: (name: string, action: ServiceAction): Promise<void> =>
        axiosClient.post(`/api/services/${name}/action`, { action }).then(() => undefined),
};
