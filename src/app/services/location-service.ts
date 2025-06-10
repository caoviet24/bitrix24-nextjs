import axios from 'axios';

export const locationVNService = {
    async getProvinces() {
        try {
            const res = await axios.get('https://provinces.open-api.vn/api/p');
            return res.data;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            throw error;
        }
    },

    async getDistricts() {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/d`);
            return res.data;
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw error;
        }
    },

    async getWards() {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/w`);
            return res.data;
        } catch (error) {
            console.error('Error fetching wards:', error);
            throw error;
        }
    },
};
