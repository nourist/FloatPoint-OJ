'use client';

import Cookies from 'js-cookie';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Locale, locales, localesCode } from '~/i18n/locales';
import { Theme } from '~/types/theme.type';

// magic wand icon

export const BasicSettings = () => {
	const t = useTranslations('settings.basic');
	const router = useRouter();

	const theme = Cookies.get('theme') || 'light';
	const language = Cookies.get('lang') || 'en';

	const setTheme = (theme: string) => {
		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			Cookies.set('theme', systemTheme, { expires: 365 * 10 });
		} else {
			Cookies.set('theme', theme, { expires: 365 * 10 });
		}
		router.refresh();
	};

	const setLanguage = (lang: Locale) => {
		Cookies.set('lang', lang, { expires: 365 * 10 });
		router.refresh();
	};

	return (
		<div className="bg-card space-y-8 rounded-2xl border p-6 shadow-xs">
			<div>
				<h3 className="text-lg font-medium">{t('theme.title')}</h3>
				<p className="text-muted-foreground text-sm">{t('theme.description')}</p>
				<RadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)} className="mt-4 flex max-w-120 gap-2 *:flex-1">
					<div>
						<RadioGroupItem value="light" id="light" className="peer sr-only" />
						<Label
							htmlFor="light"
							className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary block cursor-pointer rounded-xl border-2 p-2"
						>
							<div className="w-full rounded-lg border border-gray-300 bg-white p-2">
								<div className="mb-1 h-3 w-full rounded-sm bg-gray-100"></div>
								<div className="flex gap-1">
									<div className="h-12 w-1/5 rounded-sm bg-blue-100"></div>
									<div className="h-12 flex-1 rounded-sm bg-blue-100"></div>
								</div>
							</div>
							<span className="mt-2 block w-full text-center font-medium">{t('theme.light')}</span>
						</Label>
					</div>

					<div>
						<RadioGroupItem value="dark" id="dark" className="peer sr-only" />
						<Label
							htmlFor="dark"
							className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary block cursor-pointer rounded-xl border-2 p-2"
						>
							<div className="w-full rounded-lg bg-gray-800 p-2">
								<div className="mb-1 h-3 w-full rounded-sm bg-gray-700"></div>
								<div className="flex gap-1">
									<div className="h-12 w-1/5 rounded-sm bg-blue-500"></div>
									<div className="h-12 flex-1 rounded-sm bg-blue-500"></div>
								</div>
							</div>
							<span className="mt-2 block w-full text-center font-medium">{t('theme.dark')}</span>
						</Label>
					</div>

					{/* Auto (system) button */}
					<button
						type="button"
						onClick={() => setTheme('system')}
						className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground flex flex-col items-center justify-center rounded-xl border-2 py-2 transition-colors"
					>
						<Sparkles className="text-primary my-auto h-6 w-6" />
						<span className="font-medium">{t('theme.auto') || 'Auto'}</span>
					</button>
				</RadioGroup>
			</div>

			<div>
				<h3 className="text-lg font-medium">{t('language.title')}</h3>
				<p className="text-muted-foreground text-sm">{t('language.description')}</p>
				<Select value={language} onValueChange={(value) => setLanguage(value as Locale)}>
					<SelectTrigger className="mt-4 w-[240px]">
						<SelectValue placeholder={t('language.title')} />
					</SelectTrigger>
					<SelectContent>
						{localesCode.map((code) => (
							<SelectItem key={code} value={code}>
								{locales[code]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};
