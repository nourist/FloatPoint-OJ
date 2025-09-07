'use client';

import { Activity, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { createClientService } from '~/lib/service-client';
import { judgerServiceInstance } from '~/services/judger';
import { socketService } from '~/services/socket';
import { Judger, JudgerUpdate } from '~/types/judger.type';

const JudgerPage = () => {
	const t = useTranslations('admin.judger');
	const { getAllJudgers } = createClientService(judgerServiceInstance);
	const { data: initialJudgers = [], isLoading } = useSWR('/judger', getAllJudgers);
	const [judgers, setJudgers] = useState<Judger[]>(initialJudgers);

	// Update judgers state when SWR data changes
	useEffect(() => {
		setJudgers(initialJudgers);
	}, [initialJudgers]);

	// Set up socket listener for real-time updates
	useEffect(() => {
		// Connect to socket
		socketService.connect();

		// Listen for judger updates
		const unsubscribe = socketService.onJudgerUpdate((data: JudgerUpdate) => {
			console.log('Received judger update:', data);
			// Update the judger status in state
			setJudgers((prevJudgers) => prevJudgers.map((judger) => (judger.id === data.id ? { ...judger, busy: data.busy } : judger)));
		});

		// Clean up subscription on unmount
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Activity className="mr-2 h-4 w-4 animate-spin" />
					<span>{t('loading')}</span>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{judgers.map((judger) => (
						<Card key={judger.id} className="transition-shadow hover:shadow-md">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{t('judger')} {judger.id}
								</CardTitle>
								<Server className="text-muted-foreground h-4 w-4" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									<Badge variant={judger.busy ? 'destructive' : 'secondary'}>{judger.busy ? t('busy') : t('idle')}</Badge>
								</div>
								<p className="text-muted-foreground mt-2 text-xs">{judger.busy ? t('judgerBusyDescription') : t('judgerIdleDescription')}</p>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{!isLoading && judgers.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Server className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="text-lg font-semibold">{t('noJudgers')}</h3>
						<p className="text-muted-foreground text-sm">{t('noJudgersDescription')}</p>
					</CardContent>
				</Card>
			)}
		</>
	);
};

export default JudgerPage;
