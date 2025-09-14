import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const clientApiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
const serverApiUrl = new URL(process.env.API_URL || 'http://localhost:4000');

const nextConfig: NextConfig = {
	// Enable standalone output for Docker optimization
	output: 'standalone',
	async rewrites() {
		return [
			{
				source: '/thumbnails/:path*',
				destination: new URL('/storage/thumbnails/:path*', serverApiUrl).toString(),
			},
			{
				source: '/avatars/:path*',
				destination: new URL('/storage/avatars/:path*', serverApiUrl).toString(),
			},
		];
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: clientApiUrl.protocol.replaceAll(':', '') as 'http' | 'https',
				hostname: clientApiUrl.hostname,
				port: clientApiUrl.port,
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
