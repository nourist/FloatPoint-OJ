import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Select from '~/components/Select';
import MultiSelect from '~/components/MultiSelect';
import { getProblems, getTags } from '~/services/problem';

const Problem = () => {
	const { t } = useTranslation('problem');

	const {
		data: problems,
		isLoading: problemsLoading,
		isError: problemsErr,
	} = useQuery({
		queryKey: ['problems'],
		queryFn: getProblems,
	});

	const {
		data: tagList,
		isLoading: tagsLoading,
		isError: tagsErr,
	} = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	const [difficulty, setDifficulty] = useState();
	const [tags, setTags] = useState([]);

	return (
		<div>
			<div className="flex">
				<Select
					value={difficulty}
					setValue={setDifficulty}
					data={[
						{ value: 'easy', label: <div className="text-success">{t('easy')}</div> },
						{ value: 'medium', label: <div className="text-warning">{t('medium')}</div> },
						{ value: 'hard', label: <div className="text-error">{t('hard')}</div> },
					]}
					label={t('difficulty')}
				/>
				<MultiSelect loading={tagsLoading} value={tags} setValue={setTags} label={t('tags')} data={tagList?.map((item) => ({ value: item[0], label: item[0] }))} />
			</div>
		</div>
	);
};

export default Problem;
