import { ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '~/components/ui/select';
import useDebounce from '~/hooks/use-debounce';

interface Props {
	setQ: (q: string) => void;
	orderBy: string;
	order: 'asc' | 'desc';
	setOrderBy: (orderBy: string) => void;
	setOrder: (order: 'asc' | 'desc') => void;
}

const Toolbar = ({ setQ, orderBy, order, setOrderBy, setOrder }: Props) => {
	const t = useTranslations('admin.problem.toolbar');

	const [search, setSearch] = useState('');

	const searchDebounced = useDebounce(search);

	const orderByList = [
		{ value: 'title', label: t('title') },
		{ value: 'point', label: t('point') },
		{ value: 'difficulty', label: t('difficulty') },
		{ value: 'acCount', label: t('accept') },
		{ value: 'acRate', label: t('accept_rate') },
	];

	useEffect(() => {
		setQ(searchDebounced);
	}, [searchDebounced, setQ]);

	return (
		<div className="flex w-full flex-wrap gap-2">
			<div className="flex-1">
				<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} />
			</div>
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

export default Toolbar;
