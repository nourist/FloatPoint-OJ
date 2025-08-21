import { Menu, X } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import HeaderToolbar from './header-toolbar';
import NavLink from '~/components/nav-link';
import { Button } from '~/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';

const Header = async () => {
	const t = await getTranslations('layout.header');

	const tabs = [
		{ href: '/problem', label: t('problems') },
		{ href: '/submission', label: t('submissions') },
		{ href: '/contest', label: t('contests') },
		{ href: '/standing', label: t('standing') },
	];

	return (
		<div className="bg-card flex h-14 w-full justify-center border-b shadow-xs">
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
				<HeaderToolbar />
			</div>
		</div>
	);
};

export default Header;
