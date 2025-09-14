'use client';

import { useTranslations } from 'next-intl';

import { Input } from '~/components/ui/input';

interface UserSearchFilterProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const UserSearchFilter = ({ searchQuery, setSearchQuery }: UserSearchFilterProps) => {
	const t = useTranslations('admin.user');

	return (
		<div className="flex flex-col gap-4 sm:flex-row">
			<div className="flex-1">
				<Input placeholder={t('search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
			</div>
		</div>
	);
};

export default UserSearchFilter;
