import axios, { AxiosError } from 'axios';
import bitrixConfig from '@/configs/bitrixConfig';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const client_id = searchParams.get('client_id');
    const client_secret = searchParams.get('client_secret');

    if (error) {
        return NextResponse.json({ error: 'Authorization failed' }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    if (!client_id || !client_secret) {
        return NextResponse.json({ error: 'Client ID and Client Secret are required' }, { status: 400 });
    }

    try {
        const response = await axios.post(
            `${bitrixConfig.domain}/oauth/token/`,
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id,
                client_secret,
                code,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        const tokenData = response.data;

        return NextResponse.json({
            success: true,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            domain: tokenData.domain,
        });
    } catch (err: unknown) {
        console.error('OAuth callback error:', err instanceof AxiosError ? err.response?.data : err);
        return NextResponse.json({ error: 'Failed to process authorization' }, { status: 500 });
    }
}
