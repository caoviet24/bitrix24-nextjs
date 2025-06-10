import bitrixConfig from '@/configs/bitrixConfig';
import { mapNormalizedToBitrixContact } from '@/utils/normalizeContact';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const { contact } = body;
    const mappedContact = mapNormalizedToBitrixContact(contact);
    const accessToken = searchParams.get('access_token');

    if (!mappedContact) {
        return NextResponse.json({ error: 'Invalid contact data' }, { status: 400 });
    }
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        let phoneNumber = contact.PHONE?.[0]?.VALUE || '';
        if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.replace('0', '+84');
        }

        const mappedContact = {
            ...mapNormalizedToBitrixContact(contact),
            PHONE: [
                {
                    ID: contact.PHONE?.[0]?.ID || '',
                    VALUE: phoneNumber,
                    VALUE_TYPE: contact.PHONE?.[0]?.VALUE_TYPE || 'WORK',
                    TYPE_ID: contact.PHONE?.[0]?.TYPE_ID || '',
                },
            ],
        };

        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.update`, {
            auth: accessToken,
            id: contact.ID,
            fields: mappedContact,
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            updated: data.result,
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
    const accessToken = request.nextUrl.searchParams.get('access_token');

    if (!id) {
        return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.delete`, {
            auth: accessToken,
            id: id,
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            deleted: data.result,
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
