import { defineConfig } from 'vite'
import path from 'path';
import { fileURLToPath } from "url";
import eslint from 'vite-plugin-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [eslint()],
    build: {
        emptyOutDir: true,
        assetsDir: 'assets',
    },
    server: {
        port: 3000,
        open: true,
        fs: {
            allow: [
                '.',
                './node_modules/mondlich/dist',
            ],
        },
    },
    optimizeDeps: {
        exclude: ['mondlich']
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    base: '/mondlich-demo/',
})