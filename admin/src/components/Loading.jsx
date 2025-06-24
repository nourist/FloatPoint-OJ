import PropTypes from 'prop-types';
import '~/styles/loading.css';

const Loading = ({ className = '' }) => {
	return (
		<div className={`h-[100vh] w-full ${className} flex items-center justify-center gap-2`}>
			<div className="bg-primary size-4 animate-[loading_4s_infinite] rounded-full"></div>
			<div className="bg-primary animation-delay-200 size-4 animate-[loading_4s_infinite] rounded-full"></div>
			<div className="bg-primary animation-delay-400 size-4 animate-[loading_4s_infinite] rounded-full"></div>
			<div className="bg-primary animation-delay-600 size-4 animate-[loading_4s_infinite] rounded-full"></div>
			<div className="bg-primary animation-delay-800 size-4 animate-[loading_4s_infinite] rounded-full"></div>
		</div>
	);
};

Loading.propTypes = {
	className: PropTypes.string,
};

export default Loading;
