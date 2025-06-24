import PropTypes from 'prop-types';
import { Button } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

const Error = ({ children, onRefresh, keys = [], className = '' }) => {
	const { t } = useTranslation('error');

	const queryClient = useQueryClient();

	return (
		<div className={`flex-center h-full w-full flex-col gap-2 ${className}`}>
			<h1 className="text-base-content/60 text-3xl font-semibold">(╯°□°）╯︵ ┻━┻</h1>
			<p className="text-base-content/70 capitalize">
				{t('error')}: {children}
			</p>
			<Button
				className="bg-primary cursor-pointer hover:shadow-none"
				onClick={onRefresh || (() => keys.forEach((item) => queryClient.invalidateQueries({ queryKey: item, exact: true })))}
			>
				{t('refresh')}
			</Button>
		</div>
	);
};

Error.propTypes = {
	children: PropTypes.node,
	onRefresh: PropTypes.func,
	keys: PropTypes.array,
	className: PropTypes.string,
};

export default Error;
