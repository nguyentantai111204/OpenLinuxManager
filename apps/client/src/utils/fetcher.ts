import { axiosClient } from './axios-client';

/**
 * Default SWR fetcher.
 * Uses axiosClient so the { success, data } response unwrapping
 * from the interceptor is applied automatically.
 */
export const fetcher = <T>(url: string): Promise<T> =>
    axiosClient.get<T>(url).then((res) => res.data as T);
