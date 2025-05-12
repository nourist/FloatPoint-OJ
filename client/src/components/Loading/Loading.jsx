import PropTypes from 'prop-types';

import '~/assets/css/loading.css';

const Loading = ({ className = '' }) => {
	return (
		<div className={`flex h-full w-full items-center justify-center dark:bg-neutral-800 ${className}`}>
			<svg className="h-[6em] w-[6em]" width="240" height="240" viewBox="0 0 240 240">
				<circle
					className="pl__ring pl__ring--a"
					cx="120"
					cy="120"
					r="105"
					fill="none"
					stroke="#000"
					strokeWidth="20"
					strokeDasharray="0 660"
					strokeDashoffset="-330"
					strokeLinecap="round"
				></circle>
				<circle
					className="pl__ring pl__ring--b"
					cx="120"
					cy="120"
					r="35"
					fill="none"
					stroke="#000"
					strokeWidth="20"
					strokeDasharray="0 220"
					strokeDashoffset="-110"
					strokeLinecap="round"
				></circle>
				<circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
				<circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
			</svg>
		</div>
	);
};

Loading.propTypes = {
	className: PropTypes.string,
};

export default Loading;
