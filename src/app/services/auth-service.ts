import axios from 'axios';

async function OAuthCallback({ code, client_id, client_secret }: {
    code: string;
    client_id: string;
    client_secret: string;
}) {
    const params = new URLSearchParams({
        code,
        client_id,
        client_secret,
    });
    const response = await axios.get(`/api/auth/callback?${params.toString()}`);
    return response.data;
}


async function refreshToken({ refresh_token, client_id, client_secret }: {
    refresh_token: string;
    client_id: string;
    client_secret: string;
}) {
    const params = new URLSearchParams({
        refresh_token,
        client_id,
        client_secret,
    });
    const response = await axios.get(`/api/auth/refresh-token?${params.toString()}`);
    return response.data;
}



export const authService = {
    OAuthCallback,
    refreshToken,
};