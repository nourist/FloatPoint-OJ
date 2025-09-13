'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '~/components/ui/button';

interface ErrorPageProps {
	error: Error;
	reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
	const t = useTranslations('error');

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-8">
			<div className="text-center">
				<h1 className="text-4xl font-bold">{t('title')}</h1>
				<p className="text-muted-foreground mt-2">{t('message')}</p>
			</div>
			<div className="flex gap-4">
				<Button variant="outline" onClick={reset}>
					{t('try_again')}
				</Button>
				<Button asChild>
					<Link href="/">{t('go_home')}</Link>
				</Button>
			</div>
		</div>
	);
};

export default ErrorPage;
