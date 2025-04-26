import PropTypes from 'prop-types';
import DefaultLayout from '../DefaultLayout';
import LayoutFooter from '~/components/LayoutFooter/LayoutFooter';

const DefaultLayoutWithFooter = ({ children }) => {
	return <DefaultLayout footer={<LayoutFooter />}>{children}</DefaultLayout>;
};

DefaultLayoutWithFooter.propTypes = {
	children: PropTypes.node,
};

export default DefaultLayoutWithFooter;
