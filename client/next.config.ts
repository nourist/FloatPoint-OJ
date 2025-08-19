import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/storage/:path*',
				destination: new URL('/storage/:path*', apiUrl).toString(),
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: apiUrl.protocol.replaceAll(':', '') as 'http' | 'https',
				hostname: apiUrl.hostname,
				port: apiUrl.port,
				pathname: '/storage/**',
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
