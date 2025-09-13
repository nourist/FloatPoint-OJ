import { ArrowDownAZ, ArrowUpZA, Funnel, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import DebounceInput from '~/components/debounce-input';
import { Button } from '~/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import { cn } from '~/lib/utils';

interface OrderControllerProps {
	order: 'asc' | 'desc';
	setOrder: (order: 'asc' | 'desc') => void;
	orderBy: string;
	setOrderBy: (orderBy: string) => void;
	className?: string;
}

interface SearchBarProps {
	search: string;
	setSearch: (search: string) => void;
	orderBy: string;
	setOrderBy: (orderBy: string) => void;
	order: 'asc' | 'desc';
	setOrder: (order: 'asc' | 'desc') => void;
	setFilterDialogOpen: (filterDialogOpen: boolean) => void;
}

const OrderController = ({ order, setOrder, orderBy, setOrderBy, className }: OrderControllerProps) => {
	const t = useTranslations('problem.search');

	const orderByList = [
		{ value: 'title', label: t('title') },
		{ value: 'point', label: t('point') },
		{ value: 'difficulty', label: t('difficulty') },
		{ value: 'acCount', label: t('accept') },
		{ value: 'acRate', label: t('accept_rate') },
	];

	return (
		<div className={cn('flex gap-1', className)}>
			<Select value={orderBy} onValueChange={setOrderBy}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{t('sort_by')}</SelectLabel>
						{orderByList.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button variant="outline" className="bg-card" size="icon" onClick={() => setOrder(order == 'asc' ? 'desc' : 'asc')}>
				{order == 'asc' ? <ArrowDownAZ /> : <ArrowUpZA />}
			</Button>
		</div>
	);
};

const SearchBar = ({ search, setSearch, orderBy, setOrderBy, order, setOrder, setFilterDialogOpen }: SearchBarProps) => {
	const t = useTranslations('problem.filter');

	return (
		<div className="space-y-2">
			<div className="bg-card ring-primary/50 relative flex w-full gap-1 rounded-2xl border p-2 shadow-xs focus-within:ring-1 max-lg:rounded-xl">
				<DebounceInput className="flex-1 pl-10 outline-0" value={search} setValue={setSearch} />
				<Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2" />
				<OrderController order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy} className="max-lg:hidden" />
			</div>
			<div className="flex w-full justify-between lg:hidden">
				<Button onClick={() => setFilterDialogOpen(true)} variant="outline" className="bg-card">
					<Funnel />
					{t('title')}
				</Button>
				<OrderController order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy} />
			</div>
		</div>
	);
};

export default SearchBar;
