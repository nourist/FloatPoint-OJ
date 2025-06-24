import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-tailwind/react';
import { CodeBlock, dracula, CopyBlock } from 'react-code-blocks';

import statusColors from '~/config/statusColor';
import { getSubmission } from '~/services/submission';
import Error from '~/components/Error';
import SubmissionResultAlert from '~/components/SubmissionResultAlert';
import useThemeStore from '~/stores/themeStore';

const SubmissionId = () => {
	const { id } = useParams();
	const { t } = useTranslation('submission');
	const { theme } = useThemeStore();

	const { data, isLoading, error } = useQuery({
		queryKey: ['submission', id],
		queryFn: () => getSubmission(id),
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
				<Error keys={[['submission', id]]}>{error}</Error>
			</div>
		);
	}

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

	const languageValue = { c: 'c', c11: 'c', 'c++11': 'cpp', 'c++14': 'cpp', 'c++17': 'cpp', 'c++20': 'cpp', python2: 'python', python3: 'python' };

	return (
		<>
			<SubmissionResultAlert data={data} />

			<div className="*:bg-base-100 *:shadow-clg *:shadow-shadow-color/3 my-6 grid grid-cols-6 grid-rows-12 gap-6 *:rounded-xl *:p-5">
				<div className="col-span-6 row-span-3 grid grid-cols-8 grid-rows-8 gap-4 *:col-span-4 *:row-span-2 md:col-span-4 md:row-span-4 *:xl:col-span-2 *:xl:row-span-4">
					{[
						{
							title: t('status'),
							value: <Chip className="inline" value={data.status} style={{ background: statusColors[data.status.toLowerCase()] }} />,
						},
						{
							title: t('language'),
							value: data.language,
						},
						{
							title: t('time'),
							value: `${data.time}s`,
						},
						{
							title: t('memory'),
							value: `${data.memory}Mb`,
						},
						{
							title: t('submit-at'),
							value: formatedDate(new Date(data.createdAt || null)),
						},
						{
							title: t('author'),
							value: (
								<Link to={`/user/${data.author}`} className="text-secondary normal-case hover:underline">
									{data.author}
								</Link>
							),
						},
						{
							title: t('problem'),
							value: (
								<Link to={`/problem/${data.forProblem}`} className="text-secondary normal-case hover:underline">
									{data.forProblem}
								</Link>
							),
						},
						{
							title: t('point'),
							value: data.point,
						},
					].map((item, index) => (
						<div key={index}>
							<h4 className="text-base-content/70 capitalize">{item.title}</h4>
							<div className="text-base-content font-semibold capitalize">{item.value}</div>
						</div>
					))}
				</div>
				<div className="col-span-6 row-span-6 row-start-7 md:col-span-4 md:col-start-1 md:row-span-8 md:row-start-5">
					<h3 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('source')}</h3>
					<CopyBlock text={data.src} language={languageValue[data.language]} showLineNumbers theme={theme == 'dark' ? dracula : undefined} />
				</div>
				<div className="col-span-3 row-span-3 row-start-4 md:col-span-2 md:col-start-5 md:row-span-6 md:row-start-1">
					<h3 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('compiler-log')}</h3>
					<CodeBlock text={data.msg.compiler} language="bash" showLineNumbers theme={theme == 'dark' ? dracula : undefined} />
				</div>
				<div className="col-span-3 col-start-4 row-span-3 row-start-4 md:col-span-2 md:col-start-5 md:row-span-6 md:row-start-7">
					<h3 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('checker-log')}</h3>
					<CodeBlock text={data.msg.checker} language="bash" showLineNumbers theme={theme == 'dark' ? dracula : undefined} />
				</div>
			</div>

			<div className="bg-base-100 shadow-shadow-color/3 shadow-clg rounded-xl p-5">
				<h3 className="text-base-content mb-2 text-lg font-semibold capitalize">{t('testcase-details')}</h3>
				<div className="border-base-content/10 w-full overflow-auto rounded-lg border">
					<table className="w-full table-fixed text-left">
						<thead className="text-base-content capitalize">
							<tr>
								{[t('testcase'), t('status'), `${t('time')} (s)`, `${t('memory')} (Mb)`].map((item, index) => (
									<th className="border-base-content/10 bg-blue-gray-50 dark:bg-base-300 border-b p-4 text-sm capitalize dark:text-white" key={index}>
										{item}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data.testcase.map((item, index) => (
								<tr className="even:bg-base-200 dark:bg-base-200 dark:even:bg-base-100 bg-base-100 text-base-content/80 *:p-4" key={index}>
									<td className="text-base-content font-bold">#{index + 1}</td>
									<td>
										<Chip className="inline" value={item.status} style={{ background: statusColors[item.status.toLowerCase()] }} />
									</td>
									<td>{item.time}</td>
									<td>{item.memory}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default SubmissionId;
