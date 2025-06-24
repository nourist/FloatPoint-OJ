import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import ContestTimeWidget from './ContestTimeWidget';

const ContestStanding = ({ data }) => {
	const { t } = useTranslation('contest');

	const formatDurationFromMs = (diffMs) => {
		const totalSec = Math.floor(diffMs / 1000);
		const hours = String(Math.floor(totalSec / 3600)).padStart(2, '0');
		const minutes = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
		const seconds = String(totalSec % 60).padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	};

	return (
		<>
			{data.status === 'ongoing' && <ContestTimeWidget data={data} />}
			<div className="shadow-shadow-color/5 bg-base-100 overflow-hidden rounded-xl shadow-lg">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200 bg-gray-50 dark:border-neutral-700/70 dark:bg-neutral-700/30">
							<th scope="col" className="w-24 px-6 py-4 text-center font-medium capitalize text-gray-700 dark:text-gray-200">
								{t('top')}
							</th>
							<th scope="col" className="px-6 py-4 text-left font-medium capitalize text-gray-700 dark:text-gray-200">
								{t('user')}
							</th>
							<th
								scope="col"
								className="w-32 border-x border-gray-200 px-6 py-4 text-center font-medium capitalize text-gray-700 dark:border-neutral-700/70 dark:text-gray-200"
							>
								{t('total')}
							</th>
							{data?.problems?.map((item, index) => (
								<th
									scope="col"
									key={index}
									className="h-12 w-20 border-x border-gray-200 py-4 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-neutral-700/70 dark:text-gray-200 dark:hover:bg-neutral-700/50"
								>
									<Link className="hover:text-secondary block p-2" to={`/problem/${item}`}>
										{String.fromCharCode(65 + index)}
									</Link>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.standing?.map((item, index) => (
							<tr key={index} className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-700/50 dark:hover:bg-neutral-700/20">
								<td className="text-base-content px-6 py-4 text-center text-lg font-semibold">
									{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
								</td>
								<td className="px-6 py-4">
									<Link className="hover:!text-secondary flex items-center gap-3 text-gray-800 transition-colors dark:text-gray-200" to={`/user/${item.user}`}>
										{item.user}
									</Link>
								</td>
								<td className="border-x border-gray-200 px-6 py-4 dark:border-neutral-700/50">
									<Link
										to={`/submission?contest=${data.id}&author=${item.user}`}
										className="block rounded p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700/50"
									>
										<div className="text-lg font-bold dark:text-white">{item.score.reduce((acc, cur) => acc + cur, 0)}</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">{formatDurationFromMs(item.time.reduce((acc, cur) => acc + cur, 0))}</div>
									</Link>
								</td>
								{data?.problems?.map((problem, index) => (
									<td key={index} className="border-x border-gray-200 px-6 py-4 dark:border-neutral-700/50">
										{item?.status?.[index] && (
											<Link
												to={`/submission?contest=${data.id}&author=${item.user}&problem=${problem}`}
												className="block rounded p-2 text-center transition-colors hover:bg-gray-100 dark:hover:bg-neutral-700/50"
											>
												<div
													data-status={item?.score?.[index] == 0 ? '0' : item?.status?.[index] == 'AC' ? '2' : '1'}
													className={`data-[status=0]:!text-error data-[status=1]:!text-warning data-[status=2]:!text-success text-lg font-bold`}
												>
													{item?.score?.[index]}
												</div>
												<div className="text-xs text-gray-500 dark:text-gray-400">{item?.time?.[index] && formatDurationFromMs(item?.time?.[index])}</div>
											</Link>
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

ContestStanding.propTypes = {
	data: PropTypes.object.isRequired,
};

export default ContestStanding;
