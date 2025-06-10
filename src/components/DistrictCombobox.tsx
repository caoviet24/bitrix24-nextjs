'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { locationVNService } from '@/app/services/location-service';

interface DistrictComboboxProps {
    value: District | null;
    onSelect: (value: District) => void;
    disabled?: boolean;
    provinceCode: number | null;
}

export interface District {
    code: number;
    name: string;
    province_code: number;
}

export default function DistrictCombobox({ value, onSelect, disabled, provinceCode }: DistrictComboboxProps) {
    const [open, setOpen] = useState(false);
    const [districts, setDistricts] = useState<District[]>([]);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (!provinceCode) {
                setDistricts([]);
                return;
            }

            try {
                const res = await locationVNService.getDistricts();
                if (res) {
                    const filteredDistricts = res.filter(
                        (district: District) => district.province_code === provinceCode,
                    );
                    setDistricts(filteredDistricts);
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]);
            }
        };
        fetchDistricts();
    }, [provinceCode]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value ? districts.find((district) => district.code === value.code)?.name : 'Quận/Huyện...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput disabled={disabled} placeholder="Tìm kiếm...." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy quận/huyện.</CommandEmpty>
                        <CommandGroup>
                            {districts.map((district) => (
                                <CommandItem
                                    key={district.code}
                                    value={district.name}
                                    disabled={disabled}
                                    onSelect={() => {
                                        onSelect(district);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value?.code === district.code ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {district.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
