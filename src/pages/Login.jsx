import { useTranslation } from 'react-i18next';
import { UserRound, Eye, EyeClosed } from 'lucide-react';
import { Button, Input, Checkbox, IconButton } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { isEmail } from 'validator';
import { toast } from 'react-toastify';

import useThemeStore from '~/stores/themeStore';
import { login } from '~/services/auth';

const Login = () => {
	const { t } = useTranslation('login');
	const { theme } = useThemeStore();

	const [showPassword, setShowPassword] = useState(false);
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email) {
			setEmailError(false);
		} else {
			setEmailError(!isEmail(email));
		}
	}, [email]);

	const handleLogin = () => {
		let ok = true;
		if (!password) {
			setPasswordError(true);
			ok = false;
		}
		if (!email) {
			setEmailError(true);
			ok = false;
		}
		if (!ok) {
			return;
		}
		setLoading(true);
		login(email, password, remember)
			.then(toast.success)
			.catch(toast.error)
			.finally(() => setLoading(false));
	};

	return (
		<div className="flex-center h-[100vh] w-full px-12 py-12 lg:py-28">
			<div className="bg-base-100 shadow-cxl/3 flex h-full w-full max-w-4xl flex-col-reverse lg:flex-row lg:overflow-hidden">
				<div className="flex h-full flex-col gap-6 p-12 pb-0 lg:w-1/2">
					<div className="mb-4 flex">
						<h2 className="text-base-content text-[1.75rem] font-light">FloatPoint</h2>
						<IconButton className="border-base-content/10 ml-auto size-10 cursor-pointer rounded-full" variant="outlined">
							<img src="/logo.png" alt="" />
						</IconButton>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className="text-base-content text-sm capitalize">
							{t('email')} <span className="text-error font-bold">*</span>
						</label>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onFocus={() => {
								if (!email) {
									setEmailError(false);
								}
							}}
							id="email"
							type="email"
							size="lg"
							data-error={emailError}
							className="focus:!border-primary data-[error=true]:placeholder:text-error data-[error=true]:!border-error placeholder:!opacity-100"
							labelProps={{
								className: 'hidden',
							}}
							placeholder={t('email-placeholder')}
						></Input>
					</div>
					<div className="relative flex flex-col gap-2">
						<label htmlFor="password" className="text-base-content text-sm capitalize">
							{t('password')} <span className="text-error font-bold">*</span>
						</label>
						<Input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => setPasswordError(false)}
							data-error={passwordError}
							id="password"
							size="lg"
							type={showPassword ? 'text' : 'password'}
							className="focus:!border-primary data-[error=true]:placeholder:text-error data-[error=true]:!border-error pr-[44px] placeholder:!opacity-100"
							labelProps={{
								className: 'hidden',
							}}
							placeholder={t('password-placeholder')}
						></Input>
						<IconButton
							variant="text"
							className="text-base-content/80 hover:text-base-content !absolute top-[34px] right-[6px] !size-8 cursor-pointer !bg-transparent"
							ripple={false}
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? <Eye className="size-5" /> : <EyeClosed className="size-5" />}
						</IconButton>
					</div>
					<div className="flex flex-col gap-2">
						<Button className="bg-primary cursor-pointer justify-center" loading={loading} onClick={handleLogin}>
							{t('login')}
						</Button>
						<div className="ml-[-14px] flex items-center">
							<Checkbox
								value={remember}
								onChange={(e) => setRemember(e.target.checked)}
								ripple={false}
								className="before:!opacity-0"
								id="remember-me"
								color={theme === 'light' ? 'blue' : 'pink'}
							/>
							<label htmlFor="remember-me" className="from-secondary to-primary mb-[1px] bg-gradient-to-r bg-clip-text text-transparent capitalize">
								{t('remember-me')}
							</label>
							<a href={`${import.meta.env.VITE_CLIENT_URL}/forgot-password`} className="text-base-content/60 ml-auto capitalize">
								{t('forgot-password')}?
							</a>
						</div>
					</div>
				</div>
				<div className="from-secondary to-primary flex flex-col items-center justify-center gap-2 bg-gradient-to-r py-4 text-white lg:h-full lg:w-1/2 lg:pb-20">
					<UserRound className="size-16 lg:!size-32" />
					<h1 className="text-[2rem] font-bold">{t('welcome')}</h1>
				</div>
			</div>
		</div>
	);
};

export default Login;
