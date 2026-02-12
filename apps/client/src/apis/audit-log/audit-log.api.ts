import { axiosClient } from '../../utils/axios-client';
import { AuditLog } from './audit-log.interface';

export interface PaginatedAuditLogs {
    data: AuditLog[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const AuditLogApi = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedAuditLogs> => {
        const response = await axiosClient.get(`/api/audit-logs?page=${page}&limit=${limit}`);
        return response.data;
    }
};
