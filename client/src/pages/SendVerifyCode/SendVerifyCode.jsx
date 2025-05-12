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

const SendVerifyCode = () => {
	const { t } = useTranslation('sendVerifyCode');

	const { sendVerifyCode, isLoading, msg, error, clearLog } = useAuthStore();

	const [email, setEmail] = useState('');
	const [emailOK, setEmailOK] = useState(false);

	useEffect(() => {
		setEmailOK(isEmail(email));
	}, [email]);

	const handleSend = () => {
		sendVerifyCode(email);
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
		<div className="flex flex-1 items-center justify-center pb-32">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-[25rem] overflow-hidden rounded-2xl bg-white bg-opacity-50 shadow-xl backdrop-blur-xl backdrop-filter dark:bg-neutral-800"
			>
				<div className="space-y-5 p-8">
					<h2 className="mb-4 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-center text-3xl font-bold text-transparent">{t('title')}</h2>
					<p className="text-center text-[13px] dark:text-gray-400">{t('enter-email')}</p>
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
						className="h-9 w-full bg-gradient-to-r from-sky-400 to-blue-500 font-bold !text-white transition-all duration-200 hover:ring-2 hover:ring-sky-400 hover:ring-opacity-50"
						onClick={handleSend}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('send')}
					</Button>
				</div>
				<div className="flex h-12 items-center justify-center gap-1 bg-neutral-200 bg-opacity-50 text-sm text-gray-500 dark:bg-neutral-900 dark:bg-opacity-60 dark:text-gray-400">
					{t('already-have-code')}{' '}
					<Link to={routesConfig.verifyEmail} className="text-sky-400">
						{t('verify-now')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default SendVerifyCode;
