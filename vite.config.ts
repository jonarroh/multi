import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), vue()],
	resolve: {
		alias: {
			//@ts-ignore-next-line
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		watch: {
			usePolling: true
		}
	}
});
