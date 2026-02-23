import useSWR from 'swr';
import { UsersApi, SystemUser } from '../apis/users/users.api';

/**
 * Fetch and cache the system user list using SWR.
 * Uses UsersApi.getAll() directly so the paginated response unwrapping is handled correctly.
 */
export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR<SystemUser[]>(
        '/api/users',
        () => UsersApi.getAll(),
        { revalidateOnFocus: false },
    );

    const createUser = async (username: string, password?: string) => {
        await UsersApi.create(username, password);
        await mutate();
    };

    const deleteUser = async (username: string) => {
        await UsersApi.remove(username);
        await mutate();
    };

    return {
        users: data ?? [],
        isLoading,
        error,
        createUser,
        deleteUser,
        mutate,
    };
}
