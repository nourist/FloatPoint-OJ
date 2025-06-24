import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
	server: {
		port: 5174,
	},
	plugins: [
		react(),
		svgr({
			svgrOptions: { exportType: 'default', ref: true, titleProp: true },
			include: '**/*.svg',
		}),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: 'src/locales',
					dest: '',
				},
			],
		}),
	],
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			'~': path.resolve(__dirname, './src'),
		},
	},
	assetsInclude: ['./src/locales'],
});
