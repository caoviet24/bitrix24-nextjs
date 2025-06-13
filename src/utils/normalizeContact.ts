import { IContactClient, IContactServer } from '@/types';

export const mapBitrixContactToNormalized = (contact: IContactServer) => {
    return {
        ID: contact.ID,
        NAME: contact.NAME,
        PHONE: contact.PHONE,
        EMAIL: contact.EMAIL,
        WEB: contact.WEB,
        ADDRESS: contact.UF_CRM_1749491137 ?? null,
        REQUISITES: contact.REQUISITES,
    };
};

export const mapNormalizedToBitrixContact = (contact: IContactClient) => {
    return {
        ID: contact.ID,
        NAME: contact.NAME,
        PHONE: contact.PHONE,
        EMAIL: contact.EMAIL,
        WEB: contact.WEB,
        UF_CRM_1749491137: contact.ADDRESS ?? undefined,
        REQUISITES: contact.REQUISITES ?? undefined,
    };
};
