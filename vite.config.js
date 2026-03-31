import { defineConfig } from 'vite';

export default defineConfig({
    base: '/sign-pdf/',
    server: {
        port: 8001,
        strictPort: true,
        host: true,
        allowedHosts: ["tun.valiz.app"]
    }
});
