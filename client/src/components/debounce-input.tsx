'use client';

import { InputHTMLAttributes, useEffect, useState } from 'react';

import useDebounce from '~/hooks/use-debounce';

interface DebounceInputProps extends InputHTMLAttributes<HTMLInputElement> {
	value: string;
	setValue: (value: string) => void;
}

const DebounceInput = ({ value, setValue, ...props }: DebounceInputProps) => {
	const [valueState, setValueState] = useState(value);
	const valueDebounce = useDebounce(valueState, 400);
	useEffect(() => {
		setValue(valueDebounce);
	}, [valueDebounce, setValue]);
	return <input value={valueState} onChange={(e) => setValueState(e.target.value)} {...props} placeholder="Search..." />;
};

export default DebounceInput;
