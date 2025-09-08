'use client';

import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

interface DateTimePickerProps {
	date?: Date;
	onDateChange?: (date: Date | undefined) => void;
	datePlaceholder?: string;
}

export function DateTimePicker({ date, onDateChange, datePlaceholder = 'Select date' }: DateTimePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [time, setTime] = React.useState<string>('');

	// Initialize time from date prop
	React.useEffect(() => {
		if (date) {
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			setTime(`${hours}:${minutes}`);
		}
	}, [date]);

	// Handle date selection
	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (!selectedDate) {
			onDateChange?.(undefined);
			return;
		}

		// If we have a time, combine it with the selected date
		if (time) {
			const [hours, minutes] = time.split(':').map(Number);
			selectedDate.setHours(hours || 0, minutes || 0, 0, 0);
		} else {
			selectedDate.setHours(0, 0, 0, 0);
		}

		onDateChange?.(selectedDate);
		setOpen(false);
	};

	// Handle time change
	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = e.target.value;
		setTime(newTime);

		if (date && onDateChange) {
			const newDate = new Date(date);
			const [hours, minutes] = newTime.split(':').map(Number);
			newDate.setHours(hours || 0, minutes || 0, 0, 0);
			onDateChange(newDate);
		}
	};

	return (
		<div className="flex gap-2">
			<div className="flex flex-col gap-3">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-32 justify-between font-normal">
							{date ? date.toLocaleDateString() : datePlaceholder}
							<ChevronDownIcon className="ml-2 h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleDateSelect} />
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col gap-3">
				<Input
					type="time"
					step="60"
					value={time}
					onChange={handleTimeChange}
					className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>
	);
}
