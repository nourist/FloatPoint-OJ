import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { AlignJustify } from 'lucide-react';
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

	return (
		<div className="flex-1 flex gap-4 px-28 py-4">
			<div className=" flex-1 dark:bg-neutral-800 bg-white shadow-md rounded-md px-8 py-4">
				{loading ? (
					<div className="space-y-5">
						<Skeleton className="rounded-xl h-9 w-1/3" />
						<Skeleton className="rounded-xl h-5 w-3/4" />
						<Skeleton className="rounded-xl h-5 w-2/3" />

						<div className="space-y-2">
							<Skeleton className="rounded-xl h-7 w-1/4" />
							<Skeleton className="rounded-xl h-5 w-full" />
							<Skeleton className="rounded-xl h-5 w-5/6" />
						</div>

						<div className="space-y-2">
							<Skeleton className="rounded-xl h-7 w-1/4" />
							<Skeleton className="rounded-xl h-5 w-1/2" />
						</div>

						<div className="space-y-2">
							<Skeleton className="rounded-xl h-7 w-1/4" />
							<Skeleton className="rounded-xl h-5 w-2/3" />
							<Skeleton className="rounded-xl h-5 w-2/3" />
							<Skeleton className="rounded-xl h-5 w-2/3" />
						</div>

						<div className="space-y-2">
							<Skeleton className="rounded-xl h-7 w-1/4" />
							<Skeleton className="rounded-xl h-5 w-1/6" />
							<Skeleton className="rounded-xl h-5 w-1/4" />
						</div>
					</div>
				) : (
					<Markdown components={markdownComponents}>{problem?.task}</Markdown>
				)}
			</div>
			<div className="w-56">
				<div className="flex h-fit dark:bg-neutral-800 bg-white shadow-md rounded-md mb-4 flex-col p-2 gap-3">
					{isAuth && (
						<>
							<Button asChild>
								<Link
									to={`${routesConfig.submit}?problem=${id}`}
									className="capitalize !bg-sky-400 dark:!bg-blue-500 hover:!bg-sky-500 dark:hover:!bg-blue-400 !text-white"
								>
									{t('submit')}
								</Link>
							</Button>
							<div className="h-[1px] bg-neutral-500 !bg-opacity-40"></div>
						</>
					)}
					<Button variant="ghost" asChild>
						<Link to={`${routesConfig.submissions}?problem=${id}`} className="capitalize dark:text-gray-100 dark:hover:!bg-neutral-700 hover:!bg-neutral-100">
							<AlignJustify></AlignJustify>
							{t('submissions')}
						</Link>
					</Button>
				</div>
				<div className="flex text-sm dark:text-gray-200 h-fit bg-white dark:bg-neutral-800 shadow-md rounded-md mb-4 flex-col p-4 gap-3">
					{loading ? (
						<div className="w-50 p-4 rounded-xl bg-muted/20 space-y-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-1/2 inline-block" /> {/* ID */}
								<Skeleton className="h-4 w-1/3 inline-block" /> {/* ID Value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="h-4 w-1/2 inline-block" /> {/* Point label */}
								<Skeleton className="h-4 w-1/3 inline-block" /> {/* Point value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="h-4 w-1/2 inline-block" /> {/* Difficulty label */}
								<Skeleton className="h-4 w-1/3 inline-block" /> {/* Difficulty value */}
							</div>

							<Skeleton className="h-px w-full bg-border" />

							<div className="space-y-2">
								<Skeleton className="h-4 w-2/3 inline-block" /> {/* Time Limit */}
								<Skeleton className="h-4 w-1/4 inline-block" /> {/* Time value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="h-4 w-2/3 inline-block" /> {/* Memory Limit */}
								<Skeleton className="h-4 w-1/3 inline-block" /> {/* Memory value */}
							</div>

							<Skeleton className="h-px w-full bg-border" />

							<div className="space-y-2">
								<Skeleton className="h-4 w-1/3" /> {/* Tags */}
								<div className="flex flex-wrap gap-2">
									<Skeleton className="h-6 w-16 rounded-full" />
									<Skeleton className="h-6 w-20 rounded-full" />
								</div>
							</div>
						</div>
					) : (
						<>
							<div>
								<span className="uppercase">{t('id')}</span>
								<span className="float-right">{problem?.id}</span>
							</div>
							<div>
								<span className="capitalize">{t('point')}</span>
								<span className="float-right">{problem?.point}p</span>
							</div>
							<div>
								<span className="capitalize">{t('difficulty')}</span>
								<span className="float-right capitalize">{t(problem?.difficulty)}</span>
							</div>
							<div className="h-[1px] bg-neutral-500 w-[95%] mx-auto !bg-opacity-40"></div>
							<div>
								<span className="capitalize">{t('time-limit')}</span>
								<span className="float-right">{problem?.timeLimit}s</span>
							</div>
							<div>
								<span className="capitalize">{t('memory-limit')}</span>
								<span className="float-right">{problem?.memoryLimit}MB</span>
							</div>
							<div className="h-[1px] bg-neutral-500 w-[95%] mx-auto !bg-opacity-40"></div>
							<div className="capitalize">{t('tags')}:</div>
							<div className="flex-wrap flex gap-2">
								{problem?.tags?.map((item, index) => (
									<span className="px-2 py-1 dark:bg-neutral-700 bg-neutral-200 rounded-full text-xs cursor-default whitespace-nowrap" key={index}>
										{item}
									</span>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Problem;
