import PropTypes from 'prop-types';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

const Search = ({ value, setValue, placeholder = '', className = '' }) => {
	return (
		<div className={`relative max-w-96 flex-1 dark:text-gray-200 ${className}`}>
			<SearchIcon className="absolute m-[10px] size-4"></SearchIcon>
			<Input
				className="flex-1 border-none bg-gray-200 pl-10 dark:!bg-[rgb(55,55,55)]"
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
