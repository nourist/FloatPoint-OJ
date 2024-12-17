import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			svgrOptions: { exportType: 'default', ref: true, titleProp: true },
			include: '**/*.svg',
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
});
