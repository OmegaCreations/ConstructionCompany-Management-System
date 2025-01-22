import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  preview: {
    port: parseInt(process.env.PORT, 10) || 8080,
    host: true,
  },
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
    host: true,
  },
});
