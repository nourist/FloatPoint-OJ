'use client';

import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import NavLink from '~/components/nav-link';
import { Button } from '~/components/ui/button';
import { getProfile } from '~/services/auth';

const HeaderToolbar = () => {
	const t = useTranslations('layout.header');

	const { data: user } = useSWR('/auth/me', getProfile);

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

	return <>user</>;
};

export default HeaderToolbar;
