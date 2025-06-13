import axiosClient from '@/utils/axios-instance';

export interface Requisite {
    ID?: number;
    NAME: string;
    ENTITY_TYPE_ID: number;
    ENTITY_ID: number;
    PRESET_ID: number;
}

export interface BankDetail {
    ID?: number;
    NAME: string;
    ENTITY_TYPE_ID?: number;
    ENTITY_ID: number;
    RQ_BANK_NAME: string;
    RQ_ACC_NUM: string;
}

export const requisiteService = {
    requisite: {
        async getList() {
            const res = await axiosClient.get('/api/requisites');
            return res.data;
        },

        async create(requisite: Requisite) {
            const res = await axiosClient.post('/api/requisites', { requisite });
            return res.data;
        },

        async update(requisite: Requisite) {
            const res = await axiosClient.put(`/api/requisites/${requisite.ID}`, { requisite });
            return res.data;
        },

        async delete(requisiteId: number) {
            const res = await axiosClient.delete(`/api/requisites/${requisiteId}`);
            return res.data;
        },
    },
    
    bankDetail: {
        async getList() {
            const res = await axiosClient.get('/api/requisites/bank-detail');
            return res.data;
        },

        async create(bankDetail: BankDetail, requisiteId: number) {
            const res = await axiosClient.post('/api/requisites/bank-detail', {
                bankDetail,
                requisiteId
            });
            return res.data;
        },

        async update(bankDetail: BankDetail) {
            const res = await axiosClient.put(`/api/requisites/bank-detail/${bankDetail.ID}`, { bankDetail });
            return res.data;
        },

        async delete(bankDetailId: number) {
            const res = await axiosClient.delete(`/api/requisites/bank-detail/${bankDetailId}`);
            return res.data;
        },
    },
};
