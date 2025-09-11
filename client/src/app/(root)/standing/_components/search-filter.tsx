import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { Input } from '~/components/ui/input';
import useDebounce from '~/hooks/use-debounce';

interface SearchFilterProps {
	search: string;
	onSearchChange: (search: string) => void;
	delay?: number;
}

export const SearchFilter = ({ search, onSearchChange, delay = 400 }: SearchFilterProps) => {
	const t = useTranslations('standing');
	const [localSearch, setLocalSearch] = useState(search);
	const debouncedSearch = useDebounce(localSearch, delay);

	useEffect(() => {
		setLocalSearch(search);
	}, [search]);

	useEffect(() => {
		onSearchChange(debouncedSearch);
	}, [debouncedSearch, onSearchChange]);

	return (
		<div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<div className="relative max-w-sm flex-1">
				<Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
				<Input placeholder={t('filters.search_placeholder')} value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} className="pl-8" />
			</div>
		</div>
	);
};