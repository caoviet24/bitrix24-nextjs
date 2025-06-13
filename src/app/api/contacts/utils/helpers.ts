import { NextResponse } from 'next/server';
import axios from 'axios';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

/**
 * Validates the presence of an access token
 * @param accessToken - The access token to validate
 * @returns A NextResponse with an error if validation fails, null otherwise
 */
export function validateAccessToken(accessToken: string | null): NextResponse | null {
    if (!accessToken) {
        return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    }
    return null;
}

/**
 * Handles errors and returns appropriate responses
 * @param error - The error to handle
 * @returns A NextResponse with error details
 */
export function handleError(error: unknown): NextResponse {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        return NextResponse.json({ error: 'Unauthorized access. Please check your access token.' }, { status: 401 });
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
}

/**
 * Builds a filter object for the Bitrix API
 * @param searchValue - Search value for filtering
 * @param filters - JSON string of filters
 * @returns A filter object for Bitrix API
 */
export function buildFilterObject(searchValue: string | null, filters: string | null): {
    contactFilters: Record<string, string | number>;
    bankDetailFilters: Record<string, string | number>;
    hasFilteredBankDetails: boolean;
} {
    const contactFilters: Record<string, string | number> = {};
    const bankDetailFilters: Record<string, string | number> = {};
    let hasFilteredBankDetails = false;

    if (searchValue) {
        contactFilters['%NAME'] = searchValue;
    }

    if (filters) {
        try {
            const parsedFilters = JSON.parse(filters);
            const { province, phone, email, bankName, accountNumber } = parsedFilters;

            if (province) {
                contactFilters['UF_CRM_1749491137'] = province;
            }

            if (phone) {
                const phoneFormatted = formatPhoneNumber(phone);
                contactFilters['PHONE'] = phoneFormatted;
            }

            if (email) {
                contactFilters['EMAIL'] = email;
            }

            if (bankName && bankName !== 'all') {
                bankDetailFilters['RQ_BANK_NAME'] = bankName;
                hasFilteredBankDetails = true;
            }
            
            if (accountNumber) {
                bankDetailFilters['%RQ_ACC_NUM'] = accountNumber;
                hasFilteredBankDetails = true;
            }
        } catch (error) {
            console.error('Error parsing filters:', error);
        }
    }

    return { contactFilters, bankDetailFilters, hasFilteredBankDetails };
}
