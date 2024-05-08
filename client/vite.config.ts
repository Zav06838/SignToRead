import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/glosses": "https://0a83-205-164-158-83.ngrok-free.app",
      "/merge-videos": "https://0a83-205-164-158-83.ngrok-free.app",
      "/translate": {
        target: "https://119.63.132.178:5001",
        secure: false, // Set secure to false to allow self-signed certificates
      },
      "/get_sign": {
        target: "https://119.63.132.178:5000",
        secure: false, // Set secure to false to allow self-signed certificates
      },
      // "/api/glosses": "http://localhost:3000",
      // "/merge-videos": "http://localhost:3000",
      // "/translate": "http://119.63.132.178:5001",
      // "/get_sign": "http://119.63.132.178:5000",
    },
  },
});
