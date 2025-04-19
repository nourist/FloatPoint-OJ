import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import isEmail from 'validator/lib/isEmail';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';

import Input from '~/components/Input';
import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';

const ForgotPassword = () => {
	const { t } = useTranslation('forgotPassword');

	const { forgotPassword, isLoading, msg, error, clearLog } = useAuthStore();

	const [email, setEmail] = useState('');
	const [emailOK, setEmailOK] = useState(false);

	useEffect(() => {
		setEmailOK(isEmail(email));
	}, [email]);

	const handle = () => {
		forgotPassword(email);
	};

	useEffect(() => {
		if (msg) {
			toast.success(msg);
			toast.info(t('msg-success'));
			clearLog();
		} else {
			toast.error(error);
			clearLog();
		}
	}, [msg, error, clearLog, t]);

	return (
		<div className="w-full mt-2 flex items-center justify-center pb-28">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-[25rem] w-full bg-white dark:bg-neutral-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
			>
				<div className="p-8 space-y-5">
					<h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-sky-400 to-blue-400 text-transparent bg-clip-text">{t('title')}</h2>
					<p className="text-[13px] dark:text-gray-400 text-center">{t('enter-email')}</p>
					<Input
						icon={<Mail size={'16px'} className="translate-y-[-1px]" />}
						placeholder={t('email')}
						type="email"
						value={email}
						setValue={setEmail}
						isError={email.length != 0 && !emailOK}
					></Input>
					<Button
						disabled={isLoading || !emailOK}
						className="h-9 transition-all duration-200 w-full from-sky-400 to-blue-500 bg-gradient-to-r !text-white font-bold hover:ring-2 hover:ring-opacity-50 hover:ring-sky-400"
						onClick={handle}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('send')}
					</Button>
				</div>
				<div className="h-12 dark:bg-neutral-900 bg-neutral-200 bg-opacity-50 dark:bg-opacity-60 dark:text-gray-400 text-gray-500 text-sm flex items-center justify-center gap-1">
					{t('already-have-password')}{' '}
					<Link to={routesConfig.login} className="text-sky-400">
						{t('login-now')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default ForgotPassword;
