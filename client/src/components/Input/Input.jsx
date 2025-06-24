import PropTypes from 'prop-types';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

const Input = ({ type = 'text', placeholder = '', icon, classname = '', value, setValue, isError = false }) => {
	const [show, setShow] = useState(type != 'password');

	return (
		<div
			className={`group relative flex h-9 w-full rounded-md border border-neutral-300 transition-all duration-200 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400 focus-within:ring-opacity-90 dark:border-transparent dark:bg-neutral-700 dark:bg-opacity-40 dark:hover:border-zinc-800 ${classname} ${isError ? 'input-error' : ''}`}
		>
			{icon && (
				<div
					className={`absolute flex h-9 w-9 items-center justify-center text-gray-600 transition-all duration-200 group-focus-within:text-sky-400 dark:text-gray-500 ${isError ? 'input-error' : ''}`}
				>
					{icon}
				</div>
			)}
			<input
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				type={type == 'password' ? (show ? 'text' : 'password') : type}
				placeholder={placeholder}
				className={`h-full w-full rounded-md border-none bg-transparent p-4 text-sm font-light text-gray-800 caret-sky-400 outline-none transition-all duration-200 focus:bg-opacity-100 dark:bg-opacity-70 dark:text-gray-200 ${isError ? 'input-error' : ''}`}
				style={{ paddingLeft: icon ? '2.2rem' : '1rem' }}
			/>
			{type == 'password' && (
				<button
					onClick={() => {
						if (type == 'password') setShow((prev) => !prev);
					}}
					className="px-2"
				>
					{show ? <Eye size="18px" className="text-gray-800 dark:text-gray-400" /> : <EyeClosed size="18px" className="text-gray-800 dark:text-gray-400" />}
				</button>
			)}
		</div>
	);
};

Input.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.string,
	icon: PropTypes.node,
	classname: PropTypes.string,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	isError: PropTypes.bool,
};

export default Input;
