import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(),
        reactRouter(),
        tsconfigPaths()
    ],
    //base: "https://relics.apetbrz.dev/"
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./app")
        }
    },
    server: {
        proxy: {
            '/worldstate': {
                target: 'http://localhost:3000'
            }
        }
    }
});
