'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Button } from './ui/button';

const GoogleLoginButton = () => {
	const t = useTranslations('auth');

	const handle = () => {};

	return (
		<Button variant="outline" onClick={handle} className="h-10 w-full">
			<Image src="/google-logo.svg" alt="google-logo" width={20} height={20}></Image>
			{t('continue-with-google')}
		</Button>
	);
};

export default GoogleLoginButton;
