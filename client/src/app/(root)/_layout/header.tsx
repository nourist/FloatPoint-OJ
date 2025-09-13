'use client';

import Cookies from 'js-cookie';
import { CircleUserRound, Globe, LayoutDashboard, LogOut, Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

import NotificationPopover from './notification-popover';
import NavLink from '~/components/nav-link';
import { Button } from '~/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import UserAvatar from '~/components/user-avatar';
import { Locale, locales, localesCode } from '~/i18n/locales';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { Theme } from '~/types/theme.type';
import { UserRole } from '~/types/user.type';

const Header = () => {
	const t = useTranslations('layout.header');

	const router = useRouter();

	const { signout, getProfile } = createClientService(authServiceInstance);

	const { data: user, isLoading } = useSWR('/auth/me', getProfile);

	const theme = Cookies.get('theme') || 'light';
	const language = Cookies.get('lang') || 'en';

	const setTheme = (theme: Theme) => {
		Cookies.set('theme', theme ?? '', { expires: 365 * 10 });
		router.refresh();
	};

	const setLanguage = (lang: Locale) => {
		Cookies.set('lang', lang ?? '', { expires: 365 * 10 });
		router.refresh();
	};

	const handleSignout = async () => {
		await signout();
		mutate('/auth/me', null, false);
		router.refresh();
	};

	const tabs = [
		{ href: '/problem', label: t('problems') },
		{ href: '/submission', label: t('submissions') },
		{ href: '/contest', label: t('contests') },
		{ href: '/standing', label: t('standing') },
	];

	return (
		<div className="bg-card flex h-[var(--header-height)] w-full justify-center border-b shadow-xs">
			<div className="max-w-app flex w-full items-center gap-2">
				<Sheet>
					<SheetTrigger className="2md:hidden" asChild>
						<Button variant="outline" size="icon">
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent noCloseButton side="left" className="w-[240px] gap-3">
						<SheetHeader>
							<SheetTitle className="flex items-center gap-2">
								<Image src="/logo.svg" alt="logo" width={32} height={32} />
								<div className="text-xl font-semibold">FloatPoint</div>
							</SheetTitle>
						</SheetHeader>
						<SheetClose asChild className="text-popover-foreground/70 absolute top-[14px] right-4">
							<Button variant="ghost" size="icon">
								<X className="size-5" />
							</Button>
						</SheetClose>
						<Button variant="ghost" asChild>
							<NavLink href="/" className="data-[active=true]:text-primary text-card-foreground/80 mx-4 justify-start">
								{t('home')}
							</NavLink>
						</Button>
						{tabs.map((tab) => (
							<Button variant="ghost" asChild key={tab.href}>
								<NavLink href={tab.href} className="data-[active=true]:text-primary text-card-foreground/80 mx-4 justify-start">
									{tab.label}
								</NavLink>
							</Button>
						))}
						{!user && (
							<>
								<Button variant="outline" asChild>
									<NavLink href="/login" className="data-[active=true]:text-primary text-card-foreground/80 mx-4 mt-auto">
										{t('login')}
									</NavLink>
								</Button>
								<Button asChild>
									<NavLink href="/register" className="data-[active=true]:text-primary text-card-foreground/80 mx-4 mb-4">
										{t('register')}
									</NavLink>
								</Button>
							</>
						)}
					</SheetContent>
				</Sheet>
				<NavLink href="/" className="max-2md:hidden data-[active=true]:text-primary flex items-center gap-2 pr-4">
					<Image src="/logo.svg" alt="logo" width={32} height={32} />
					<h1 className="text-xl font-semibold">FloatPoint</h1>
				</NavLink>
				{tabs.map((tab) => (
					<Button variant="ghost" asChild key={tab.href}>
						<NavLink href={tab.href} className="data-[active=true]:text-primary max-2md:hidden text-card-foreground/80">
							{tab.label}
						</NavLink>
					</Button>
				))}
				{isLoading ? (
					<></>
				) : user ? (
					<>
						<NotificationPopover />
						<DropdownMenu>
							<DropdownMenuTrigger>
								<UserAvatar user={user} className="size-9" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" alignOffset={-8} sideOffset={10} className="w-48">
								<DropdownMenuItem asChild>
									<Link href={`/profile/${user.username}`}>
										<CircleUserRound />
										{t('profile')}
									</Link>
								</DropdownMenuItem>

								{user.role == UserRole.ADMIN && (
									<DropdownMenuItem asChild>
										<Link href={`/admin`}>
											<LayoutDashboard />
											{t('dashboard')}
										</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />

								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										{theme === 'dark' ? <Moon /> : <Sun />}
										{t('appearance')}
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											<DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={() => setTheme('light')}>
												{t('light')}
											</DropdownMenuCheckboxItem>
											<DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={() => setTheme('dark')}>
												{t('dark')}
											</DropdownMenuCheckboxItem>
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<Globe />
										{t('language')}
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											{localesCode.map((item) => (
												<DropdownMenuCheckboxItem key={item} checked={language === item} onCheckedChange={() => setLanguage(item)}>
													{locales[item]}
												</DropdownMenuCheckboxItem>
											))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuItem asChild>
									<Link href="/settings">
										<Settings />
										{t('settings')}
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignout} variant="destructive">
									<LogOut />
									{t('logout')}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				) : (
					<>
						<Button variant="outline" className="ml-auto" asChild>
							<NavLink href="/login">{t('login')}</NavLink>
						</Button>
						<Button asChild>
							<NavLink href="/register">{t('register')}</NavLink>
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
