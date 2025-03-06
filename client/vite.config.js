import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: { exportType: 'default', ref: true, titleProp: true },
			include: '**/*.svg',
		}),
		viteStaticCopy({
			targets: [
				{
					src: 'src/locales',
					dest: '',
				},
			],
		}),
	],
	css: {
		devSourcemap: true,
	},
	resolve: {
		alias: {
			// eslint-disable-next-line no-undef
			'~': path.resolve(__dirname, './src'),
		},
	},
	assetsInclude: ['./src/locales'],
});
