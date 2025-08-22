'use client';

import Cookies from 'js-cookie';
import { Check, Globe, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { Locale, locales, localesCode } from '~/i18n/locales';
import { Theme } from '~/types/theme.type';

const FooterToolbar = () => {
	const t = useTranslations('layout.footer');
	const theme = Cookies.get('theme') || 'light';
	const language = Cookies.get('lang') || 'en';

	const router = useRouter();

	const setTheme = (theme: Theme) => {
		Cookies.set('theme', theme ?? '', { expires: 365 * 10 });
		router.refresh();
	};

	const setLanguage = (lang: Locale) => {
		Cookies.set('lang', lang ?? '', { expires: 365 * 10 });
		router.refresh();
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="ml-auto h-7 text-xs" variant="outline">
						<Globe />
						{locales[language as Locale]}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{localesCode.map((item) => (
						<DropdownMenuItem key={item} onClick={() => setLanguage(item)}>
							{locales[item]}
							{language === item ? <Check className="ml-auto" /> : null}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			<Button className="size-7" variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
				{theme === 'light' ? <Moon /> : <Sun />}
			</Button>
		</>
	);
};

export default FooterToolbar;
