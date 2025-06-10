import bitrixConfig from '@/configs/bitrixConfig';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { writeToEnv } from './writeToEnv';

let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse> | null = null;

function createAxiosClientInstance() {
    const axiosClient = axios.create();

    axiosClient.interceptors.request.use((config) => {
        const params = new URLSearchParams({
            access_token: bitrixConfig.accessToken,
        });
        config.params = params;
        return config;
    });

    axiosClient.interceptors.response.use(
        async (response): Promise<AxiosResponse> => {
            return response;
        },
        async (error): Promise<AxiosError> => {
            console.log('Axios error:', error);

            // Check if error is from contacts API and contains expired token error
            if (
                error.status === 401 ||
                (error.response?.status === 400 &&
                    (error.response?.data?.error?.includes('expired') ||
                        error.response?.data?.error === 'The access token provided has expired'))
            ) {
                console.log('Token expired, attempting refresh...');

                if (isRefreshing) {
                    if (refreshPromise) {
                        await refreshPromise;
                        return axiosClient.request(error.config!);
                    }
                }

                isRefreshing = true;

                try {
                    const params = new URLSearchParams({
                        client_id: bitrixConfig.clientId,
                        client_secret: bitrixConfig.clientSecret,
                        refresh_token: bitrixConfig.refreshToken,
                    });

                    refreshPromise = axios.get(`/api/auth/refresh-token?${params}`);
                    const res = await refreshPromise;

                    if (res.status === 200) {
                        console.log('Token refresh successful');

                        await writeToEnv({
                            field: 'ACCESS_TOKEN',
                            value: res.data.access_token,
                        });
                        await writeToEnv({
                            field: 'REFRESH_TOKEN',
                            value: res.data.refresh_token,
                        });

                        // Update the bitrixConfig in memory
                        bitrixConfig.accessToken = res.data.access_token;
                        bitrixConfig.refreshToken = res.data.refresh_token;

                        // Retry the original request
                        return axiosClient.request(error.config!);
                    } else {
                        console.error('Failed to refresh token:', res.data);
                    }
                } catch (refreshError) {
                    console.error('Error during token refresh:', refreshError);
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            }

            return Promise.reject(error);
        },
    );

    return axiosClient;
}

const axiosClient = createAxiosClientInstance();

export default axiosClient;
