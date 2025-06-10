'use client';

import bitrixConfig from '@/configs/bitrixConfig';
import { useQuery } from '@tanstack/react-query';
import { contactService } from './services/contact-service';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Users,
    Building2,
    Search,
    Mail,
    Phone,
    Globe,
    CreditCard,
    Settings,
    SquarePen,
    Trash2,
    CircleFadingPlus,
    House,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import useDebounce from './hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import ContactForm from '@/components/ContactForm';
import ContactFilters, { ContactFilters as FilterType } from '@/components/ContactFilters';
import { ContactClient } from '@/types';

export default function Home() {
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<FilterType>({
        province: '',
        phone: '',
        email: '',
        bankName: '',
        accountNumber: '',
    });
    const [contactSelected, setContactSelected] = useState<ContactClient | null>(null);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const searchValueDebounced = useDebounce({ value: searchValue, delay: 500 });

    const { data: contactsData, isLoading } = useQuery({
        queryKey: ['contacts', searchValueDebounced, currentPage, filters],
        queryFn: () =>
            contactService.getList({
                search: searchValueDebounced,
                start: (currentPage - 1) * 50,
                filters,
            }),
        enabled: !!bitrixConfig.accessToken && !!bitrixConfig.refreshToken,
    });

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleApplyFilter = (newFilters: FilterType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            province: '',
            phone: '',
            accountNumber: '',
            email: '',
            bankName: '',
        });
        setCurrentPage(1);
    };

    const handleCreateContact = () => {
        setContactSelected(null);
        setDialogMode('create');
        setIsDialogOpen(true);
    };

    const handleEditContact = (contact: ContactClient) => {
        setContactSelected(contact);
        setDialogMode('edit');
        setIsDialogOpen(true);
    };

    const handleViewContact = (contact: ContactClient) => {
        setContactSelected(contact);
        setDialogMode('view');
        setIsDialogOpen(true);
    };

    const handleDeleteContact = (contact: ContactClient) => {
        setContactSelected(contact);
        setDialogMode('delete');
        setIsDialogOpen(true);
    };

    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false);
        setContactSelected(null);
    }, []);

    if (!bitrixConfig.clientId || !bitrixConfig.clientSecret || !bitrixConfig.redirectUri) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="glass-effect max-w-md w-full hover-lift">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-gradient">Yêu cầu cấu hình Bitrix24</h2>
                        <p className="text-muted-foreground">
                            Vui lòng thiết lập cấu hình Bitrix24 của bạn trong tệp .env.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!bitrixConfig.accessToken || !bitrixConfig.refreshToken) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="glass-effect max-w-md w-full hover-lift">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold mb-4 text-gradient">Kết nối với Bitrix24</h2>
                        <p className="text-muted-foreground mb-6">
                            Vui lòng xác thực với tài khoản Bitrix24 của bạn để bắt đầu quản lý liên hệ.
                        </p>
                        <Button
                            asChild
                            className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <a
                                href={`${bitrixConfig.domain}/oauth/authorize/?client_id=${bitrixConfig.clientId}&response_type=code&redirect_uri=${bitrixConfig.redirectUri}`}
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Kết nối Bitrix24
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <Card className="glass-effect">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gradient">
                            <Users className="w-6 h-6" />
                            Danh sách Liên hệ Bitrix24
                            {contactsData && contactsData?.pagination.total > 0 && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({contactsData?.pagination.total} liên hệ)
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="glass-effect">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm theo tên..."
                                        value={searchValue}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <ContactFilters onApplyFilter={handleApplyFilter} onClearFilters={handleClearFilters} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 hover:bg-blue-50 bg-orange-200 hover:cursor-pointer"
                                    onClick={handleCreateContact}
                                >
                                    <CircleFadingPlus className={`w-4 h-4`} />
                                    Thêm Liên hệ
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-effect">
                    <CardContent className="px-3">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <p className="mt-2 text-muted-foreground">Đang tải danh sách liên hệ...</p>
                            </div>
                        ) : contactsData?.contacts.length === 0 ? (
                            <div className="p-8 text-center">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    {searchValueDebounced
                                        ? 'Không tìm thấy liên hệ nào phù hợp'
                                        : 'Chưa có liên hệ nào'}
                                </p>
                                {searchValueDebounced && (
                                    <Button variant="outline" onClick={() => setSearchValue('')} className="mt-4">
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-semibold">ID</TableHead>
                                            <TableHead className="font-semibold">Tên</TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-1">
                                                    <House className="w-4 h-4" />
                                                    Địa chỉ
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    Điện thoại
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-1">
                                                    <Globe className="w-4 h-4" />
                                                    Website
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="w-4 h-4" />
                                                    Ngân hàng
                                                </div>
                                            </TableHead>

                                            <TableHead>
                                                <div className="flex items-center gap-1">
                                                    <Settings className="w-4 h-4" />
                                                    Tùy chỉnh
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contactsData?.contacts &&
                                            contactsData.contacts.length > 0 &&
                                            contactsData?.contacts.map((contact: ContactClient) => (
                                                <TableRow key={`${contact.ID}`} className="contact-row">
                                                    <TableCell className="font-mono">{contact.ID}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {contact.NAME || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{contact.ADDRESS}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {contact.PHONE?.[0]?.VALUE ? (
                                                                <a
                                                                    href={`tel:${contact.PHONE[0].VALUE}`}
                                                                    className="text-green-600 hover:underline"
                                                                    title={contact.PHONE[0].VALUE}
                                                                >
                                                                    {contact.PHONE[0].VALUE}
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground">N/A</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {contact.EMAIL?.[0]?.VALUE ? (
                                                                <a
                                                                    href={`mailto:${contact.EMAIL[0].VALUE}`}
                                                                    className="text-blue-600 hover:underline truncate max-w-[200px]"
                                                                    title={contact.EMAIL[0].VALUE}
                                                                >
                                                                    {contact.EMAIL[0].VALUE}
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground">N/A</span>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        {contact.WEB?.[0]?.VALUE ? (
                                                            <a
                                                                href={
                                                                    contact.WEB[0].VALUE.startsWith('http')
                                                                        ? contact.WEB[0].VALUE
                                                                        : `https://${contact.WEB[0].VALUE}`
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-purple-600 hover:underline inline-flex items-center gap-1"
                                                                title={contact.WEB[0].VALUE}
                                                            >
                                                                <Globe className="w-3 h-3" />
                                                                Website
                                                            </a>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="px-2 py-1 max-w-20 text-center bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                {contact.BANK_NAME || 'N/A'}
                                                            </span>
                                                            <span className="text-base underline text-blue-600 shadow text-center">
                                                                {contact.ACCOUNT_NUMBER || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewContact(contact)}
                                                                title="Xem chi tiết"
                                                            >
                                                                <Users className="w-4 h-4 text-gray-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEditContact(contact)}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <SquarePen className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteContact(contact)}
                                                                title="Xóa"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {contactsData && contactsData.pagination.total > 50 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>
                                        Hiển thị {Math.min((currentPage - 1) * 50 + 1, contactsData.pagination.total)} -{' '}
                                        {Math.min(currentPage * 50, contactsData.pagination.total)} trong tổng số{' '}
                                        {contactsData.pagination.total} liên hệ
                                    </span>
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    if (currentPage > 1) {
                                                        setCurrentPage(currentPage - 1);
                                                    }
                                                }}
                                                disabled={currentPage <= 1}
                                            >
                                                Trước
                                            </Button>
                                        </PaginationItem>

                                        {(() => {
                                            const totalPages = Math.ceil(contactsData.pagination.total / 50);
                                            const pages = [];
                                            const startPage = Math.max(1, currentPage - 2);
                                            const endPage = Math.min(totalPages, currentPage + 2);

                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <PaginationItem key={i}>
                                                        <Button
                                                            variant={currentPage === i ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setCurrentPage(i)}
                                                        >
                                                            {i}
                                                        </Button>
                                                    </PaginationItem>,
                                                );
                                            }
                                            return pages;
                                        })()}

                                        <PaginationItem>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const totalPages = Math.ceil(contactsData.pagination.total / 50);
                                                    if (currentPage < totalPages) {
                                                        setCurrentPage(currentPage + 1);
                                                    }
                                                }}
                                                disabled={currentPage >= Math.ceil(contactsData.pagination.total / 50)}
                                            >
                                                Sau
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {isDialogOpen && (
                    <ContactForm
                        isOpen={isDialogOpen}
                        onClose={handleCloseDialog}
                        contact={contactSelected}
                        mode={dialogMode}
                    />
                )}
            </div>
        </div>
    );
}
