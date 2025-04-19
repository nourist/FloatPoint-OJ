import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProblems } from '~/services/problem';
import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import useAuthStore from '~/stores/authStore';
import padlock from '~/assets/images/padlock.png';

const Problem = () => {
	const { t } = useTranslation('problems');
	const { user } = useAuthStore();

	const [list, setList] = useState([]);
	const [numOfPage, setNumOfPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		getProblems()
			.then((res) => {
				setList(res.data);
				setNumOfPage(res.maxPage);
			})
			.catch((err) => {
				toast.error(err);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-4/5 h-[calc(100%-64px)] max-w-[1084px] mx-auto mt-12">
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-white dark:bg-neutral-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('status')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('title')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('difficulty')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('tags')}
							</th>
							{user.permission == 'Admin' && (
								<th scope="col" className="px-6 py-3">
									{t('private')}
								</th>
							)}
							<th scope="col" className="px-6 py-3">
								{t('point')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-rate')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-count')}
							</th>
						</tr>
					</thead>
					<tbody>
						{list.map((problem, index) => (
							<tr
								key={index}
								className="odd:bg-gray-100 odd:dark:bg-neutral-900 even:bg-white even:dark:bg-neutral-800 border-b dark:border-gray-700 border-gray-200"
							>
								<td className="px-6 py-4">{problem.solve && <CircleCheck className="size-5 text-green-500 mx-auto"></CircleCheck>}</td>
								<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-400 dark:text-white">
									<Link to={routesConfig.problem.replace(':id', problem.id)}>{problem.name}</Link>
								</th>
								<td className="px-6 py-4 capitalize">{t(problem.difficulty)}</td>
								<td className="px-6 py-4 capitalize">{problem.tags.join(' | ')}</td>
								{user.permission == 'Admin' && <td className="px-6 py-4">{!problem.public && <img className="size-6 mx-auto" src={padlock} />}</td>}
								<td className="px-6 py-4">{problem.point}p</td>
								<td className="px-6 py-4">{problem.noOfSubm ? Math.round((problem.noOfSuccess / problem.noOfSubm) * 100) : 0}%</td>
								<td className="px-6 py-4">{problem.noOfSuccess}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination maxPage={numOfPage} currentPage={currentPage} setPage={setCurrentPage} className="my-8"></Pagination>
		</div>
	);
};

export default Problem;
