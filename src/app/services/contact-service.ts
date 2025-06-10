import axiosClient from '@/utils/axios-instance';
import {  ContactClient, ContactsResponse } from '@/types/index';
import { ContactFilters } from '@/components/ContactFilters';

async function getList({
    search = '',
    start = 0,
    filters = { province: '', phone: '', email: '', bankName: '', accountNumber: ''},
}: {
    search?: string;
    start?: number;
    filters?: ContactFilters;
}): Promise<ContactsResponse> {
    const params = new URLSearchParams({
        search,
        start: start.toString(),
        filters: JSON.stringify(filters),
    });


    const res = await axiosClient.get(`/api/contacts?${params.toString()}`);
    return res.data;
}

async function create(contactData: ContactClient) {
    const res = await axiosClient.post('/api/contacts', {
        contact: contactData,
    });
    return res.data;
}

async function update(id: string, contactData: ContactClient) {
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
