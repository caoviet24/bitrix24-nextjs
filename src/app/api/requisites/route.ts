import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import bitrixConfig from '@/configs/bitrixConfig';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.list`, {
            auth: accessToken,
            select: ['*'],
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            requisites: data.result || [],
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized access. Please check your access token.', success: false },
                { status: 401 },
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: 'Internal server error', details: errorMessage, success: false },
            { status: 500 },
        );
    }
}
