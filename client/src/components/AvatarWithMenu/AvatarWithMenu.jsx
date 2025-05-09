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
import { Settings, Languages, LogOut, Check } from 'lucide-react';

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
			<DropdownMenuContent className="border-none shadow-lg rounded-2xl w-[296px] dark:bg-[#303030] mr-8 mt-4 p-4 space-y-4">
				<DropdownMenuItem asChild className="cursor-pointer hover:!bg-transparent">
					<Link className="flex gap-2" to={routesConfig.user.replace(':name', user.name)}>
						<UserAvatar user={user} className="size-14"></UserAvatar>
						<span className="space-y-[2px] py-[2px] h-14">
							<h2 className="text-lg font-medium relative">
								{user?.permission == 'Admin' && (
									<span className="font-semibold text-base bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">
										AD{' '}
									</span>
								)}
								{user?.name}
							</h2>
							<p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
						</span>
					</Link>
				</DropdownMenuItem>
				<div className="w-full flex justify-between">
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
							className="h-20 w-20 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center hover:!bg-neutral-200 dark:hover:!bg-neutral-600 cursor-pointer"
						>
							<Link to={item.path}>
								<img className="size-10" src={item.img} alt="" />
								<p className="text-xs text-gray-500 dark:text-gray-400">{item.title}</p>
							</Link>
						</DropdownMenuItem>
					))}
				</div>
				<div className="w-full">
					<DropdownMenuItem asChild className="cursor-pointer h-[42px] flex px-4 text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:text-gray-400">
						<Link to={routesConfig.submit}>
							<Terminal></Terminal>
							{t('editor')}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="cursor-pointer h-[42px] flex px-4 text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:text-gray-400">
						<Link>
							<Settings></Settings>
							{t('setting')}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="cursor-pointer h-[42px] flex px-4 text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 dark:data-[state=open]:bg-neutral-700 dark:text-gray-400">
							{theme == 'dark' ? <Dark></Dark> : <Light></Light>}
							{t('appearance')}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="mr-5 p-4 rounded-xl w-48 border-none dark:!bg-neutral-800">
								<DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
									{['light', 'dark', 'system'].map((item, index) => (
										<DropdownMenuRadioItem
											key={index}
											value={item}
											icon={<Check className="size-4" />}
											className="cursor-pointer h-[42px] text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:text-gray-400"
										>
											{t(item)}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="cursor-pointer h-[42px] flex px-4 text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 dark:data-[state=open]:bg-neutral-700 dark:text-gray-400">
							<Languages></Languages>
							{t('language')}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="mr-5 p-4 rounded-xl w-48 border-none dark:!bg-neutral-800 max-h-[452px] overflow-auto">
								<DropdownMenuRadioGroup value={i18n.language} onValueChange={i18n.changeLanguage}>
									{Object.keys(locales).map((item, index) => (
										<DropdownMenuRadioItem
											key={index}
											value={item}
											icon={<Check className="size-4" />}
											className="cursor-pointer h-[42px] text-gray-600 rounded-md dark:hover:!bg-neutral-700 dark:text-gray-400"
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
						className="cursor-pointer h-[42px] flex px-4 text-gray-600 rounded-md dark:text-gray-400 hover:!text-red-500 hover:!bg-red-600/10 w-full"
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
