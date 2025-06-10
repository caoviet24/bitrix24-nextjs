export interface OAuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    domain: string;
    server_endpoint: string;
}

export interface IContact {
    ID?: string;
    NAME?: string;
    ADDRESS?: string;
    ADDRESS_2?: string;
    ADDRESS_CITY?: string;
    ADDRESS_POSTAL_CODE?: string;
    ADDRESS_REGION?: string;
    ADDRESS_PROVINCE?: string;
    ADDRESS_COUNTRY?: string;
    ADDRESS_COUNTRY_CODE?: string;
    ADDRESS_LOC_ADDR_ID?: string;
    EMAIL?: Array<{
        ID?: string;
        VALUE?: string;
        VALUE_TYPE?: string;
        TYPE_ID?: string;
    }>;
    WEB?: Array<{
        ID?: string;
        VALUE?: string;
        VALUE_TYPE?: string;
        TYPE_ID?: string;
    }>;
    PHONE?: Array<{
        ID?: string;
        VALUE?: string;
        VALUE_TYPE?: string;
        TYPE_ID?: string;
    }>;
}

export interface ContactServer extends Omit<IContact, never> {
    UF_CRM_1749491137?: string;
    UF_CRM_1749488806735?: string;
    UF_CRM_1749488831655?: string; // Bank account number
}

export interface ContactClient extends Omit<IContact, never> {
    ADDRESS?: string | null;
    BANK_NAME?: string | null;
    ACCOUNT_NUMBER?: string | null;
}

export interface ContactsResponse {
    success: boolean;
    contacts: ContactClient[];
    total: number;
    pagination: {
        total: number;
        start: number;
    };
    error?: string;
    error_description?: string;
}

export interface BitrixContactsResponse {
    result: ContactClient[];
    total: number;
    time: {
        start: number;
        finish: number;
        duration: number;
        processing: number;
        date_start: string;
        date_finish: string;
    };
    error?: string;
    error_description?: string;
}

export interface AppTokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    domain: string;
}
