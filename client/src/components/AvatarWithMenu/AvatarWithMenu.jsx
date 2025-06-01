// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from '~/components/ui/dropdown-menu';
import { Link } from 'react-router';
import { Settings, Languages, LogOut, Check, LayoutDashboard } from 'lucide-react';

import UserAvatar from '../UserAvatar';
import useAuthStore from '~/stores/authStore';
import useThemeStore from '~/stores/themeStore';
import routesConfig from '~/config/routes';
import list from '~/assets/images/list.png';
import answer from '~/assets/images/answer.png';
import contest from '~/assets/images/contest.png';
import Terminal from '~/assets/icons/terminal.svg';
import Light from '~/assets/icons/light.svg';
import Dark from '~/assets/icons/dark.svg';
import { locales } from '~/i18n';

const AvatarWithMenu = () => {
	const { t, i18n } = useTranslation();
	const { user, logout } = useAuthStore();
	const { theme, mode, setMode } = useThemeStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<UserAvatar user={user}></UserAvatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-8 mt-4 w-[296px] space-y-4 rounded-2xl border-none p-4 shadow-lg dark:bg-[#303030]">
				<DropdownMenuItem asChild className="cursor-pointer hover:!bg-transparent">
					<Link className="flex gap-2" to={routesConfig.user.replace(':name', user.name)}>
						<UserAvatar user={user} className="size-14"></UserAvatar>
						<span className="h-14 space-y-[2px] py-[2px]">
							<h2 className="relative text-lg font-medium">
								{user?.permission == 'Admin' && (
									<span className="bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-base font-semibold text-transparent drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">
										AD{' '}
									</span>
								)}
								{user?.name}
							</h2>
							<p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
						</span>
					</Link>
				</DropdownMenuItem>
				<div className="flex w-full justify-between">
					{[
						{
							title: t('problem'),
							path: `${routesConfig.user.replace(':name', user.name)}?tab=2`,
							img: list,
						},
						{
							title: t('submission'),
							path: `${routesConfig.submissions}?author=${user.name}`,
							img: answer,
						},
						{
							title: t('contest'),
							path: `${routesConfig.user.replace(':name', user.name)}?tab=4`,
							img: contest,
						},
					].map((item, index) => (
						<DropdownMenuItem
							asChild
							key={index}
							className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl bg-neutral-100 hover:!bg-neutral-200 dark:bg-neutral-700 dark:hover:!bg-neutral-600"
						>
							<Link to={item.path}>
								<img className="size-10" src={item.img} alt="" />
								<p className="text-xs text-gray-500 dark:text-gray-400">{item.title}</p>
							</Link>
						</DropdownMenuItem>
					))}
				</div>
				<div className="w-full">
					{user.permission === 'Admin' && (
						<DropdownMenuItem
							asChild
							className="flex h-[42px] cursor-pointer rounded-md bg-gradient-to-r from-sky-300 to-purple-400 px-4 !text-white dark:from-sky-500 dark:to-purple-500"
						>
							<a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}>
								<LayoutDashboard></LayoutDashboard>
								{t('admin-dashboard')}
							</a>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem asChild className="flex h-[42px] cursor-pointer rounded-md px-4 text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700">
						<Link to={routesConfig.submit}>
							<Terminal></Terminal>
							{t('editor')}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="flex h-[42px] cursor-pointer rounded-md px-4 text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700">
						<Link to={routesConfig.setting}>
							<Settings></Settings>
							{t('setting')}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="flex h-[42px] cursor-pointer rounded-md px-4 text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 dark:data-[state=open]:bg-neutral-700">
							{theme == 'dark' ? <Dark></Dark> : <Light></Light>}
							{t('appearance')}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="mr-5 w-48 rounded-xl border-none p-4 dark:!bg-neutral-800">
								<DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
									{['light', 'dark', 'system'].map((item, index) => (
										<DropdownMenuRadioItem
											key={index}
											value={item}
											icon={<Check className="size-4" />}
											className="h-[42px] cursor-pointer rounded-md text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700"
										>
											{t(item)}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="flex h-[42px] cursor-pointer rounded-md px-4 text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 dark:data-[state=open]:bg-neutral-700">
							<Languages></Languages>
							{t('language')}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="mr-5 max-h-[452px] w-48 overflow-auto rounded-xl border-none p-4 dark:!bg-neutral-800">
								<DropdownMenuRadioGroup value={i18n.language} onValueChange={i18n.changeLanguage}>
									{Object.keys(locales).map((item, index) => (
										<DropdownMenuRadioItem
											key={index}
											value={item}
											icon={<Check className="size-4" />}
											className="h-[42px] cursor-pointer rounded-md text-gray-600 dark:text-gray-400 dark:hover:!bg-neutral-700"
										>
											{locales[item]}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem
						asChild
						className="flex h-[42px] w-full cursor-pointer rounded-md px-4 text-gray-600 hover:!bg-red-600/10 hover:!text-red-500 dark:text-gray-400"
					>
						<button onClick={logout}>
							<LogOut></LogOut>
							{t('log-out')}
						</button>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

AvatarWithMenu.propTypes = {};

export default AvatarWithMenu;
