import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import '~/styles/index.css';

export const metadata: Metadata = {
	title: 'FloatPoint OJ',
	description: 'Online Judge platform for programmers to practice coding, solve algorithm challenges, and improve problem-solving skills efficiently.',
};

type Props = {
	children: React.ReactNode;
};

const RootLayout = async ({ children }: Props) => {
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body className="antialiased">
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
