import PropTypes from 'prop-types';

const PercentChange = ({ className = '', prev, next, ...props }) => {
	const rateChange = (prev, next) => Math.round(prev <= 0 ? next * 100 : next <= 0 ? prev * -100 : ((next - prev) / prev) * 100);

	const rate = rateChange(prev, next);

	return (
		<span data-worse={rate < 0} className={`text-success data-[worse=true]:text-error text-sm font-semibold ${className}`} {...props}>
			{`${rate >= 0 ? '+' : ''}${rate}%`}{' '}
		</span>
	);
};

PercentChange.propTypes = {
	className: PropTypes.string,
	prev: PropTypes.number,
	next: PropTypes.number,
};

export default PercentChange;
