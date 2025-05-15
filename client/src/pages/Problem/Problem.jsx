import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { AlignJustify, Clock, Cpu, Tag, Award, Hash, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import Markdown from 'react-markdown';
import { Skeleton } from '~/components/ui/skeleton';

import useAuthStore from '~/stores/authStore';
import { getProblem } from '~/services/problem';
import routesConfig from '~/config/routes';
import markdownComponents from '~/config/markdownComponents.jsx';

const Problem = () => {
	const { t } = useTranslation('problem');
	const { isAuth } = useAuthStore();

	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		setLoading(true);
		getProblem(id)
			.then((res) => {
				setProblem(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoading(false));
	}, [id]);

	// Skeleton component for reuse
	const MetadataSkeleton = () => (
		<div className="space-y-5">
			<div className="space-y-3">
				<Skeleton className="h-5 w-1/3 rounded-lg dark:bg-neutral-800" />
				<Skeleton className="h-4 w-1/2 rounded-lg dark:bg-neutral-800" />
			</div>
		</div>
	);

	return (
		<div className="min-h-screen pb-12 pt-6 dark:bg-neutral-950">
			<div className="mx-auto max-w-7xl px-4 md:px-6">
				{/* Breadcrumb */}
				<div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
					<Link to={routesConfig.problems} className="transition hover:text-gray-700 dark:hover:text-gray-300">
						{t('problems')}
					</Link>
					<ChevronRight className="mx-2 h-4 w-4" />
					<span className="flex items-center truncate font-medium capitalize text-gray-900 dark:text-white">
						{loading ? <Skeleton className="inline-block h-4 w-32 rounded-md dark:bg-neutral-800" /> : problem?.id}
					</span>
				</div>
				{/* Main Layout */}
				<div className="flex flex-col gap-6 lg:flex-row">
					{/* Main Problem Content */}
					<div className="flex-1 rounded-xl border border-gray-200 bg-white !px-8 !py-6 shadow-md md:p-8 dark:border-neutral-800 dark:bg-neutral-900">
						{/* Problem Title */}
						{!loading && problem && (
							<div className="mb-3 flex">
								<h1 className="mb-1 mr-6 text-3xl font-bold text-gray-900 dark:text-white">{problem.name}</h1>
								<div className="flex flex-wrap items-center gap-3">
									<span
										data-difficulty={problem?.difficulty}
										className={`rounded-full border px-3 py-1 text-sm font-medium data-[difficulty='']:border-gray-200 data-[difficulty=easy]:border-green-200 data-[difficulty=hard]:border-red-200 data-[difficulty=medium]:border-yellow-200 data-[difficulty='']:bg-gray-100 data-[difficulty=easy]:bg-green-100 data-[difficulty=hard]:bg-red-100 data-[difficulty=medium]:bg-yellow-100 data-[difficulty='']:text-gray-600 data-[difficulty=easy]:text-green-600 data-[difficulty=hard]:text-red-600 data-[difficulty=medium]:text-yellow-600 dark:data-[difficulty='']:border-gray-700 dark:data-[difficulty=easy]:border-green-800 dark:data-[difficulty=hard]:border-red-800 dark:data-[difficulty=medium]:border-yellow-800 dark:data-[difficulty='']:bg-gray-800 dark:data-[difficulty=easy]:bg-green-900/30 dark:data-[difficulty=hard]:bg-red-900/30 dark:data-[difficulty=medium]:bg-yellow-900/30 dark:data-[difficulty='']:text-gray-400 dark:data-[difficulty=easy]:text-green-400 dark:data-[difficulty=hard]:text-red-400 dark:data-[difficulty=medium]:text-yellow-400`}
									>
										{t(problem?.difficulty)}
									</span>
									{problem?.tags?.slice(0, 3).map((item, index) => (
										<span
											key={index}
											className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
										>
											{item}
										</span>
									))}
									{problem?.tags?.length > 3 && (
										<span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400">
											+{problem.tags.length - 3}
										</span>
									)}
								</div>
							</div>
						)}
						<div className="mb-2 h-px bg-gray-200 dark:bg-neutral-700" />

						{loading ? (
							<div className="space-y-6">
								<Skeleton className="h-10 w-2/3 rounded-lg dark:bg-neutral-800" />
								<div className="space-y-3">
									<Skeleton className="h-5 w-full rounded-lg dark:bg-neutral-800" />
									<Skeleton className="h-5 w-5/6 rounded-lg dark:bg-neutral-800" />
									<Skeleton className="h-5 w-3/4 rounded-lg dark:bg-neutral-800" />
								</div>

								{[...Array(4)].map((_, i) => (
									<div key={i} className="space-y-3 pt-4">
										<Skeleton className="h-7 w-1/4 rounded-lg dark:bg-neutral-800" />
										<Skeleton className="h-5 w-full rounded-lg dark:bg-neutral-800" />
										<Skeleton className="h-5 w-5/6 rounded-lg dark:bg-neutral-800" />
										<Skeleton className="h-5 w-3/4 rounded-lg dark:bg-neutral-800" />
									</div>
								))}
							</div>
						) : (
							<div className="prose dark:prose-invert prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-pre:bg-neutral-800/50 dark:prose-pre:border-neutral-700 max-w-none">
								<Markdown components={markdownComponents}>{problem?.task}</Markdown>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="flex w-full flex-col gap-4 lg:w-80">
						{/* Action Buttons */}
						<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
							{isAuth && (
								<>
									<Button asChild className="w-full" size="lg">
										<Link
											to={`${routesConfig.submit}?problem=${id}`}
											className="bg-gradient-to-r from-blue-600 to-indigo-600 font-medium capitalize !text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800"
										>
											{t('submit')}
										</Link>
									</Button>
									<div className="my-4 h-px bg-gray-200 dark:bg-neutral-700" />
								</>
							)}
							<Button variant="outline" asChild className="w-full border-gray-300 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" size="lg">
								<Link to={`${routesConfig.submissions}?problem=${id}`} className="font-medium capitalize text-gray-900 dark:text-gray-100">
									<AlignJustify className="mr-2 h-4 w-4" />
									{t('submissions')}
								</Link>
							</Button>
						</div>

						{/* Problem Stats */}
						<div className="grid grid-cols-2 gap-3">
							<div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
								{loading ? (
									<Skeleton className="h-6 w-16 rounded-md dark:bg-neutral-800" />
								) : (
									<>
										<span className="text-2xl font-bold text-gray-900 dark:text-white">{problem?.noOfSuccess}</span>
										<span className="text-xs capitalize text-gray-500 dark:text-gray-400">{t('ac-count')}</span>
									</>
								)}
							</div>
							<div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
								{loading ? (
									<Skeleton className="h-6 w-16 rounded-md dark:bg-neutral-800" />
								) : (
									<>
										<span className="text-2xl font-bold text-gray-900 dark:text-white">
											{problem?.noOfSubm ? Math.round((problem?.noOfSuccess / problem?.noOfSubm) * 100) : 0}%
										</span>
										<span className="text-xs capitalize text-gray-500 dark:text-gray-400">{t('ac-rate')}</span>
									</>
								)}
							</div>
						</div>

						{/* Problem Metadata */}
						<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
							{loading ? (
								<div className="space-y-6">
									<MetadataSkeleton />
									<div className="my-3 h-px bg-gray-200 dark:bg-neutral-700" />
									<MetadataSkeleton />
									<div className="my-3 h-px bg-gray-200 dark:bg-neutral-700" />
									<div className="space-y-3">
										<Skeleton className="h-5 w-1/4 rounded-lg dark:bg-neutral-800" />
										<div className="flex flex-wrap gap-2">
											<Skeleton className="h-6 w-16 rounded-full dark:bg-neutral-800" />
											<Skeleton className="h-6 w-20 rounded-full dark:bg-neutral-800" />
										</div>
									</div>
								</div>
							) : (
								<div className="space-y-5">
									<div>
										<h3 className="mb-3 text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">{t('details')}</h3>
										<div className="space-y-3">
											<div className="group flex items-center justify-between">
												<div className="flex items-center text-gray-500 transition group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
													<Hash className="mr-2 h-4 w-4" />
													<span className="text-sm capitalize">{t('id')}</span>
												</div>
												<span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{problem?.id}</span>
											</div>

											<div className="group flex items-center justify-between">
												<div className="flex items-center text-gray-500 transition group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
													<Award className="mr-2 h-4 w-4" />
													<span className="text-sm capitalize">{t('point')}</span>
												</div>
												<span className="font-medium text-gray-900 dark:text-gray-100">{problem?.point}p</span>
											</div>

											<div className="group flex items-center justify-between">
												<div className="flex items-center text-gray-500 transition group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
													<Tag className="mr-2 h-4 w-4" />
													<span className="text-sm capitalize">{t('difficulty')}</span>
												</div>
												<span
													data-difficulty={problem?.difficulty}
													className={`rounded-full border px-2.5 py-1 text-xs font-medium data-[difficulty='']:border-gray-200 data-[difficulty=easy]:border-green-200 data-[difficulty=hard]:border-red-200 data-[difficulty=medium]:border-yellow-200 data-[difficulty='']:bg-gray-100 data-[difficulty=easy]:bg-green-100 data-[difficulty=hard]:bg-red-100 data-[difficulty=medium]:bg-yellow-100 data-[difficulty='']:text-gray-600 data-[difficulty=easy]:text-green-600 data-[difficulty=hard]:text-red-600 data-[difficulty=medium]:text-yellow-600 dark:data-[difficulty='']:border-gray-700 dark:data-[difficulty=easy]:border-green-800 dark:data-[difficulty=hard]:border-red-800 dark:data-[difficulty=medium]:border-yellow-800 dark:data-[difficulty='']:bg-gray-800 dark:data-[difficulty=easy]:bg-green-900/30 dark:data-[difficulty=hard]:bg-red-900/30 dark:data-[difficulty=medium]:bg-yellow-900/30 dark:data-[difficulty='']:text-gray-400 dark:data-[difficulty=easy]:text-green-400 dark:data-[difficulty=hard]:text-red-400 dark:data-[difficulty=medium]:text-yellow-400`}
												>
													{t(problem?.difficulty)}
												</span>
											</div>
										</div>
									</div>

									<div className="h-px bg-gray-200 dark:bg-neutral-700" />

									<div>
										<h3 className="mb-3 text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">{t('constraints')}</h3>
										<div className="space-y-3">
											<div className="group flex items-center justify-between">
												<div className="flex items-center text-gray-500 transition group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
													<Clock className="mr-2 h-4 w-4" />
													<span className="text-sm capitalize">{t('time-limit')}</span>
												</div>
												<span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{problem?.timeLimit}s</span>
											</div>

											<div className="group flex items-center justify-between">
												<div className="flex items-center text-gray-500 transition group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
													<Cpu className="mr-2 h-4 w-4" />
													<span className="text-sm capitalize">{t('memory-limit')}</span>
												</div>
												<span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{problem?.memoryLimit}MB</span>
											</div>
										</div>
									</div>

									<div className="h-px bg-gray-200 dark:bg-neutral-700" />

									<div className="space-y-3">
										<h3 className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-400">{t('tags')}</h3>
										<div className="flex flex-wrap gap-2">
											{problem?.tags?.map((item, index) => (
												<span
													key={index}
													className="cursor-pointer rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
												>
													{item}
												</span>
											))}
											{!problem?.tags?.length && <span className="text-sm italic text-gray-500 dark:text-gray-400">{t('no-tags')}</span>}
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Problem;
