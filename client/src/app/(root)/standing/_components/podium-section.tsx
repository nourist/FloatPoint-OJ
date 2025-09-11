'use client';

import { Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PodiumCard } from './podium-card';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { User } from '~/types/user.type';

interface StandingUser extends User {
	rank: number;
	ratingValue: number;
	scoreValue: number;
	mode: 'rating' | 'score';
}

interface PodiumSectionProps {
	ratingUsers: StandingUser[];
	scoreUsers: StandingUser[];
}

type StandingMode = 'rating' | 'score';

export const PodiumSection = ({ ratingUsers, scoreUsers }: PodiumSectionProps) => {
	const t = useTranslations('standing');
	const [podiumMode, setPodiumMode] = useState<StandingMode>('rating');

	const handleModeChange = (newMode: string) => {
		setPodiumMode(newMode as StandingMode);
	};

	const currentUsers = podiumMode === 'rating' ? ratingUsers : scoreUsers;

	return (
		<div className="bg-card rounded-2xl border p-6 shadow-xs">
			<div className="mb-4 flex items-center gap-2">
				<Trophy className="h-5 w-5" />
				<h2 className="text-xl font-semibold">{t('top_users')}</h2>
			</div>

			{/* Mode Selector */}
			<div className="mb-6 flex justify-center">
				<Tabs value={podiumMode} onValueChange={handleModeChange} className="w-[400px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="rating">{t('modes.rating')}</TabsTrigger>
						<TabsTrigger value="score">{t('modes.score')}</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{currentUsers && currentUsers.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{currentUsers.map((user) => (
						<PodiumCard key={user.id} user={user} position={user.rank} mode={podiumMode} />
					))}
				</div>
			) : (
				<div className="py-8 text-center">
					<p className="text-muted-foreground">{t('no_data')}</p>
				</div>
			)}
		</div>
	);
};