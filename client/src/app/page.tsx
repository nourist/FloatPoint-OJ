import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import List from './_components/list';
import { Button } from '~/components/ui/button';
import { createServerApiInstance } from '~/lib/http-server';
import { createAuthService } from '~/services/auth';

const Home = async () => {
	const t = await getTranslations('home');

	const http = await createServerApiInstance();
	const authService = createAuthService(http);

	const user = await authService.getProfile().catch(() => null);

	return (
		<div className="flex gap-6">
			<div className="flex-1 space-y-6">
				<div className="flex items-center justify-between gap-6">
					<div className="flex-1 space-y-2">
						<h1 className="text-3xl font-bold">{t('blog')}</h1>
						<p className="text-muted-foreground gap-2 text-sm">{t('description')}</p>
					</div>
					{user && (
						<Button className="ml-auto" asChild>
							<Link href="/create/blog">
								<Plus />
								{t('new')}
							</Link>
						</Button>
					)}
				</div>
				<List />
			</div>
			<div className="h-100 w-80 bg-red-500 max-md:hidden"></div>
		</div>
	);
};

export default Home;
