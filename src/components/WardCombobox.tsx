'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { locationVNService } from '@/app/services/location-service';

interface WardComboboxProps {
    value: Ward | null;
    onSelect: (value: Ward) => void;
    disabled?: boolean;
    districtCode: number | null;
}

export interface Ward {
    code: number;
    name: string;
    district_code: number;
}

export default function WardCombobox({ value, onSelect, disabled, districtCode }: WardComboboxProps) {
    const [open, setOpen] = useState(false);
    const [wards, setWards] = useState<Ward[]>([]);

    useEffect(() => {
        const fetchWards = async () => {
            if (!districtCode) {
                setWards([]);
                return;
            }

            try {
                const res = await locationVNService.getWards();
                if (res) {
                    const filteredWards = res.filter((ward: Ward) => ward.district_code === districtCode);
                    setWards(filteredWards);
                }
            } catch (error) {
                console.error('Error fetching wards:', error);
                setWards([]);
            }
        };
        fetchWards();
    }, [districtCode]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? wards.find((ward) => ward.code === value.code)?.name : 'Phường/Xã...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Tìm kiếm...." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy phường/xã.</CommandEmpty>
                        <CommandGroup>
                            {wards.map((ward) => (
                                <CommandItem
                                    key={ward.code}
                                    value={ward.name}
                                    disabled={disabled}
                                    onSelect={() => {
                                        onSelect(ward);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value?.code === ward.code ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {ward.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
