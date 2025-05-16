import { useTranslation } from 'react-i18next';
import { UserRound, Eye, EyeClosed } from 'lucide-react';
import { Button, Input, Checkbox, IconButton } from '@material-tailwind/react';
import { Link } from 'react-router';
import { useState } from 'react';

import { login, logout } from '~/services/auth';

const Login = () => {
	const { t } = useTranslation('login');

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="flex-center h-[100vh] w-full px-12 py-28">
			<div className="bg-base-100 shadow-cxl flex h-full w-full max-w-4xl overflow-hidden shadow-gray-300">
				<div className="flex h-full w-1/2 flex-col gap-6 p-12 pb-0">
					<div className="mb-4 flex">
						<h2 className="text-[1.75rem] font-light">FloatPoint</h2>
						<IconButton className="border-neutral/10 ml-auto size-10 cursor-pointer rounded-full" variant="outlined">
							<img src="/logo.png" alt="" />
						</IconButton>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="email" className="text-sm capitalize">
							{t('email')}
						</label>
						<Input
							id="email"
							type='email'
							size="lg"
							className="focus:!border-primary !border-t-blue-gray-200 placeholder:!opacity-100"
							labelProps={{
								className: 'hidden',
							}}
							placeholder={t('email-placeholder')}
						></Input>
					</div>
					<div className="relative flex flex-col gap-2">
						<label htmlFor="password" className="text-sm capitalize">
							{t('password')}
						</label>
						<Input
							id="password"
							size="lg"
							type={showPassword ? 'text' : 'password'}
							className="focus:!border-primary !border-t-blue-gray-200 pr-[44px] placeholder:!opacity-100"
							labelProps={{
								className: 'hidden',
							}}
							placeholder={t('password-placeholder')}
						></Input>
						<IconButton
							variant="text"
							className="text-neutral/80 hover:text-neutral !absolute top-[34px] right-[6px] !size-8 cursor-pointer !bg-transparent"
							ripple={false}
							onClick={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? <Eye className="size-5" /> : <EyeClosed className="size-5" />}
						</IconButton>
					</div>
					<div className="flex flex-col gap-2">
						<Button className="bg-primary cursor-pointer">{t('login')}</Button>
						<div className="ml-[-14px] flex items-center">
							<Checkbox ripple={false} className="before:!opacity-0" id="remember-me" color="blue"></Checkbox>
							<label htmlFor="remember-me" className="mb-[1px] from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent capitalize">
								{t('remember-me')}
							</label>
							<Link className="text-neutral/50 ml-auto capitalize">{t('forgot-password')}?</Link>
						</div>
					</div>
				</div>
				<div className="from-secondary to-primary text-neutral-content flex h-full w-1/2 flex-col items-center justify-center gap-2 bg-gradient-to-r pb-20">
					<UserRound size="128" />
					<h1 className="text-[2rem] font-bold">{t('welcome')}</h1>
				</div>
			</div>
		</div>
	);
};

export default Login;
