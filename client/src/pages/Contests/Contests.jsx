import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Calendar, Clock, RotateCcw } from 'lucide-react';
import { Button } from '~/components/ui/button';

import { getContests } from '~/services/contest';
import Select from '~/components/Select';
import Search from '~/components/Search';
import useAuthStore from '~/stores/authStore';
import Pagination from '~/components/Pagination';
import contestImg from '~/assets/images/1stcontest.png';
import routesConfig from '~/config/routes';
import useDebounce from '~/hooks/useDebounce';

const Contests = () => {
	const { t } = useTranslation('contests');
	const { user } = useAuthStore();

	const [contests, setContests] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPage, setMaxPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState();
	const searchValue = useDebounce(search, 400);

	const formatDuration = (ms) => {
		const MS_IN_SECOND = 1000;
		const MS_IN_MINUTE = MS_IN_SECOND * 60;
		const MS_IN_HOUR = MS_IN_MINUTE * 60;
		const MS_IN_DAY = MS_IN_HOUR * 24;
		const MS_IN_MONTH = MS_IN_DAY * 30.44; // trung bình
		const MS_IN_YEAR = MS_IN_DAY * 365.25;

		if (ms >= MS_IN_YEAR) {
			const years = Math.floor(ms / MS_IN_YEAR);
			return `${years} year${years > 1 ? 's' : ''}`;
		}
		if (ms >= MS_IN_MONTH) {
			const months = Math.floor(ms / MS_IN_MONTH);
			return `${months} month${months > 1 ? 's' : ''}`;
		}
		if (ms >= MS_IN_DAY) {
			const days = Math.floor(ms / MS_IN_DAY);
			return `${days} day${days > 1 ? 's' : ''}`;
		}
		if (ms >= MS_IN_HOUR) {
			const hours = Math.floor(ms / MS_IN_HOUR);
			return `${hours} hour${hours > 1 ? 's' : ''}`;
		}
		if (ms >= MS_IN_MINUTE) {
			const minutes = Math.floor(ms / MS_IN_MINUTE);
			return `${minutes} minute${minutes > 1 ? 's' : ''}`;
		}
		const seconds = Math.floor(ms / MS_IN_SECOND);
		return `${seconds} second${seconds > 1 ? 's' : ''}`;
	};

	const query = () => {
		setLoading(true);
		getContests({
			page: currentPage,
			size: 50,
			status,
			q: searchValue,
		})
			.then((res) => {
				setContests(
					res.data.sort((a, b) => {
						const astatus = user?.joiningContest === a.id && a.status == 'ongoing' ? 'joined' : a.status;
						const bstatus = user?.joiningContest === b.id && b.status == 'ongoing' ? 'joined' : b.status;
						const priority = {
							joined: 4,
							ongoing: 3,
							upcoming: 2,
							ended: 1,
						};
						if (astatus == bstatus) {
							return b.startTime - a.startTime;
						}
						return priority[bstatus] - priority[astatus];
					}),
				);
				setMaxPage(res.maxPage);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, status, searchValue]);

	return (
		<div className="flex-1 px-14 pt-8 space-y-4">
			<div className="w-full flex justify-between">
				<h2 className="text-xl capitalize dark:text-white">{t('all-contests')}</h2>
				<span className="flex gap-2">
					<Select
						setValue={setStatus}
						data={[
							{ label: <span className="capitalize">{t('status')}</span> },
							{ value: 'ended', label: <span className="capitalize text-red-500">{t('ended')}</span> },
							{ value: 'ongoing', label: <span className="capitalize text-green-500">{t('ongoing')}</span> },
							{ value: 'upcoming', label: <span className="capitalize text-yellow-400">{t('upcoming')}</span> },
						]}
					></Select>
					<Search placeholder={t('search-placeholder')} value={search} setValue={setSearch}></Search>
					<Button onClick={query} className="!bg-sky-400 capitalize !text-white font-light hover:!bg-sky-500">
						<RotateCcw></RotateCcw>
						{t('refresh')}
					</Button>
				</span>
			</div>
			<div className="w-full space-y-3">
				{loading ? (
					<div className="w-full text-center dark:text-white my-44">{t('loading')}...</div>
				) : (
					contests.map((item, index) => {
						const itemstatus = user?.joiningContest === item.id && item.status == 'ongoing' ? 'joined' : item.status;
						item.startTime = new Date(item.startTime);
						return (
							<div className="dark:bg-neutral-800 rounded-md bg-white shadow-sm py-5 px-8 w-full h-[100px] flex" key={index}>
								<div className="flex items-center">
									<img className="size-10 mr-4" src={contestImg} alt="" />
									<div className="space-y-1">
										<Link className="dark:text-white text-lg font-light hover:!text-sky-400 hover:underline" to={routesConfig.contest.replace(':id', item.id)}>
											{item.title}
										</Link>
										<div className="text-sm flex gap-x-2 dark:text-gray-300">
											<span className="flex gap-x-1">
												<Calendar className="size-4 text-sky-500"></Calendar>
												{`${item.startTime.getFullYear()}-${item.startTime.getMonth() + 1}-${item.startTime.getDate()} ${item.startTime.getHours()}:00`}
											</span>
											<span className="flex gap-x-1">
												<Clock className="size-4 text-sky-500"></Clock>
												{formatDuration(new Date(item.duration))}
											</span>
										</div>
									</div>
								</div>
								<div className="ml-auto flex items-center">
									<button className="h-8 dark:bg-neutral-700 rounded-sm border flex items-center gap-2 dark:border-neutral-600 text-xs dark:text-white font-light px-2 capitalize">
										<div
											data-status={itemstatus}
											className="size-3 data-[status=joined]:bg-purple-600 data-[status=ended]:bg-red-500 data-[status=ongoing]:bg-green-500 data-[status=upcoming]:bg-yellow-400 rounded-full"
										></div>
										{itemstatus}
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>
			{!loading && <Pagination maxPage={maxPage} currentPage={currentPage} setPage={setCurrentPage}></Pagination>}
		</div>
	);
};

export default Contests;
