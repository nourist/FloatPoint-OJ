import PropTypes from 'prop-types';
import { Chip } from '@material-tailwind/react';

const ChipList = ({ data = [], activeTags = [] }) => {
	return (
		<div className="flex flex-wrap gap-1">
			{data.map((tag, index) => (
				<Chip
					key={index}
					value={tag}
					size="sm"
					data-active={activeTags.includes(tag)}
					className="bg-base-content data-[active=true]:bg-accent text-base-100 rounded-xl text-xs capitalize data-[active=true]:text-white"
				/>
			))}
		</div>
	);
};

ChipList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.string),
	activeTags: PropTypes.arrayOf(PropTypes.string),
};

export default ChipList;
