import PropTypes from 'prop-types';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '~/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

const Combobox = ({ data = [], value, setValue, label = '', triggerClassname = '', contentClassname = '' }) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={`w-[200px] justify-between dark:border-none dark:!bg-[rgb(55,55,55)] dark:text-gray-200 dark:hover:!bg-neutral-800 ${triggerClassname}`}
				>
					<span className="overflow-hidden truncate whitespace-nowrap">{value ? data.find((framework) => framework.value === value)?.label : label}</span>
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={`w-[200px] p-0 dark:border-none`}>
				<Command className={`dark:!bg-[rgb(55,55,55)] ${contentClassname}`}>
					<CommandInput placeholder={label} className="h-9" />
					<CommandList>
						<CommandGroup>
							{data.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}
									className="dark:hover:!bg-neutral-700 dark:data-[selected=true]:!bg-neutral-700"
								>
									{framework.label}
									<Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

Combobox.propTypes = {
	data: PropTypes.array,
	value: PropTypes.any,
	setValue: PropTypes.func.isRequired,
	label: PropTypes.string,
	triggerClassname: PropTypes.string,
	contentClassname: PropTypes.string,
};

export default Combobox;
