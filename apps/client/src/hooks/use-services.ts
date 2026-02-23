import useSWR from 'swr';
import { ServicesApi, ServiceAction, SystemService } from '../apis/services/services.api';

/**
 * Fetch and cache the system service list using SWR.
 * Refreshes automatically every 10 seconds.
 */
export function useServices() {
    const { data, error, isLoading, mutate } = useSWR<SystemService[]>(
        '/api/services',
        () => ServicesApi.getAll(),
        {
            revalidateOnFocus: false,
            refreshInterval: 10_000,
        },
    );

    const performAction = async (name: string, action: ServiceAction) => {
        await ServicesApi.performAction(name, action);
        await mutate();
    };

    return {
        services: data ?? [],
        isLoading,
        error,
        performAction,
        mutate,
    };
}
