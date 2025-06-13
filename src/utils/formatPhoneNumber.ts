export const formatPhoneNumber = (phone: string): string => {
    return phone.startsWith('0') ? phone.replace('0', '+84') : phone;
};

export const normalizePhoneNumber = (phone: string): string => {
    return phone.startsWith('+84') ? phone.replace('+84', '0') : phone;
};
