import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { init } from 'text-metrics';

const ChipList = ({ items = [], activeItems = [], w, className = '' }) => {
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
			if (sum + itemW <= w - 20) {
				sum += itemW;
				arr.push({ [items[i]]: activeItems.includes(items[i]) });
			}
		}
		if (items.length != arr.length) {
			setRenderItems([
				...arr,
				{
					[`+${items.length - arr.length}`]: items.some((item) => !arr.some((i) => Object.keys(i) == item) && activeItems.includes(item)),
				},
			]);
		} else setRenderItems(arr);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [w, items, activeItems]);

	return (
		<div className={`w-${w}px whitespace-nowrap`}>
			{renderItems.map((item, index) => (
				<span
					data-active={Object.values(item)}
					className={`py-1 px-2 capitalize dark:bg-neutral-700 bg-neutral-200 text-gray-600 dark:text-gray-100 rounded-full mx-1 text-xs data-[active=true]:!bg-blue-500 data-[active=true]:!bg-opacity-20 data-[active=true]:text-blue-500 dark:!bg-opacity-100  ${className}`}
					key={index}
				>
					{Object.keys(item)}
				</span>
			))}
		</div>
	);
};

ChipList.propTypes = {
	items: PropTypes.arrayOf(PropTypes.string),
	activeItems: PropTypes.arrayOf(PropTypes.string),
	w: PropTypes.number,
	className: PropTypes.string,
};

export default ChipList;

/*
i know that it has lots of bugs (just for small sreen)
MAY BE
*/
