const fs = require('fs');
const path = require('path');

console.log('=== STARTING CLONE BUILD & FICTIONALIZATION ===');

// 1. Setup Directories
const DIRS = [
  'public',
  'public/images',
  'public/_next/static/immutable/chunks',
  'pages',
  'pages/produto'
];

DIRS.forEach(d => fs.mkdirSync(d, { recursive: true }));

// 2. Fictional Replacements Mapping
const REPLACEMENTS = [
  // WhatsApp Link & Raw Number
  ['5595991105815', '5595999990000'],
  ['(95) 99110-5815', '(95) 99999-0000'],
  ['(95) 99141-3253', '(95) 99999-0001'],
  ['WhatsApp [a confirmar]', 'WhatsApp (95) 99999-0002'],
  
  // Telephones
  ['(95) 3626-3445', '(95) 3000-0001'],
  ['+559536263445', '+559530000001'],
  ['(95) 3628-1919', '(95) 3000-0002'],
  ['+559536281919', '+559530000002'],
  ['(95) 3625-8184', '(95) 3000-0003'],
  ['+559536258184', '+559530000003'],

  // Physical Addresses
  ['Av. General Ataíde Teive, 5337 — Asa Branca', 'Av. das Américas, 1000 — Asa Branca'],
  ['Av. General Ataíde Teive, 5337', 'Av. das Américas, 1000'],
  ['Av.%20General%20Ata%C3%ADde%20Teive%2C%205337', 'Av.%20das%20Am%C3%A9ricas%2C%201000'],
  ['Rua Pedro Aldemar Bantim, 1715 — Sílvio Botelho', 'Rua dos Pets, 500 — Sílvio Botelho'],
  ['Rua Pedro Aldemar Bantim, 1715', 'Rua dos Pets, 500'],
  ['Rua%20Pedro%20Aldemar%20Bantim%2C%201715', 'Rua%20dos%20Pets%2C%20500'],
  ['Av. Mário Homem de Melo, 3572 — Buritis', 'Av. Central das Flores, 250 — Buritis'],
  ['Av. Mário Homem de Melo, 3572', 'Av. Central das Flores, 250'],
  ['Av.%20M%C3%A1rio%20Homem%20de%20Melo%2C%203572', 'Av.%20Central%20das%20Flores%2C%20250'],

  // Instagram
  ['terrafertil.loja', 'terrafertil.ficticio'],
  ['@terrafertil.loja', '@terrafertil.ficticio'],

  // Email
  ['emailDisplay:"[a configurar]"', 'emailDisplay:"contato@terrafertilpetshop.com.br"'],
  ['E-mail <!-- -->[a configurar]', 'E-mail <!-- -->contato@terrafertilpetshop.com.br'],
  ['E-mail [a configurar]', 'E-mail contato@terrafertilpetshop.com.br'],
  ['voce@email.com', 'contato@terrafertilpetshop.com.br'],

  // CNPJ
  ['cnpjDisplay:"[a informar]"', 'cnpjDisplay:"00.000.000/0001-00"'],
  ['CNPJ <!-- -->[a informar]', 'CNPJ <!-- -->00.000.000/0001-00'],
  ['CNPJ [a informar]', 'CNPJ 00.000.000/0001-00'],

  // Horários
  ['hoursDisplay:"[a confirmar]"', 'hoursDisplay:"Seg a Sáb, 8h às 19h"'],
  ['Horários <!-- -->[a confirmar]', 'Horários <!-- -->Seg a Sáb, 8h às 19h'],
  ['Horários [a confirmar]', 'Horários Seg a Sáb, 8h às 19h'],
  ['[Horário a confirmar]', 'Seg a Sáb, 8h às 19h'],
  ['[confirmar com a loja]', 'Seg a Sex, 8h às 18h | Sáb, 8h às 14h'],

  // Pagamento
  ['paymentDisplay:"[Formas de pagamento a configurar]"', 'paymentDisplay:"Pix, Cartão de Crédito e Débito"'],
  ['Pagamento <!-- -->[Formas de pagamento a configurar]', 'Pagamento <!-- -->Pix, Cartão de Crédito e Débito'],
  ['Pagamento [Formas de pagamento a configurar]', 'Pagamento Pix, Cartão de Crédito e Débito'],
  ['[Parcelamento e desconto no Pix a configurar]', 'Até 3x sem juros ou 5% de desconto no Pix'],
  ['[Prazos e taxas a configurar]', 'Consulte prazo e taxa para o seu bairro pelo WhatsApp'],
  ['[Política de trocas a definir]', 'Até 7 dias corridos para devolução ou troca do produto lacrado']
];

function applyReplacements(str) {
  let result = str;
  for (const [from, to] of REPLACEMENTS) {
    result = result.split(from).join(to);
  }
  return result;
}

// 3. Process CSS Files
const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Aleo:ital,wght@0,100..900;1,100..900&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');\n`;

const cssFiles = fs.readdirSync('downloaded_assets/css').filter(f => f.endsWith('.css'));
cssFiles.forEach(f => {
  let content = fs.readFileSync('downloaded_assets/css/' + f, 'utf8');
  if (f === '1kifu43wipvrl.css') {
    content = fontImport + content;
  }
  fs.writeFileSync('public/_next/static/immutable/chunks/' + f, content);
  console.log('Processed CSS:', f);
});

// 4. Process JS Files
const jsFiles = fs.readdirSync('downloaded_assets').filter(f => f.endsWith('.js'));
jsFiles.forEach(f => {
  let content = fs.readFileSync('downloaded_assets/' + f, 'utf8');
  content = applyReplacements(content);
  fs.writeFileSync('public/_next/static/immutable/chunks/' + f, content);
  console.log('Processed JS:', f);
});

// 5. Process HTML Files
function processHtml(sourcePath, destPath) {
  let content = fs.readFileSync(sourcePath, 'utf8');
  content = applyReplacements(content);
  // Inject our interactive script before </body>
  const injectScript = `<script src="/interactive.js" defer></script>\n</body>`;
  if (content.includes('</body>')) {
    content = content.replace('</body>', injectScript);
  } else {
    content += `<script src="/interactive.js" defer></script>`;
  }
  fs.writeFileSync(destPath, content);
  console.log('Saved page:', destPath);
}

// Home
processHtml('page.html', 'pages/index.html');
// Also copy to root index.html for static hosting convenience
processHtml('page.html', 'index.html');

// Conta & Checkout
processHtml('page__conta.html', 'pages/conta.html');
processHtml('page__checkout.html', 'pages/checkout.html');

// Products
const products = JSON.parse(fs.readFileSync('extracted_products.json', 'utf8'));
products.forEach(p => {
  const prodFile = 'page__produto_' + p.id + '.html';
  if (fs.existsSync(prodFile)) {
    processHtml(prodFile, 'pages/produto/' + p.id + '.html');
  }
});

console.log('=== BUILD COMPLETED SUCCESSFULLY ===');
