import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '~/components/ui/button';
import { RotateCcw, KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import useAuthStore from '~/stores/authStore';
import Input from '~/components/Input';
import { editUser } from '~/services/user';
import UserAvatar from '~/components/UserAvatar';
import routesConfig from '~/config/routes';
import Select from '~/components/Select';
import { locales } from '~/i18n';
import useThemeStore from '~/stores/themeStore';

const Setting = () => {
	const { t, i18n } = useTranslation('setting');
	const { user, forgotPassword, msg, error, clearLog } = useAuthStore();
	const { mode, setMode } = useThemeStore();

	const [userValue, setUserValue] = useState(user);
	const [pending, setPending] = useState(false);

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

	useEffect(() => {
		setUserValue(user);
	}, [user]);

	return (
		<div className="h-full w-full px-16 py-8">
			<div className="rounded-md bg-white p-6 px-10 dark:bg-neutral-800">
				<h3 className="text-base/7 font-semibold capitalize text-gray-900 dark:text-white">{t('profile')}</h3>
				<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-300">{t('profile-warn')}</p>
				<h4 className="mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('fullname')}</h4>
				<Input
					classname="mt-2 placeholder:text-gray-400 !w-1/2 min-w-80"
					placeholder={t('fullname-msg')}
					value={userValue.fullname}
					setValue={(v) => setUserValue((prev) => ({ ...prev, fullname: v }))}
				></Input>
				<h4 className="mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('about')}</h4>
				<textarea
					rows="3"
					className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-500 sm:text-sm/6 dark:bg-neutral-700 dark:bg-opacity-40 dark:text-gray-100 dark:outline-neutral-700/40"
					value={userValue.bio}
					onChange={(e) => setUserValue((prev) => ({ ...prev, bio: e.target.value }))}
				></textarea>
				<p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-300">{t('about-msg')}</p>
				<h4 className="mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('avatar')}</h4>
				<div className="mt-2 flex items-center gap-4">
					<UserAvatar user={user} className="size-12"></UserAvatar>
					<Link
						to={routesConfig.avatarChange}
						className="shadow-xs rounded-sm bg-white px-2.5 py-1.5 text-sm font-semibold capitalize text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-neutral-700 dark:text-white dark:ring-0"
					>
						{t('change')}
					</Link>
				</div>
				<div className="my-12 h-[1px] w-full bg-gray-900/10 dark:bg-neutral-700"></div>
				<h3 className="text-base/7 font-semibold capitalize text-gray-900 dark:text-white">{t('personal-information')}</h3>
				<p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-300">{t('personal-warn')}</p>
				<h4 className="mb-2 mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('default-language')}</h4>
				<Select
					triggerClassname="!bg-white border border-gray-300"
					defaultValue={userValue.defaultLanguage}
					setValue={(v) => setUserValue((prev) => ({ ...prev, defaultLanguage: v }))}
					data={[
						{ value: 'c', label: 'c' },
						{ value: 'c11', label: 'c11' },
						{ value: 'c++11', label: 'c++11' },
						{ value: 'c++14', label: 'c++14' },
						{ value: 'c++17', label: 'c++17' },
						{ value: 'c++20', label: 'c++20' },
						{ value: 'python2', label: 'python2' },
						{ value: 'python3', label: 'python3' },
					]}
				></Select>
				<p className="mt-3 text-sm/6 text-gray-600 dark:text-gray-300">{t('default-language-msg')}</p>
				<h4 className="mb-2 mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('language')}</h4>
				<Select
					triggerClassname="!bg-white border border-gray-300"
					defaultValue={i18n.language}
					data={Object.entries(locales).map((item) => ({ value: item[0], label: item[1] }))}
					setValue={i18n.changeLanguage}
				></Select>
				<p className="mb-2 mt-3 text-sm/6 text-gray-600 dark:text-gray-300">{t('language-msg')}</p>
				<h4 className="mb-2 mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('theme')}</h4>
				<p className="mb-2 text-sm/6 text-gray-600 dark:text-gray-300">{t('theme-msg')}</p>
				<div className="flex space-x-4">
					<label htmlFor="light" className="hover:cursor-pointer">
						<div className="w-44 rounded-xl border border-gray-300 bg-white p-4">
							<div className="mb-2 h-4 w-full rounded-md bg-gray-100"></div>
							<div className="flex gap-1">
								<div className="h-16 w-1/5 rounded-md bg-blue-100"></div>
								<div className="h-16 flex-1 rounded-md bg-blue-100"></div>
							</div>
						</div>
					</label>
					<label htmlFor="dark" className="hover:cursor-pointer">
						<div className="w-44 rounded-xl bg-gray-800 p-4">
							<div className="mb-2 h-4 w-full rounded-md bg-gray-700"></div>
							<div className="flex gap-1">
								<div className="h-16 w-1/5 rounded-md bg-blue-500"></div>
								<div className="h-16 flex-1 rounded-md bg-blue-500"></div>
							</div>
						</div>
					</label>
					<label htmlFor="system" className="hover:cursor-pointer">
						<div className="relative w-44">
							<div className="w-1/2 overflow-hidden">
								<div className="w-44 rounded-xl border border-gray-300 bg-white p-4">
									<div className="mb-2 h-4 w-full rounded-md bg-gray-100"></div>
									<div className="flex gap-1">
										<div className="h-16 w-1/5 rounded-md bg-blue-100"></div>
										<div className="h-16 flex-1 rounded-md bg-blue-100"></div>
									</div>
								</div>
							</div>
							<div className="absolute left-1/2 top-0 w-1/2 overflow-hidden">
								<div className="w-44 -translate-x-1/2 rounded-xl bg-gray-800 p-4">
									<div className="mb-2 h-4 w-full rounded-md bg-gray-700"></div>
									<div className="flex gap-1">
										<div className="h-16 w-1/5 rounded-md bg-blue-500"></div>
										<div className="h-16 flex-1 rounded-md bg-blue-500"></div>
									</div>
								</div>
							</div>
						</div>
					</label>
				</div>
				<div className="mt-2 flex w-[546px] justify-around">
					<div>
						<input type="radio" value="light" id="light" checked={mode === 'light'} onChange={(e) => setMode(e.target.value)} />
						<label className="ml-2 capitalize dark:text-gray-100" htmlFor="light">
							{t('light')}
						</label>
					</div>
					<div>
						<input type="radio" value="dark" id="dark" checked={mode === 'dark'} onChange={(e) => setMode(e.target.value)} />
						<label className="ml-2 capitalize dark:text-gray-100" htmlFor="dark">
							{t('dark')}
						</label>
					</div>
					<div>
						<input type="radio" value="system" id="system" checked={mode === 'system'} onChange={(e) => setMode(e.target.value)} />
						<label className="ml-2 capitalize dark:text-gray-100" htmlFor="system">
							{t('system')}
						</label>
					</div>
				</div>
				<h4 className="mb-2 mt-10 block text-sm/6 font-medium capitalize text-gray-900 dark:text-gray-50">{t('change-password')}</h4>
				<button
					onClick={() => {
						forgotPassword(user.email);
					}}
					className="shadow-xs inline-flex items-center gap-2 rounded-sm bg-white !bg-opacity-10 px-3 py-2 text-sm capitalize text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-red-500 hover:text-red-500 hover:ring-red-500 dark:text-white"
				>
					{t('change-password')}
					<KeyRound className="size-4"></KeyRound>
				</button>
				<div className="my-4 h-[1px] w-full bg-gray-900/10 dark:bg-neutral-700"></div>
				<div className="flex">
					<Button
						className="ml-auto !bg-sky-500 capitalize hover:!bg-sky-600 dark:text-white"
						disabled={pending}
						onClick={() => {
							setPending(true);
							editUser(userValue)
								.then(() => toast.success(t('success-msg')))
								.catch((err) => toast.error(err.response.data.msg))
								.finally(() => setPending(false));
						}}
					>
						{pending ? <RotateCcw className="size-4 animate-spin" /> : t('save')}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Setting;
