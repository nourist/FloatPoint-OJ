'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '~/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';

interface TagSelectorProps<T> {
	availableTags: T[];
	selectedTags: T[];
	onChange: (tags: T[]) => void;
	getValue: (tag: T) => string;
	getLabel: (tag: T) => string;
	createTag: (inputValue: string) => T;
	className?: string;
	placeholder?: string;
}

export function TagSelector<T>({ availableTags, selectedTags, onChange, getValue, getLabel, createTag, className, placeholder }: TagSelectorProps<T>) {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState('');

	const filteredTags = availableTags.filter(
		(tag) => getLabel(tag).toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.some((selected) => getValue(selected) === getValue(tag)),
	);

	const handleSelect = (value: string) => {
		const existingTag = availableTags.find((tag) => getValue(tag) === value);
		if (existingTag) {
			onChange([...selectedTags, existingTag]);
		}
		setInputValue('');
	};

	const handleCreate = () => {
		const newTag = createTag(inputValue);
		onChange([...selectedTags, newTag]);
		setInputValue('');
	};

	const handleRemove = (value: string) => {
		onChange(selectedTags.filter((tag) => getValue(tag) !== value));
	};
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'mt-1 flex h-auto min-h-9 w-full cursor-text flex-wrap items-center justify-start gap-[2px] bg-transparent py-[2px] pr-3 pl-[2px] text-left',
						className,
						selectedTags.length > 0 && 'hover:bg-background',
					)}
				>
					{selectedTags.length == 0 && <span className="text-muted-foreground">{placeholder}</span>}
					{selectedTags.map((tag) => (
						<span key={getValue(tag)} className="bg-secondary flex items-center gap-1 rounded px-2 py-1 text-sm break-words">
							{getLabel(tag)}
							<button
								type="button"
								className="cursor-pointer rounded p-0.5 transition-colors hover:bg-red-400/40"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove(getValue(tag));
								}}
							>
								<X size={12} />
							</button>
						</span>
					))}
					<span className="flex-grow" />
					<ChevronsUpDown className="h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder="Enter tag..."
						value={inputValue}
						onValueChange={(value) => setInputValue(value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && inputValue.trim() !== '') {
								handleCreate();
							}
						}}
					/>
					<CommandList>
						<CommandEmpty>No tags found.</CommandEmpty>
						<CommandGroup heading="Tags">
							{filteredTags.map((tag) => (
								<CommandItem key={getValue(tag)} value={getValue(tag)} onSelect={handleSelect}>
									<Check className={cn('mr-2 h-4 w-4', selectedTags.some((selected) => getValue(selected) === getValue(tag)) ? 'opacity-100' : 'opacity-0')} />
									{getLabel(tag)}
								</CommandItem>
							))}
						</CommandGroup>
						{inputValue.trim() !== '' && !availableTags.some((tag) => getLabel(tag).toLowerCase() === inputValue.toLowerCase()) && (
							<CommandGroup heading="Create Tag">
								<CommandItem value={inputValue} onSelect={handleCreate}>
									<Check className="mr-2 h-4 w-4 opacity-100" />
									Create "{inputValue}"
								</CommandItem>
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
