'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Club } from '../page';
import Image from 'next/image';
import Typography from '@/components/ui/typography';
import { useQueryState } from 'nuqs';

export function ClubSelectCombobox({ clubs }: { clubs: Club[] }) {
    const [selectedClub, setSelectedClub] = useQueryState('club', {
        defaultValue: '',
    });

    return (
        <div className="flex flex-col gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-full justify-between', !selectedClub && 'text-muted-foreground')}
                    >
                        {selectedClub ? (
                            <div className="flex flex-row items-center gap-2">
                                {clubs.find((club: Club) => club.id!.toString() === selectedClub)?.name}
                                <Image
                                    src={
                                        clubs.find((club: Club) => club.id!.toString() === selectedClub)?.image_url ||
                                        ''
                                    }
                                    alt={clubs.find((club: Club) => club.id!.toString() === selectedClub)?.name || ''}
                                    width={20}
                                    height={20}
                                />
                            </div>
                        ) : (
                            'Select club'
                        )}

                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search club..." />
                        <CommandList>
                            <CommandEmpty>No club found.</CommandEmpty>
                            <CommandGroup>
                                {clubs.map((club: Club) => (
                                    <CommandItem
                                        value={club.name}
                                        key={club.id}
                                        onSelect={() => {
                                            setSelectedClub(club.id!.toString());
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                club.id!.toString() === selectedClub ? 'opacity-100' : 'opacity-0',
                                            )}
                                        />
                                        <div className="flex w-full flex-row items-center justify-between">
                                            <Typography variant="p">{club.name}</Typography>
                                            <Image src={club.image_url || ''} alt={club.name} width={30} height={30} />
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
