import PropTypes from 'prop-types';

const FullOutlineInput = ({ className = '', size, error, ...props }) => {
	return (
		<input
			data-error={error}
			data-lg={size === 'lg'}
			className={`data-[error=true]:placeholder:text-error text-base-content/90 dark:border-blue-gray-800 data-[error=true]:!outline-error dark:data-[error=true]:!outline-error border-blue-gray-200 focus:outline-primary dark:focus:outline-primary h-10 rounded-[7px] border px-3 py-2.5 text-sm outline-2 outline-transparent data-[lg=true]:h-11 data-[lg=true]:rounded-md data-[lg=true]:py-3 ${className}`}
			{...props}
		/>
	);
};

FullOutlineInput.propTypes = {
	className: PropTypes.string,
	size: PropTypes.oneOf(['lg', 'md']),
	error: PropTypes.bool,
};

export default FullOutlineInput;
