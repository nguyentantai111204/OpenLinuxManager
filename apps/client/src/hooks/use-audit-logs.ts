import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { PaginatedAuditLogs } from '../apis/audit-log/audit-log.api';

/**
 * Fetch a paginated page of audit logs using SWR.
 * @param page      1-based page number (as returned by the API)
 * @param limit     rows per page
 */
export function useAuditLogs(page: number, limit: number) {
    const key = `/api/audit-logs?page=${page}&limit=${limit}`;

    const { data, error, isLoading, mutate } = useSWR<PaginatedAuditLogs>(
        key,
        fetcher,
        { revalidateOnFocus: false },
    );

    return {
        logs: data?.data ?? [],
        total: data?.meta?.total ?? 0,
        isLoading,
        error,
        mutate,
    };
}
