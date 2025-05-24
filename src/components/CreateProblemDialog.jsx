import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconButton, Dialog, DialogBody, DialogHeader, DialogFooter, Checkbox, Input, Button, Accordion, AccordionHeader, AccordionBody, Textarea } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import FullOutlineInput from './FullOutlineInput';
import TagInput from './TagInput';
import { getTags } from '~/services/problem';
import Select from './Select';
import MdEditor from './MdEditor';
import { createProblem } from '~/services/problem';

const CreateProblemDialog = ({ handler, open }) => {
	const { t } = useTranslation('problem');
	const [id, setId] = useState('');
	const [name, setName] = useState('');
	const [isPublic, setIsPublic] = useState(true);
	const [tags, setTags] = useState([]);
	const [difficulty, setDifficulty] = useState('medium');
	const [task, setTask] = useState('');
	const [point, setPoint] = useState(100);
	const [timeLimit, setTimeLimit] = useState(1);
	const [memoryLimit, setMemoryLimit] = useState(128);
	const [testcase, setTestcase] = useState([]);
	const [openTestcase, setOpenTestcase] = useState(-1);
	const [creating, setCreating] = useState(false);

	const { data: suggestTags } = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	console.log(testcase);

	return (
		<Dialog className="max-h-[calc(100vh-32px)] overflow-auto p-4" size="xl" open={open}>
			<DialogHeader className="capitalize">
				{t('create-new-problem')}
				<IconButton onClick={handler} variant="text" className="!text-base-content/65 hover:!text-base-content ml-auto cursor-pointer rounded-full">
					<X />
				</IconButton>
			</DialogHeader>
			<DialogBody>
				<h2 className="text-base-content text-sm/6 font-medium capitalize">
					{t('problem-id')} <span className="text-error font-bold">*</span>
				</h2>
				<FullOutlineInput value={id} onChange={(e) => setId(e.target.value)} className="mt-2 w-2/6 min-w-52" placeholder={t('problem-id')} />
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">
					{t('problem-name')} <span className="text-error font-bold">*</span>
				</h2>
				<FullOutlineInput value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-1/2 min-w-60" placeholder={t('problem-name')} />
				<h2 className="text-base-content mt-6 mb-2 text-sm/6 font-medium capitalize">{t('difficulty')}</h2>
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
				<h2 className="text-base-content mt-6 mb-2 text-sm/6 font-medium capitalize">{t('edit-task')}</h2>
				<MdEditor markdown={task} onChange={setTask} />
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">{t('setting')}</h2>
				<div className="mt-2 flex flex-col gap-5">
					<Input label={t('point')} value={point} onChange={(e) => setPoint(Number(e.target.value))} type="number" />
					<Input label={t('time-limit')} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} step="0.01" type="number" />
					<Input label={t('memory-limit')} value={memoryLimit} onChange={(e) => setMemoryLimit(Number(e.target.value))} type="number" />
				</div>
				<h2 className="text-base-content mt-6 mb-2 text-sm/6 font-medium capitalize">{t('test-case')}</h2>
				<div className="bg-base-200 rounded-md p-4">
					{testcase.map((item, index) => (
						<Accordion className="mb-4" open={openTestcase == index} key={index}>
							<AccordionHeader
								onClick={() => {
									if (index == openTestcase) setOpenTestcase(-1);
									else setOpenTestcase(index);
								}}
								className="!text-base-content hover:!text-base-content/90 cursor-pointer capitalize"
							>
								{`${t('test')} ${index + 1}`}
								<IconButton
									variant="text"
									className="hover:bg-error/20 hover:!text-error ml-auto cursor-pointer rounded-full"
									onClick={() => setTestcase((prev) => prev.filter((_, i) => i != index))}
								>
									<X />
								</IconButton>
							</AccordionHeader>
							<AccordionBody className="flex gap-3">
								<Textarea
									resize={true}
									value={item.stdin}
									onChange={(e) =>
										setTestcase((prev) => {
											const update = [...prev];
											update[index].stdin = e.target.value;
											return update;
										})
									}
									labelProps={{ className: 'capitalize' }}
									label={t('input')}
								/>
								<Textarea
									resize={true}
									value={item.stdout}
									onChange={(e) =>
										setTestcase((prev) => {
											const update = [...prev];
											update[index].stdout = e.target.value;
											return update;
										})
									}
									labelProps={{ className: 'capitalize' }}
									label={t('output')}
								/>
							</AccordionBody>
						</Accordion>
					))}
					<Button className="bg-primary cursor-pointer" onClick={() => setTestcase((prev) => [...prev, { stdin: '', stdout: '' }])}>
						+ {t('new')}
					</Button>
				</div>
			</DialogBody>
			<DialogFooter className="space-x-2">
				<Button className="text-error cursor-pointer capitalize" variant="text" onClick={handler}>
					{t('cancel')}
				</Button>
				<Button
					className="bg-error cursor-pointer text-white capitalize"
					onClick={() => {
						setId('');
						setName('');
						setIsPublic(true);
						setTags([]);
						setDifficulty('medium');
						setTask('');
						setPoint(100);
						setTimeLimit(1);
						setMemoryLimit(128);
						setTestcase([]);
						setOpenTestcase(-1);
					}}
				>
					{t('reset-to-default')}
				</Button>
				<Button
					loading={creating}
					className="bg-success cursor-pointer capitalize"
					onClick={() => {
						setCreating(true);
						createProblem({
							id,
							name,
							public: isPublic,
							tags,
							difficulty,
							task,
							point,
							memoryLimit,
							timeLimit,
							testcase,
						})
							.then(toast.success)
							.catch(toast.error)
							.finally(() => {
								setCreating(false);
								handler();
							});
					}}
				>
					{t('save')}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

CreateProblemDialog.propTypes = {
	handler: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

export default CreateProblemDialog;
