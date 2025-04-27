import { Badge } from '~/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import MonacoEditor from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Skeleton } from '~/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui/tooltip';

import editorConfig from '~/config/editor';
import { getSubmission } from '~/services/submission';
import statusColors from '~/config/statusColor';
import routesConfig from '~/config/routes';
import useThemeStore from '~/stores/themeStore';

const Submission = () => {
	const { t } = useTranslation('submission');
	const { theme } = useThemeStore();

	const { id } = useParams();
	const [submission, setSubmission] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getSubmission(id)
			.then((res) => {
				setSubmission(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoading(false));
	}, [id]);

	const languageValue = { c: 'c', c11: 'c', 'c++11': 'cpp', 'c++14': 'cpp', 'c++17': 'cpp', 'c++20': 'cpp', python2: 'python', python3: 'python' };

	const formatedDate = (date) => {
		const datePart = new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(date);

		const timePart = new Intl.DateTimeFormat('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			// second: '2-digit',
		}).format(date);

		const result = `${datePart.replaceAll('/', '-')} ${timePart}`;
		return result;
	};

	return (
		<div className="p-6 flex-1 mx-28">
			<div className="rounded-2xl shadow-md p-6 bg-white dark:bg-neutral-800">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					{loading ? (
						<>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
							<Skeleton className="h-6 rounded-full" style={{ width: Math.round(Math.random() * 160 + 80) }}></Skeleton>
						</>
					) : (
						<>
							<div className="flex items-center gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('status')}:</span>
								<Tooltip>
									<TooltipTrigger>
										<Badge style={{ backgroundColor: statusColors[submission?.status?.toLowerCase()] }} className=" !text-white">
											{submission?.status}
										</Badge>
									</TooltipTrigger>
									<TooltipContent className="capitalize">{t(submission?.status?.toLowerCase())}</TooltipContent>
								</Tooltip>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('problem')}:</span>
								<Link to={routesConfig.problem.replace(':id', submission?.forProblem)} className="text-blue-600 hover:underline dark:text-blue-500">
									{submission?.forProblem}
								</Link>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('time')}:</span>
								<span className="dark:text-gray-200">{submission?.time}s</span>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('language')}:</span>
								<span className="dark:text-gray-200">{submission?.language.toUpperCase()}</span>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('memory')}:</span>
								<span className="dark:text-gray-200">{submission?.memory}MB</span>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('submit-at')}:</span>
								<span className="dark:text-gray-200">{formatedDate(new Date(submission?.createdAt || null))}</span>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('point')}:</span>
								<span className="dark:text-gray-200">{submission?.point}</span>
							</div>
							<div className="flex gap-2">
								<span className="capitalize font-semibold dark:text-gray-100">{t('author')}:</span>
								<Link to={routesConfig.user.replace(':id', submission?.author)} className="text-blue-600 hover:underline dark:text-blue-500">
									{submission?.author}
								</Link>
							</div>
						</>
					)}
				</div>

				<Tabs defaultValue="source">
					<TabsList className="bg-gray-100 dark:bg-neutral-700 p-1 rounded-xl mb-4">
						<TabsTrigger className="capitalize dark:data-[state=active]:!bg-neutral-800" value="source">
							{t('source')}
						</TabsTrigger>
						<TabsTrigger className="capitalize dark:data-[state=active]:!bg-neutral-800" value="testcase">
							{t('test-details')}
						</TabsTrigger>
						<TabsTrigger className="capitalize dark:data-[state=active]:!bg-neutral-800" value="compiler">
							{t('compiler-output')}
						</TabsTrigger>
						<TabsTrigger className="capitalize dark:data-[state=active]:!bg-neutral-800" value="judge">
							{t('judge-log')}
						</TabsTrigger>
						{submission?.status === 'IE' && (
							<TabsTrigger className="capitalize dark:data-[state=active]:!bg-neutral-800" value="server">
								{t('server-error')}
							</TabsTrigger>
						)}
					</TabsList>

					<TabsContent value="source">
						<div className="h-[400px] rounded-xl overflow-hidden border dark:border-neutral-700">
							{loading ? (
								<Skeleton className="w-full h-full"></Skeleton>
							) : (
								<MonacoEditor
									height="100%"
									language={languageValue[submission?.language]}
									value={submission?.src}
									theme={theme == 'dark' ? 'vs-dark' : 'light'}
									options={{
										...editorConfig,
										readOnly: true,
										minimap: { enabled: false },
									}}
								/>
							)}
						</div>
					</TabsContent>

					<TabsContent value="testcase">
						<div className="overflow-x-auto dark:rounded-lg overflow-hidden">
							<table className="w-full text-left">
								<thead className="bg-gray-50 dark:bg-neutral-700">
									<tr>
										<th className="p-2 capitalize dark:text-white w-1/4">{t('testcase')}</th>
										<th className="p-2 capitalize dark:text-white w-1/4">{t('status')}</th>
										<th className="p-2 capitalize dark:text-white w-1/4">{t('time')} (s)</th>
										<th className="p-2 capitalize dark:text-white w-1/4">{t('memory')} (MB)</th>
									</tr>
								</thead>
								<tbody>
									{submission?.testcase?.map((item, index) => (
										<tr className="hover:bg-gray-100 even:bg-white even:dark:bg-[rgb(55,55,55)] odd:bg-gray-100 odd:dark:bg-neutral-800" key={index}>
											<td className="p-2 dark:text-gray-200">#{index + 1}</td>
											<td className="p-2 dark:text-gray-200 capitalize" style={{ color: statusColors[item.status.toLowerCase()] }}>
												{item.status}
											</td>
											<td className="p-2 dark:text-gray-200">{item.time}</td>
											<td className="p-2 dark:text-gray-200">{item.memory}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</TabsContent>

					<TabsContent value="compiler">
						<div className="bg-gray-100 dark:bg-neutral-700 dark:text-gray-100 p-4 rounded-xl font-mono text-sm whitespace-pre-line">
							{submission?.msg?.compiler || <span className="text-red-400 capitalize">{t('nothing-here')}</span>}
						</div>
					</TabsContent>

					<TabsContent value="judge">
						<div className="bg-gray-100 dark:bg-neutral-700 dark:text-gray-100 p-4 rounded-xl font-mono text-sm whitespace-pre-line">
							{submission?.msg?.checker || <span className="text-red-400 capitalize">{t('nothing-here')}</span>}
						</div>
					</TabsContent>

					{submission?.status === 'IE' && (
						<TabsContent value="server">
							<div className="bg-gray-100 dark:bg-neutral-700 dark:text-gray-100 p-4 rounded-xl font-mono text-sm whitespace-pre-line">
								{submission?.msg?.server || <span className="text-red-400 capitalize">{t('nothing-here')}</span>}
							</div>
						</TabsContent>
					)}
				</Tabs>
			</div>
		</div>
	);
};

export default Submission;
