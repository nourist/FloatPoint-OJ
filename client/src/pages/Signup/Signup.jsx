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
		<div className="w-full py-10 flex items-center justify-center">
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
					<Button disabled={isLoading} className="h-9 w-full from-sky-400 to-blue-500 bg-gradient-to-r !text-white font-bold" onClick={handleSignup}>
						{isLoading ? <Loader2 className="animate-spin" /> : t('signup')}
					</Button>
				</div>
				<div className="h-12 dark:bg-neutral-900 bg-neutral-200 bg-opacity-50 dark:bg-opacity-60 dark:text-gray-400 text-gray-500 text-sm flex items-center justify-center gap-1">
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
