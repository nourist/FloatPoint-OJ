import PropTypes from 'prop-types';
import { Checkbox, Menu, MenuHandler, MenuList, MenuItem, Button, Chip } from '@material-tailwind/react';
import { useEffect, useRef, useState } from 'react';

const MultiSelect = ({ label, data, value, setValue, className = '', loading }) => {
	const containerRef = useRef(null);
	const [visibleChipIndexes, setVisibleChipIndexes] = useState([]);

	const getTextWidth = (text) => {
		const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
		const context = canvas.getContext('2d');
		context.font = '10px Lato';
		return context.measureText(text).width;
	};

	const getText = (item) => {
		if (typeof item === 'string') {
			return item;
		} else if (typeof item === 'object' && item !== null) {
			return getText(item.props.children);
		}
		return '';
	};

	useEffect(() => {
		if (!containerRef.current) return;
		const containerWidth = containerRef.current.offsetWidth - 44;
		let sum = 0;
		let skip = false;
		const newVisibleChipIndexes = [];
		value.forEach((item, index) => {
			const itemValue = getTextWidth(getText(data.find((i) => i.value === item).label)) + 24;
			if (sum + itemValue < containerWidth - skip * 40) {
				newVisibleChipIndexes.push(index);
				sum += itemValue;
			} else {
				skip = true;
			}
		});
		setVisibleChipIndexes(newVisibleChipIndexes);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, data]);

	return (
		<div className={`relative w-64 ${className}`} ref={containerRef}>
			<Menu>
				<MenuHandler>
					<Button
						loading={loading}
						variant="outlined"
						className={`!border-blue-gray-200 dark:!border-blue-gray-800 aria-expanded:!outline-primary aria-expanded:dark:!outline-primary group relative flex h-10 w-64 items-center p-3 pr-8 outline-2 outline-transparent hover:!opacity-100`}
						ripple={false}
					>
						<span
							data-label={value.length === 0}
							className="data-[label=true]:!text-blue-gray-400 dark:data-[label=true]:!text-blue-gray-200 text-blue-gray-800 dark:text-blue-gray-100 flex overflow-hidden truncate text-sm font-normal capitalize"
						>
							{value.length !== 0
								? value.map((item, index) => {
										const itemData = data.find((i) => i.value === item);
										if (!itemData) return null;

										return (
											<div key={index} data-chip-index={index} className="shrink-0">
												{visibleChipIndexes.includes(index) && (
													<Chip className="bg-base-300 text-base-content mr-1 !rounded-xl text-[10px] capitalize" size="sm" value={itemData.label} />
												)}
											</div>
										);
									})
								: label}
							{value.length != visibleChipIndexes.length && (
								<Chip className="bg-base-300 text-base-content !rounded-xl text-[10px] capitalize" size="sm" value={'...'} />
							)}
						</span>
						{value.length === 0 && (
							<div className="text-blue-gray-400 absolute right-2 top-2/4 grid size-5 -translate-y-2/4 rotate-0 place-items-center pt-px transition-all group-aria-expanded:rotate-180">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
						)}
					</Button>
				</MenuHandler>
				<MenuList className={`card-scrollbar max-h-[344px] w-64 overflow-auto`}>
					{data?.map((item, index) => (
						<MenuItem
							className="flex h-10 items-center gap-2 capitalize"
							key={index}
							onClick={() => {
								if (value.includes(item.value)) {
									setValue((prev) => prev.filter((val) => val !== item.value));
								} else {
									setValue((prev) => [...prev, item.value]);
								}
							}}
						>
							<div className="-ml-3">
								<Checkbox readOnly color="blue" checked={value.includes(item.value)} ripple className="!size-4 before:!opacity-0" />
							</div>
							{item.label}
						</MenuItem>
					))}
				</MenuList>
				{value.length !== 0 && (
					<div className="text-blue-gray-400 flex-center absolute right-2 top-2/4 grid size-5 -translate-y-2/4 rotate-0 place-items-center pt-px transition-all">
						<button className="cursor-pointer" onClick={() => setValue([])}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
								<path
									fillRule="evenodd"
									d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				)}
			</Menu>
		</div>
	);
};

MultiSelect.propTypes = {
	label: PropTypes.string,
	data: PropTypes.array,
	value: PropTypes.array.isRequired,
	setValue: PropTypes.func.isRequired,
	className: PropTypes.string,
	loading: PropTypes.bool,
};

export default MultiSelect;
