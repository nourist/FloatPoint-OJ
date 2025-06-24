import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router';
import { LoaderCircle, Trophy, Pencil } from 'lucide-react';
import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
	Chip,
	Input,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Button,
} from '@material-tailwind/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Error from '~/components/Error';
import { getContest, editContest } from '~/services/contest';
import ContestStanding from '~/components/ContestStanding';
import ContestSetting from '~/components/ContestSetting';

const ContestId = () => {
	const { id } = useParams();
	const { t } = useTranslation('contest');
	const [searchParams] = useSearchParams();
	const queryClient = useQueryClient();

	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState();
	const [openStartDialog, setOpenStartDialog] = useState(false);

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

	return (
		<div className="relative min-h-[100vh]">
			<Dialog size="xs" className="p-4" open={openStartDialog} handler={() => setOpenStartDialog(false)}>
				<DialogHeader className="capitalize">{t('start-contest')}</DialogHeader>
				<DialogBody className="space-y-4">
					<Input type="datetime-local" label={t('start-time')} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
					<Input type="datetime-local" label={t('end-time')} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
				</DialogBody>
				<DialogFooter className="space-x-2">
					<Button size="sm" variant="text" onClick={() => setOpenStartDialog(false)} className="text-error cursor-pointer">
						{t('cancel')}
					</Button>
					<Button
						size="sm"
						onClick={() => {
							if (!startTime || !endTime) {
								toast.error('All fields are required');
								return setOpenStartDialog(false);
							}
							editContest(id, { endTime: new Date(endTime), startTime: new Date(startTime) })
								.then(toast.success)
								.catch(toast.error)
								.finally(() => {
									queryClient.invalidateQueries({ queryKey: ['contest', id] });
									setOpenStartDialog(false);
								});
						}}
						className="bg-success cursor-pointer text-white"
					>
						{t('start')}
					</Button>
				</DialogFooter>
			</Dialog>
			<Menu>
				<MenuHandler>
					<Chip
						data-status={data?.status}
						className="bg-warning data-[status=ended]:bg-error data-[status=ongoing]:bg-success absolute right-1 top-[5px] cursor-pointer text-white"
						value={t(data?.status)}
						size="lg"
					/>
				</MenuHandler>
				<MenuList>
					{data.status === 'ongoing' ? (
						<MenuItem
							className="!text-error capitalize"
							onClick={() => {
								editContest(id, { endTime: new Date() })
									.then(toast.success)
									.catch(toast.error)
									.finally(() => queryClient.invalidateQueries({ queryKey: ['contest', id] }));
							}}
						>
							{t('stop')}
						</MenuItem>
					) : data.status === 'ended' ? (
						<MenuItem className="!text-success capitalize" onClick={() => setOpenStartDialog(true)}>
							{t('start')}
						</MenuItem>
					) : (
						<MenuItem
							className="!text-warning capitalize"
							onClick={() => {
								editContest(id, { startTime: new Date() })
									.then(toast.success)
									.catch(toast.error)
									.finally(() => queryClient.invalidateQueries({ queryKey: ['contest', id] }));
							}}
						>
							{t('start-now')}
						</MenuItem>
					)}
				</MenuList>
			</Menu>
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
						<ContestSetting
							defaultData={data}
							handler={(newData) => editContest(id, newData)}
							finallyHandler={() => {
								queryClient.invalidateQueries({ queryKey: ['contest', id] });
							}}
						/>
					</TabPanel>
				</TabsBody>
			</Tabs>
		</div>
	);
};

export default ContestId;
