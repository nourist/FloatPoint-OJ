import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import List from './_components/list';
import Sidebar from './_components/sidebar';
import { Button } from '~/components/ui/button';
import { createServerService } from '~/lib/service-server';
import { authServiceInstance } from '~/services/auth';

const Home = async () => {
	const t = await getTranslations('home');

	const authService = await createServerService(authServiceInstance);

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
							<Link href="/blog/create">
								<Plus />
								{t('new')}
							</Link>
						</Button>
					)}
				</div>
				<List />
			</div>
			<Sidebar user={user} />
		</div>
	);
};

export default Home;
