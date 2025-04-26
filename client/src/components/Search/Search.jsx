import PropTypes from 'prop-types';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

const Search = ({ value, setValue, placeholder = '', className = '' }) => {
	return (
		<div className={`relative flex-1 max-w-96 dark:text-gray-200 ${className}`}>
			<SearchIcon className="absolute size-4 m-[10px]"></SearchIcon>
			<Input
				className="flex-1 pl-10 bg-gray-200 dark:!bg-[rgb(55,55,55)] border-none"
				value={value}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
			></Input>
		</div>
	);
};

Search.propTypes = {
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	className: PropTypes.string,
};

export default Search;
