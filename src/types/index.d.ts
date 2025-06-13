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
    // ADDRESS?: string;
    // ADDRESS_2?: string;
    // ADDRESS_CITY?: string;
    // ADDRESS_POSTAL_CODE?: string;
    // ADDRESS_REGION?: string;
    // ADDRESS_PROVINCE?: string;
    // ADDRESS_COUNTRY?: string;
    // ADDRESS_COUNTRY_CODE?: string;
    REQUISITES?: IRequisite[];
    // ADDRESS_LOC_ADDR_ID?: string;
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

export interface IContactServer extends Omit<IContact, never> {
    UF_CRM_1749491137?: string; //Address
}

export interface IContactClient extends Omit<IContact, never> {
    ADDRESS?: string;
}

export interface IContactsResponse {
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

export interface AppTokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    domain: string;
}

export interface IRequisite {
    ID: string;
    ENTITY_TYPE_ID: number;
    ENTITY_ID: string;
    PRESET_ID: number;
    BANK_DETAIL: IBankDetail;
}

export interface IBankDetail {
    ID: string;
    ENTITY_TYPE_ID: number;
    ENTITY_ID: string;
    NAME?: string;
    RQ_BANK_NAME?: string;
    RQ_ACC_NUM?: string;
}
