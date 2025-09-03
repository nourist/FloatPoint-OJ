'use client';

import Cookies from 'js-cookie';
import { Bell, CircleUserRound, Globe, LayoutDashboard, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

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
import UserAvatar from '~/components/user-avatar';
import { Locale, locales, localesCode } from '~/i18n/locales';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { Theme } from '~/types/theme.type';
import { UserRole } from '~/types/user.type';

const HeaderToolbar = () => {
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

	if (isLoading) {
		return null;
	}

	if (!user) {
		return (
			<>
				<Button variant="outline" className="ml-auto" asChild>
					<NavLink href="/login">{t('login')}</NavLink>
				</Button>
				<Button asChild>
					<NavLink href="/register">{t('register')}</NavLink>
				</Button>
			</>
		);
	}

	return (
		<>
			<Button variant="ghost" size="icon" className="text-card-foreground/80 ml-auto rounded-full">
				<Bell className="size-5" />
			</Button>
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
	);
};

export default HeaderToolbar;
