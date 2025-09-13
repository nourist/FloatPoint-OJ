import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

const nextConfig: NextConfig = {
	// Enable standalone output for Docker optimization
	output: 'standalone',
	async rewrites() {
		return [
			{
				source: '/storage/:path*',
				destination: new URL('/storage/:path*', apiUrl).toString(),
			},
			{
				source: '/avatars/:path*',
				destination: new URL('/storage/avatars/:path*', apiUrl).toString(),
			},
		];
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: apiUrl.protocol.replaceAll(':', '') as 'http' | 'https',
				hostname: apiUrl.hostname,
				port: apiUrl.port,
				pathname: '/storage/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
