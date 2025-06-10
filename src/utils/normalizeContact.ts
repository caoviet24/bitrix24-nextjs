import { ContactClient, ContactServer } from '@/types';

export const mapBitrixContactToNormalized = (contact: ContactServer) => {
    return {
        ID: contact.ID,
        NAME: contact.NAME,
        PHONE: contact.PHONE,
        EMAIL: contact.EMAIL,
        WEB: contact.WEB,
        ADDRESS: contact.UF_CRM_1749491137 ?? null,
        BANK_NAME: contact.UF_CRM_1749488806735 ?? null,
        ACCOUNT_NUMBER: contact.UF_CRM_1749488831655 ?? null,
    };
};

export const mapNormalizedToBitrixContact = (contact: ContactClient) => {
    return {
        ID: contact.ID,
        NAME: contact.NAME,
        PHONE: contact.PHONE,
        EMAIL: contact.EMAIL,
        WEB: contact.WEB,
        UF_CRM_1749491137: contact.ADDRESS ?? undefined,
        UF_CRM_1749488806735: contact.BANK_NAME ?? undefined,
        UF_CRM_1749488831655: contact.ACCOUNT_NUMBER ?? undefined,
    };
};
