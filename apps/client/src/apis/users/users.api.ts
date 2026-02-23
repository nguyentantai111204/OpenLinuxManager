import { axiosClient } from '../../utils/axios-client';

export interface SystemUser {
    username: string;
    uid: number;
    gid: number;
    home: string;
    shell: string;
}

export const UsersApi = {
    getAll: (): Promise<SystemUser[]> =>
        axiosClient.get('/api/users').then((r) => {
            const payload = r.data as SystemUser[] | { data: SystemUser[] };
            return Array.isArray(payload) ? payload : payload.data;
        }),

    create: (username: string, password?: string): Promise<void> =>
        axiosClient.post('/api/users', { username, password }).then(() => undefined),

    remove: (username: string): Promise<void> =>
        axiosClient.delete(`/api/users/${username}`).then(() => undefined),
};
