import { useEffect, useState } from 'react';
import { Breadcrumbs, IconButton, Menu, MenuHandler, MenuList, MenuItem, Drawer } from '@material-tailwind/react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Moon, Sun, AlignJustify, Check } from 'lucide-react';

import { locales } from '~/i18n';
import useAuthStore from '~/stores/authStore';
import UserAvatar from './UserAvatar';
import useThemeStore from '~/stores/themeStore';
import Sidebar from './Sidebar';

const Header = () => {
	const { pathname } = useLocation();
	const { user } = useAuthStore();
	const { t, i18n } = useTranslation();
	const { theme, setMode, mode } = useThemeStore();

	const [openDrawer, setOpenDrawer] = useState(false);

	const getList = () => {
		let list = pathname.split('/');
		list = list.filter((item) => item.length != 0);
		if (list.length == 0) list.push('dashboard');
		return list;
	};

	const list = getList();

	const [scroll, setScroll] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', () => {
			setScroll(window.scrollY > 0);
		});
		return () => {
			window.removeEventListener('scroll', () => {
				setScroll(window.scrollY > 0);
			});
		};
	}, []);

	return (
		<>
			<div
				data-scroll={scroll}
				className="shadow-shadow-color/3 data-[scroll=true]:bg-base-100/60 fixed left-6 top-3 z-50 flex h-[78px] w-[calc(100%-48px)] items-center gap-1 rounded-md px-5 py-4 backdrop-blur-lg transition-all duration-200 ease-in-out data-[scroll=true]:shadow-xl lg:left-[274px] lg:w-[calc(100%-298px)]"
			>
				<div>
					<Breadcrumbs className="bg-transparent p-0">
						<Link to="/" className="text-base-content/60 hover:text-secondary">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
								<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
							</svg>
						</Link>
						{list.map((item, index) => (
							<Link to={index === list.length - 1 ? '#' : `/${item}`} className="text-base-content/60 hover:text-secondary capitalize" key={index}>
								{index === 0 ? t(item) : item}
							</Link>
						))}
					</Breadcrumbs>
					<h3 className="text-base-content/90 ml-[3px] mt-1 font-semibold capitalize">{list.join(' ')}</h3>
				</div>
				<IconButton variant="text" className="hover:bg-base-300 ml-auto size-[38px] cursor-pointer rounded-full lg:hidden" onClick={() => setOpenDrawer(true)}>
					<AlignJustify strokeWidth="1.5" size="20" />
				</IconButton>
				<Menu>
					<MenuHandler>
						<IconButton variant="text" className="hover:bg-base-300 size-[38px] cursor-pointer rounded-full lg:ml-auto">
							<Languages strokeWidth="1.5" size="20" />
						</IconButton>
					</MenuHandler>
					<MenuList>
						{Object.keys(locales).map((item, index) => (
							<MenuItem className="flex" onClick={() => i18n.changeLanguage(item)} key={index}>
								{locales[item]}
								{item === i18n.language && <Check className="ml-auto size-4" />}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
				<Menu>
					<MenuHandler>
						<IconButton variant="text" className="hover:bg-base-300 size-[38px] cursor-pointer rounded-full">
							{theme === 'dark' ? <Moon strokeWidth="1.5" size="20" /> : <Sun strokeWidth="1.5" size="20"></Sun>}
						</IconButton>
					</MenuHandler>
					<MenuList>
						<MenuItem className="flex capitalize" onClick={() => setMode('light')}>
							{t('light')}
							{mode == 'light' && <Check className="ml-auto size-4" />}
						</MenuItem>
						<MenuItem className="flex capitalize" onClick={() => setMode('dark')}>
							{t('dark')}
							{mode == 'dark' && <Check className="ml-auto size-4" />}
						</MenuItem>
						<MenuItem className="flex capitalize" onClick={() => setMode('system')}>
							{t('system')}
							{mode == 'system' && <Check className="ml-auto size-4" />}
						</MenuItem>
					</MenuList>
				</Menu>
				<UserAvatar user={user} className="mx-1 !size-[38px]" />
				<div className="hidden sm:block">
					<h4 className="text-base-content/70 text-[15px] capitalize">
						{t('hey')}, <span className="text-base-content">{user?.fullname || user?.name}</span>
					</h4>
					<p className="text-base-content/70 text-xs capitalize">{t('admin')}</p>
				</div>
			</div>
			<Drawer className="w-[150px]" open={openDrawer} onClose={() => setOpenDrawer(false)}>
				<Sidebar classname="!flex" />
			</Drawer>
		</>
	);
};

export default Header;
