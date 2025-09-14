'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

const NotFoundPage = () => {
	const t = useTranslations('not_found');

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8">
			<div className="relative">
				<h1 className="text-9xl font-bold">404</h1>
			</div>
			<div className="text-center">
				<h2 className="text-3xl font-semibold">{t('title')}</h2>
				<p className="text-muted-foreground mt-2">{t('message')}</p>
			</div>
			<Button asChild>
				<Link href="/">{t('go_home')}</Link>
			</Button>
		</div>
	);
};

export default NotFoundPage;
