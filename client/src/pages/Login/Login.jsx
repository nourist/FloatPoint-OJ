import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import isEmail from 'validator/lib/isEmail';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';

import Input from '~/components/Input';
import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';

const Login = () => {
	const { t } = useTranslation('login');

	const { login, isLoading, msg, error, clearLog } = useAuthStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [emailOK, setEmailOK] = useState(false);

	useEffect(() => {
		setEmailOK(isEmail(email));
	}, [email]);

	const handleLogin = () => {
		if (!emailOK) {
			if (!email) toast.error(t('email-required'));
			else toast.warn(t('email-error'));
			return;
		}
		if (!password) {
			toast.error(t('password-required'));
			return;
		}
		login(email, password);
	};

	useEffect(() => {
		toast.error(error);
		clearLog();
	}, [error, clearLog, t]);

	useEffect(() => {
		toast.success(msg);
		clearLog();
	}, [msg, clearLog]);

	return (
		<div className="flex flex-1 items-center justify-center pb-24">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-[25rem] overflow-hidden rounded-2xl bg-white bg-opacity-50 shadow-xl backdrop-blur-xl backdrop-filter dark:bg-neutral-800"
			>
				<div className="space-y-5 p-8">
					<h2 className="mb-8 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-center text-3xl font-bold text-transparent">{t('title')}</h2>
					<Input
						icon={<Mail size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('email')}
						type="email"
						value={email}
						setValue={setEmail}
						isError={email.length != 0 && !emailOK}
					></Input>
					<Input icon={<Lock size={'16px'} className="translate-y-[-1px]" />} placeholder={t('password')} type="password" value={password} setValue={setPassword}></Input>
					<div className="flex justify-between">
						<Link to={routesConfig.forgotPassword} className="block text-xs font-medium text-sky-400 transition-all duration-100 hover:text-sky-500">
							{t('forgot-password')}
						</Link>
						<Link to={routesConfig.verifyEmail} className="block text-xs font-medium transition-all duration-100 dark:text-gray-300 hover:dark:text-gray-400">
							{t('verify-email')}
						</Link>
					</div>
					<Button
						disabled={isLoading}
						className="h-9 w-full bg-gradient-to-r from-sky-400 to-blue-500 font-bold !text-white transition-all duration-200 hover:ring-2 hover:ring-sky-400 hover:ring-opacity-50"
						onClick={handleLogin}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('login')}
					</Button>
				</div>
				<div className="flex h-12 items-center justify-center gap-1 bg-neutral-200 bg-opacity-50 text-sm text-gray-500 dark:bg-neutral-900 dark:bg-opacity-60 dark:text-gray-400">
					{t('dont-have-account')}{' '}
					<Link to={routesConfig.signup} className="text-sky-400">
						{t('signup')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default Login;
