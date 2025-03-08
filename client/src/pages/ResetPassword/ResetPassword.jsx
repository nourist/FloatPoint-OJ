import { useParams } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';

import Input from '~/components/Input';
import PasswordIndicator from '~/components/PasswordIndicator';
import useAuthStore from '~/stores/authStore';

const ResetPassword = () => {
	const { t } = useTranslation('resetPassword');
	const { token } = useParams();

	const { resetPassword, msg, error, isLoading, clearLog } = useAuthStore();

	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const [passwordOK, setPasswordOK] = useState(true);
	const [passwordConfirmOK, setPasswordConfirmOK] = useState(true);

	const handleReset = async () => {
		if (!passwordOK) {
			if (!password) toast.error(t('password-required'));
			else toast.warn(t('password-error'));
			return;
		}
		if (!passwordConfirmOK) {
			if (!passwordConfirm) toast.error(t('confirm-password-required'));
			else toast.warn(t('confirm-password-error'));
			return;
		}
		resetPassword(token, password);
	};

	useEffect(() => {
		setPasswordConfirmOK(password == passwordConfirm);
	}, [password, passwordConfirm]);

	useEffect(() => {
		toast.error(error);
		clearLog();
	}, [error, clearLog]);

	useEffect(() => {
		toast.success(msg);
		clearLog();
	}, [msg, clearLog]);

	return (
		<div className="w-full h-[calc(90%-80px)] flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-[25rem] w-full bg-white dark:bg-neutral-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
			>
				<div className="p-8 space-y-5">
					<h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-sky-400 to-blue-400 text-transparent bg-clip-text">{t('title')}</h2>
					<Input
						icon={<Lock size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('password')}
						type="password"
						value={password}
						setValue={setPassword}
						isError={password.length != 0 && !passwordOK}
					></Input>
					<Input
						icon={<Lock size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('confirm-password')}
						type="password"
						value={passwordConfirm}
						setValue={setPasswordConfirm}
						isError={passwordConfirm.length != 0 && !passwordConfirmOK}
					></Input>
					<PasswordIndicator password={password} setOk={setPasswordOK}></PasswordIndicator>
					<Button
						disabled={isLoading}
						className="h-9 w-full from-sky-400 to-blue-500 bg-gradient-to-r !text-white font-bold hover:ring-2 transition-all duration-200 hover:ring-opacity-50 hover:ring-sky-400"
						onClick={handleReset}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('reset')}
					</Button>
				</div>
			</motion.div>
		</div>
	);
};

export default ResetPassword;
