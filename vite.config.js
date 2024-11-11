import { defineConfig } from "vite";

export default defineConfig({
    base: "",
    build: {
        chunkSizeWarningLimit:1000
    },
    preview: {
        port: 8668,
        strictPort: true,
    },
    server: {
        port: 8668,
        strictPort: true,
        host: true,
        origin: "http://localhost:8668",
    }
});