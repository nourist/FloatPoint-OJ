import Cookies from 'js-cookie';
import { ChevronsUpDown, CircleUserRound, Code, Globe, Home, LayoutDashboard, LogOut, Moon, Send, Server, SquarePen, Sun, Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

import NavLink from '~/components/nav-link';
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
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '~/components/ui/sidebar';
import UserAvatar from '~/components/user-avatar';
import { Locale, locales, localesCode } from '~/i18n/locales';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { Theme } from '~/types/theme.type';

const AdminSidebar = () => {
	const t = useTranslations('admin.layout');
	const router = useRouter();

	const { getProfile, signout } = createClientService(authServiceInstance);

	const { data: user } = useSWR('/auth/me', getProfile);

	const handleSignout = async () => {
		await signout();
		mutate('/auth/me', null, false);
		router.refresh();
	};

	const items = [
		{
			title: t('dashboard'),
			url: '',
			icon: LayoutDashboard,
		},
		{
			title: t('blog'),
			url: '/blog',
			icon: SquarePen,
		},
		{
			title: t('problem'),
			url: '/problem',
			icon: Code,
		},
		{
			title: t('submission'),
			url: '/submission',
			icon: Send,
		},
		{
			title: t('contest'),
			url: '/contest',
			icon: Trophy,
		},
		{
			title: t('user'),
			url: '/user',
			icon: Users,
		},
		{
			title: t('judger'),
			url: '/judger',
			icon: Server,
		},
	];

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

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size="lg" className="px-3 py-2" asChild>
									<Link href="/admin">
										<Image src="/logo.svg" alt="logo" width={32} height={32} />
										<h1 className="text-xl font-semibold">FloatPoint</h1>
										<ChevronsUpDown className="ml-auto size-4" />
									</Link>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" sideOffset={12} side="right" className="w-48">
								<DropdownMenuItem asChild>
									<Link href="/admin">
										<LayoutDashboard />
										{t('dashboard')}
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/">
										<Home />
										{t('home')}
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton className="px-3" asChild>
										<NavLink href={`/admin${item.url}`}>
											<item.icon />
											<span>{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{user && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton className="flex items-center gap-1" size="lg">
										<UserAvatar user={user} className="size-9 rounded-md" />
										<div>
											<p className="mt-[2px] mb-[1px] text-xs font-semibold">{user.fullname || user.username}</p>
											<p className="text-muted-foreground text-xs">{user.email}</p>
										</div>
										<ChevronsUpDown className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" sideOffset={12} side="right" className="w-48">
									<DropdownMenuItem asChild>
										<Link href={`/admin/user/${user.username}`}>
											<CircleUserRound />
											{t('profile')}
										</Link>
									</DropdownMenuItem>
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
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={handleSignout} variant="destructive">
										<LogOut />
										{t('logout')}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AdminSidebar;
