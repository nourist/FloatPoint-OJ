'use client';

import { ArrowDownAZ, ArrowUpZA, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import useDebounce from '~/hooks/use-debounce';

interface Props {
	search: string;
	setSearch: (search: string) => void;
	orderByList: {
		value: string;
		label: string;
	}[];
	orderBy: string;
	setOrderBy: (orderBy: string) => void;
	order: 'asc' | 'desc';
	setOrder: (order: 'asc' | 'desc') => void;
}

interface DebounceInputProps {
	value: string;
	setValue: (value: string) => void;
}

const DebounceInput = ({ value, setValue }: DebounceInputProps) => {
	const [valueState, setValueState] = useState(value);
	const valueDebounce = useDebounce(valueState, 400);
	useEffect(() => {
		setValue(valueDebounce);
	}, [valueDebounce, setValue]);
	return <input value={valueState} onChange={(e) => setValueState(e.target.value)} className="flex-1 pl-10 outline-0" placeholder="Search..." />;
};

const SearchBarWithOrder = ({ search, setSearch, orderByList, orderBy, setOrderBy, order, setOrder }: Props) => {
	return (
		<div className="bg-card ring-primary/50 relative flex w-full gap-1 rounded-2xl border p-2 shadow-xs focus-within:ring-1">
			<DebounceInput value={search} setValue={setSearch} />
			<Select value={orderBy} onValueChange={setOrderBy}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Sort by</SelectLabel>
						{orderByList.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button variant="outline" className="bg-transparent" size="icon" onClick={() => setOrder(order == 'asc' ? 'desc' : 'asc')}>
				{order == 'asc' ? <ArrowDownAZ /> : <ArrowUpZA />}
			</Button>
			<Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2" />
		</div>
	);
};

export default SearchBarWithOrder;
