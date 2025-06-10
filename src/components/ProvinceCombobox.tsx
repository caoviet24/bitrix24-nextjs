'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { locationVNService } from '@/app/services/location-service';


interface ProvinceComboboxProps {
    value: Province | null;
    onSelect: (value: Province) => void;
    disabled?: boolean;
    className?: string;
}

export interface Province {
    code: number;
    name: string;
}

export default function ProvinceCombobox({ value, onSelect, disabled, className }: ProvinceComboboxProps) {
    const [open, setOpen] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await locationVNService.getProvinces();

            if (res) {
                setProvinces(res);
            }
        };
        fetchProvinces();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    role="combobox"
                    aria-expanded={open}
                    className={`w-[200px] justify-between ${className}`}
                >
                    {value ? provinces.find((province) => province.code === value.code)?.name : 'Tỉnh/Thành phố...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Tìm kiếm...." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy tỉnh/thành phố.</CommandEmpty>
                        <CommandGroup>
                            {provinces.map((province) => (
                                <CommandItem
                                    disabled={disabled}
                                    key={province.code}
                                    value={province.name}
                                    onSelect={() => {
                                        onSelect(province);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value?.code === province.code ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {province.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
