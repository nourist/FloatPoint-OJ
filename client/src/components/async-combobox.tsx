'use client';

import { ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useId, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import useDebounce from '~/hooks/use-debounce';

export interface Option {
	value: string;
	label: string;
}

export interface FetcherResponse {
	items: Option[];
	has_more: boolean;
}

interface AsyncComboboxProps {
	value?: string;
	set_value: (val: string) => void;
	fetcher: (page: number, limit: number, query: string) => Promise<FetcherResponse>;
	placeholder?: string;
	page_size?: number;
}

export function AsyncCombobox({ value, set_value, fetcher, placeholder, page_size = 20 }: AsyncComboboxProps) {
	const [open, set_open] = useState(false);
	const [search, set_search] = useState('');
	const debounced_search = useDebounce(search, 400);
	const t = useTranslations('async_combobox');
	const uniqueId = useId();

	const { data, size, setSize, isValidating } = useSWRInfinite<FetcherResponse>(
		(index: number) => [uniqueId, index + 1, page_size, debounced_search],
		([, page, limit, q]) => fetcher(page as number, limit as number, q as string),
		{ revalidateFirstPage: true, keepPreviousData: true },
	);

	const options: Option[] = data ? data.flatMap((page) => page.items) : [];
	const has_more = data?.[data.length - 1]?.has_more ?? false;

	return (
		<Popover open={open} onOpenChange={set_open}>
			<div className="relative w-full">
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						className="w-full justify-between bg-transparent pr-8 font-normal" // chừa chỗ bên phải
					>
						<div className="flex-1 truncate text-left">{value ? options.find((o) => o.value === value)?.label : placeholder || t('select')}</div>

						{!value && <ChevronsUpDown className="h-4 w-4 opacity-50" />}
					</Button>
				</PopoverTrigger>

				{value && (
					<X
						className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100"
						onClick={(e) => {
							e.stopPropagation(); // tránh mở popover
							set_value('');
						}}
					/>
				)}
			</div>

			<PopoverContent className="w-full p-0">
				<Command shouldFilter={false}>
					<CommandInput placeholder={t('search')} value={search} onValueChange={(val) => set_search(val)} />
					<CommandList>
						{!isValidating && options.length === 0 && <CommandEmpty>{t('no_results')}</CommandEmpty>}
						<CommandGroup>
							{options.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={() => {
										set_value(item.value);
										set_open(false);
									}}
								>
									{item.label}
								</CommandItem>
							))}

							{isValidating && (
								<div className="flex justify-center p-2">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							)}

							{has_more && !isValidating && (
								<div className="cursor-pointer p-2 text-center text-sm text-blue-500" onClick={() => setSize(size + 1)}>
									{t('load_more')}
								</div>
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
