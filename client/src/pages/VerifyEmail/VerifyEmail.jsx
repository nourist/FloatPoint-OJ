import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';

import useAuthStore from '~/stores/authStore';
import routesConfig from '~/config/routes';

const VerifyEmail = () => {
	const { t } = useTranslation('verifyEmail');

	const { verifyEmail, isLoading, msg, error, clearLog } = useAuthStore();

	const [otp, setOtp] = useState('');

	useEffect(() => {
		if (otp[otp.length - 1] < '0' || otp[otp.length - 1] > '9') {
			setOtp((prev) => prev.slice(0, prev.length - 1));
		}
	}, [otp]);

	const handleVerify = () => {
		verifyEmail(otp);
	};

	useEffect(() => {
		if (msg) {
			toast.success(msg);
			toast.info(t('success-msg'));
			clearLog();
		} else {
			toast.error(error);
			clearLog();
		}
	}, [t, msg, error, clearLog]);

	return (
		<div className="flex flex-1 items-center justify-center pb-28">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-[25rem] overflow-hidden rounded-2xl bg-white bg-opacity-50 shadow-xl backdrop-blur-xl backdrop-filter dark:bg-neutral-800"
			>
				<div className="space-y-6 p-8">
					<h2 className="mb-4 bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-center text-3xl font-bold text-transparent">{t('title')}</h2>
					<p className="text-center text-[13px] dark:text-gray-400">{t('enter-otp')}</p>
					<OtpInput
						value={otp}
						onChange={setOtp}
						numInputs={6}
						renderInput={(props) => (
							<input
								{...props}
								style={{ width: '46px', height: '46px' }}
								className="mx-auto rounded-md border border-neutral-300 text-center text-lg text-gray-800 caret-sky-400 outline-none transition-all duration-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:border-none dark:bg-neutral-700 dark:bg-opacity-40 dark:text-gray-200 dark:focus:border-sky-400"
							/>
						)}
					/>
					<Button
						disabled={otp.length != 6 || isLoading}
						className="h-9 w-full bg-gradient-to-r from-sky-400 to-blue-500 font-bold !text-white transition-all duration-200 hover:ring-2 hover:ring-sky-400 hover:ring-opacity-50"
						onClick={handleVerify}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('verify')}
					</Button>
				</div>
				<div className="flex h-12 items-center justify-center gap-1 bg-neutral-200 bg-opacity-50 text-sm text-gray-500 dark:bg-neutral-900 dark:bg-opacity-60 dark:text-gray-400">
					{t('re-verify-msg')}{' '}
					<Link to={routesConfig.sendVerifyCode} className="text-sky-400">
						{t('re-send')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default VerifyEmail;
