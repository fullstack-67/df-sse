import { defineConfig, HttpProxy, ProxyOptions } from "vite";
import react from "@vitejs/plugin-react-swc";

const configureFn = (proxy: HttpProxy.Server, _options: ProxyOptions) => {
  proxy.on("error", (err, _req, _res) => {
    console.log("proxy error", err);
  });

  // @ts-ignore
  proxy.on("proxyReq", (proxyReq, req, _res) => {
    console.log("Sending Request to the Target:", req.method, req.url);
  });
  proxy.on("proxyRes", (proxyRes, req, _res) => {
    console.log(
      "Received Response from the Target:",
      proxyRes.statusCode,
      req.url
    );
  });
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https://stackoverflow.com/a/74430384
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: configureFn,
      },
      "/clock": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: configureFn,
      },
    },
  },
});
