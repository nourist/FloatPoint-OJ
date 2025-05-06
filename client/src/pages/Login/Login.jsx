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
		<div className="flex-1 flex items-center justify-center pb-24">
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
						icon={<Mail size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('email')}
						type="email"
						value={email}
						setValue={setEmail}
						isError={email.length != 0 && !emailOK}
					></Input>
					<Input icon={<Lock size={'16px'} className="translate-y-[-1px]" />} placeholder={t('password')} type="password" value={password} setValue={setPassword}></Input>
					<div className="flex justify-between">
						<Link to={routesConfig.forgotPassword} className="text-sky-400 text-xs font-medium block hover:text-sky-500 transition-all duration-100">
							{t('forgot-password')}
						</Link>
						<Link to={routesConfig.verifyEmail} className="dark:text-gray-300 text-xs font-medium block hover:dark:text-gray-400 transition-all duration-100">
							{t('verify-email')}
						</Link>
					</div>
					<Button
						disabled={isLoading}
						className="h-9 transition-all duration-200 w-full from-sky-400 to-blue-500 bg-gradient-to-r !text-white font-bold hover:ring-2 hover:ring-opacity-50 hover:ring-sky-400"
						onClick={handleLogin}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('login')}
					</Button>
				</div>
				<div className="h-12 dark:bg-neutral-900 bg-neutral-200 bg-opacity-50 dark:bg-opacity-60 dark:text-gray-400 text-gray-500 text-sm flex items-center justify-center gap-1">
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
