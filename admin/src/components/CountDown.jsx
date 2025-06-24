import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const CountDown = ({ endTime }) => {
	const [now, setNow] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const timeLeft = Math.max(endTime - now, 0);

	const hours = Math.floor(timeLeft / (1000 * 60 * 60));
	const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	return (
		<>
			{hours.toString().padStart(2, '0')}h {minutes.toString().padStart(2, '0')}m {seconds.toString().padStart(2, '0')}s
		</>
	);
};

CountDown.propTypes = {
	endTime: PropTypes.instanceOf(Date),
};

export default CountDown;
