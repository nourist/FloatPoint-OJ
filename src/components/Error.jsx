import PropTypes from 'prop-types';
import { Button } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

const Error = ({ children, onRefresh }) => {
	const { t } = useTranslation('error');

	const queryClient = useQueryClient();

	return (
		<div className="flex-center h-[100vh] w-full flex-col gap-2 pb-56">
			<h1 className="text-base-content/60 text-3xl font-semibold">(╯°□°）╯︵ ┻━┻</h1>
			<p className="text-base-content/70 capitalize">
				{t('error')}: {children}
			</p>
			<Button className="bg-primary cursor-pointer hover:shadow-none" onClick={onRefresh || (() => queryClient.invalidateQueries())}>
				{t('refresh')}
			</Button>
		</div>
	);
};

Error.propTypes = {
	children: PropTypes.node,
	onRefresh: PropTypes.func,
};

export default Error;
