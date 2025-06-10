import bitrixConfig from '@/configs/bitrixConfig';
import { ContactServer } from '@/types';
import { mapBitrixContactToNormalized, mapNormalizedToBitrixContact } from '@/utils/normalizeContact';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const searchValue = searchParams.get('search');
    const filters = searchParams.get('filters');
    const start = searchParams.get('start') || '0';

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const { province, phone, email, bankName, accountNumber } = parsedFilters;

    const filtersObj: Record<string, string | number> = {};

    if (searchValue) {
        filtersObj['%NAME'] = searchValue;
    }

    if (province) {
        filtersObj['UF_CRM_1749491137'] = province;
    }

    if (phone) {
        if (phone.startsWith('0')) {
            const phoneVN = phone.replace('0', '+84');
            filtersObj['PHONE'] = phoneVN;
        }
    }

    if (email) {
        filtersObj['EMAIL'] = email;
    }

    if (bankName) {
        filtersObj['UF_CRM_1749488806735'] = bankName;
    }

    if (accountNumber) {
        filtersObj['UF_CRM_1749488831655'] = accountNumber;
    }


    const accessToken = searchParams.get('access_token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }

    try {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.list`, {
            auth: accessToken,
            filter: filtersObj,
            select: [
                'ID',
                'NAME',
                'ADDRESS',
                'ADDRESS_2',
                'ADDRESS_CITY',
                'ADDRESS_POSTAL_CODE',
                'ADDRESS_REGION',
                'ADDRESS_PROVINCE',
                'ADDRESS_COUNTRY',
                'ADDRESS_COUNTRY_CODE',
                'ADDRESS_LOC_ADDR_ID',
                'EMAIL',
                'WEB',
                'PHONE',
                'UF_CRM_1749491137', //Address
                'UF_CRM_1749488806735', // Bank name
                'UF_CRM_1749488831655', // Bank account number
            ],
            start: parseInt(start, 10),
            order: { ID: 'ASC' },
        });

        const data = response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            contacts: data.result.map((contact: ContactServer) => {
                let phoneNumber = contact.PHONE?.[0]?.VALUE || '';
                if (phoneNumber.startsWith('+84')) {
                    phoneNumber = phoneNumber.replace('+84', '0');
                }

                return mapBitrixContactToNormalized({
                    ...contact,
                    PHONE: [
                        {
                            ID: contact.PHONE?.[0]?.ID || '',
                            VALUE: phoneNumber,
                            VALUE_TYPE: contact.PHONE?.[0]?.VALUE_TYPE || 'WORK',
                            TYPE_ID: contact.PHONE?.[0]?.TYPE_ID || '',
                        },
                    ],
                });
            }),
            pagination: {
                total: data.total || 0,
                start: parseInt(start, 10),
            },
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

export async function POST(request: NextRequest) {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('access_token');
    const { contact } = body;

    if (!contact) {
        return NextResponse.json({ error: 'Contact data is required' }, { status: 400 });
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

        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.add`, {
            auth: accessToken,
            fields: mappedContact,
        });

        const data = await response.data;

        if (data.error) {
            return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            contactId: data.result,
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
