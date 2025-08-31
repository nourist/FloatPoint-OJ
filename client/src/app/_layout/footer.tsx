import { getTranslations } from 'next-intl/server';

import { Separator } from '~/components/ui/separator';

const Footer = async () => {
	const t = await getTranslations('layout.footer');

	return (
		<div className="border-t">
			<div className="max-w-app text-foreground/70 mx-auto flex h-13 items-center gap-3 text-xs">
				<div className="text-muted-foreground">{t('copyright', { year: new Date().getFullYear() })}</div>
				<a className="ml-auto hover:underline" href="https://github.com/nourist/FloatPoint-OJ/blob/main/LICENSE">
					{t('license')}
				</a>
				<Separator className="!h-4" orientation="vertical" />
				<a className="hover:underline" href="https://github.com/nourist/FloatPoint-OJ">
					{t('github')}
				</a>
				<Separator className="!h-4" orientation="vertical" />
				<a className="hover:underline" href="https://github.com/nourist">
					{t('author')}
				</a>
			</div>
		</div>
	);
};

export default Footer;
