import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Poppins } from 'next/font/google';
import { cookies } from 'next/headers';

import Header from './_layout/header';
import '~/styles/index.css';
import { Theme } from '~/types/theme.type';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'FloatPoint OJ',
	description: 'Online Judge platform for programmers to practice coding, solve algorithm challenges, and improve problem-solving skills efficiently.',
	icons: {
		icon: '/logo.svg',
	},
};

type Props = {
	children: React.ReactNode;
};

const RootLayout = async ({ children }: Props) => {
	const locale = await getLocale();
	const theme = (await cookies()).get('theme')?.value as Theme;

	return (
		<html lang={locale} className={`${poppins.className} ${theme}`}>
			<body className="antialiased">
				<NextIntlClientProvider>
					<Header />
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
