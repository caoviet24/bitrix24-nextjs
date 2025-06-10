'use server';

import bitrixConfig from '@/configs/bitrixConfig';
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const refresh_token = searchParams.get('refresh_token');
    const client_id = searchParams.get('client_id');
    const client_secret = searchParams.get('client_secret');

    if (!refresh_token) {
        return Response.json(
            { error: 'Refresh token is required' },
            {
                status: 400,
            },
        );
    }

    if (!client_id || !client_secret) {
        return Response.json(
            {
                error: 'Client ID and Client Secret are required',
            },
            {
                status: 400,
            },
        );
    }

    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: client_id || '',
        client_secret: client_secret || '',
        refresh_token,
    });

    try {
        const res = await axios.get(`${bitrixConfig.domain}/oauth/token/?${params.toString()}`);

        if (res.status !== 200) {
            return Response.json(
                {
                    error: 'Failed to refresh token',
                    status: res.status,
                    data: res.data,
                },
                {
                    status: res.status,
                },
            );
        }

        const tokenData = res.data;

        return Response.json(
            {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
            },
            {
                status: 200,
            },
        );
    } catch (error) {
        return Response.json(
            {
                error: 'Failed to refresh token',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
