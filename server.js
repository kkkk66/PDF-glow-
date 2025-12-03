const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. PERFORMANCE: Enable Gzip compression
app.use(compression());

// 2. SECURITY: Set HTTP Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 3. STATIC FILES: Serve the 'dist' folder (Production Build)
// This ensures we serve the minified, optimized assets created by Vite
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// 4. SPA ROUTING: Redirect all unknown routes to index.html in dist
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🚀 PDF Glow Server is running!
  ---------------------------------
  Local:    http://localhost:${PORT}
  Mode:     Production (Serving /dist)
  ---------------------------------
  `);
});