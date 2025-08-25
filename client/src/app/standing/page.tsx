'use client';

import { Award, Medal, Search, Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import PaginationControls from '~/components/pagination-controls';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';
import { User } from '~/types/user.type';

type StandingMode = 'rating' | 'score';

interface StandingUser extends User {
	rank: number;
	value: number; // Either rating or score based on mode
}

const Standing = () => {
	const t = useTranslations('standing');
	const router = useRouter();
	const searchParams = useSearchParams();

	// State management
	const [mode, setMode] = useState<StandingMode>((searchParams.get('mode') as StandingMode) || 'rating');
	const [search, setSearch] = useState(searchParams.get('q') || '');
	const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
	const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10'));

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		if (mode !== 'rating') params.set('mode', mode);
		if (search) params.set('q', search);
		if (page > 1) params.set('page', page.toString());
		if (limit !== 10) params.set('limit', limit.toString());

		const newUrl = params.toString() ? `/standing?${params.toString()}` : '/standing';
		router.replace(newUrl, { scroll: false });
	}, [mode, search, page, limit, router]);

	// SWR data fetching for top 3 users
	const userService = createClientService(userServiceInstance);
	const {
		data: topData,
		error: topError,
		isLoading: topLoading,
	} = useSWR(['users-top', mode], () =>
		userService.getUsers({
			sortBy: mode,
			sortOrder: 'DESC',
			limit: 3,
			page: 1,
		}),
	);

	// SWR data fetching for paginated table
	const { data, error, isLoading } = useSWR(['users', mode, search, page, limit], () =>
		userService.getUsers({
			sortBy: mode,
			sortOrder: 'DESC',
			q: search || undefined,
			page,
			limit,
		}),
	);

	const handleReset = () => {
		setMode('rating');
		setSearch('');
		setPage(1);
		setLimit(10);
	};

	const handleModeChange = (newMode: string) => {
		setMode(newMode as StandingMode);
		setPage(1);
	};

	const handleSearchChange = (newSearch: string) => {
		setSearch(newSearch);
		setPage(1);
	};

	// Podium component
	const PodiumCard = ({ user, position }: { user: StandingUser; position: number }) => {
		const getPodiumIcon = () => {
			switch (position) {
				case 1:
					return <Trophy className="h-8 w-8 text-yellow-500" />;
				case 2:
					return <Medal className="h-8 w-8 text-gray-400" />;
				case 3:
					return <Award className="h-8 w-8 text-amber-600" />;
				default:
					return null;
			}
		};

		const getPodiumColor = () => {
			switch (position) {
				case 1:
					return 'border-yellow-200 bg-yellow-50';
				case 2:
					return 'border-gray-200 bg-gray-50';
				case 3:
					return 'border-amber-200 bg-amber-50';
				default:
					return 'border-gray-200 bg-gray-50';
			}
		};

		return (
			<Card className={`relative ${getPodiumColor()}`}>
				<CardHeader className="pb-2 text-center">
					<div className="mb-2 flex justify-center">{getPodiumIcon()}</div>
					<Badge variant="outline" className="absolute top-2 right-2">
						#{position}
					</Badge>
				</CardHeader>
				<CardContent className="space-y-3 text-center">
					<Avatar className="mx-auto h-16 w-16 border-2 border-white shadow">
						<AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
						<AvatarFallback className="text-lg font-semibold">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-semibold">{user.username}</h3>
						{user.fullname && <p className="text-muted-foreground text-sm">{user.fullname}</p>}
					</div>
					<div className="text-primary text-2xl font-bold">{Math.round(user.value)}</div>
					<p className="text-muted-foreground text-sm">{mode === 'rating' ? t('rating') : t('score')}</p>
				</CardContent>
			</Card>
		);
	};

	// Loading skeleton for podium
	const PodiumSkeleton = () => (
		<Card>
			<CardHeader className="pb-2 text-center">
				<Skeleton className="mx-auto mb-2 h-8 w-8" />
			</CardHeader>
			<CardContent className="space-y-3 text-center">
				<Skeleton className="mx-auto h-16 w-16 rounded-full" />
				<div className="space-y-1">
					<Skeleton className="mx-auto h-6 w-24" />
					<Skeleton className="mx-auto h-4 w-32" />
				</div>
				<Skeleton className="mx-auto h-8 w-16" />
				<Skeleton className="mx-auto h-4 w-12" />
			</CardContent>
		</Card>
	);

	return (
		<div className="container mx-auto space-y-6 py-6">
			{/* Header */}
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">{t('title')}</h1>
				<p className="text-muted-foreground">{t('description')}</p>
			</div>

			{/* Mode Selector */}
			<div className="flex justify-center">
				<Tabs value={mode} onValueChange={handleModeChange} className="w-[400px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="rating">{t('modes.rating')}</TabsTrigger>
						<TabsTrigger value="score">{t('modes.score')}</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Top 3 Podium */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5" />
						{t('top_users')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{topLoading ? (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<PodiumSkeleton />
							<PodiumSkeleton />
							<PodiumSkeleton />
						</div>
					) : topError ? (
						<div className="py-8 text-center">
							<p className="text-red-500">{t('errors.load_failed')}</p>
						</div>
					) : topData?.users && topData.users.length > 0 ? (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							{topData.users.map((user, index) => {
								const standingUser: StandingUser = {
									...user,
									rank: index + 1,
									value: mode === 'score' ? (user as any).score || 0 : user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0,
								};
								return <PodiumCard key={user.id} user={standingUser} position={index + 1} />;
							})}
						</div>
					) : (
						<div className="py-8 text-center">
							<Users className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
							<p className="text-muted-foreground">{t('no_data')}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* User Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						{t('all_users')}
					</CardTitle>
					{/* Filters */}
					<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<div className="relative max-w-sm flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
							<Input placeholder={t('filters.search_placeholder')} value={search} onChange={(e) => handleSearchChange(e.target.value)} className="pl-8" />
						</div>
						<div className="flex gap-2">
							<Select
								value={limit.toString()}
								onValueChange={(value) => {
									setLimit(parseInt(value));
									setPage(1);
								}}
							>
								<SelectTrigger className="w-20">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={handleReset}>
								{t('filters.reset')}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: limit }).map((_, i) => (
								<div key={i} className="flex items-center space-x-4 p-4">
									<Skeleton className="h-4 w-8" />
									<Skeleton className="h-10 w-10 rounded-full" />
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-16" />
								</div>
							))}
						</div>
					) : error ? (
						<div className="py-8 text-center">
							<p className="text-red-500">{t('errors.load_failed')}</p>
						</div>
					) : data?.users && data.users.length > 0 ? (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-16">{t('table.rank')}</TableHead>
										<TableHead>{t('table.user')}</TableHead>
										<TableHead className="text-right">{mode === 'rating' ? t('table.rating') : t('table.score')}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.users.map((user, index) => {
										const rank = (page - 1) * limit + index + 1;
										const value = mode === 'score' ? (user as any).score || 0 : user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;
										return (
											<TableRow key={user.id}>
												<TableCell className="font-medium">#{rank}</TableCell>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-8 w-8">
															<AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
															<AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium">{user.username}</p>
															{user.fullname && <p className="text-muted-foreground text-sm">{user.fullname}</p>}
														</div>
													</div>
												</TableCell>
												<TableCell className="text-right font-mono">{Math.round(value)}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							{/* Pagination */}
							<div className="mt-6">
								<PaginationControls
									totalItems={data?.total || 0}
									initialPage={page}
									initialSize={limit}
									onPageChange={setPage}
									onSizeChange={(newLimit: number) => {
										setLimit(newLimit);
										setPage(1);
									}}
								/>
							</div>
						</>
					) : (
						<div className="py-8 text-center">
							<Users className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
							<p className="text-muted-foreground">{t('no_data')}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Standing;
