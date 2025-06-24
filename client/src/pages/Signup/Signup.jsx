import { motion } from 'framer-motion';
import { Mail, User, Lock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';

import Input from '~/components/Input';
import PasswordIndicator from '~/components/PasswordIndicator';
import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';

const Signup = () => {
	const { t } = useTranslation('signup');
	const { signup, msg, error, isLoading, clearLog } = useAuthStore();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [usernameOK, setUsernameOK] = useState(false);
	const [emailOK, setEmailOK] = useState(false);
	const [passwordOK, setPasswordOK] = useState(true);

	const handleSignup = async () => {
		if (!usernameOK) {
			if (!username) toast.warn(t('username-required'));
			else toast.error(t('username-error'));
			return;
		}
		if (!emailOK) {
			if (!email) toast.warn(t('email-required'));
			else toast.error(t('email-error'));
			return;
		}
		if (!passwordOK) {
			if (!password) toast.warn(t('password-required'));
			else toast.error(t('password-error'));
			return;
		}
		await signup(email, password, username);
	};

	useEffect(() => {
		setUsernameOK(/^[a-zA-Z0-9]+$/.test(username));
	}, [username]);

	useEffect(() => {
		setEmailOK(isEmail(email));
	}, [email]);

	useEffect(() => {
		toast.error(error);
		clearLog();
	}, [error, clearLog]);

	useEffect(() => {
		toast.success(msg);
		clearLog();
	}, [msg, clearLog]);

	return (
		<div className="flex flex-1 items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-[25rem] overflow-hidden rounded-2xl bg-white bg-opacity-50 shadow-xl backdrop-blur-xl backdrop-filter dark:bg-neutral-800"
			>
				<div className="space-y-5 p-8">
					<h2 className="mb-8 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-center text-3xl font-bold text-transparent">{t('title')}</h2>
					<Input
						icon={<User size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('username')}
						value={username}
						setValue={setUsername}
						isError={username.length != 0 && !usernameOK}
					></Input>
					<Input
						icon={<Mail size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('email')}
						type="email"
						value={email}
						setValue={setEmail}
						isError={email.length != 0 && !emailOK}
					></Input>
					<Input
						icon={<Lock size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('password')}
						type="password"
						value={password}
						setValue={setPassword}
						isError={password.length != 0 && !passwordOK}
					></Input>
					<PasswordIndicator password={password} setOk={setPasswordOK}></PasswordIndicator>
					<Button
						disabled={isLoading}
						className="h-9 w-full bg-gradient-to-r from-sky-400 to-blue-500 font-bold !text-white transition-all duration-200 hover:ring-2 hover:ring-sky-400 hover:ring-opacity-50"
						onClick={handleSignup}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('signup')}
					</Button>
				</div>
				<div className="flex h-12 items-center justify-center gap-1 bg-neutral-200 bg-opacity-50 text-sm text-gray-500 dark:bg-neutral-900 dark:bg-opacity-60 dark:text-gray-400">
					{t('already-have-account')}{' '}
					<Link to={routesConfig.login} className="text-sky-400">
						{t('login')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default Signup;
