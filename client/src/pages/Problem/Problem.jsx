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
		<div className="flex flex-1 gap-4 px-28 py-4">
			<div className="flex-1 rounded-md bg-white px-8 py-4 shadow-md dark:bg-neutral-800">
				{loading ? (
					<div className="space-y-5">
						<Skeleton className="h-9 w-1/3 rounded-xl" />
						<Skeleton className="h-5 w-3/4 rounded-xl" />
						<Skeleton className="h-5 w-2/3 rounded-xl" />

						<div className="space-y-2">
							<Skeleton className="h-7 w-1/4 rounded-xl" />
							<Skeleton className="h-5 w-full rounded-xl" />
							<Skeleton className="h-5 w-5/6 rounded-xl" />
						</div>

						<div className="space-y-2">
							<Skeleton className="h-7 w-1/4 rounded-xl" />
							<Skeleton className="h-5 w-1/2 rounded-xl" />
						</div>

						<div className="space-y-2">
							<Skeleton className="h-7 w-1/4 rounded-xl" />
							<Skeleton className="h-5 w-2/3 rounded-xl" />
							<Skeleton className="h-5 w-2/3 rounded-xl" />
							<Skeleton className="h-5 w-2/3 rounded-xl" />
						</div>

						<div className="space-y-2">
							<Skeleton className="h-7 w-1/4 rounded-xl" />
							<Skeleton className="h-5 w-1/6 rounded-xl" />
							<Skeleton className="h-5 w-1/4 rounded-xl" />
						</div>
					</div>
				) : (
					<Markdown components={markdownComponents}>{problem?.task}</Markdown>
				)}
			</div>
			<div className="w-56">
				<div className="mb-4 flex h-fit flex-col gap-3 rounded-md bg-white p-2 shadow-md dark:bg-neutral-800">
					{isAuth && (
						<>
							<Button asChild>
								<Link
									to={`${routesConfig.submit}?problem=${id}`}
									className="!bg-sky-400 capitalize !text-white hover:!bg-sky-500 dark:!bg-blue-500 dark:hover:!bg-blue-400"
								>
									{t('submit')}
								</Link>
							</Button>
							<div className="h-[1px] bg-neutral-500 !bg-opacity-40"></div>
						</>
					)}
					<Button variant="ghost" asChild>
						<Link to={`${routesConfig.submissions}?problem=${id}`} className="capitalize hover:!bg-neutral-100 dark:text-gray-100 dark:hover:!bg-neutral-700">
							<AlignJustify></AlignJustify>
							{t('submissions')}
						</Link>
					</Button>
				</div>
				<div className="mb-4 flex h-fit flex-col gap-3 rounded-md bg-white p-4 text-sm shadow-md dark:bg-neutral-800 dark:text-gray-200">
					{loading ? (
						<div className="w-50 bg-muted/20 space-y-4 rounded-xl p-4">
							<div className="space-y-2">
								<Skeleton className="inline-block h-4 w-1/2" /> {/* ID */}
								<Skeleton className="inline-block h-4 w-1/3" /> {/* ID Value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="inline-block h-4 w-1/2" /> {/* Point label */}
								<Skeleton className="inline-block h-4 w-1/3" /> {/* Point value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="inline-block h-4 w-1/2" /> {/* Difficulty label */}
								<Skeleton className="inline-block h-4 w-1/3" /> {/* Difficulty value */}
							</div>

							<Skeleton className="bg-border h-px w-full" />

							<div className="space-y-2">
								<Skeleton className="inline-block h-4 w-2/3" /> {/* Time Limit */}
								<Skeleton className="inline-block h-4 w-1/4" /> {/* Time value */}
							</div>

							<div className="space-y-2">
								<Skeleton className="inline-block h-4 w-2/3" /> {/* Memory Limit */}
								<Skeleton className="inline-block h-4 w-1/3" /> {/* Memory value */}
							</div>

							<Skeleton className="bg-border h-px w-full" />

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
							<div className="mx-auto h-[1px] w-[95%] bg-neutral-500 !bg-opacity-40"></div>
							<div>
								<span className="capitalize">{t('time-limit')}</span>
								<span className="float-right">{problem?.timeLimit}s</span>
							</div>
							<div>
								<span className="capitalize">{t('memory-limit')}</span>
								<span className="float-right">{problem?.memoryLimit}MB</span>
							</div>
							<div className="mx-auto h-[1px] w-[95%] bg-neutral-500 !bg-opacity-40"></div>
							<div className="capitalize">{t('tags')}:</div>
							<div className="flex flex-wrap gap-2">
								{problem?.tags?.map((item, index) => (
									<span className="cursor-default whitespace-nowrap rounded-full bg-neutral-200 px-2 py-1 text-xs dark:bg-neutral-700" key={index}>
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
