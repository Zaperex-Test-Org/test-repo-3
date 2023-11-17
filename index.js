const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const defaultTargetUrl = "http://www.example.com";
const targetUrl = process.env.NGROK_HOST || defaultTargetUrl; // Replace with ngrok host url

// Create a proxy middleware
const apiProxy = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true, // Necessary for the target API to receive requests from your proxy
  onProxyReq: (proxyReq, req, res) => {
    // Log the incoming request
    console.log(`Request received: ${req.method} ${req.originalUrl}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Append additional header to the response
    proxyRes.headers["ngrok-skip-browser-warning"] = "69420";
  },
});

// Use the proxy middleware for all routes
app.use("*", apiProxy);

// Start the server
const port = normalizePort(process.env.PORT || "8080");
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
