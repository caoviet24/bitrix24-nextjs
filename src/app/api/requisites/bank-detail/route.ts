import bitrixConfig from '@/configs/bitrixConfig';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /requisites/bank-detail:
 *   get:
 *     summary: Get all bank details
 *     description: Retrieve a list of all bank details
 *     tags: [Bank Details]
 *     parameters:
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     responses:
 *       200:
 *         description: A list of bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bankDetails:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BankDetail'
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

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }
    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.list`, {
            auth: accessToken,
            select: ['*'],
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            bankDetails: data.result || [],
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

/**
 * @swagger
 * /requisites/bank-detail:
 *   post:
 *     summary: Create a new bank detail
 *     description: Create a new bank detail for a requisite
 *     tags: [Bank Details]
 *     parameters:
 *       - name: access_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankDetail
 *               - requisiteId
 *             properties:
 *               bankDetail:
 *                 type: object
 *                 properties:
 *                   NAME:
 *                     type: string
 *                   RQ_BANK_NAME:
 *                     type: string
 *                   RQ_ACC_NUM:
 *                     type: string
 *               requisiteId:
 *                 type: string
 *                 description: ID of the requisite to attach the bank detail to
 *     responses:
 *       200:
 *         description: Bank detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bankDetailId:
 *                   type: string
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
export async function POST(request: NextRequest) {
    const { bankDetail, requisiteId } = await request.json();

    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    if (!requisiteId) {
        return NextResponse.json({ error: 'Requisite ID is required' }, { status: 400 });
    }

    try {
        // Make sure bank detail is associated with a requisite
        const bankDetailWithRequisite = {
            ...bankDetail,
            ENTITY_TYPE_ID: 7,
            ENTITY_ID: requisiteId,
        };

        const res = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.add`, {
            auth: accessToken,
            fields: bankDetailWithRequisite,
        });
        const data = res.data;
        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }
        return NextResponse.json({
            success: true,
            bankDetailId: data.result,
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
