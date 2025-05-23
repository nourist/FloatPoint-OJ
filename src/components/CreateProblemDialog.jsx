import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconButton, Dialog, DialogBody, DialogHeader, DialogFooter, Checkbox } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import FullOutlineInput from './FullOutlineInput';
import TagInput from './TagInput';
import { getTags } from '~/services/problem';
import Select from './Select';

const CreateProblemDialog = ({ handler, open }) => {
	const { t } = useTranslation('problem');
	const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [isPublic, setIsPublic] = useState(true);
	const [tags, setTags] = useState([]);
	const [difficulty, setDifficulty] = useState('medium');

	const { data: suggestTags } = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	return (
		<Dialog className="p-4" size="xl" open={open}>
			<DialogHeader className="capitalize">
				{t('create-new-problem')}
				<IconButton onClick={handler} variant="text" className="!text-base-content/65 hover:!text-base-content ml-auto cursor-pointer rounded-full">
					<X />
				</IconButton>
			</DialogHeader>
			<DialogBody>
				<h2 className="text-base-content text-sm/6 font-medium capitalize">{t('problem-id')}</h2>
				<FullOutlineInput value={id} onChange={(e) => setId(e.target.value)} className="mt-2 w-2/6 min-w-52" placeholder={t('problem-id')} />
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">{t('problem-name')}</h2>
				<FullOutlineInput value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-1/2 min-w-60" placeholder={t('problem-name')} />
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">{t('difficulty')}</h2>
				<Select
					value={difficulty}
					setValue={setDifficulty}
					data={[
						{ value: 'easy', label: <div className="text-success">{t('easy')}</div> },
						{ value: 'medium', label: <div className="text-warning">{t('medium')}</div> },
						{ value: 'hard', label: <div className="text-error">{t('hard')}</div> },
					]}
					clearable={false}
				/>
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">{t('tags')}</h2>
				<TagInput className="mt-2" tags={tags} setTags={setTags} suggestTags={suggestTags || []} placeholder={`${t('select-tag')}...`} />
				<h2 className="text-base-content mt-6 flex items-center gap-2 text-sm/6 font-medium capitalize">
					{t('private')}
					<Checkbox
						checked={!isPublic}
						onChange={(e) => setIsPublic(!e.target.checked)}
						className="checked:!bg-primary checked:!border-primary checked:before:!bg-primary"
						color="blue"
					/>
				</h2>
				<p className="text-base-content/60 text-sm/6">{isPublic ? t('open-msg') : t('close-msg')}</p>
			</DialogBody>
			<DialogFooter></DialogFooter>
		</Dialog>
	);
};

CreateProblemDialog.propTypes = {
	handler: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

export default CreateProblemDialog;
