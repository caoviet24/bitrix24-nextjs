import bitrixConfig from '@/configs/bitrixConfig';
import { IContactPayLoad } from '@/app/services/contact-service';
import { IBankDetail, IContactServer, IRequisite } from '@/types';
import { formatPhoneNumber, normalizePhoneNumber } from '@/utils/formatPhoneNumber';
import { mapBitrixContactToNormalized, mapNormalizedToBitrixContact } from '@/utils/normalizeContact';
import axios from 'axios';
import { buildFilterObject } from '../utils/helpers';

export class ContactService {
    /**
     * Get a list of contacts with optional filtering
     */
    async getContacts(accessToken: string, searchValue: string | null, filters: string | null, start: number) {
        const { contactFilters, bankDetailFilters, hasFilteredBankDetails } = buildFilterObject(searchValue, filters);
        

        const contactsData = await this.fetchContacts(accessToken, contactFilters, start);

        if (contactsData.error) {
            throw new Error(contactsData.error_description || contactsData.error);
        }

        const contactIds = contactsData.result.map((contact: IContactServer) => contact.ID);
        
        // Get not filter bank details
        if (contactIds.length === 0 || !hasFilteredBankDetails) {
            const requisitesByContactId = await this.fetchRequisitesAndBankDetails(
                accessToken, 
                contactIds, 
                {} 
            );
            
            return this.formatContactsResponse(contactsData, requisitesByContactId, start);
        }
        
        // Get filtered bank details
        const requisitesByContactId = await this.fetchRequisitesAndBankDetails(
            accessToken, 
            contactIds, 
            bankDetailFilters
        );
        
        const filteredContactIds = Object.keys(requisitesByContactId);
        const filteredContacts = contactsData.result.filter(
            (contact: IContactServer) => filteredContactIds.includes(String(contact.ID))
        );
        
        const filteredContactsData = {
            ...contactsData,
            result: filteredContacts,
            total: filteredContacts.length
        };
        
        return this.formatContactsResponse(filteredContactsData, requisitesByContactId, start);
    }

    /**
     * Create a new contact
     */
    async createContact(accessToken: string, contact: IContactPayLoad) {
        const contactId = await this.createContactRecord(accessToken, contact);

        if (!contactId) {
            throw new Error('Failed to create contact');
        }

        if (contact.REQUISITES && contact.REQUISITES.length > 0) {
            try {
                const { requisiteId, bankDetailId } = await this.createRequisiteAndBankDetails(accessToken, {
                    ...contact,
                    ID: contactId,
                });

                return {
                    success: true,
                    contactId,
                    requisiteId,
                    bankDetailId,
                };
            } catch (error) {
                await this.rollbackContactCreation(accessToken, contactId);
                throw error;
            }
        }

        return {
            success: true,
            contactId,
        };
    }

    /**
     * Update an existing contact
     */
    async updateContact(accessToken: string, contact: IContactPayLoad, id: string) {
        const phoneNumber = formatPhoneNumber(contact.PHONE?.[0]?.VALUE || '');

        const baseContact = mapNormalizedToBitrixContact(contact);
        const contactFields = {
            ID: id,
            NAME: baseContact.NAME,
            EMAIL: baseContact.EMAIL,
            WEB: baseContact.WEB,
            UF_CRM_1749491137: baseContact.UF_CRM_1749491137, // Address
            PHONE: [
                {
                    ID: contact.PHONE?.[0]?.ID || '',
                    VALUE: phoneNumber,
                    VALUE_TYPE: contact.PHONE?.[0]?.VALUE_TYPE || 'WORK',
                    TYPE_ID: contact.PHONE?.[0]?.TYPE_ID || '',
                },
            ],
        };

        const contactResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.update`, {
            auth: accessToken,
            id: id,
            fields: contactFields,
        });

        const contactData = contactResponse.data;

        if (contactData.error) {
            throw new Error(contactData.error_description || contactData.error);
        }

        if (
            (contact.REQUISITES && contact.REQUISITES[0]?.BANK_DETAIL?.RQ_BANK_NAME) ||
            (contact.REQUISITES && contact.REQUISITES[0]?.BANK_DETAIL?.RQ_ACC_NUM)
        ) {
            try {
                // Find existing requisites for this contact
                const existingRequisitesResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.list`, {
                    auth: accessToken,
                    filter: {
                        ENTITY_TYPE_ID: 3, // Contact
                        ENTITY_ID: id,
                    },
                });

                const existingRequisites = existingRequisitesResponse.data;

                if (existingRequisites.result && existingRequisites.result.length > 0) {
                    const requisiteId = existingRequisites.result[0].ID;

                    // Get bank details for this requisite
                    const bankDetailsResponse = await axios.post(
                        `${bitrixConfig.domain}/rest/crm.requisite.bankdetail.list`,
                        {
                            auth: accessToken,
                            filter: {
                                ENTITY_ID: requisiteId,
                            },
                            select: ['ID', 'ENTITY_ID', 'NAME', 'RQ_BANK_NAME', 'RQ_ACC_NUM'],
                        },
                    );

                    const bankDetailsData = bankDetailsResponse.data;

                    if (bankDetailsData.error) {
                        throw new Error(bankDetailsData.error_description || bankDetailsData.error);
                    }

                    if (bankDetailsData.result && bankDetailsData.result.length > 0) {
                        // Update existing bank detail
                        const bankDetailId = bankDetailsData.result[0].ID;
                        await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.update`, {
                            auth: accessToken,
                            id: bankDetailId,
                            fields: {
                                RQ_BANK_NAME: contact.REQUISITES[0]?.BANK_DETAIL?.RQ_BANK_NAME || '',
                                RQ_ACC_NUM: contact.REQUISITES[0]?.BANK_DETAIL?.RQ_ACC_NUM || '',
                            },
                        });
                    } else {
                        // Create new bank detail for this requisite
                        await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.add`, {
                            auth: accessToken,
                            fields: {
                                ENTITY_ID: requisiteId,
                                NAME: `Bank Detail for contact - ${id}`,
                                RQ_BANK_NAME: contact.REQUISITES[0]?.BANK_DETAIL?.RQ_BANK_NAME || '',
                                RQ_ACC_NUM: contact.REQUISITES[0]?.BANK_DETAIL?.RQ_ACC_NUM || '',
                            },
                        });
                    }
                }
            } catch (requisiteError) {
                console.warn('Failed to update requisite:', requisiteError);
            }
        }

        return {
            success: true,
            updated: contactData.result,
        };
    }

    /**
     * Delete a contact
     */
    async deleteContact(accessToken: string, id: string) {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.delete`, {
            auth: accessToken,
            id: id,
        });

        const data = response.data;

        if (data.error) {
            throw new Error(data.error_description || data.error);
        }

        return {
            success: true,
            deleted: data.result,
        };
    }

    /**
     * PRIVATE METHODS
     */

    private async fetchContacts(accessToken: string, filtersObj: Record<string, string | number>, start: number) {
        const response = await axios.post(`${bitrixConfig.domain}/rest/crm.contact.list`, {
            auth: accessToken,
            filter: filtersObj,
            select: [
                'ID',
                'NAME',
                'UF_CRM_1749491137', // Address
                'EMAIL',
                'WEB',
                'PHONE',
            ],
            start,
            order: { ID: 'ASC' },
        });

        return response.data;
    }

    private async fetchRequisitesAndBankDetails(
        accessToken: string,
        contactIds: string[],
        filtersObj: Record<string, string | number>,
    ) {
        if (!contactIds.length) return {};

        // Check if we're filtering by bank details
        const isFilteringByBankDetails = Object.keys(filtersObj).length > 0;


        console.log('filtersObj', filtersObj);
        

        const requisitesResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.list`, {
            auth: accessToken,
            filter: {
                ENTITY_TYPE_ID: 3,
                ENTITY_ID: contactIds,
            },
            select: ['ID', 'ENTITY_TYPE_ID', 'ENTITY_ID', 'PRESET_ID'],
        });

        const requisitesData = requisitesResponse.data;
        if (requisitesData.error || !requisitesData.result || !requisitesData.result.length) {
            return {};
        }

        const requisiteIds = requisitesData.result.map((requisite: IRequisite) => requisite.ID);
        const bankDetailsResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.list`, {
            auth: accessToken,
            filter: {
                ENTITY_ID: requisiteIds,
                ...filtersObj
            },
            select: ['ID', 'ENTITY_ID', 'NAME', 'RQ_BANK_NAME', 'RQ_ACC_NUM'],
        });

        const bankDetailsData = bankDetailsResponse.data;

        // Map bank details to requisites
        const bankDetailsByRequisiteId: Record<string, IBankDetail> = {};
        if (!bankDetailsData.error && bankDetailsData.result) {
            bankDetailsData.result.forEach((bankDetail: IBankDetail) => {
                bankDetailsByRequisiteId[bankDetail.ENTITY_ID] = bankDetail;
            });
        }

        // Group requisites by contact ID
        const requisitesByContactId: Record<string, IRequisite[]> = {};
        requisitesData.result.forEach((requisite: IRequisite) => {
            const contactId = String(requisite.ENTITY_ID);
            
            if (isFilteringByBankDetails && !bankDetailsByRequisiteId[requisite.ID]) {
                return; 
            }

            if (!requisitesByContactId[contactId]) {
                requisitesByContactId[contactId] = [];
            }

            const requisiteWithBankDetails: IRequisite = {
                ...requisite,
                BANK_DETAIL: bankDetailsByRequisiteId[requisite.ID] || null,
            };

            requisitesByContactId[contactId].push(requisiteWithBankDetails);
        });

        return requisitesByContactId;
    }

    private async createContactRecord(accessToken: string, contact: IContactPayLoad): Promise<string> {
        const phoneNumber = contact.PHONE?.[0]?.VALUE ? formatPhoneNumber(contact.PHONE[0].VALUE) : '';

        const baseContact = mapNormalizedToBitrixContact(contact);
        const contactFields = {
            ID: baseContact.ID,
            NAME: baseContact.NAME,
            EMAIL: baseContact.EMAIL,
            WEB: baseContact.WEB,
            UF_CRM_1749491137: baseContact.UF_CRM_1749491137,
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
            fields: contactFields,
        });

        const data = response.data;
        if (data.error) {
            throw new Error(data.error_description || data.error);
        }

        return data.result;
    }

    private async createRequisiteAndBankDetails(
        accessToken: string,
        contact: IContactPayLoad,
    ): Promise<{ requisiteId: string; bankDetailId: string }> {
        // Create requisite
        const requisiteData = {
            ENTITY_TYPE_ID: 3,
            ENTITY_ID: contact.ID,
            PRESET_ID: 1,
            NAME: `Requisite for contact ${contact.ID || 'Contact'}`,
        };
        const requisiteResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.add`, {
            auth: accessToken,
            fields: requisiteData,
        });

        const requisiteResult = requisiteResponse.data;

        if (requisiteResult.error) {
            throw new Error(requisiteResult.error_description || requisiteResult.error);
        }

        const requisiteId = requisiteResult.result;

        // Create bank detail
        const bankDetailData = {
            ENTITY_ID: requisiteId,
            NAME: `Bank Detail for contact - ${contact.ID || 'Contact'}`,
            RQ_BANK_NAME: contact.REQUISITES?.[0]?.BANK_DETAIL?.RQ_BANK_NAME || '',
            RQ_ACC_NUM: contact.REQUISITES?.[0]?.BANK_DETAIL?.RQ_ACC_NUM || '',
        };

        const bankDetailResponse = await axios.post(`${bitrixConfig.domain}/rest/crm.requisite.bankdetail.add`, {
            auth: accessToken,
            fields: bankDetailData,
        });

        const bankDetailResult = bankDetailResponse.data;
        if (bankDetailResult.error) {
            throw new Error(bankDetailResult.error_description || bankDetailResult.error);
        }

        return {
            requisiteId,
            bankDetailId: bankDetailResult.result,
        };
    }

    private async rollbackContactCreation(accessToken: string, contactId: string): Promise<void> {
        try {
            await axios.post(`${bitrixConfig.domain}/rest/crm.contact.delete`, {
                auth: accessToken,
                id: contactId,
            });
        } catch (error) {
            console.error('Error deleting contact during rollback:', error);
        }
    }

    /**
     * Format the contacts response with requisites and pagination
     */
    private formatContactsResponse(
        contactsData: { result: IContactServer[]; total?: number },
        requisitesByContactId: Record<string, IRequisite[]>,
        start: number
    ) {
        return {
            success: true,
            contacts: contactsData.result.map((contact: IContactServer) => {
                const phoneNumber = contact.PHONE?.[0]?.VALUE ? normalizePhoneNumber(contact.PHONE[0].VALUE) : '';

                const normalizedContact = mapBitrixContactToNormalized({
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

                return {
                    ...normalizedContact,
                    REQUISITES: requisitesByContactId[String(contact.ID)] || [],
                };
            }),
            pagination: {
                total: contactsData.total || 0,
                start: start,
            },
        };
    }
}
