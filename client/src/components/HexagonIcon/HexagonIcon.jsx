import PropTypes from 'prop-types';

const HexagonIcon = ({ children, bg = 'linear-gradient(to bottom right, #4fc3f7 0%, #2196f3 100%)', className = '' }) => {
	return (
		<div className={`relative h-[60px] w-[60px] ${className}`}>
			<div className={`mx-[10px] h-full w-[40px] rounded-[7px]`} style={{ background: bg }}>
				<div className={`absolute h-full w-[40px] rotate-[60deg] rounded-[inherit]`} style={{ background: bg }}></div>
				<div className={`absolute h-full w-[40px] rotate-[-60deg] rounded-[inherit]`} style={{ background: bg }}></div>
				<div className={`absolute bottom-1/2 right-1/2 flex h-9 w-9 translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-white dark:bg-gray-900`}>
					{children}
				</div>
			</div>
		</div>
	);
};

HexagonIcon.propTypes = {
	children: PropTypes.node,
	bg: PropTypes.string,
	className: PropTypes.string,
};

export default HexagonIcon;
