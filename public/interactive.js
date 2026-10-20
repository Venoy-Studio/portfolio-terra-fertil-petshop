// Interactive runtime for Terra Fértil Pet Shop Clone
(function () {
  'use strict';

  // --- 1. Products Catalog ---
  const PRODUCTS = [
    { id: "pro-omega-adulto", brand: "Pro Omega", name: "Ração Pro Omega Super Premium Cães Adultos", size: "15 kg", price: 224.99, img: "/images/pd-proomega-adulto.jpg", category: "Rações" },
    { id: "primus", brand: "Primus", name: "Ração Primus All Day Premium Especial Adultos", size: "15 kg", price: 174.99, img: "/images/pd-primus.jpg", category: "Rações" },
    { id: "dog-fit", brand: "Dog Fit", name: "Ração Dog Fit Natural Carne e Frango", size: "15 kg", price: 142.99, img: "/images/pd-dogfit.jpg", category: "Rações" },
    { id: "pro-omega-filhote", brand: "Pro Omega", name: "Ração Pro Omega Super Premium Filhotes", size: "10,1 kg", price: 169.99, img: "/images/pd-proomega-filhote.jpg", category: "Rações" },
    { id: "percane", brand: "PerCane", name: "Ração PerCane para Cães", size: "Adultos ou filhotes", price: 164.99, img: "/images/pd-percane.jpg", category: "Rações" },
    { id: "sabor-cat", brand: "Sabor Cat", name: "Ração Sabor Cat para Gatos", size: "10,1 kg", price: 114.99, img: "/images/pd-saborcat.jpg", category: "Rações" },
    { id: "herbalvet", brand: "Herbalvet", name: "Desinfetante Herbalvet T.A.", size: "1 litro", price: 74.99, img: "/images/pd-herbalvet.jpg", category: "Higiene" },
    { id: "vittamax-gato", brand: "VittaMax", name: "Ração VittaMax Gato Mix Premium Especial", size: "10,1 kg", price: 129.99, img: "/images/pd-vittamax-gato.jpg", category: "Rações" },
    { id: "capitao-dog", brand: "Capitão Dog", name: "Ração Capitão Dog Adultos", size: "14 kg", price: 94.99, img: "/images/pd-capitao.jpg", category: "Rações" },
    { id: "jack-pet", brand: "Jack Pet", name: "Ração Jack Pet Adultos", size: "15 kg", price: 114.99, img: "/images/pd-jackpet.jpg", category: "Rações" },
    { id: "domus", brand: "Domus", name: "Ração Domus Carne", size: "7 kg", price: 47.99, img: "/images/pd-domus.jpg", category: "Rações" },
    { id: "vetmax-plus", brand: "Vetmax", name: "Vermífugo Vetmax Plus Cães e Gatos", size: "4 comprimidos", price: 29.99, img: "/images/pd-vetmax.jpg", category: "Medicamentos" },
    { id: "nd-filhote", brand: "N&D", name: "Ração N&D Ancestral Grain Filhotes", size: "15 kg", price: 369.99, img: "/images/pd-nd.jpg", category: "Rações" },
    { id: "pro-omega-action", brand: "Pro Omega", name: "Ração Pro Omega Action Super Premium", size: "15 kg", price: 234.99, img: "/images/pd-proomega-action.jpg", category: "Rações" },
    { id: "bravecto", brand: "Bravecto", name: "Antipulgas e Carrapatos Bravecto", size: "Cães de 2 a 4,5 kg", price: 164.99, img: "/images/pd-bravecto.jpg", category: "Medicamentos" },
    { id: "gulliver", brand: "Gulliver", name: "Caixa de Transporte Gulliver", size: "Porte médio e grande", price: 189.99, img: "/images/pd-gulliver.jpg", category: "Transporte" }
  ];

  const PRODUCT_MAP = {};
  PRODUCTS.forEach(p => PRODUCT_MAP[p.id] = p);

  // --- 2. LocalStorage Store Management ---
  const STORAGE_KEY = 'terra-fertil-shop-v1';

  function getStore() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          cart: parsed.cart || {},
          favorites: parsed.favorites || {}
        };
      }
    } catch (e) {}
    return { cart: {}, favorites: {} };
  }

  function setStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {}
    updateHeaderBadges();
    renderDrawerItems();
  }

  function formatMoney(amount) {
    return 'R$ ' + Number(amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // --- 3. Toast Notifications ---
  function showToast(message, iconSvg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #14161C;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 999px;
      font-size: 14.5px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.28);
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;

    toast.innerHTML = (iconSvg || `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`) + `<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // --- 4. Cart Drawer Logic ---
  let drawerEl = null;
  let scrimEl = null;

  function initDrawer() {
    drawerEl = document.querySelector('aside.drawer');
    scrimEl = document.querySelector('button.scrim');

    if (!drawerEl) return;

    // Enhance drawer with full shopping cart items container & free shipping bar
    renderDrawerItems();

    // Event listener for scrim click
    if (scrimEl) {
      scrimEl.addEventListener('click', closeDrawer);
    }

    // Close button
    const closeBtn = drawerEl.querySelector('button[aria-label="Fechar carrinho"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isDrawerOpen()) {
        closeDrawer();
      }
    });

    // Intercept cart open buttons across page
    document.querySelectorAll('a[href="/checkout"], button[aria-label="Carrinho"]').forEach(el => {
      // If it's a header or nav link for cart, open drawer instead of immediate navigating
      if (el.closest('header') || el.closest('nav.tabbar')) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          openDrawer();
        });
      }
    });
  }

  function isDrawerOpen() {
    return drawerEl && drawerEl.style.transform === 'translateX(0%)';
  }

  function openDrawer() {
    if (!drawerEl) return;
    renderDrawerItems();
    drawerEl.style.visibility = 'visible';
    drawerEl.style.transform = 'translateX(0%)';
    drawerEl.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    if (scrimEl) {
      scrimEl.style.opacity = '1';
      scrimEl.style.pointerEvents = 'auto';
      scrimEl.style.transition = 'opacity 0.3s ease';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawerEl) return;
    drawerEl.style.transform = 'translateX(105%)';
    if (scrimEl) {
      scrimEl.style.opacity = '0';
      scrimEl.style.pointerEvents = 'none';
    }
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!isDrawerOpen()) drawerEl.style.visibility = 'hidden';
    }, 400);
  }

  function renderDrawerItems() {
    if (!drawerEl) return;
    const store = getStore();
    const cartEntries = Object.entries(store.cart).filter(([_, qty]) => qty > 0);
    const totalCount = cartEntries.reduce((sum, [_, q]) => sum + q, 0);

    // Update Drawer Header Count
    const countEl = drawerEl.querySelector('.dsp span');
    if (countEl) countEl.textContent = `(${totalCount})`;

    // Target content area (the container after the header)
    const bodyArea = drawerEl.querySelector('div[style*="flex:1"], .drawer-body');
    if (!bodyArea) return;

    if (totalCount === 0) {
      bodyArea.className = 'drawer-body';
      bodyArea.style.cssText = 'flex:1;display:grid;place-items:center;padding:32px;text-align:center;overflow-y:auto;';
      bodyArea.innerHTML = `
        <div>
          <div class="dsp" style="font-size:24px;margin-bottom:8px">Seu carrinho está vazio</div>
          <p style="margin:0 0 20px;color:#5B6272;font-size:14.5px">Que tal começar pelas ofertas da semana?</p>
          <a class="btn btn-sm btn-red" href="#ofertas" onclick="window.__petShopCloseDrawer()">Ver ofertas</a>
        </div>
      `;
      return;
    }

    // Calculate subtotal & goal
    let subtotal = 0;
    const itemsHtml = cartEntries.map(([id, qty]) => {
      const prod = PRODUCT_MAP[id] || { id, name: id, price: 99.99, size: '', img: '/images/ph-frenchie.jpg' };
      const itemTotal = (prod.price || 0) * qty;
      subtotal += itemTotal;
      return `
        <div style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #F0F2F5;align-items:center">
          <img src="${prod.img}" alt="${prod.name}" style="width:68px;height:68px;object-fit:cover;border-radius:10px;background:#F4F5F8;flex-shrink:0" />
          <div style="flex:1;min-width:0">
            <h4 style="margin:0 0 4px;font-size:14px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${prod.name}</h4>
            <div style="font-size:12.5px;color:#5B6272;margin-bottom:6px">${prod.size || ''}</div>
            <div style="font-size:15px;font-weight:700;color:#14161C">${formatMoney(prod.price)}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
            <div style="display:flex;align-items:center;border:1px solid #D5DAE1;border-radius:999px;background:#fff;padding:2px">
              <button type="button" onclick="window.__petShopUpdateCart('${id}', -1)" style="width:26px;height:26px;border:0;background:transparent;border-radius:50%;font-size:14px;cursor:pointer;display:grid;place-items:center">−</button>
              <span style="font-size:13px;font-weight:700;padding:0 8px">${qty}</span>
              <button type="button" onclick="window.__petShopUpdateCart('${id}', 1)" style="width:26px;height:26px;border:0;background:transparent;border-radius:50%;font-size:14px;cursor:pointer;display:grid;place-items:center">+</button>
            </div>
            <button type="button" onclick="window.__petShopRemoveCart('${id}')" style="background:none;border:0;font-size:11.5px;color:#94A3B8;cursor:pointer;text-decoration:underline">Remover</button>
          </div>
        </div>
      `;
    }).join('');

    const freeShippingGoal = 300;
    const progress = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));
    const remaining = freeShippingGoal - subtotal;

    bodyArea.className = 'drawer-body';
    bodyArea.style.cssText = 'flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:16px 20px;overflow-y:auto;';
    bodyArea.innerHTML = `
      <div style="flex:1">
        <!-- Free Delivery Progress Bar -->
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;margin-bottom:14px">
          <div style="font-size:13px;font-weight:600;margin-bottom:6px;display:flex;justify-content:space-between">
            <span>${remaining > 0 ? `Faltam ${formatMoney(remaining)} para Frete Grátis!` : '🎉 Você ganhou Frete Grátis!'}</span>
            <span style="color:#0B7A3E">${progress}%</span>
          </div>
          <div style="height:6px;background:#E2E8F0;border-radius:999px;overflow:hidden">
            <div style="width:${progress}%;height:100%;background:#0B7A3E;border-radius:999px;transition:width 0.4s ease"></div>
          </div>
        </div>

        <!-- Items list -->
        <div style="margin-bottom:16px">
          ${itemsHtml}
        </div>
      </div>

      <!-- Footer Checkout Actions -->
      <div style="border-top:1px solid #E3E6EC;padding-top:16px;background:#fff;position:sticky;bottom:0">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14.5px;color:#5B6272">
          <span>Subtotal</span>
          <span style="font-weight:700;color:#14161C;font-size:17px">${formatMoney(subtotal)}</span>
        </div>
        <div style="font-size:12px;color:#64748B;margin-bottom:14px">Entrega e opções de pagamento calculadas no checkout.</div>
        <a href="/checkout" class="btn btn-red" style="width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;border-radius:999px;font-weight:700;font-size:15px;background:#E0161C;color:#fff;text-decoration:none">
          Finalizar Compra (${formatMoney(subtotal)})
        </a>
      </div>
    `;
  }

  // Global window helpers for inline onclicks
  window.__petShopCloseDrawer = closeDrawer;
  window.__petShopOpenDrawer = openDrawer;

  window.__petShopUpdateCart = function (id, delta) {
    const store = getStore();
    const current = store.cart[id] || 0;
    const next = Math.max(0, current + delta);
    if (next === 0) {
      delete store.cart[id];
    } else {
      store.cart[id] = next;
    }
    setStore(store);
  };

  window.__petShopRemoveCart = function (id) {
    const store = getStore();
    delete store.cart[id];
    setStore(store);
    showToast('Item removido do carrinho');
  };

  // --- 5. Add to Cart Interception ---
  function initAddToCart() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, a');
      if (!btn) return;

      const ariaLabel = btn.getAttribute('aria-label') || '';
      const text = btn.textContent || '';

      const isAddToCart = ariaLabel.includes('Adicionar ao carrinho') ||
                          text.includes('Adicionar ao carrinho') ||
                          btn.classList.contains('add-cart');

      if (isAddToCart) {
        e.preventDefault();
        e.stopPropagation();

        // Extract product ID
        let prodId = null;
        const card = btn.closest('[data-id]') || btn.closest('article') || btn.closest('.card') || btn.closest('li') || btn.closest('main');
        
        // Find from product link inside card
        if (card) {
          const prodLink = card.querySelector('a[href*="/produto/"]');
          if (prodLink) {
            const m = prodLink.getAttribute('href').match(/\/produto\/([a-z0-9-]+)/);
            if (m) prodId = m[1];
          }
        }

        // If on product page
        if (!prodId && window.location.pathname.includes('/produto/')) {
          const m = window.location.pathname.match(/\/produto\/([a-z0-9-]+)/);
          if (m) prodId = m[1];
        }

        // Fallback from ariaLabel
        if (!prodId && ariaLabel) {
          for (const p of PRODUCTS) {
            if (ariaLabel.toLowerCase().includes(p.name.toLowerCase()) || ariaLabel.toLowerCase().includes(p.id)) {
              prodId = p.id;
              break;
            }
          }
        }

        if (!prodId) prodId = 'capitao-dog'; // Safe default

        // Add to store
        const store = getStore();
        store.cart[prodId] = (store.cart[prodId] || 0) + 1;
        setStore(store);

        const prod = PRODUCT_MAP[prodId];
        const name = prod ? prod.name : 'Produto';
        showToast(`${name} adicionado ao carrinho!`);
        openDrawer();
      }
    });
  }

  // --- 6. Favorites Heart Toggle ---
  function initFavorites() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button[aria-label*="Favorit"], button.fav-btn');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('article') || btn.closest('.card') || btn.closest('li') || btn.closest('main');
      let prodId = null;
      if (card) {
        const prodLink = card.querySelector('a[href*="/produto/"]');
        if (prodLink) {
          const m = prodLink.getAttribute('href').match(/\/produto\/([a-z0-9-]+)/);
          if (m) prodId = m[1];
        }
      }

      if (!prodId && window.location.pathname.includes('/produto/')) {
        const m = window.location.pathname.match(/\/produto\/([a-z0-9-]+)/);
        if (m) prodId = m[1];
      }

      if (!prodId) return;

      const store = getStore();
      const isFav = !!store.favorites[prodId];
      if (isFav) {
        delete store.favorites[prodId];
      } else {
        store.favorites[prodId] = true;
      }
      setStore(store);

      // Visual feedback on the heart SVG
      const svg = btn.querySelector('svg');
      if (svg) {
        const path = svg.querySelector('path');
        if (path) {
          path.style.fill = !isFav ? '#E0161C' : 'none';
          path.style.stroke = !isFav ? '#E0161C' : '#14161C';
        }
      }

      const prod = PRODUCT_MAP[prodId];
      const name = prod ? prod.name : 'Produto';
      showToast(!isFav ? `${name} favoritado!` : `${name} removido dos favoritos.`);
    });
  }

  // --- 7. Header Badges Sync ---
  function updateHeaderBadges() {
    const store = getStore();
    const cartCount = Object.values(store.cart).reduce((sum, q) => sum + q, 0);
    const favCount = Object.keys(store.favorites).length;

    // Cart Badges in Header & Mobile Bottom Bar
    document.querySelectorAll('a[href="/checkout"], button[aria-label="Carrinho"], a[aria-label="Carrinho"]').forEach(el => {
      let badge = el.querySelector('.cart-count-badge');
      if (cartCount > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cart-count-badge';
          badge.style.cssText = `
            position: absolute;
            top: 4px;
            right: 4px;
            background: #E0161C;
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            min-width: 18px;
            height: 18px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            padding: 0 4px;
            line-height: 1;
          `;
          el.style.position = 'relative';
          el.appendChild(badge);
        }
        badge.textContent = cartCount;
        badge.style.display = 'grid';
      } else if (badge) {
        badge.style.display = 'none';
      }
    });

    // Favorites Badges in Header
    document.querySelectorAll('a[href="/conta"][aria-label="Favoritos"]').forEach(el => {
      let badge = el.querySelector('.fav-count-badge');
      if (favCount > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'fav-count-badge';
          badge.style.cssText = `
            position: absolute;
            top: 4px;
            right: 4px;
            background: #E0161C;
            color: #fff;
            font-size: 11px;
            font-weight: 800;
            min-width: 18px;
            height: 18px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            padding: 0 4px;
            line-height: 1;
          `;
          el.style.position = 'relative';
          el.appendChild(badge);
        }
        badge.textContent = favCount;
        badge.style.display = 'grid';
      } else if (badge) {
        badge.style.display = 'none';
      }
    });
  }

  // --- 8. Live Search Functionality ---
  function initLiveSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="O que seu pet"]');
    if (!searchInputs.length) return;

    searchInputs.forEach(input => {
      // Wrapper container
      const wrapper = input.parentElement;
      if (!wrapper) return;
      wrapper.style.position = 'relative';

      // Dropdown results
      const dropdown = document.createElement('div');
      dropdown.className = 'live-search-dropdown';
      dropdown.style.cssText = `
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: #ffffff;
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(15,26,74,0.14);
        max-height: 380px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        padding: 8px;
      `;
      wrapper.appendChild(dropdown);

      function handleSearch() {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          dropdown.style.display = 'none';
          dropdown.innerHTML = '';
          return;
        }

        const matches = PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          dropdown.innerHTML = `
            <div style="padding: 16px; text-align: center; color: #64748B; font-size: 14px">
              Nenhum produto encontrado para "<strong>${input.value}</strong>".
            </div>
          `;
          dropdown.style.display = 'block';
          return;
        }

        dropdown.innerHTML = matches.map(p => `
          <a href="/produto/${p.id}" style="display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:8px;text-decoration:none;color:inherit;transition:background 0.15s" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='transparent'">
            <img src="${p.img}" alt="${p.name}" style="width:44px;height:44px;object-fit:cover;border-radius:6px;background:#F1F5F9;flex-shrink:0" />
            <div style="flex:1;min-width:0">
              <div style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
              <div style="font-size:12px;color:#64748B">${p.size} · ${p.brand}</div>
            </div>
            <div style="font-size:14px;font-weight:700;color:#14161C">${formatMoney(p.price)}</div>
          </a>
        `).join('');

        dropdown.style.display = 'block';
      }

      input.addEventListener('input', handleSearch);
      input.addEventListener('focus', handleSearch);

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
    });

    // Mobile "Buscar" tabbar button triggers search input focus
    const tabbarSearchBtn = document.querySelector('nav.tabbar button');
    if (tabbarSearchBtn) {
      tabbarSearchBtn.addEventListener('click', () => {
        const firstInput = document.querySelector('input[type="search"], input[placeholder*="Buscar"]');
        if (firstInput) {
          firstInput.focus();
          firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  }

  // --- 9. Checkout Interactivity (for /checkout) ---
  function initCheckoutPage() {
    if (!window.location.pathname.includes('/checkout')) return;

    const store = getStore();
    const cartEntries = Object.entries(store.cart).filter(([_, qty]) => qty > 0);
    const summaryList = document.querySelector('.checkout-summary-list') || document.querySelector('main');
    
    // Auto-populate cart summary in checkout
    let subtotal = 0;
    cartEntries.forEach(([id, qty]) => {
      const prod = PRODUCT_MAP[id] || { price: 99.99 };
      subtotal += (prod.price || 0) * qty;
    });

    const subtotalEls = document.querySelectorAll('main span, main td, main div');
    subtotalEls.forEach(el => {
      if (el.textContent && el.textContent.includes('R$ 0,00') && subtotal > 0) {
        el.textContent = formatMoney(subtotal);
      }
    });
  }

  // --- 10. Run on DOM Loaded ---
  function init() {
    initDrawer();
    initAddToCart();
    initFavorites();
    initLiveSearch();
    initCheckoutPage();
    updateHeaderBadges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
