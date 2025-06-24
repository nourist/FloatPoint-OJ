import PropTypes from 'prop-types';
import { useState } from 'react';
import { X } from 'lucide-react';
import TextInput from 'react-autocomplete-input';

const TagInput = ({ tags, setTags, placeholder, suggestTags, className = '' }) => {
	const [value, setValue] = useState('');

	return (
		<div
			className={`border-blue-gray-200 dark:border-blue-gray-800 focus-within:outline-primary dark:focus-within:outline-primary flex min-h-10 gap-2 rounded-md border px-3 py-2 text-sm focus-within:outline-2 ${className} flex-wrap`}
		>
			{tags.map((tag, index) => (
				<span className="flex-center text-base-content bg-base-content/10 h-6 gap-1 rounded-full py-1 pl-3 pr-2.5 text-xs" key={index}>
					{tag}
					<button className="text-base-content cursor-pointer" onClick={() => setTags((prev) => prev.filter((_, i) => i !== index))}>
						<X size="14" />
					</button>
				</span>
			))}
			<TextInput
				Component={'input'}
				trigger={''}
				options={suggestTags?.map((tag) => tag[0])?.filter((tag) => !tags.includes(tag))}
				value={value}
				onChange={(v) => setValue(v.trim())}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						if (value.length !== 0 && !tags.includes(value)) setTags((prev) => [...prev, value]);
						setValue('');
					}
				}}
				matchAny={true}
				className="placeholder:text-base-content/60 text-base-content min-w-40 flex-1 py-1 outline-none"
				placeholder={placeholder}
				spacer=""
				passThroughTab={false}
			/>
		</div>
	);
};

TagInput.propTypes = {
	tags: PropTypes.array.isRequired,
	setTags: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	suggestTags: PropTypes.array,
	className: PropTypes.string,
};

export default TagInput;
