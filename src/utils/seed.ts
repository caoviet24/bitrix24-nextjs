import { contactService } from '@/app/services/contact-service';

const lastName: string[] = [
    'Nguyễn',
    'Trần',
    'Lê',
    'Phạm',
    'Hoàng',
    'Huỳnh',
    'Phan',
    'Vũ',
    'Võ',
    'Đặng',
    'Bùi',
    'Đỗ',
    'Hồ',
    'Ngô',
    'Dương',
    'Lý',
    'Tạ',
    'Thái',
    'Mai',
    'Cao',
];

const midName: string[] = [
    'Văn',
    'Thị',
    'Hữu',
    'Đức',
    'Ngọc',
    'Xuân',
    'Thanh',
    'Phương',
    'Minh',
    'Trung',
    'Nhật',
    'Quốc',
    'Hoàng',
    'Tấn',
    'Gia',
    'Thành',
    'Anh',
    'Bảo',
    'Kim',
    'Hải',
];

const firstName: string[] = [
    'Anh',
    'Bình',
    'Châu',
    'Dũng',
    'Hà',
    'Hải',
    'Hiếu',
    'Hương',
    'Hùng',
    'Khánh',
    'Lan',
    'Linh',
    'Loan',
    'Minh',
    'Nam',
    'Ngọc',
    'Phúc',
    'Quang',
    'Sơn',
    'Trang',
];

export const mockBanks = [
    'MBB', // Ngân hàng Quân đội
    'SCB', // Ngân hàng Sài Gòn
    'VCB', // Vietcombank
    'TCB', // Techcombank
    'BIDV', // Ngân hàng Đầu tư và Phát triển
    'ACB', // Ngân hàng Á Châu
    'VIB', // Ngân hàng Quốc tế
    'VPB', // VPBank
    'HDB', // HDBank
    'SHB', // Ngân hàng Sài Gòn - Hà Nội
];


function getRandomFullName(): { fullName: string; firstName: string } {
    const last = lastName[Math.floor(Math.random() * lastName.length)];
    const mid = midName[Math.floor(Math.random() * midName.length)];
    const first = firstName[Math.floor(Math.random() * firstName.length)];
    return {
        fullName: `${last} ${mid} ${first}`,
        firstName: first,
    };
}

function generateVietnamPhoneNumber(): string {
    const prefixes = ['03', '05', '07', '08', '09'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 1_000_000_000);
    const suffix = ('00000000' + randomNumber).slice(-8); // giống padStart(8, '0')
    return prefix + suffix;
}

function getRandomBank(): string {
    const index = Math.floor(Math.random() * mockBanks.length);
    return mockBanks[index];
}

function getRandomAddress(): string {
    const provinces = [
        'Hải Dương',
        'Hải Phòng',
        'Hà Nội',
        'Đà Nẵng',
        'Bình Dương',
        'Cần Thơ',
        'Nghệ An',
        'Quảng Ninh',
        'Thái Bình',
        'Lâm Đồng',
    ];
    const districts = [
        'Thanh Miện',
        'Ba Đình',
        'Thủ Đức',
        'Liên Chiểu',
        'Thuận An',
        'Ninh Kiều',
        'Vinh',
        'Hạ Long',
        'Quỳnh Phụ',
        'Đà Lạt',
    ];
    const wards = [
        'Phạm Kha',
        'Ngọc Hà',
        'Hiệp Bình Chánh',
        'Hòa Khánh Bắc',
        'Bình Hòa',
        'Tân An',
        'Hưng Dũng',
        'Bạch Đằng',
        'An Vinh',
        'Tân Lạc',
    ];

    const getRandom = (list: string[]) => list[Math.floor(Math.random() * list.length)];

    const province = getRandom(provinces);
    const district = getRandom(districts);
    const ward = getRandom(wards);

    return `Xã ${ward}, Huyện ${district}, Tỉnh ${province}`;
}

function getRandomBankAccount(): string {
    const num = Math.floor(Math.random() * 1_000_000_00000); // Tối đa 11 chữ số
    const str = '00000000000' + num; // Thêm số 0 ở đầu
    return str.slice(-11); // Lấy 11 ký tự cuối
}

export async function seedContacts(count: number): Promise<boolean> {
    const contacts = [];
    for (let i = 0; i < count; i++) {
        const { fullName, firstName } = getRandomFullName();
        const phoneNumber = generateVietnamPhoneNumber();
        const bankAccount = getRandomBankAccount();
        const bankName = getRandomBank();
        const address = getRandomAddress();

        const formData = {
            NAME: fullName,
            ADDRESS: address,
            EMAIL: [
                {
                    VALUE: `${firstName.toLowerCase()}@example.com`,
                    VALUE_TYPE: 'WORK',
                },
            ],
            PHONE: [
                {
                    VALUE: phoneNumber,
                    VALUE_TYPE: 'WORK',
                },
            ],
            WEB: [
                {
                    VALUE: `https://${firstName.toLowerCase()}.example.com`,
                    VALUE_TYPE: 'WORK',
                },
            ],
            BANK_NAME: bankName,
            ACCOUNT_NUMBER: bankAccount,
        };

        contacts.push(formData);
    }

    try {
        await Promise.all(
            contacts.map(async (contact) => {
                await contactService.create(contact);
            }),
        );
        return true;
    } catch (error) {
        console.error('Error creating contact:', error);
        return false;
    }
}
