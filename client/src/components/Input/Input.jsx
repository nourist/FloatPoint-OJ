import PropTypes from 'prop-types';
import { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';

const Input = ({ type = 'text', placeholder = '', icon, classname = '', value, setValue, isError = false }) => {
	const [show, setShow] = useState(type != 'password');

	return (
		<div
			className={`w-full h-9 dark:bg-neutral-700 dark:bg-opacity-40 rounded-md flex border border-neutral-300 dark:border-transparent dark:hover:border-zinc-800 relative focus-within:ring-sky-400 focus-within:ring-opacity-90 focus-within:ring-1 focus-within:border-sky-400 group transition-all duration-200 ${classname} ${isError ? 'input-error' : ''}`}
		>
			<div
				className={`absolute w-9 h-9 dark:text-gray-500 text-gray-600 flex items-center justify-center group-focus-within:text-sky-400 transition-all duration-200 ${isError ? 'input-error' : ''}`}
			>
				{icon}
			</div>
			<input
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				type={type == 'password' ? (show ? 'text' : 'password') : type}
				placeholder={placeholder}
				className={`p-4 w-full h-full rounded-md bg-transparent caret-sky-400 outline-none border-none focus:bg-opacity-100 transition-all dark:bg-opacity-70 duration-200 dark:text-gray-200 text-gray-800 font-light text-sm ${isError ? 'input-error' : ''}`}
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
