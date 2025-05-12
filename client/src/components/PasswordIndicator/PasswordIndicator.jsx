import PropTypes from 'prop-types';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PasswordCriteria = ({ password }) => {
	const { t } = useTranslation('signup');

	const criteria = [
		{ label: t('password-criteria-1'), met: password.length >= 6 },
		{ label: t('password-criteria-2'), met: /[A-Z]/.test(password) },
		{ label: t('password-criteria-3'), met: /[a-z]/.test(password) },
		{ label: t('password-criteria-4'), met: /\d/.test(password) },
		{ label: t('password-criteria-5'), met: /[!@#$%^&*()_+{}[\]:;<>,.?/~\\-]/.test(password) },
	];

	return (
		<div className="mt-2 space-y-1">
			{criteria.map((item) => (
				<div key={item.label} className="flex items-center text-xs">
					{item.met ? <Check className="mr-2 size-4 text-green-500" /> : <X className="mr-2 size-4 text-gray-500" />}
					<span className={item.met ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}>{item.label}</span>
				</div>
			))}
		</div>
	);
};

const PasswordIndicator = ({ setOk, password }) => {
	const { t } = useTranslation('signup');

	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};

	const [strength, setStrength] = useState(0);
	useEffect(() => {
		const power = getStrength(password);
		setStrength(power);
		setOk(power == 4);
	}, [password, setOk]);

	const getColor = (strength) => {
		if (strength === 0) return 'bg-red-500';
		if (strength === 1) return 'bg-red-400';
		if (strength === 2) return 'bg-yellow-500';
		if (strength === 3) return 'bg-yellow-400';
		return 'bg-green-500';
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return t('password-strong-1');
		if (strength === 1) return t('password-strong-2');
		if (strength === 2) return t('password-strong-3');
		if (strength === 3) return t('password-strong-4');
		return t('password-strong-5');
	};

	return (
		<div className="mt-2">
			<div className="mb-1 flex items-center justify-between">
				<span className="text-xs text-gray-600 dark:text-gray-400">{t('password-strength')}</span>
				<span className="text-xs text-gray-600 dark:text-gray-400">{getStrengthText(strength)}</span>
			</div>

			<div className="flex space-x-1">
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${index < strength ? getColor(strength) : 'bg-gray-400 dark:bg-gray-600'} `}
					/>
				))}
			</div>
			<PasswordCriteria password={password} />
		</div>
	);
};

PasswordCriteria.propTypes = {
	password: PropTypes.string.isRequired,
};

PasswordIndicator.propTypes = {
	setOk: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
};

export default PasswordIndicator;
