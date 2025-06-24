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
import { ChevronRight, FileCode, AlertTriangle, Server, Bug, CheckCircle, Clock, ArrowLeftCircle } from 'lucide-react';

import editorConfig from '~/config/editor';
import { getSubmission } from '~/services/submission';
import statusColors from '~/config/statusColor';
import routesConfig from '~/config/routes';
import useThemeStore from '~/stores/themeStore';
import { Button } from '~/components/ui/button';

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

	const getStatusIcon = (status) => {
		const statusLower = status?.toLowerCase();
		switch (statusLower) {
			case 'ac':
				return <CheckCircle className="mr-1 h-4 w-4" />;
			case 'ie':
				return <Server className="mr-1 h-4 w-4" />;
			case 'ce':
			case 're':
				return <Bug className="mr-1 h-4 w-4" />;
			default:
				return <Clock className="mr-1 h-4 w-4" />;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 pb-12 pt-6 dark:bg-neutral-950">
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
					<Link to={routesConfig.submissions} className="flex items-center transition hover:text-gray-700 dark:hover:text-gray-300">
						<ArrowLeftCircle className="mr-1 h-4 w-4" />
						{t('submissions')}
					</Link>
					<ChevronRight className="mx-2 h-4 w-4" />
					<span className="truncate font-medium text-gray-900 dark:text-white">
						{loading ? <Skeleton className="inline-block h-4 w-32 rounded-md dark:bg-neutral-800" /> : `#${id}`}
					</span>
				</div>

				{/* Submission Status Banner */}
				{!loading && submission && (
					<div
						data-status={submission?.status?.toLowerCase()}
						className={`mb-6 flex items-center rounded-xl border border-amber-200 bg-amber-50 p-4 capitalize data-[status=ac]:border-green-200 data-[status=ac]:bg-green-50 dark:border-amber-800 dark:bg-amber-900/20 data-[status=ac]:dark:border-green-800 data-[status=ac]:dark:bg-green-900/20`}
					>
						<div
							data-status={submission?.status?.toLowerCase()}
							className={`mr-3 rounded-full bg-amber-100 p-2 data-[status=ac]:bg-green-100 dark:bg-amber-800/30 data-[status=ac]:dark:bg-green-800/30`}
						>
							{submission.status === 'AC' ? (
								<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
							) : (
								<AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
							)}
						</div>
						<div>
							<h2 className="mb-0.5 flex items-center text-lg font-semibold capitalize">
								<span className={`${submission.status === 'AC' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
									{t(submission?.status?.toLowerCase())}
								</span>
								{submission.status !== 'AC' && submission.point > 0 && (
									<span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
										{t('partial')}: {submission.point}p
									</span>
								)}
							</h2>
							<p className="text-sm text-gray-600 dark:text-gray-300">
								{t('submitted-for')}{' '}
								<Link to={routesConfig.problem.replace(':id', submission?.forProblem)} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
									{t('problem')} {submission?.forProblem}
								</Link>
							</p>
						</div>
						{submission.status === 'AC' && (
							<div className="ml-auto rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-800/30 dark:text-green-400">
								{submission.point}p
							</div>
						)}
					</div>
				)}

				{/* Main Content */}
				<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900">
					{/* Submission Info Panel */}
					<div className="border-b border-gray-200 p-5 dark:border-neutral-700">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							{loading ? (
								<>
									{[...Array(8)].map((_, index) => (
										<div key={index} className="space-y-2">
											<Skeleton className="h-5 w-24 rounded-md dark:bg-neutral-800" />
											<Skeleton className="h-6 w-32 rounded-md dark:bg-neutral-800" />
										</div>
									))}
								</>
							) : (
								<>
									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('status')}</div>
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge
													className="inline-flex h-6 items-center px-3 font-medium !text-white"
													style={{ backgroundColor: statusColors[submission?.status?.toLowerCase()] }}
												>
													{getStatusIcon(submission?.status)}
													{submission?.status}
												</Badge>
											</TooltipTrigger>
											<TooltipContent className="capitalize">{t(submission?.status?.toLowerCase())}</TooltipContent>
										</Tooltip>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('language')}</div>
										<div className="font-medium text-gray-900 dark:text-white">{submission?.language?.toUpperCase()}</div>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('time')}</div>
										<div className="font-medium text-gray-900 dark:text-white">{submission?.time === -1 ? '-' : `${submission?.time}s`}</div>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('memory')}</div>
										<div className="font-medium text-gray-900 dark:text-white">{submission?.memory === -1 ? '-' : `${submission?.memory}MB`}</div>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('author')}</div>
										<Link
											to={routesConfig.user.replace(':name', submission?.author)}
											className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
										>
											{submission?.author}
										</Link>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('problem')}</div>
										<Link
											to={routesConfig.problem.replace(':id', submission?.forProblem)}
											className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
										>
											{submission?.forProblem}
										</Link>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('submit-at')}</div>
										<div className="font-medium text-gray-900 dark:text-white">{formatedDate(new Date(submission?.createdAt || null))}</div>
									</div>

									<div className="space-y-1">
										<div className="text-sm capitalize text-gray-500 dark:text-gray-400">{t('point')}</div>
										<div className="font-medium text-gray-900 dark:text-white">{submission?.point}</div>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Source Code and Details Tabs */}
					<div className="p-5">
						<Tabs defaultValue="source" className="w-full">
							<TabsList className="mb-4 w-full justify-start rounded-xl bg-gray-100 p-1 dark:bg-neutral-800">
								<TabsTrigger
									className="flex items-center capitalize data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
									value="source"
								>
									<FileCode className="mr-1.5 h-4 w-4" />
									{t('source')}
								</TabsTrigger>
								<TabsTrigger
									className="capitalize data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
									value="testcase"
								>
									{t('test-details')}
								</TabsTrigger>
								<TabsTrigger
									className="capitalize data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
									value="compiler"
								>
									{t('compiler-output')}
								</TabsTrigger>
								<TabsTrigger
									className="capitalize data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
									value="judge"
								>
									{t('judge-log')}
								</TabsTrigger>
								{submission?.status === 'IE' && (
									<TabsTrigger
										className="capitalize data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
										value="server"
									>
										{t('server-error')}
									</TabsTrigger>
								)}
							</TabsList>

							<TabsContent value="source">
								<div className="h-[500px] overflow-hidden rounded-xl border shadow-sm dark:border-neutral-700">
									{loading ? (
										<Skeleton className="h-full w-full dark:bg-neutral-800"></Skeleton>
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
								<div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-neutral-700">
									<table className="w-full text-left">
										<thead className="border-b border-gray-200 bg-gray-50 text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300">
											<tr>
												<th className="w-1/4 px-4 py-3 font-medium capitalize">{t('testcase')}</th>
												<th className="w-1/4 px-4 py-3 font-medium capitalize">{t('status')}</th>
												<th className="w-1/4 px-4 py-3 font-medium capitalize">{t('time')} (s)</th>
												<th className="w-1/4 px-4 py-3 font-medium capitalize">{t('memory')} (MB)</th>
											</tr>
										</thead>
										<tbody>
											{submission?.testcase?.map((item, index) => (
												<tr
													key={index}
													className="border-b border-gray-200 last:border-b-0 odd:bg-white even:bg-gray-50 dark:border-neutral-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
												>
													<td className="px-4 py-3 dark:text-gray-200">
														<div className="font-medium">#{index + 1}</div>
													</td>
													<td className="px-4 py-3 capitalize">
														<Badge className="font-medium text-white" style={{ backgroundColor: statusColors[item.status.toLowerCase()] }}>
															{item.status}
														</Badge>
													</td>
													<td className="px-4 py-3 font-mono dark:text-gray-200">{item.status == 'TLE' ? '-' : item.time}</td>
													<td className="px-4 py-3 font-mono dark:text-gray-200">{item.status == 'MLE' ? '-' : item.memory}</td>
												</tr>
											))}
											{loading &&
												[...Array(3)].map((_, index) => (
													<tr
														key={index}
														className="border-b border-gray-200 last:border-b-0 odd:bg-white even:bg-gray-50 dark:border-neutral-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
													>
														<td className="px-4 py-3 dark:text-gray-200">
															<Skeleton className="h-6 w-16 rounded-md dark:bg-neutral-800" />
														</td>
														<td className="px-4 py-3 dark:text-gray-200">
															<Skeleton className="h-6 w-24 rounded-md dark:bg-neutral-800" />
														</td>
														<td className="px-4 py-3 dark:text-gray-200">
															<Skeleton className="h-6 w-16 rounded-md dark:bg-neutral-800" />
														</td>
														<td className="px-4 py-3 dark:text-gray-200">
															<Skeleton className="h-6 w-16 rounded-md dark:bg-neutral-800" />
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</TabsContent>

							<TabsContent value="compiler">
								<div className="whitespace-pre-line rounded-xl border border-gray-200 bg-gray-50 p-5 font-mono text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200">
									{loading ? (
										<div className="space-y-2">
											<Skeleton className="h-4 w-full rounded-md dark:bg-neutral-700" />
											<Skeleton className="h-4 w-5/6 rounded-md dark:bg-neutral-700" />
											<Skeleton className="h-4 w-4/6 rounded-md dark:bg-neutral-700" />
										</div>
									) : (
										submission?.msg?.compiler || (
											<div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
												<AlertTriangle className="mr-2 h-5 w-5 opacity-70" />
												<span className="capitalize">{t('nothing-here')}</span>
											</div>
										)
									)}
								</div>
							</TabsContent>

							<TabsContent value="judge">
								<div className="whitespace-pre-line rounded-xl border border-gray-200 bg-gray-50 p-5 font-mono text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200">
									{loading ? (
										<div className="space-y-2">
											<Skeleton className="h-4 w-full rounded-md dark:bg-neutral-700" />
											<Skeleton className="h-4 w-5/6 rounded-md dark:bg-neutral-700" />
											<Skeleton className="h-4 w-4/6 rounded-md dark:bg-neutral-700" />
										</div>
									) : (
										submission?.msg?.checker || (
											<div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
												<AlertTriangle className="mr-2 h-5 w-5 opacity-70" />
												<span className="capitalize">{t('nothing-here')}</span>
											</div>
										)
									)}
								</div>
							</TabsContent>

							{submission?.status === 'IE' && (
								<TabsContent value="server">
									<div className="whitespace-pre-line rounded-xl border border-gray-200 bg-gray-50 p-5 font-mono text-sm shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200">
										{loading ? (
											<div className="space-y-2">
												<Skeleton className="h-4 w-full rounded-md dark:bg-neutral-700" />
												<Skeleton className="h-4 w-5/6 rounded-md dark:bg-neutral-700" />
												<Skeleton className="h-4 w-4/6 rounded-md dark:bg-neutral-700" />
											</div>
										) : (
											submission?.msg?.server || (
												<div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
													<AlertTriangle className="mr-2 h-5 w-5 opacity-70" />
													<span className="capitalize">{t('nothing-here')}</span>
												</div>
											)
										)}
									</div>
								</TabsContent>
							)}
						</Tabs>
					</div>
				</div>

				{/* Navigation Buttons */}
				<div className="mt-6 flex justify-between">
					<Button variant="outline" className="border-gray-300 capitalize dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800" asChild>
						<Link to={routesConfig.submissions}>
							<ArrowLeftCircle className="mr-2 h-4 w-4" />
							{t('back-to-submissions')}
						</Link>
					</Button>

					{!loading && submission && (
						<Button className="bg-blue-600 capitalize !text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" asChild>
							<Link to={routesConfig.submit + `?problem=${submission.forProblem}`}>{t('try-again')}</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Submission;
