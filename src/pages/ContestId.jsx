import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { LoaderCircle, Trophy, Pencil } from 'lucide-react';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from '@material-tailwind/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Error from '~/components/Error';
import { getContest } from '~/services/contest';
import ContestStanding from '~/components/ContestStanding';

const ContestId = () => {
	const { id } = useParams();
	const { t } = useTranslation('contest');
	const [searchParams] = useSearchParams();

	const [activeTab, setActiveTab] = useState(Number(searchParams.get('tab')) || 1);

	const { data, isLoading, error } = useQuery({
		queryKey: ['contest', id],
		queryFn: () => getContest(id),
	});

	if (isLoading) {
		return (
			<div className="flex-center h-[calc(100vh-100px)]">
				<LoaderCircle className="text-base-content/15 mx-auto size-32 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-[calc(100vh-100px)]">
				<Error keys={[['contest', id]]}>{error}</Error>
			</div>
		);
	}

	console.log(data);

	return (
		<div className="min-h-[100vh]">
			<Tabs value={activeTab}>
				<TabsHeader className="bg-base-300 max-w-80" indicatorProps={{ className: 'bg-base-100' }}>
					<Tab
						className="text-base-content/80 data-[active=true]:text-base-content *:flex-center capitalize *:gap-2"
						data-active={activeTab === 1}
						value={1}
						onClick={() => setActiveTab(1)}
					>
						<Trophy size={16} color="#fbc02d" />
						{t('standing')}
					</Tab>
					<Tab
						className="text-base-content/80 data-[active=true]:text-base-content *:flex-center capitalize *:gap-2"
						data-active={activeTab === 2}
						value={2}
						onClick={() => setActiveTab(2)}
					>
						<Pencil size={16} color="oklch(0.685 0.169 237.323)" />
						{t('edit')}
					</Tab>
				</TabsHeader>
				<TabsBody>
					<TabPanel className="px-1" value={1}>
						<ContestStanding data={data} />
					</TabPanel>
					<TabPanel className="px-1" value={2}>
						info
					</TabPanel>
				</TabsBody>
			</Tabs>
		</div>
	);
};

export default ContestId;
