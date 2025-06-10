'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X, MapPin, Phone, CreditCard, Mail, RotateCcw, Landmark } from 'lucide-react';
import ProvinceCombobox, { Province } from './ProvinceCombobox';
import { mockBanks } from '@/utils/seed';

export interface ContactFilters {
    province: string;
    phone: string;
    bankName: string;
    email: string;
    accountNumber: string;
}

interface ContactFiltersProps {
    onApplyFilter: (filters: ContactFilters) => void;
    onClearFilters: () => void;
}

export default function ContactFilters({ onApplyFilter, onClearFilters }: ContactFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [province, setProvince] = useState<Province | null>(null);
    const [filters, setFilters] = useState<ContactFilters>({
        province: '',
        phone: '',
        bankName: '',
        email: '',
        accountNumber: '',
    });

    const handleFilterChange = (key: keyof ContactFilters, value: unknown) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const hasActiveFilters = Object.values(filters).some((value) => value.trim() !== '');
    const activeFilterCount = Object.values(filters).filter((value) => value.trim() !== '').length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`flex items-center gap-2 relative ${
                        hasActiveFilters
                            ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                            : 'hover:bg-gray-50'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Bộ lọc tìm kiếm</h3>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setFilters({
                                            province: '',
                                            phone: '',
                                            bankName: '',
                                            email: '',
                                            accountNumber: '',
                                        });
                                        setProvince(null);
                                        onClearFilters();
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Xóa tất cả
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Tỉnh/Thành phố
                                </Label>
                                <ProvinceCombobox
                                    value={province}
                                    onSelect={(value) => {
                                        handleFilterChange('province', value.name);
                                        setProvince(value);
                                    }}
                                    className="w-full"
                                    disabled={false}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    Số điện thoại
                                </Label>
                                <Input
                                    placeholder="Nhập số điện thoại..."
                                    value={filters.phone}
                                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tìm kiếm theo số điện thoại (có thể nhập một phần)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Landmark className="w-4 h-4 text-purple-600" />
                                    Ngân hàng
                                </Label>
                                <Select
                                    value={filters.bankName}
                                    onValueChange={(value) => handleFilterChange('bankName', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn ngân hàng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả ngân hàng</SelectItem>
                                        {mockBanks.map((bank) => (
                                            <SelectItem key={bank} value={bank}>
                                                {bank}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                    Số tài khoản ngân hàng
                                </Label>
                                <Input
                                    placeholder="Nhập tài khoản ngân hàng..."
                                    value={filters.accountNumber}
                                    onChange={(e) => handleFilterChange('accountNumber', e.target.value)}
                                    className="w-full"
                                    type="text"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tìm kiếm theo số tài khoản ngân hàng (có thể nhập một phần)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Mail className="w-4 h-4 text-orange-600" />
                                    Email
                                </Label>
                                <Input
                                    placeholder="Nhập email..."
                                    value={filters.email}
                                    onChange={(e) => handleFilterChange('email', e.target.value)}
                                    className="w-full"
                                    type="email"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tìm kiếm theo địa chỉ email (có thể nhập một phần)
                                </p>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-6 pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Bộ lọc đang áp dụng:</p>
                                <div className="flex flex-wrap gap-2">
                                    {filters.province && (
                                        <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                            <MapPin className="w-3 h-3" />
                                            {filters.province}
                                            <button
                                                onClick={() => {
                                                    handleFilterChange('province', '');
                                                    setProvince(null);
                                                }}
                                                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                    {filters.phone && (
                                        <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                            <Phone className="w-3 h-3" />
                                            {filters.phone}
                                            <button
                                                onClick={() => handleFilterChange('phone', '')}
                                                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                    {filters.bankName && (
                                        <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                            <CreditCard className="w-3 h-3" />
                                            {filters.bankName}
                                            <button
                                                onClick={() => handleFilterChange('bankName', '')}
                                                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                    {filters.email && (
                                        <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                            <Mail className="w-3 h-3" />
                                            {filters.email}
                                            <button
                                                onClick={() => handleFilterChange('email', '')}
                                                className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={() => {
                                    setIsOpen(false);
                                    onApplyFilter(filters);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Áp dụng bộ lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>
    );
}
