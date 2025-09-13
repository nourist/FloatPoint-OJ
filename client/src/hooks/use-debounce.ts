import { useEffect, useState } from 'react';

const useDebounce = <T>(value: T, delay: number = 400) => {
	const [debounceValue, setDebounceValue] = useState(value);

	useEffect(() => {
		const handle = setTimeout(() => {
			setDebounceValue(value);
		}, delay);
		return () => clearTimeout(handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return debounceValue;
};

export default useDebounce;
