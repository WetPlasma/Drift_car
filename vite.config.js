import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows ngrok (and other tunnels) to access the server
    allowedHosts: true,
    // OR if you want to be safer, specific domains:
    // allowedHosts: ['.ngrok-free.app'],
  },
});
