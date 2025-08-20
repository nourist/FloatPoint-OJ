'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Slider } from './ui/slider';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Switch } from '~/components/ui/switch';
import useDebounce from '~/hooks/use-debounce';
import { cn } from '~/lib/utils';

interface FilterCollapsibleProps {
	title: string;
	children: React.ReactNode;
	initState?: boolean;
}

type Label = React.ReactNode | string;

interface DataItem {
	value: string;
	label: Label;
}

interface FilterRadioProps {
	data: DataItem[];
	value: string;
	setValue: (value: string) => void;
}

interface FilterSwitchProps {
	value: boolean;
	setValue: (value: boolean) => void;
	label: Label;
}

interface FilterRangeSliderProps {
	min: number;
	max: number;
	value: [number, number];
	setValue: (value: [number, number]) => void;
}

interface FilterTagsProps {
	tags: string[];
	value: string[];
	setValue: (value: string[]) => void;
}

const FilterCollapsible = ({ title, children, initState = true }: FilterCollapsibleProps) => {
	const [open, setOpen] = useState(initState);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger asChild>
				<Button variant="ghost" className="w-full justify-between">
					{title}
					<ChevronDown className={cn(!open && '-rotate-90')} />
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="my-3 space-y-2">{children}</CollapsibleContent>
		</Collapsible>
	);
};

const FilterRadio = ({ data, value, setValue }: FilterRadioProps) => {
	const id = useId();
	return (
		<RadioGroup value={value} onValueChange={setValue}>
			{data.map((item) => (
				<div key={item.value} className="flex items-center gap-2 px-3">
					<RadioGroupItem id={`${id}-${item.value}`} value={item.value} />
					<Label className="text-card-foreground/80 flex-1 cursor-pointer font-normal" htmlFor={`${id}-${item.value}`}>
						{item.label}
					</Label>
				</div>
			))}
		</RadioGroup>
	);
};

const FilterSwitch = ({ value, setValue, label }: FilterSwitchProps) => {
	const id = useId();
	return (
		<div className="flex items-center gap-2 px-3">
			<Switch checked={value} id={id} onCheckedChange={setValue} />
			<Label className="text-card-foreground/80 flex-1 cursor-pointer font-normal" htmlFor={id}>
				{label}
			</Label>
		</div>
	);
};

const FilterRangeSlider = ({ min, max, value, setValue }: FilterRangeSliderProps) => {
	const [state, setState] = useState<[number, number]>(value);

	//use debounce to prevent too many re-render and request
	const debouncedValue = useDebounce(state, 100);

	useEffect(() => {
		setValue(debouncedValue);
	}, [debouncedValue, setValue]);

	return (
		<>
			<div className="text-card-foreground/80 flex items-center justify-between gap-2 px-4 text-sm font-medium tabular-nums">
				<output>{state[0]}</output>
				<output>{state[1]}</output>
			</div>
			<div className="px-3 pb-2">
				<Slider min={min} max={max} value={state} onValueChange={(value) => setState(value as [number, number])} />
			</div>
		</>
	);
};

const FilterTags = ({ tags, value, setValue }: FilterTagsProps) => {
	return (
		<div className="flex flex-wrap gap-2 px-3">
			{tags.map((tag, index) => (
				<button
					key={index}
					className={cn(
						'text-card-foreground/80 hover:text-card-foreground rounded-full border px-2 py-1 text-xs font-medium',
						value.includes(tag) && 'bg-primary !text-primary-foreground border-primary',
					)}
					onClick={() => {
						if (value.includes(tag)) {
							setValue(value.filter((item) => item !== tag));
						} else {
							setValue([...value, tag]);
						}
					}}
				>
					{tag}
				</button>
			))}
		</div>
	);
};

export { FilterCollapsible, FilterRadio, FilterSwitch, FilterRangeSlider, FilterTags };
