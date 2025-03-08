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
		<div className="w-full h-[calc(80%-80px)] flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-[25rem] w-full bg-white dark:bg-neutral-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
			>
				<div className="p-8 space-y-6">
					<h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-sky-400 to-blue-400 text-transparent bg-clip-text">{t('title')}</h2>
					<p className="text-[13px] dark:text-gray-400 text-center">{t('enter-otp')}</p>
					<OtpInput
						value={otp}
						onChange={setOtp}
						numInputs={6}
						renderInput={(props) => (
							<input
								{...props}
								style={{ width: '46px', height: '46px' }}
								className="mx-auto dark:bg-neutral-700 dark:text-gray-200 text-gray-800 dark:border-none dark:bg-opacity-40 border focus:border-sky-400 dark:focus:border-sky-400 rounded-md outline-none border-neutral-300 focus:ring-1 focus:ring-sky-400 caret-sky-400 transition-all duration-200 text-center text-lg"
							/>
						)}
					/>
					<Button
						disabled={otp.length != 6 || isLoading}
						className="h-9 w-full from-sky-400 to-blue-500 bg-gradient-to-r !text-white font-bold hover:ring-2 hover:ring-opacity-50 hover:ring-sky-400 transition-all duration-200"
						onClick={handleVerify}
					>
						{isLoading ? <Loader2 className="animate-spin" /> : t('verify')}
					</Button>
				</div>
				<div className="h-12 dark:bg-neutral-900 bg-neutral-200 bg-opacity-50 dark:bg-opacity-60 dark:text-gray-400 text-gray-500 text-sm flex items-center justify-center gap-1">
					{t('re-verify-msg')}{' '}
					<Link to={routesConfig.reVerifyEmail} className="text-sky-400">
						{t('re-send')}
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default VerifyEmail;
