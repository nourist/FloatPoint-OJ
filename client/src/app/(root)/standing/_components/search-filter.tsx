import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import DebounceInput from '~/components/debounce-input';

interface SearchFilterProps {
	search: string;
	onSearchChange: (search: string) => void;
}

export const SearchFilter = ({ search, onSearchChange }: SearchFilterProps) => {
	const t = useTranslations('standing');

	return (
		<div className="space-y-2">
			<div className="bg-card ring-primary/50 relative flex w-full gap-1 rounded-2xl border p-2 shadow-xs focus-within:ring-1">
				<DebounceInput 
					className="flex-1 pl-10 h-9 outline-0" 
					value={search} 
					setValue={onSearchChange}
					placeholder={t('filters.search_placeholder')}
				/>
				<Search className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2" />
			</div>
		</div>
	);
};
