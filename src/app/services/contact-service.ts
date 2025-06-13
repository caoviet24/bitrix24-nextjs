import axiosClient from '@/utils/axios-instance';
import { IContactClient, IContactsResponse } from '@/types/index';
import { ContactFilters } from '@/components/ContactFilters';

async function getList({
    search = '',
    start = 0,
    filters = { province: '', phone: '', email: '', bankName: '', accountNumber: '' },
}: {
    search?: string | undefined;
    start?: number;
    filters?: ContactFilters;
}): Promise<IContactsResponse> {
    const params = new URLSearchParams();
    if (search) {
        params.append('search', search);
    }
    if (filters) {
        params.append('filters', JSON.stringify(filters));
    }
    params.append('start', start.toString());

    const res = await axiosClient.get(`/api/contacts?${params.toString()}`);

    return res.data;
}

export type IContactPayLoad = IContactClient;

async function create(contactData: IContactPayLoad) {
    const res = await axiosClient.post('/api/contacts', {
        contact: contactData,
    });
    return res.data;
}

async function update(id: string, contactData: IContactPayLoad) {
    const res = await axiosClient.put(`/api/contacts/${id}`, {
        contact: contactData,
    });
    return res.data;
}

async function remove(id: string) {
    const res = await axiosClient.delete(`/api/contacts/${id}`);
    return res.data;
}

export const contactService = {
    getList,
    create,
    update,
    remove,
};
