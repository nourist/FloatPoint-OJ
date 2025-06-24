import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useTranslation } from 'react-i18next';

import { getTags } from '~/services/problem';

const ProblemTags = ({ setActiveTags, className = '' }) => {
	const { t } = useTranslation('problems');

	const [tags, setTags] = useState([]);
	const [expand, setExpand] = useState(false);

	const handleExpand = () => setExpand((prev) => !prev);

	const handleTagClick = (e) => {
		const tag = e.target.dataset.name;
		if (e.target.dataset.active == 'false') {
			setActiveTags((prev) => [...prev, tag]);
			e.target.dataset.active = true;
		} else {
			setActiveTags((prev) => prev.filter((item) => item != tag));
			e.target.dataset.active = false;
		}
	};

	useEffect(() => {
		getTags()
			.then((res) => {
				res.data.sort((a, b) => b[1] - a[1]);
				setTags(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			});
	}, []);

	return (
		<div data-expand={expand} className={`relative h-12 w-full overflow-hidden data-[expand=true]:h-auto data-[expand=false]:pr-16 ${className}`}>
			{tags.map((tag, index) => (
				<Tooltip key={index}>
					<TooltipTrigger
						asChild
						className="m-2 whitespace-nowrap rounded-full !bg-opacity-30 px-3 py-2 text-sm capitalize hover:text-blue-500 data-[active=true]:bg-blue-500 data-[active=true]:text-blue-500 dark:text-gray-100 dark:hover:text-blue-500"
					>
						<button data-active={false} data-name={tag[0]} onClick={handleTagClick}>
							{tag[0]}
						</button>
					</TooltipTrigger>
					<TooltipContent className="bg-gray-400 capitalize dark:bg-gray-800 dark:text-gray-100">
						{tag[0]}
						<span className="ml-1 rounded-full bg-orange-400 px-1">{tag[1]}</span>
					</TooltipContent>
				</Tooltip>
			))}
			{expand ? (
				<button onClick={handleExpand} className="group float-right m-2 px-3 py-2 text-sm capitalize text-gray-600 dark:text-gray-400">
					{t('collapse')}
					<ChevronsUp className="inline h-4 w-4 transition-all duration-200 group-hover:text-orange-600 dark:group-hover:text-orange-500" />
				</button>
			) : (
				<button onClick={handleExpand} className="group absolute right-1 top-0 m-2 px-3 py-2 text-sm capitalize text-gray-600 dark:text-gray-400">
					{t('expand')}
					<ChevronsDown className="inline h-4 w-4 transition-all duration-200 group-hover:text-orange-600 dark:group-hover:text-orange-500" />
				</button>
			)}
		</div>
	);
};

ProblemTags.propTypes = {
	setActiveTags: PropTypes.func.isRequired,
	className: PropTypes.string,
};

export default ProblemTags;
