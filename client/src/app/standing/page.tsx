'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import useDebounce from '~/hooks/use-debounce';
import { PodiumSection } from './_components/PodiumSection';
import { UserTableSection } from './_components/UserTableSection';

type StandingMode = 'rating' | 'score';

const Standing = () => {
	const t = useTranslations('standing');

	// State management
	const [podiumMode, setPodiumMode] = useState<StandingMode>('rating');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	// Debounce search term
	const debouncedSearch = useDebounce(search, 300);

	const handleModeChange = (newMode: string) => {
		setPodiumMode(newMode as StandingMode);
		setPage(1);
	};

	const handleSearchChange = (newSearch: string) => {
		setSearch(newSearch);
		setPage(1);
	};

	return (
		<div className="container mx-auto space-y-6 py-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">{t('title')}</h1>
				<p className="text-muted-foreground">{t('description')}</p>
			</div>

			{/* Mode Selector */}
			<div className="flex justify-center">
				<Tabs value={podiumMode} onValueChange={handleModeChange} className="w-[400px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="rating">{t('modes.rating')}</TabsTrigger>
						<TabsTrigger value="score">{t('modes.score')}</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Top 3 Podium */}
			<PodiumSection mode={podiumMode} />

			{/* User Table */}
			<UserTableSection
				search={debouncedSearch}
				onSearchChange={handleSearchChange}
				page={page}
				limit={limit}
				onPageChange={setPage}
				onSizeChange={(newLimit: number) => {
					setLimit(newLimit);
					setPage(1);
				}}
			/>
		</div>
	);
};

export default Standing;