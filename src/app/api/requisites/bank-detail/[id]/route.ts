import bitrixConfig from '@/configs/bitrixConfig';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /requisites/bank-detail/{id}:
 *   get:
 *     summary: Get a bank detail by ID
 *     description: Retrieve a bank detail by its ID
 *     tags: [Bank Details]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank detail ID
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     responses:
 *       200:
 *         description: Bank detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bankDetail:
 *                   $ref: '#/components/schemas/BankDetail'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');
    const bankDetailId = searchParams.get('id');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    if (!bankDetailId) {
        return NextResponse.json({ error: 'Bank detail ID is required' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.get`, {
            auth: accessToken,
            id: bankDetailId,
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            bankDetail: data.result || {},
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized access. Please check your access token.' },
                { status: 401 },
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const { bankDetail } = await request.json();

    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    if (!bankDetail || !bankDetail.ID) {
        return NextResponse.json({ error: 'Bank detail ID is required' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.update`, {
            auth: accessToken,
            fields: bankDetail,
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            bankDetail: data.result || {},
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized access. Please check your access token.' },
                { status: 401 },
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    if (!id) {
        return NextResponse.json({ error: 'Bank detail ID is required' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.delete`, {
            auth: accessToken,
            id,
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Bank detail deleted successfully',
        });
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
            return NextResponse.json(
                { error: 'Unauthorized access. Please check your access token.' },
                { status: 401 },
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
    }
}
