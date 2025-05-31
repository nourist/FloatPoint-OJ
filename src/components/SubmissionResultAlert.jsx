import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CircleCheckBig, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';

const SubmissionResultAlert = ({ data }) => {
	const { t } = useTranslation('submission');

	return (
		<div
			data-ac={data.status == 'AC'}
			className="bg-warning/6 text-warning border-warning data-[ac=true]:bg-success/6 data-[ac=true]:text-success data-[ac=true]:border-success flex items-center gap-4 rounded-xl border p-4"
		>
			<div data-ac={data.status == 'AC'} className="bg-warning/12 data-[ac=true]:bg-success/12 flex-center size-10 rounded-full">
				{data.status == 'AC' ? <CircleCheckBig /> : <TriangleAlert />}
			</div>
			<div>
				<h3 data-ac={data.status == 'AC'} className="text-warning-content data-[ac=true]:text-success-content flex items-center text-lg font-bold capitalize">
					{t(data.status.toLowerCase())}
					{data.status != 'AC' && data.point != 0 && (
						<div className="bg-secondary/20 text-secondary ml-4 rounded-full px-2 py-1 text-sm capitalize">
							{t('partial')}: {data.point}p
						</div>
					)}
				</h3>
				<p className="text-sm">
					<span className="text-base-content/70 capitalize">{t('submitted-for')}</span>{' '}
					<Link className="text-secondary font-semibold hover:underline" to={`/problem/${data.forProblem}`}>
						{data.forProblem}
					</Link>
				</p>
			</div>
			{data.status == 'AC' && <div className="text-success-content dark:text-success bg-success/12 ml-auto rounded-full px-3 py-1">{data.point}p</div>}
		</div>
	);
};

SubmissionResultAlert.propTypes = {
	data: PropTypes.object,
};

export default SubmissionResultAlert;
