import { Button } from '~/components/ui/button';
import { useTranslation } from 'react-i18next';
import { AlignJustify } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import Markdown from 'react-markdown';

import useAuthStore from '~/stores/authStore';
import { getProblem } from '~/services/problem';
import routesConfig from '~/config/routes';

const Problem = () => {
	const { t } = useTranslation('problem');
	const { isAuth } = useAuthStore();

	const [problem, setProblem] = useState(null);
	const { id } = useParams();

	useEffect(() => {
		getProblem(id)
			.then((res) => {
				setProblem(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			});
	}, [id]);

	return (
		<div className="flex-1 flex gap-4 px-28 py-4">
			<div className=" flex-1 dark:bg-neutral-800 bg-white shadow-md rounded-md px-8 py-6">
				<Markdown
					components={{
						// eslint-disable-next-line no-unused-vars
						h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-4" {...props} />,
						// eslint-disable-next-line no-unused-vars
						h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3 mt-5" {...props} />,
						// eslint-disable-next-line no-unused-vars
						h3: ({ node, ...props }) => <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4" {...props} />,
						// eslint-disable-next-line no-unused-vars
						h4: ({ node, ...props }) => <h4 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4" {...props} />,
						// eslint-disable-next-line no-unused-vars
						p: ({ node, ...props }) => <p className="text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
						// eslint-disable-next-line no-unused-vars
						code: ({ node, ...props }) => <code className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded" {...props} />,
						// eslint-disable-next-line no-unused-vars
						pre: ({ node, ...props }) => (
							<pre className="bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 p-4 rounded mb-4 overflow-auto" {...props} />
						),
						// eslint-disable-next-line no-unused-vars
						ul: ({ node, ...props }) => <ul className="list-disc ml-6 text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
						// eslint-disable-next-line no-unused-vars
						ol: ({ node, ...props }) => <ol className="list-decimal ml-6 text-neutral-700 dark:text-neutral-300 mb-2" {...props} />,
						// eslint-disable-next-line no-unused-vars
						li: ({ node, ...props }) => <li className="mb-1" {...props} />,
						hr: () => <hr className="border-neutral-300 dark:border-neutral-700 my-4" />,
						// eslint-disable-next-line no-unused-vars
						blockquote: ({ node, ...props }) => (
							<blockquote className="border-l-4 border-neutral-400 dark:border-neutral-600 pl-4 italic text-neutral-600 dark:text-neutral-400 mb-4" {...props} />
						),
					}}
				>
					{problem?.task}
				</Markdown>
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
				</div>
			</div>
		</div>
	);
};

export default Problem;
