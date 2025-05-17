import PropTypes from 'prop-types';

import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';

const DefaultLayout = ({ children }) => {
	return (
		<>
			<Sidebar />
			<Header />
			<div className="pt-[102px] pr-6 pl-[274px]">{children}</div>
		</>
	);
};

DefaultLayout.propTypes = {
	children: PropTypes.node,
};

export default DefaultLayout;
