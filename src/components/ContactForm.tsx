'use client';

import React, { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactService, IContactPayLoad } from '@/app/services/contact-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Loader } from 'lucide-react';
import validatePhoneVN from '@/utils/validatePhoneVN';
import ProvinceCombobox, { Province } from '@/components/ProvinceCombobox';
import DistrictCombobox, { District } from '@/components/DistrictCombobox';
import WardCombobox, { Ward } from '@/components/WardCombobox';
import { IContactClient } from '@/types';

const contactFormSchema = z.object({
    NAME: z.string().min(1, 'Tên là bắt buộc'),
    ADDRESS_CITY: z.string().optional(),
    ADDRESS_DISTRICT: z.string().optional(),
    ADDRESS_WARD: z.string().optional(),

    EMAIL_VALUE_ID: z.string().optional(),
    EMAIL: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    EMAIL_VALUE_TYPE: z.string().optional(),
    EMAIL_VALUE_TYPE_ID: z.string().optional(),

    PHONE_VALUE_ID: z.string().optional(),
    PHONE: z.string().min(1, 'Số điện thoại là bắt buộc'),
    PHONE_VALUE_TYPE: z.string().optional(),
    PHONE_VALUE_TYPE_ID: z.string().optional(),

    WEB_VALUE_ID: z.string().optional(),
    WEB: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
    WEB_VALUE_TYPE: z.string().optional(),
    WEB_VALUE_TYPE_ID: z.string().optional(),

    ADDRESS: z.string().min(1, {
        message: 'Địa chỉ là bắt buộc',
    }),
    BANK_NAME: z.string().min(1, {
        message: 'Tên ngân hàng là bắt buộc',
    }),
    ACCOUNT_NUMBER: z.string().min(5, {
        message: 'Số tài khoản ngân hàng phải có ít nhất 5 ký tự',
    }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    contact?: IContactClient | null;
    mode: 'create' | 'edit' | 'view' | 'delete';
}

function ContactForm({ isOpen, onClose, contact, mode }: ContactFormProps) {
    const queryClient = useQueryClient();
    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    const isEditMode = mode === 'edit';
    const isDeleteMode = mode === 'delete';

    const [province, setProvince] = React.useState<Province | null>(null);
    const [district, setDistrict] = React.useState<District | null>(null);
    const [ward, setWard] = React.useState<Ward | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            NAME: '',
            ADDRESS: '',
            ADDRESS_CITY: '',
            ADDRESS_DISTRICT: '',
            ADDRESS_WARD: '',
            EMAIL: '',
            EMAIL_VALUE_TYPE: 'WORK',
            PHONE: '',
            PHONE_VALUE_TYPE: 'WORK',
            WEB: '',
            WEB_VALUE_TYPE: 'WORK',
            BANK_NAME: '',
            ACCOUNT_NUMBER: '',
        },
    });

    const handleProvinceSelect = async (province: Province) => {
        setProvince(province);
        setDistrict(null);
        setWard(null);
        form.setValue('ADDRESS', `${province.name}`);
    };

    const handleDistrictSelect = async (district: District) => {
        setDistrict(district);
        setWard(null);
        form.setValue('ADDRESS', `${district.name}, ${province?.name}`);
    };

    const handleWardSelect = async (ward: Ward) => {
        setWard(ward);
        form.setValue('ADDRESS', `${ward.name}, ${district?.name}, ${province?.name}`);
    };

    const createContactMutation = useMutation({
        mutationFn: (data: IContactPayLoad) => contactService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Tạo liên hệ thành công!');
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Có lỗi xảy ra khi tạo liên hệ');
        },
    });

    const updateContactMutation = useMutation({
        mutationFn: (data: IContactPayLoad) => contactService.update(contact?.ID || '', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Cập nhật liên hệ thành công!');
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật liên hệ');
        },
    });

    const deleteContactMutation = useMutation({
        mutationFn: (id: string) => contactService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Xóa liên hệ thành công!');
            handleClose();
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Có lỗi xảy ra khi xóa liên hệ');
        },
    });

    const isDisabled =
        isViewMode ||
        createContactMutation.isPending ||
        updateContactMutation.isPending ||
        deleteContactMutation.isPending;

    const onSubmit = async (data: ContactFormValues) => {
        const formData: IContactPayLoad = {
            ID: contact?.ID || '',
            NAME: data.NAME,
            ADDRESS: data.ADDRESS || '',
            EMAIL: data.EMAIL
                ? [
                      {
                          ID: data.EMAIL_VALUE_ID,
                          VALUE: data.EMAIL,
                          VALUE_TYPE: data.EMAIL_VALUE_TYPE,
                          TYPE_ID: data.EMAIL_VALUE_TYPE_ID,
                      },
                  ]
                : undefined,
            PHONE: data.PHONE
                ? [
                      {
                          ID: data.PHONE_VALUE_ID,
                          VALUE: data.PHONE,
                          VALUE_TYPE: data.PHONE_VALUE_TYPE,
                          TYPE_ID: data.PHONE_VALUE_TYPE_ID,
                      },
                  ]
                : undefined,
            WEB: data.WEB
                ? [
                      {
                          ID: data.WEB_VALUE_ID,
                          VALUE: data.WEB,
                          VALUE_TYPE: data.WEB_VALUE_TYPE,
                          TYPE_ID: data.WEB_VALUE_TYPE_ID,
                      },
                  ]
                : undefined,
            REQUISITES: [
                {
                    ID: contact?.REQUISITES?.[0]?.ID || '',
                    ENTITY_TYPE_ID: 4, 
                    ENTITY_ID: contact?.ID || '',
                    PRESET_ID: contact?.REQUISITES?.[0]?.PRESET_ID || 0,
                    BANK_DETAIL: {
                        ID: contact?.REQUISITES?.[0]?.BANK_DETAIL?.ID || '',
                        NAME: contact?.REQUISITES?.[0]?.BANK_DETAIL?.NAME || '',
                        ENTITY_ID: contact?.REQUISITES?.[0]?.ID || '',
                        ENTITY_TYPE_ID: 4,
                        RQ_BANK_NAME: data.BANK_NAME,
                        RQ_ACC_NUM: data.ACCOUNT_NUMBER,
                    },
                }
            ]
        };

        if (formData.PHONE && formData.PHONE[0]?.VALUE && !validatePhoneVN(formData.PHONE[0].VALUE)) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
            return;
        }

        if (isCreateMode) {
            createContactMutation.mutate(formData);
        } else if (isEditMode && contact) {
            updateContactMutation.mutate(formData);
        } else if (isDeleteMode && contact?.ID) {
            deleteContactMutation.mutate(contact.ID);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const getAlertDialogTitle = () => {
        switch (mode) {
            case 'create':
                return 'Tạo liên hệ mới';
            case 'edit':
                return 'Chỉnh sửa liên hệ';
            case 'view':
                return 'Xem chi tiết liên hệ';
            case 'delete':
                return 'Xóa liên hệ';
            default:
                return 'Liên hệ';
        }
    };

    const getAlertDialogDescription = () => {
        switch (mode) {
            case 'create':
                return 'Nhập thông tin để tạo liên hệ mới';
            case 'edit':
                return 'Chỉnh sửa thông tin liên hệ';
            case 'view':
                return 'Thông tin chi tiết của liên hệ';
            case 'delete':
                return 'Bạn có chắc chắn muốn xóa liên hệ này? ';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (contact) {
            form.reset({
                NAME: contact.NAME || '',
                ADDRESS: contact.ADDRESS || '',
                EMAIL_VALUE_ID: contact.EMAIL?.[0]?.ID || '',
                EMAIL: contact.EMAIL?.[0]?.VALUE || '',
                EMAIL_VALUE_TYPE: contact.EMAIL?.[0]?.VALUE_TYPE || 'WORK',
                EMAIL_VALUE_TYPE_ID: contact.EMAIL?.[0]?.TYPE_ID || '',

                PHONE_VALUE_ID: contact.PHONE?.[0]?.ID || '',
                PHONE: contact.PHONE?.[0]?.VALUE || '',
                PHONE_VALUE_TYPE: contact.PHONE?.[0]?.VALUE_TYPE || 'WORK',
                PHONE_VALUE_TYPE_ID: contact.PHONE?.[0]?.TYPE_ID || '',

                WEB_VALUE_ID: contact.WEB?.[0]?.ID || '',
                WEB: contact.WEB?.[0]?.VALUE || '',
                WEB_VALUE_TYPE: contact.WEB?.[0]?.VALUE_TYPE || 'WORK',
                WEB_VALUE_TYPE_ID: contact.WEB?.[0]?.TYPE_ID || '',

                BANK_NAME: contact.REQUISITES?.[0]?.BANK_DETAIL?.RQ_BANK_NAME || '',
                ACCOUNT_NUMBER: contact.REQUISITES?.[0]?.BANK_DETAIL?.RQ_ACC_NUM || '',
            });
        }
    }, [contact, form, mode]);

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>{getAlertDialogTitle()}</AlertDialogTitle>
                    <AlertDialogDescription>{getAlertDialogDescription()}</AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="NAME"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên người dùng</FormLabel>
                                    <FormControl>
                                        <Input disabled={isDisabled} type="text" {...field} placeholder="Họ và tên" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="EMAIL"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isDisabled}
                                                type="email"
                                                {...field}
                                                placeholder="example@gmail.com"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="EMAIL_VALUE_TYPE"
                                render={({ field }) => (
                                    <FormItem className="w-32">
                                        <FormLabel>Loại Email</FormLabel>
                                        <Select
                                            disabled={isDisabled}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại email" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WORK">Công việc</SelectItem>
                                                <SelectItem value="HOME">Nhà</SelectItem>
                                                <SelectItem value="OTHER">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="PHONE"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isDisabled}
                                                type="tel"
                                                {...field}
                                                placeholder="Số điện thoại"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="PHONE_VALUE_TYPE"
                                render={({ field }) => (
                                    <FormItem className="w-32">
                                        <FormLabel>Loại Phone</FormLabel>
                                        <Select
                                            disabled={isDisabled}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Loại số điện thoại" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WORK">Công việc</SelectItem>
                                                <SelectItem value="HOME">Nhà</SelectItem>
                                                <SelectItem value="MOBILE">Di động</SelectItem>
                                                <SelectItem value="FAX">Fax</SelectItem>
                                                <SelectItem value="OTHER">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="WEB"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isDisabled}
                                                type="url"
                                                {...field}
                                                placeholder="https://example.com"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="WEB_VALUE_TYPE"
                                render={({ field }) => (
                                    <FormItem className="w-32">
                                        <FormLabel>Loại Website</FormLabel>
                                        <Select
                                            disabled={isDisabled}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Loại website" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="WORK">Corporate</SelectItem>
                                                <SelectItem value="HOME">Personal</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <ProvinceCombobox
                                        value={province}
                                        onSelect={handleProvinceSelect}
                                        disabled={isDisabled}
                                    />
                                    <DistrictCombobox
                                        value={district}
                                        onSelect={handleDistrictSelect}
                                        provinceCode={province?.code || null}
                                        disabled={isDisabled}
                                    />
                                    <WardCombobox
                                        value={ward}
                                        onSelect={handleWardSelect}
                                        districtCode={district?.code || null}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="ADDRESS"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    type="text"
                                                    {...field}
                                                    placeholder="Địa chỉ sẽ tự động cập nhật khi chọn tỉnh/huyện/xã"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="BANK_NAME"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên ngân hàng</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isDisabled}
                                            type="text"
                                            {...field}
                                            placeholder="Tên ngân hàng"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ACCOUNT_NUMBER"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số tài khoản ngân hàng</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isDisabled}
                                            type="text"
                                            {...field}
                                            placeholder="Số tài khoản ngân hàng"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <AlertDialogFooter>
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Đóng
                            </Button>

                            {isCreateMode && (
                                <Button type="submit" disabled={createContactMutation.isPending}>
                                    {createContactMutation.isPending ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Tạo liên hệ mới'
                                    )}
                                </Button>
                            )}
                            {isEditMode && (
                                <Button type="submit" disabled={updateContactMutation.isPending}>
                                    {updateContactMutation.isPending ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Cập nhật liên hệ'
                                    )}
                                </Button>
                            )}

                            {isDeleteMode && (
                                <Button type="submit" disabled={deleteContactMutation.isPending}>
                                    {deleteContactMutation.isPending ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Xóa liên hệ'
                                    )}
                                </Button>
                            )}
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default memo(ContactForm);
