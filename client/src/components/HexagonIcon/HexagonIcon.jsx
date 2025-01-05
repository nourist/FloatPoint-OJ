import PropTypes from 'prop-types';

const HexagonIcon = ({
	children,
	circleBg = 'white',
	darkCircleBg = 'gray-900',
	bg = 'linear-gradient(to bottom right, #4fc3f7 0%, #2196f3 100%)',
	className = '',
}) => {
	return (
		<div className={`w-[60px] h-[60px] relative ${className}`}>
			<div className={`w-[40px] mx-[10px] h-full rounded-[7px]`} style={{ background: bg }}>
				<div
					className={`rotate-[60deg] absolute w-[40px] h-full rounded-[inherit]`}
					style={{ background: bg }}
				></div>
				<div
					className={`rotate-[-60deg] absolute w-[40px] h-full rounded-[inherit]`}
					style={{ background: bg }}
				></div>
				<div
					className={`rounded-full w-9 h-9 bg-${circleBg} dark:bg-${darkCircleBg} absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 flex items-center justify-center`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

HexagonIcon.propTypes = {
	children: PropTypes.node,
	bg: PropTypes.string,
	darkCircleBg: PropTypes.string,
	circleBg: PropTypes.string,
	className: PropTypes.string,
};

export default HexagonIcon;
