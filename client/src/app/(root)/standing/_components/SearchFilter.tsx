import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '~/components/ui/input';

interface SearchFilterProps {
	search: string;
	onSearchChange: (search: string) => void;
}

export const SearchFilter = ({ search, onSearchChange }: SearchFilterProps) => {
	const t = useTranslations('standing');

	return (
		<div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<div className="relative max-w-sm flex-1">
				<Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
				<Input placeholder={t('filters.search_placeholder')} value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-8" />
			</div>
		</div>
	);
};
