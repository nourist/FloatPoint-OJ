import PropTypes from 'prop-types';
import { LucideSearchX } from 'lucide-react';

const NotFoundResult = ({ msg = '' }) => {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<LucideSearchX className="w-16 h-16 text-gray-400 mb-4" />
			<h2 className="text-xl font-semibold text-gray-600 mb-2">Không có kết quả</h2>
			<p className="text-gray-500">{msg}</p>
		</div>
	);
};

NotFoundResult.propTypes = {
	msg: PropTypes.string,
};

export default NotFoundResult;
