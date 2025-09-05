'use client';

import { Bell } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { SidebarTrigger } from '~/components/ui/sidebar';

const AdminHeader = () => {
	const currentPath = usePathname();
	const t = useTranslations('admin.layout');

	const paths = currentPath.split('/').filter((item) => item !== '');

	const items = paths.map((item, index) => ({
		path: `/${paths.slice(0, index + 1).join('/')}`,
		label: index == 0 ? t('dashboard') : index == 1 ? t(item) : item,
	}));

	return (
		<div className="flex h-8 items-center gap-2">
			<SidebarTrigger />
			<Separator orientation="vertical" className="!h-4" />
			<Breadcrumb>
				<BreadcrumbList>
					{items.slice(0, items.length - 1).map((item, index) => (
						<Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink href={item.path} className="capitalize">
									{item.label}
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
						</Fragment>
					))}
					<BreadcrumbItem>
						<BreadcrumbPage className="capitalize">{items[items.length - 1].label}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Button variant="ghost" size="icon" className="text-card-foreground/80 ml-auto size-8">
				<Bell className="size-5" />
			</Button>
		</div>
	);
};

export default AdminHeader;
