import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ContestSetting = ({ handler, defaultData }) => {
	const { t } = useTranslation('contest');

	return <div className="bg-base-100 shadow-clg shadow-shadow-color/3 rounded-xl p-8"></div>;
};

ContestSetting.propTypes = {
	handler: PropTypes.func.isRequired,
	defaultData: PropTypes.object,
};

export default ContestSetting;
