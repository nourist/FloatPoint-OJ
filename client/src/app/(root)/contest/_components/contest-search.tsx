import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Input } from '~/components/ui/input';
import useDebounce from '~/hooks/use-debounce';

interface ContestSearchProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	delay?: number;
}

export const ContestSearch = ({ searchQuery, onSearchChange, delay = 400 }: ContestSearchProps) => {
	const t = useTranslations('contest.page');
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const debouncedSearch = useDebounce(localSearch, delay);

	useEffect(() => {
		setLocalSearch(searchQuery);
	}, [searchQuery]);

	useEffect(() => {
		onSearchChange(debouncedSearch);
	}, [debouncedSearch, onSearchChange]);

	return (
		<div className="relative flex-1">
			<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
			<Input placeholder={t('search_placeholder')} value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="bg-card w-full pl-10" />
		</div>
	);
};
