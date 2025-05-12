import PropTypes from 'prop-types';
import { SelectContent, Select as Selectcontainer, SelectTrigger, SelectValue, SelectItem, SelectGroup } from '../ui/select';

const Select = ({ setValue, data, triggerClassname = '', contentClassname = '', defaultValue, placeholder = '' }) => {
	return (
		<Selectcontainer defaultValue={defaultValue} onValueChange={setValue}>
			<SelectTrigger
				className={`w-[180px] bg-gray-200 text-gray-700 hover:bg-neutral-100 dark:border-none dark:!bg-[rgb(55,55,55)] dark:!text-gray-200 dark:hover:!bg-neutral-800 ${triggerClassname}`}
			>
				<SelectValue className="capitalize" placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className={`border-none dark:!bg-[rgb(55,55,55)] ${contentClassname}`}>
				<SelectGroup>
					{data.map((item, index) => (
						<SelectItem value={item.value} key={index} className="h-10 px-3 capitalize dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700">
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Selectcontainer>
	);
};

Select.propTypes = {
	setValue: PropTypes.func.isRequired,
	data: PropTypes.array.isRequired,
	triggerClassname: PropTypes.string,
	contentClassname: PropTypes.string,
	defaultValue: PropTypes.any,
	placeholder: PropTypes.string,
};

export default Select;
