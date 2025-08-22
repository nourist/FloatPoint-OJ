import { CheckCircle, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

type Props = {
	searchParams: Promise<{ email: string }>;
};

const VerifySuccess = async ({ searchParams }: Props) => {
	const t = await getTranslations('auth');

	const params = await searchParams;
	const email = params.email;

	return (
		<div className="bg-card mx-auto my-10 flex max-w-108 flex-col items-center space-y-6 rounded-2xl border px-8 py-10 shadow-xs">
			<div className="inline-flex h-20 w-20 scale-100 items-center justify-center rounded-full bg-emerald-100 transition-all duration-500 ease-out">
				<CheckCircle className="h-10 w-10 scale-100 text-emerald-600 opacity-100 transition-all delay-300 duration-700" />
			</div>
			<h2 className="mb-4 text-center text-2xl font-semibold">{t('verify_success')}</h2>
			<p className="text-muted-foreground text-center">{t('success.verify')}</p>
			<div className="bg-background flex w-full items-center justify-center gap-2 rounded-md py-3 text-center text-sm font-medium">
				<Mail className="size-4" />
				{email}
			</div>
			<Button className="h-10 w-full" asChild>
				<Link href="/login">{t('login')}</Link>
			</Button>
		</div>
	);
};
export default VerifySuccess;
