import useSWR from 'swr';
import { ServicesApi, ServiceAction, SystemService } from '../apis/services/services.api';

export function useServices(params?: { page?: number; limit?: number; search?: string }) {
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/services', params?.page, params?.limit, params?.search],
        () => ServicesApi.getAll(params),
        {
            revalidateOnFocus: false,
            refreshInterval: 10_000,
        },
    );

    const performAction = async (name: string, action: ServiceAction) => {
        await ServicesApi.performAction(name, action);
        await mutate();
    };

    const isPaginated = !Array.isArray(data) && data?.data;
    const services = isPaginated ? data.data : (Array.isArray(data) ? data : []);
    const meta = isPaginated ? data.meta : null;

    return {
        services,
        meta,
        isLoading,
        error,
        performAction,
        mutate,
    };
}
