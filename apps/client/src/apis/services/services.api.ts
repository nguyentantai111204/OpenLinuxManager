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
    getAll: (params?: { page?: number; limit?: number; search?: string }): Promise<SystemService[] | { data: SystemService[]; meta: any }> =>
        axiosClient.get('/api/services', { params }).then((r) => r.data),

    performAction: (name: string, action: ServiceAction): Promise<void> =>
        axiosClient.post(`/api/services/${name}/action`, { action }).then(() => undefined),
};
