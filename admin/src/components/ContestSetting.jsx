import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Input, Button, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { ArrowBigDown, ArrowBigUp, Trash, Eye, Pencil } from 'lucide-react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { getProblems } from '~/services/problem';
import FullOutlineInput from './FullOutlineInput';
import MdEditor from './MdEditor';
import Error from './Error';

const toDatetimeLocalString = (date) => {
	const pad = (n) => n.toString().padStart(2, '0');
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hour = pad(date.getHours());
	const minute = pad(date.getMinutes());
	return `${year}-${month}-${day}T${hour}:${minute}`;
};

const ContestSetting = ({ handler, defaultData, finallyHandler = () => {} }) => {
	const { t } = useTranslation('contest');

	const [id, setId] = useState(defaultData?.id || '');
	const [title, setTitle] = useState(defaultData?.title || '');
	const [description, setDescription] = useState(defaultData?.description || '');
	const [startTime, setStartTime] = useState(defaultData?.startTime ? toDatetimeLocalString(new Date(defaultData?.startTime || null)) : null);
	const [endTime, setEndTime] = useState(defaultData?.endTime ? toDatetimeLocalString(new Date(defaultData?.endTime || null)) : null);
	const [problems, setProblems] = useState(defaultData?.problems || []);
	const [loading, setLoading] = useState(false);
	const [openSelectProblem, setOpenSelectProblem] = useState(0);
	const [editProblemId, setEditProblemId] = useState(0);

	const swapProblem = (idx1, idx2) => {
		setProblems((prev) => {
			const arr = [...prev];
			const tmp = arr[idx2];
			arr[idx2] = arr[idx1];
			arr[idx1] = tmp;
			return arr;
		});
	};

	const { data: suggestProblems, error: problemErr } = useQuery({
		queryKey: ['minimal-problems'],
		queryFn: () => getProblems({ size: 1e9, minimal: true }).then((res) => res.data),
	});

	if (problemErr) {
		return <Error keys={[['minimal-problems']]}>{problemErr}</Error>;
	}

	return (
		<>
			<Dialog open={openSelectProblem} handler={() => setOpenSelectProblem(0)} className="card-scrollbar max-h-[calc(100vh-300px)] overflow-auto p-4" size="xs">
				<DialogHeader className="capitalize">{t('select-problem')}</DialogHeader>
				<DialogBody className="space-y-1">
					{suggestProblems?.map((item, index) => (
						<Button
							className="bg-base-200 text-base-content w-full cursor-pointer"
							key={index}
							onClick={() => {
								if (openSelectProblem === 1) {
									setProblems((prev) => prev.map((i, idx) => (idx === editProblemId ? item : i)));
								} else {
									setProblems((prev) => [...prev, item]);
								}
								setOpenSelectProblem(0);
							}}
						>
							{item}
						</Button>
					))}
				</DialogBody>
			</Dialog>
			<div className="bg-base-100 shadow-clg shadow-shadow-color/3 rounded-xl p-8">
				<h2 className="text-base-content text-sm/6 font-medium capitalize">
					{t('contest-id')} <span className="text-error font-bold">*</span>
				</h2>
				<FullOutlineInput value={id} onChange={(e) => setId(e.target.value)} className="mt-2 w-2/6 min-w-52 placeholder:capitalize" placeholder={t('contest-id')} />
				<h2 className="text-base-content mt-6 text-sm/6 font-medium capitalize">
					{t('contest-title')} <span className="text-error font-bold">*</span>
				</h2>
				<FullOutlineInput
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="mt-2 w-1/2 min-w-60 placeholder:capitalize"
					placeholder={t('contest-title')}
				/>
				<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('time')}</h2>
				<Input type="datetime-local" label={t('start-time')} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
				<div className="my-5"></div>
				<Input type="datetime-local" label={t('end-time')} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
				<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('description')}</h2>
				<MdEditor markdown={description} onChange={setDescription} />
				<h2 className="text-base-content mb-2 mt-6 text-sm/6 font-medium capitalize">{t('problems')}</h2>
				<div className="bg-base-300 space-y-2 rounded-lg p-2">
					{problems.map((item, index) => (
						<div key={index} className="bg-base-100 border-base-200 text-base-content flex items-center gap-3 rounded-md border p-4">
							<div className="flex flex-col">
								<button
									onClick={() => {
										if (index === 0) return;
										swapProblem(index, index - 1);
									}}
								>
									<ArrowBigUp
										data-disabled={index === 0}
										fill="#ccc"
										className="data-[disabled=false]:hover:fill-base-content data-[disabled=false]:cursor-pointer data-[disabled=true]:opacity-50"
										color="transparent"
										size={18}
									/>
								</button>
								<button
									onClick={() => {
										if (index === problems.length - 1) return;
										swapProblem(index, index + 1);
									}}
								>
									<ArrowBigDown
										data-disabled={index === problems.length - 1}
										className="data-[disabled=false]:hover:fill-base-content data-[disabled=false]:cursor-pointer data-[disabled=true]:opacity-50"
										fill="#ccc"
										color="transparent"
										size={18}
									/>
								</button>
							</div>
							{item}
							<Link to={`/problem/${item}`} className="ml-auto">
								<IconButton className="!text-info hover:bg-info/15 cursor-pointer rounded-full" variant="text">
									<Eye size="18" />
								</IconButton>
							</Link>
							<IconButton
								onClick={() => {
									setOpenSelectProblem(1);
									setEditProblemId(index);
								}}
								className="!text-warning hover:bg-warning/15 cursor-pointer rounded-full"
								variant="text"
							>
								<Pencil size="18" />
							</IconButton>
							<IconButton
								onClick={() => setProblems((prev) => prev.filter((_, idx) => index != idx))}
								className="!text-error hover:bg-error/15 cursor-pointer rounded-full"
								variant="text"
							>
								<Trash size="18" />
							</IconButton>
						</div>
					))}
					<Button className="bg-secondary border-base-content/30 w-full cursor-pointer border" onClick={() => setOpenSelectProblem(2)}>
						+ {t('add')}
					</Button>
				</div>
				<div className="mt-6 flex justify-end gap-3">
					<Button
						className="bg-error cursor-pointer capitalize text-white"
						onClick={() => {
							setId('');
							setTitle('');
							setDescription('');
							setStartTime(null);
							setEndTime(null);
							setProblems([]);
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
								title,
								description,
								startTime: new Date(startTime),
								endTime: new Date(endTime),
								problems,
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
		</>
	);
};

ContestSetting.propTypes = {
	handler: PropTypes.func.isRequired,
	finallyHandler: PropTypes.func,
	defaultData: PropTypes.object,
};

export default ContestSetting;
