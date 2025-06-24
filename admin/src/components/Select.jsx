import PropTypes from 'prop-types';
import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';
import { Check } from 'lucide-react';

const Select = ({ label, data, value, setValue, className = '', clearable = true, prefix, loading }) => {
	return (
		<div className={`relative w-48 ${className}`}>
			<Menu>
				<MenuHandler>
					<Button
						loading={loading}
						variant="outlined"
						className={`!border-blue-gray-200 dark:!border-blue-gray-800 aria-expanded:!outline-primary aria-expanded:dark:!outline-primary group relative flex h-10 w-48 items-center p-3 outline-2 outline-transparent transition-all hover:!opacity-100`}
						ripple={false}
					>
						<span
							data-label={!value}
							className="data-[label=true]:!text-blue-gray-400 dark:data-[label=true]:!text-blue-gray-200 text-blue-gray-800 dark:text-blue-gray-100 text-sm font-normal capitalize"
						>
							{value ? (
								<>
									{prefix && <span className="font-semibold normal-case">{prefix}: </span>}
									{data?.filter((item) => item.value === value)?.[0]?.label}
								</>
							) : (
								label
							)}
						</span>
						{(!value || !clearable) && (
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
				<MenuList className={`card-scrollbar z-[9999] max-h-[369px] w-48 overflow-auto`}>
					{data?.map((item, index) => (
						<MenuItem className="flex gap-2 capitalize" key={index} onClick={() => setValue(item.value)}>
							<div className="-ml-1 size-4">{item.value === value && <Check className="size-4" />}</div>
							{item.label}
						</MenuItem>
					))}
				</MenuList>
				{value && clearable && (
					<div className="text-blue-gray-400 flex-center absolute right-2 top-2/4 grid size-5 -translate-y-2/4 rotate-0 place-items-center pt-px transition-all">
						<button className="cursor-pointer" onClick={() => setValue(null)}>
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

Select.propTypes = {
	label: PropTypes.string,
	data: PropTypes.array,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	className: PropTypes.string,
	clearable: PropTypes.bool,
	prefix: PropTypes.string,
	loading: PropTypes.bool,
};

export default Select;
