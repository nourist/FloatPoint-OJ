import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconButton, Checkbox, Input, Button, Accordion, AccordionHeader, AccordionBody, Textarea } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import FullOutlineInput from '~/components/FullOutlineInput';
import TagInput from '~/components/TagInput';
import { getTags } from '~/services/problem';
import Select from '~/components/Select';
import MdEditor from '~/components/MdEditor';

const ProblemSetting = ({ handler, defaultData, finallyHandler = () => {} }) => {
	const { t } = useTranslation('problem');

	const [id, setId] = useState(defaultData?.id || '');
	const [name, setName] = useState(defaultData?.name || '');
	const [isPublic, setIsPublic] = useState(defaultData?.public || true);
	const [tags, setTags] = useState(defaultData?.tags || []);
	const [difficulty, setDifficulty] = useState(defaultData?.difficulty || 'medium');
	const [task, setTask] = useState(defaultData?.task || '');
	const [point, setPoint] = useState(defaultData?.point || 100);
	const [timeLimit, setTimeLimit] = useState(defaultData?.timeLimit || 1);
	const [memoryLimit, setMemoryLimit] = useState(defaultData?.memoryLimit || 128);
	const [testcase, setTestcase] = useState(defaultData?.testcase || []);
	const [openTestcase, setOpenTestcase] = useState(-1);
	const [loading, setLoading] = useState(false);

	const { data: suggestTags } = useQuery({
		queryKey: ['tags'],
		queryFn: getTags,
	});

	return (
		<div className="bg-base-100 shadow-clg shadow-shadow-color/3 rounded-xl p-8">
			<h2 className="text-base-content text-sm/6 font-medium capitalize">
				{t('problem-id')} <span className="text-error font-bold">*</span>
			</h2>
			<FullOutlineInput value={id} onChange={(e) => setId(e.target.value)} className="mt-2 w-2/6 min-w-52" placeholder={t('problem-id')} />
			<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">
				{t('problem-name')} <span className="text-error font-bold">*</span>
			</h2>
			<FullOutlineInput value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-1/2 min-w-60" placeholder={t('problem-name')} />
			<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('difficulty')}</h2>
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
			<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('edit-task')}</h2>
			<MdEditor markdown={task} onChange={setTask} />
			<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">{t('setting')}</h2>
			<div className="mt-2 flex flex-col gap-5">
				<Input label={t('point')} value={point} onChange={(e) => setPoint(Number(e.target.value))} type="number" />
				<Input label={t('time-limit')} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} step="0.01" type="number" />
				<Input label={t('memory-limit')} value={memoryLimit} onChange={(e) => setMemoryLimit(Number(e.target.value))} type="number" />
			</div>
			<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('test-case')}</h2>
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
						</AccordionHeader>
						<div className="absolute right-4 top-2">
							<IconButton
								variant="text"
								className="hover:bg-error/20 hover:!text-error ml-auto cursor-pointer rounded-full focus:absolute"
								onClick={() => setTestcase((prev) => prev.filter((_, i) => i != index))}
							>
								<X />
							</IconButton>
						</div>
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
			<div className="mt-6 flex justify-end gap-3">
				<Button
					className="bg-error cursor-pointer capitalize text-white"
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
					loading={loading}
					className="bg-success cursor-pointer capitalize"
					onClick={() => {
						setLoading(true);
						handler({
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
								setLoading(false);
							})
							.finally(finallyHandler);
					}}
				>
					{t('save')}
				</Button>
			</div>
		</div>
	);
};

ProblemSetting.propTypes = {
	handler: PropTypes.func.isRequired,
	finallyHandler: PropTypes.func,
	defaultData: PropTypes.object,
};

export default ProblemSetting;
