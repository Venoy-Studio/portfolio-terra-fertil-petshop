const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Security check: prevent directory traversal
  if (pathname.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  // 1. Static asset lookup in public/
  const publicPath = path.join(__dirname, 'public', pathname);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    const ext = path.extname(publicPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });
    return fs.createReadStream(publicPath).pipe(res);
  }

  // 2. Specific Route Handlers
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'pages', 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(indexPath).pipe(res);
  }

  if (pathname === '/conta') {
    const contaPath = path.join(__dirname, 'pages', 'conta.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(contaPath).pipe(res);
  }

  if (pathname === '/checkout') {
    const checkoutPath = path.join(__dirname, 'pages', 'checkout.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(checkoutPath).pipe(res);
  }

  if (pathname.startsWith('/produto/')) {
    const slug = pathname.replace('/produto/', '').replace(/\/$/, '');
    const prodPath = path.join(__dirname, 'pages', 'produto', `${slug}.html`);
    if (fs.existsSync(prodPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(prodPath).pipe(res);
    }
  }

  // 3. Fallback: try direct page HTML in pages/
  const possiblePage = path.join(__dirname, 'pages', `${pathname.replace(/^\//, '')}.html`);
  if (fs.existsSync(possiblePage) && fs.statSync(possiblePage).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(possiblePage).pipe(res);
  }

  // 4. 404 Custom Error Page
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  const notFoundHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Página não encontrada — Terra Fértil Pet Shop</title>
      <link rel="stylesheet" href="/_next/static/immutable/chunks/1kifu43wipvrl.css" />
      <link rel="stylesheet" href="/_next/static/immutable/chunks/1tglap296gb-8.css" />
    </head>
    <body class="tfd" style="min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;">
      <div>
        <h1 class="dsp" style="font-size:36px;margin-bottom:12px">Página não encontrada</h1>
        <p style="color:#5B6272;margin-bottom:24px">O endereço solicitado não existe ou mudou de local.</p>
        <a href="/" style="display:inline-flex;align-items:center;padding:12px 28px;background:#E0161C;color:#fff;font-weight:700;border-radius:999px;text-decoration:none">Voltar para o início</a>
      </div>
    </body>
    </html>
  `;
  res.end(notFoundHtml);
});

server.listen(PORT, () => {
  console.log(`
  🐾 Terra Fértil Pet Shop (Clone Fictício)
  ===========================================
  🚀 Servidor rodando em: http://localhost:${PORT}
  📦 Rotas disponíveis:
     - Início:     http://localhost:${PORT}/
     - Minha Conta: http://localhost:${PORT}/conta
     - Checkout:    http://localhost:${PORT}/checkout
     - Produtos:    http://localhost:${PORT}/produto/capitao-dog
  ===========================================
  `);
});
