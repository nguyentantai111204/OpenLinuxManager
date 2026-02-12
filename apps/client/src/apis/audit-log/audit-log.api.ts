import { axiosClient } from '../../utils/axios-client';
import { AuditLog } from './audit-log.interface';

export const AuditLogApi = {
    getAll: async (): Promise<AuditLog[]> => {
        const response = await axiosClient.get('/api/audit-logs');
        return response.data;
    }
};
