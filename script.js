/* ============================================================
   SHOPMASTER - Archivo: script.js  →  COMPORTAMIENTO (lógica)
   Desarrollado por: Sohany Galan — 24-SISN-8-004
   ------------------------------------------------------------
   Etapas:
     1. Configuración y estado
     2. Utilidades (formato de precio, escape de HTML, alertas)
     3. Consumo de la API (fetch)
     4. Render de categorías y tarjetas
     5. Modal de producto
     6. Carrito + LocalStorage
     7. Pasarela de pago (validación)
     8. Ticket térmico en PDF (jsPDF)
     9. Eventos e inicio
   ============================================================ */
'use strict';

/* ------------------------------------------------------------
   1. CONFIGURACIÓN Y ESTADO
   ------------------------------------------------------------ */
const API_URL = 'https://fakestoreapi.com/products';
const STORAGE_KEY = 'shopmaster_cart';
const MAX_QTY = 99;

// Datos de la empresa ficticia (aparecen en el ticket)
const STORE = {
  name: 'SHOPMASTER',
  legalName: 'ShopMaster S.A.S.',
  taxId: 'NIT 900.123.456-7',
  address: 'Av. Principal #123',
  city: 'Ciudad Digital',
  phone: 'Tel: (601) 555-0123'
};

// Estado de la aplicación
let products = [];           // productos traídos de la API
let cart = loadCart();       // carrito recuperado de LocalStorage
let currentProduct = null;   // producto abierto en el modal
let activeCategory = 'all';  // filtro de categoría
let searchTerm = '';         // texto del buscador
let lastOrder = null;        // última compra (para re-descargar el ticket)

// Nombres de categorías en español (la API las entrega en inglés)
const CATEGORY_NAMES = {
  all: 'Todo',
  "men's clothing": 'Hombre',
  "women's clothing": 'Mujer',
  jewelery: 'Joyería',
  electronics: 'Tecnología'
};
const categoryName = (cat) => CATEGORY_NAMES[cat] ?? cat;

// Atajo para seleccionar elementos
const $ = (selector) => document.querySelector(selector);

// Referencias a elementos del DOM
const productGrid   = $('#productGrid');
const loader        = $('#loader');
const errorBox      = $('#errorBox');
const noResults     = $('#noResults');
const categoryBox   = $('#categoryFilters');
const cartItemsBox  = $('#cartItems');
const cartCount     = $('#cartCount');
const cartTotal     = $('#cartTotal');
const checkoutBtn   = $('#checkoutBtn');
const clearCartBtn  = $('#clearCartBtn');
const modalQty      = $('#modalQty');
const paymentForm   = $('#paymentForm');

// Instancias de componentes de Bootstrap
const productModal  = new bootstrap.Modal('#productModal');
const checkoutModal = new bootstrap.Modal('#checkoutModal');
const successModal  = new bootstrap.Modal('#successModal');
const cartOffcanvas = new bootstrap.Offcanvas('#cartOffcanvas');

/* ------------------------------------------------------------
   2. UTILIDADES
   ------------------------------------------------------------ */

// Da formato de moneda: 109.95 → "$109.95"
function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

// Evita que texto externo se interprete como HTML (seguridad contra XSS)
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Muestra una alerta de Bootstrap que se cierra sola a los 3 segundos
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>`;
  $('#alertContainer').appendChild(alert);

  setTimeout(() => bootstrap.Alert.getOrCreateInstance(alert).close(), 3000);
}

/* ------------------------------------------------------------
   3. CONSUMO DE LA API (Fetch)
   ------------------------------------------------------------ */
async function fetchProducts() {
  loader.classList.remove('d-none');
  errorBox.classList.add('d-none');

  try {
    const response = await fetch(API_URL);           // 1) pedimos los datos
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    products = await response.json();                // 2) convertimos JSON → objetos JS
    renderCategories();                              // 3) pintamos en pantalla
    renderProducts();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    errorBox.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation me-2"></i>
      No pudimos cargar los productos. Revisa tu conexión a internet.
      <button class="btn btn-sm btn-danger ms-2" id="retryBtn">
        <i class="fa-solid fa-rotate-right me-1"></i>Reintentar
      </button>`;
    errorBox.classList.remove('d-none');
    $('#retryBtn').addEventListener('click', fetchProducts);
  } finally {
    loader.classList.add('d-none');
  }
}

/* ------------------------------------------------------------
   4. RENDER DE CATEGORÍAS Y TARJETAS
   ------------------------------------------------------------ */

// Crea un botón por cada categoría distinta que venga en la API
function renderCategories() {
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  categoryBox.innerHTML = categories.map((cat) => `
    <button type="button"
            class="category-pill ${cat === activeCategory ? 'active' : ''}"
            data-category="${escapeHTML(cat)}">
      ${escapeHTML(categoryName(cat))}
    </button>`).join('');
}

// Pinta las tarjetas aplicando el filtro de categoría y la búsqueda
function renderProducts() {
  const term = searchTerm.toLowerCase();
  const filtered = products.filter((p) =>
    (activeCategory === 'all' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
  );

  noResults.classList.toggle('d-none', filtered.length > 0);

  productGrid.innerHTML = filtered.map((p, index) => `
    <div class="col">
      <article class="product-card" style="animation-delay:${index * 0.06}s">
        <div class="product-media" data-action="view" data-id="${p.id}">
          <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy">
          <span class="rating-tag"><i class="fa-solid fa-star"></i> ${p.rating?.rate ?? '-'}</span>
          <button class="quick-view" data-action="view" data-id="${p.id}">Vista rápida</button>
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHTML(categoryName(p.category))}</span>
          <h3 class="product-title">${escapeHTML(p.title)}</h3>
          <p class="product-desc">${escapeHTML(p.description)}</p>
          <div class="product-footer">
            <span class="price">${formatPrice(p.price)}</span>
            <button class="view-link" data-action="view" data-id="${p.id}">
              Ver más <i class="fa-solid fa-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </article>
    </div>`).join('');
}

/* ------------------------------------------------------------
   5. MODAL DE PRODUCTO
   ------------------------------------------------------------ */
function openProductModal(id) {
  currentProduct = products.find((p) => p.id === id);
  if (!currentProduct) return;

  const p = currentProduct;
  // Estrellas llenas, medias y vacías según la valoración (ej. 3.9 → 4 estrellas)
  const rate = p.rating?.rate ?? 0;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rate >= i + 1) return '<i class="fa-solid fa-star"></i>';
    if (rate >= i + 0.5) return '<i class="fa-solid fa-star-half-stroke"></i>';
    return '<i class="fa-regular fa-star"></i>';
  }).join('');

  $('#productModalTitle').textContent = p.title;
  $('#modalCategory').textContent = categoryName(p.category);
  $('#modalPrice').textContent = formatPrice(p.price);
  $('#modalImage').src = p.image;
  $('#modalImage').alt = p.title;
  $('#modalDetails').innerHTML = `
    <li class="list-group-item"><span class="detail-label">Categoría</span>
      ${escapeHTML(categoryName(p.category))}</li>
    <li class="list-group-item"><span class="detail-label">Descripción</span>
      <span class="detail-desc">${escapeHTML(p.description)}</span></li>
    <li class="list-group-item"><span class="detail-label">Valoración</span>
      <span class="stars">${stars}</span> ${rate} · ${p.rating?.count ?? 0} opiniones</li>
    <li class="list-group-item"><span class="detail-label">Precio</span>
      ${formatPrice(p.price)}</li>`;

  modalQty.value = 1;
  productModal.show();
}

// Asegura que la cantidad esté entre 1 y MAX_QTY
function clampQty(value) {
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, MAX_QTY);
}

/* ------------------------------------------------------------
   6. CARRITO + LOCALSTORAGE
   ------------------------------------------------------------ */

// Lee el carrito guardado (si existe y es válido)
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Guarda el carrito en el navegador para que no se pierda al recargar
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product, qty) {
  const item = cart.find((i) => i.id === product.id);
  if (item) {
    item.qty = Math.min(item.qty + qty, MAX_QTY);
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
  }
  saveCart();
  renderCart();

  // Pequeña animación en el contador
  cartCount.classList.remove('badge-bump');
  void cartCount.offsetWidth; // reinicia la animación
  cartCount.classList.add('badge-bump');

  showAlert(`<i class="fa-solid fa-check me-2"></i><strong>${qty} ×</strong> ${escapeHTML(product.title.slice(0, 40))}… agregado al carrito`);
}

function updateQty(id, qty) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = clampQty(qty);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
  showAlert('<i class="fa-regular fa-trash-can me-2"></i>Producto eliminado del carrito', 'warning');
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.qty, 0);
const getCartCount = () => cart.reduce((sum, i) => sum + i.qty, 0);

// Dibuja el contenido del carrito, el total y el contador
function renderCart() {
  cartCount.textContent = getCartCount();
  cartTotal.textContent = formatPrice(getCartTotal());
  checkoutBtn.disabled = cart.length === 0;
  clearCartBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItemsBox.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <h6>Tu carrito está vacío</h6>
        <small>Descubre nuestra colección y encuentra tu próxima pieza favorita.</small>
      </div>`;
    return;
  }

  cartItemsBox.innerHTML = cart.map((i) => `
    <div class="cart-item" data-id="${i.id}">
      <img src="${escapeHTML(i.image)}" alt="${escapeHTML(i.title)}">
      <div class="flex-grow-1 min-w-0 d-flex flex-column">
        <div class="d-flex justify-content-between gap-2">
          <div class="cart-item-title">${escapeHTML(i.title)}</div>
          <button class="remove-btn" data-action="remove" aria-label="Eliminar">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
        <div class="small text-muted mb-2">${formatPrice(i.price)} c/u</div>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <div class="qty-selector">
            <button data-action="dec" aria-label="Restar"><i class="fa-solid fa-minus"></i></button>
            <input type="number" value="${i.qty}" min="1" max="${MAX_QTY}" data-action="qty" aria-label="Cantidad">
            <button data-action="inc" aria-label="Sumar"><i class="fa-solid fa-plus"></i></button>
          </div>
          <span class="cart-item-price">${formatPrice(i.price * i.qty)}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ------------------------------------------------------------
   7. PASARELA DE PAGO (simulada) + VALIDACIÓN
   ------------------------------------------------------------ */

// Algoritmo de Luhn: comprueba si un número de tarjeta es matemáticamente válido
function luhnCheck(number) {
  let sum = 0;
  let double = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

// Comprueba que la fecha MM/AA tenga formato correcto y no esté vencida
function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59); // último día del mes
  return endOfMonth >= new Date();
}

// Detecta la marca de la tarjeta para mostrar su ícono
function detectBrand(digits) {
  if (/^4/.test(digits)) return 'fa-brands fa-cc-visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'fa-brands fa-cc-mastercard';
  if (/^3[47]/.test(digits)) return 'fa-brands fa-cc-amex';
  if (/^6/.test(digits)) return 'fa-brands fa-cc-discover';
  return 'fa-regular fa-credit-card';
}

// Marca un campo como válido o inválido (clases de Bootstrap)
function setValidity(input, isValid) {
  input.classList.toggle('is-invalid', !isValid);
  input.classList.toggle('is-valid', isValid);
  return isValid;
}

function validatePaymentForm() {
  const name   = $('#cardName');
  const number = $('#cardNumber');
  const expiry = $('#cardExpiry');
  const cvv    = $('#cardCvv');
  const digits = number.value.replace(/\D/g, '');

  const results = [
    setValidity(name, /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,}(\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,})+$/.test(name.value.trim())),
    setValidity(number, digits.length >= 13 && digits.length <= 19 && luhnCheck(digits)),
    setValidity(expiry, isValidExpiry(expiry.value)),
    setValidity(cvv, /^\d{3,4}$/.test(cvv.value))
  ];
  return results.every(Boolean);
}

function openCheckout() {
  if (cart.length === 0) return;
  $('#checkoutTotal').textContent = formatPrice(getCartTotal());
  cartOffcanvas.hide();
  checkoutModal.show();
}

function processPayment(event) {
  event.preventDefault();

  if (!validatePaymentForm()) {
    showAlert('<i class="fa-solid fa-triangle-exclamation me-2"></i>Revisa los datos marcados en rojo', 'danger');
    return;
  }

  // Simulamos la espera de respuesta del banco
  const payBtn = $('#payBtn');
  payBtn.disabled = true;
  payBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando pago...';

  setTimeout(() => {
    const digits = $('#cardNumber').value.replace(/\D/g, '');

    // Creamos la orden con una COPIA del carrito
    lastOrder = {
      id: 'SM-' + Date.now().toString().slice(-8),
      auth: String(Math.floor(100000 + Math.random() * 900000)),
      date: new Date(),
      customer: $('#cardName').value.trim(),
      last4: digits.slice(-4),
      items: cart.map((i) => ({ ...i })),
      total: getCartTotal()
    };

    // Limpiamos todo
    clearCart();
    paymentForm.reset();
    paymentForm.querySelectorAll('.is-valid, .is-invalid').forEach((el) => el.classList.remove('is-valid', 'is-invalid'));
    $('#cardBrandIcon').className = 'fa-regular fa-credit-card';
    payBtn.disabled = false;
    payBtn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Pagar ahora';

    // Mostramos el éxito y generamos el ticket
    checkoutModal.hide();
    $('#successName').textContent = lastOrder.customer;
    $('#successOrderId').textContent = lastOrder.id;
    successModal.show();
    generateTicketPDF(lastOrder);
  }, 1800);
}

/* ------------------------------------------------------------
   8. TICKET TÉRMICO EN PDF (jsPDF)
   ------------------------------------------------------------
   Papel de 80 mm de ancho, fuente Courier (monoespaciada).
   Como todas las letras miden lo mismo, podemos alinear
   columnas simplemente rellenando con espacios.
   ------------------------------------------------------------ */
const TICKET = {
  width: 80,       // ancho del papel en mm (cambia a 58 para impresoras pequeñas)
  margin: 4,       // margen lateral en mm
  fontSize: 8,     // tamaño de letra en puntos
  lineHeight: 3.6, // alto de cada línea en mm
  cols: 40         // caracteres por línea (usa 28 si el ancho es 58 mm)
};

// Quita tildes y caracteres especiales (las impresoras térmicas usan ASCII)
const toAscii = (text) => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, '');

// Centra un texto dentro del ancho del ticket
const center = (text) => {
  const t = toAscii(text).slice(0, TICKET.cols);
  return ' '.repeat(Math.floor((TICKET.cols - t.length) / 2)) + t;
};

// Pone un texto a la izquierda y otro a la derecha: "TOTAL:        $10.00"
const leftRight = (left, right) => {
  const r = toAscii(right);
  const l = toAscii(left).slice(0, TICKET.cols - r.length - 1);
  return l + ' '.repeat(TICKET.cols - l.length - r.length) + r;
};

// Parte un texto largo en varias líneas sin cortar palabras
function wrapText(text, width) {
  const words = toAscii(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > width) {
      if (line) lines.push(line);
      line = word.slice(0, width);
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

const pad2 = (n) => String(n).padStart(2, '0');

// Construye todas las líneas del ticket como texto plano
function buildTicketLines(order) {
  const sep = '-'.repeat(TICKET.cols);
  const dbl = '='.repeat(TICKET.cols);
  const d = order.date;
  const fecha = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  const hora = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  const units = order.items.reduce((s, i) => s + i.qty, 0);

  // Cada línea: { text, bold }
  const L = (text, bold = false) => ({ text, bold });
  const lines = [
    L(center(STORE.name), true),
    L(center(STORE.legalName)),
    L(center(STORE.taxId)),
    L(center(STORE.address)),
    L(center(STORE.city)),
    L(center(STORE.phone)),
    L(sep),
    L(leftRight('TICKET:', order.id)),
    L(leftRight('FECHA:', fecha)),
    L(leftRight('HORA:', hora)),
    L(leftRight('CLIENTE:', '')),
    ...wrapText(order.customer.toUpperCase(), TICKET.cols).map((t) => L(t)),
    L(sep),
    L(leftRight('CANT  DESCRIPCION', 'IMPORTE'), true),
    L(sep)
  ];

  // Productos: "2 x Titulo del producto..." y debajo "   $10.00 c/u     $20.00"
  order.items.forEach((item) => {
    const prefix = `${item.qty} x `;
    const titleLines = wrapText(item.title, TICKET.cols - prefix.length);
    titleLines.forEach((t, idx) => {
      lines.push(L((idx === 0 ? prefix : ' '.repeat(prefix.length)) + t));
    });
    lines.push(L(leftRight(' '.repeat(prefix.length) + formatPrice(item.price) + ' c/u', formatPrice(item.price * item.qty))));
  });

  lines.push(
    L(sep),
    L(leftRight('ARTICULOS:', String(units))),
    L(leftRight('SUBTOTAL:', formatPrice(order.total))),
    L(leftRight('ENVIO:', 'GRATIS')),
    L(dbl),
    L(leftRight('TOTAL:', formatPrice(order.total)), true),
    L(dbl),
    L(leftRight('PAGO:', `TARJETA **** ${order.last4}`)),
    L(leftRight('AUTORIZACION:', order.auth)),
    L(leftRight('ESTADO:', 'APROBADO')),
    L(sep),
    L(center('GRACIAS POR SU COMPRA!'), true),
    L(center('Conserve este ticket como')),
    L(center('comprobante de pago')),
    L(''),
    L(center('*** DOCUMENTO SIN VALOR FISCAL ***')),
    L(''),
    L(center('Desarrollado por Sohany Galan')),
    L(center('24-SISN-8-004'))
  );

  return lines;
}

function generateTicketPDF(order) {
  if (!window.jspdf) {
    showAlert('No se pudo cargar jsPDF. Revisa tu conexión.', 'danger');
    return;
  }
  const { jsPDF } = window.jspdf;
  const lines = buildTicketLines(order);

  // El alto del papel depende de cuántas líneas tenga el ticket
  const height = Math.max(TICKET.margin * 2 + lines.length * TICKET.lineHeight + 4, 100);
  const doc = new jsPDF({ unit: 'mm', format: [TICKET.width, height], orientation: 'portrait' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(TICKET.fontSize);

  let y = TICKET.margin + 3;
  lines.forEach((line) => {
    doc.setFont('courier', line.bold ? 'bold' : 'normal');
    doc.text(line.text, TICKET.margin, y);
    y += TICKET.lineHeight;
  });

  doc.save(`ticket-${order.id}.pdf`);
}

/* ------------------------------------------------------------
   9. EVENTOS E INICIO
   ------------------------------------------------------------ */

// Clic en "Ver más" o en la imagen (delegación de eventos)
productGrid.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-action="view"]');
  if (trigger) openProductModal(Number(trigger.dataset.id));
});

// Filtros de categoría
categoryBox.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderCategories();
  renderProducts();
});

// Buscador (filtra mientras escribes)
$('#searchInput').addEventListener('input', (e) => {
  searchTerm = e.target.value.trim();
  renderProducts();
});
$('#searchForm').addEventListener('submit', (e) => e.preventDefault());

// Selector de cantidad del modal
$('#qtyMinus').addEventListener('click', () => { modalQty.value = clampQty(modalQty.value - 1); });
$('#qtyPlus').addEventListener('click', () => { modalQty.value = clampQty(Number(modalQty.value) + 1); });
modalQty.addEventListener('change', () => { modalQty.value = clampQty(modalQty.value); });

// Agregar al carrito desde el modal
$('#addToCartBtn').addEventListener('click', () => {
  if (!currentProduct) return;
  addToCart(currentProduct, clampQty(modalQty.value));
  productModal.hide();
});

// Botones dentro del carrito: sumar, restar, eliminar
cartItemsBox.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  const row = e.target.closest('.cart-item');
  if (!btn || !row) return;
  const id = Number(row.dataset.id);
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  if (btn.dataset.action === 'inc') updateQty(id, item.qty + 1);
  if (btn.dataset.action === 'dec') {
    if (item.qty <= 1) removeFromCart(id);
    else updateQty(id, item.qty - 1);
  }
  if (btn.dataset.action === 'remove') removeFromCart(id);
});

// Escribir una cantidad directamente en el carrito
cartItemsBox.addEventListener('change', (e) => {
  if (e.target.dataset.action !== 'qty') return;
  updateQty(Number(e.target.closest('.cart-item').dataset.id), e.target.value);
});

clearCartBtn.addEventListener('click', () => {
  if (confirm('¿Seguro que quieres vaciar el carrito?')) {
    clearCart();
    showAlert('<i class="fa-regular fa-trash-can me-2"></i>Carrito vaciado', 'warning');
  }
});

checkoutBtn.addEventListener('click', openCheckout);
paymentForm.addEventListener('submit', processPayment);

// Formato automático de la tarjeta: "4242424242424242" → "4242 4242 4242 4242"
$('#cardNumber').addEventListener('input', (e) => {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
  e.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  $('#cardBrandIcon').className = detectBrand(digits);
});

// Formato automático del vencimiento: "1228" → "12/28"
$('#cardExpiry').addEventListener('input', (e) => {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});

// El CVV solo acepta números
$('#cardCvv').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Re-descargar el ticket
$('#downloadTicketBtn').addEventListener('click', () => {
  if (lastOrder) generateTicketPDF(lastOrder);
});

// La barra de navegación se compacta al bajar
window.addEventListener('scroll', () => {
  $('#mainNav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// En móvil, cerrar el menú al elegir un enlace
document.querySelectorAll('#navMenu .nav-link').forEach((link) => {
  link.addEventListener('click', () => bootstrap.Collapse.getInstance('#navMenu')?.hide());
});

// ¡Arrancamos!
$('#year').textContent = new Date().getFullYear();
renderCart();
fetchProducts();
