import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { init } from 'text-metrics';

const ChipList = ({ items = [], w, className = '' }) => {
	const TextMetrics = init({
		fontSize: '12px',
		lineHeight: '16px',
		fontFamily: 'Poppins, sans-serif',
	});

	const [renderItems, setRenderItems] = useState([]);

	useEffect(() => {
		let sum = 0;
		const arr = [];
		for (let i = 0; i < items.length; i++) {
			let itemW = TextMetrics.width(items[i]);
			if (sum + itemW <= w - 10) {
				sum += itemW;
				arr.push(items[i]);
			} else {
				break;
			}
		}
		if (items.length != arr.length) setRenderItems([...arr, `+${items.length - arr.length}`]);
		else setRenderItems(arr);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [w]);

	return (
		<div className={`w-${w}px`}>
			{renderItems.map((item, index) => (
				<span className={`py-1 px-2 capitalize bg-neutral-700 text-gray-100 rounded-full mx-1 text-xs ${className}`} key={index}>
					{item}
				</span>
			))}
		</div>
	);
};

ChipList.propTypes = {
	items: PropTypes.arrayOf(PropTypes.string),
	w: PropTypes.number,
	className: PropTypes.string,
};

export default ChipList;

/*
i know that it has lots of bugs (just for small sreen)
MAY BE
*/
