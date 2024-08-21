import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		dts({ include: ["lib"], exclude: ["src"] }),
	],
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime"],
		},
	},
});
