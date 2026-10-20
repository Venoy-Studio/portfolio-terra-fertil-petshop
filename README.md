# Terra Fértil Pet Shop — Clone Fictício

Clone completo do website [Terra Fértil Pet Shop](https://terrafertilpetshop.vercel.app/), com **todos os dados de contato, telefones, WhatsApp, endereços, redes sociais, horários e CNPJ substituídos por dados 100% fictícios**.

---

## 🚀 Como Executar o Projeto

Este projeto foi construído com servidor HTTP em Node.js puro (**zero dependências externas necessárias**).

```bash
# Iniciar o servidor local na porta 3000
npm start
# ou
node server.js
```

Em seguida, abra o navegador em:  
👉 **`http://localhost:3000`**

---

## 🗺️ Rotas Disponíveis

- **Início (`/`)**: Vitrine completa, hero, categorias, ofertas, mais vendidos, serviços de banho & tosa, consultório veterinário, feed de fotos, depoimentos e lojas.
- **Minha Conta (`/conta`)**: Painel de clientes com histórico de pedidos, cadastro de pets (*Thor & Mel*), agendamentos e favoritos.
- **Checkout (`/checkout`)**: Fluxo em etapas de identificação, endereço, entrega, opções de pagamento e resumo.
- **Páginas de Produtos (`/produto/:id`)**:
  - `/produto/capitao-dog`
  - `/produto/pro-omega-adulto`
  - `/produto/primus`
  - `/produto/dog-fit`
  - `/produto/pro-omega-filhote`
  - `/produto/percane`
  - `/produto/sabor-cat`
  - `/produto/herbalvet`
  - `/produto/vittamax-gato`
  - `/produto/jack-pet`
  - `/produto/domus`
  - `/produto/vetmax-plus`
  - `/produto/nd-filhote`
  - `/produto/pro-omega-action`
  - `/produto/bravecto`
  - `/produto/gulliver`

---

## 🔄 Tabela de Alterações de Dados de Contato (Originais ➔ Fictícios)

| Dado / Campo | Original (Site Real) | Novo Valor Fictício |
| :--- | :--- | :--- |
| **WhatsApp Principal** | `(95) 99110-5815` (`5595991105815`) | `(95) 99999-0000` (`5595999990000`) |
| **Telefone Principal** | `(95) 3626-3445` (`+559536263445`) | `(95) 3000-0001` (`+559530000001`) |
| **Loja 1 · Asa Branca** | Av. General Ataíde Teive, 5337 | **Av. das Américas, 1000 — Asa Branca** |
| • Telefone Loja 1 | `(95) 3626-3445` | `(95) 3000-0001` |
| • WhatsApp Loja 1 | `(95) 99141-3253` | `(95) 99999-0001` |
| • Horário Loja 1 | `[Horário a confirmar]` | `Seg a Sáb: 8h às 19h` |
| **Loja 2 · Sílvio Botelho** | Rua Pedro Aldemar Bantim, 1715 | **Rua dos Pets, 500 — Sílvio Botelho** |
| • Telefone Loja 2 | `(95) 3628-1919` | `(95) 3000-0002` |
| • WhatsApp Loja 2 | `WhatsApp [a confirmar]` | `WhatsApp (95) 99999-0002` |
| • Horário Loja 2 | `[Horário a confirmar]` | `Seg a Sáb: 8h às 18h` |
| **Loja 3 · Buritis** | Av. Mário Homem de Melo, 3572 | **Av. Central das Flores, 250 — Buritis** |
| • Telefone Loja 3 | `(95) 3625-8184` | `(95) 3000-0003` |
| • WhatsApp Loja 3 | `(95) 99110-5815` | `(95) 99999-0000` |
| • Horário Loja 3 | Seg a Sáb, 8h às 19h (Banho & Tosa) | Seg a Sáb, 8h às 19h (Banho & Tosa) |
| **Instagram** | `@terrafertil.loja` | `@terrafertil.ficticio` |
| **E-mail de Atendimento** | `[a configurar]` / `voce@email.com` | `contato@terrafertilpetshop.com.br` |
| **CNPJ** | `[a informar]` | `00.000.000/0001-00` |
| **Formas de Pagamento** | `[Formas de pagamento a configurar]` | `Pix, Cartão de Crédito e Débito` |
| **Links Google Maps** | Apontavam para os endereços reais | Apontam para os endereços fictícios |

---

## ✨ Recursos Interativos Incluídos

1. **Carrinho Lateral Completo (Slide-Over Drawer)**:
   - Abertura suave ao clicar no ícone do carrinho (desktop e mobile).
   - Adição e remoção de itens em tempo real com seletor de quantidade (+ / -).
   - Barra de progresso dinâmica para meta de **Frete Grátis** (R$ 300,00).
   - Cálculo automático do subtotal.
   - Sincronização persistente via `localStorage` (`terra-fertil-shop-v1`).
2. **Favoritos Interativos**:
   - Botão de coração nos cards de produtos alterna estado (preenchimento vermelho ativo).
   - Contador de favoritos sincronizado no cabeçalho.
3. **Busca em Tempo Real (Live Search)**:
   - Digitação instantânea com filtragem de produtos por nome, marca e categoria.
   - Dropdown com miniaturas, preços e links diretos.
4. **Notificações Toast**:
   - Feedback visual moderno e discreto a cada adição ao carrinho ou aos favoritos.
5. **Responsividade Mobile de Alta Qualidade**:
   - Tabbar inferior com touch-targets confortáveis (mínimo 44px).
   - Botão flutuante de atendimento via WhatsApp configurado para o número fictício.
