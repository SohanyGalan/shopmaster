# 🚀 Tutorial: tu primera tienda virtual con IA — ShopMaster 🛒

> Proyecto educativo: tienda web que consume **FakeStoreAPI**, con carrito de compras, pasarela de pago simulada y **ticket térmico en PDF**.
> Está pensado para estudiantes que empiezan desde cero.
>
> **Autor:** Sohany Galan — 24-SISN-8-004

---

## 📑 Índice

1. [¿Qué es la programación web?](#1-qué-es-la-programación-web)
2. [Las tecnologías fundamentales, en orden histórico](#2-las-tecnologías-fundamentales-en-orden-histórico)
3. [Cómo usamos cada tecnología en este proyecto](#3-cómo-usamos-cada-tecnología-en-este-proyecto)
4. [Guía del proyecto, etapa por etapa (con código)](#4-guía-del-proyecto-etapa-por-etapa-con-código)
5. [Trabajar el proyecto en Visual Studio Code](#5-trabajar-el-proyecto-en-visual-studio-code)
6. [Publicar en GitHub Pages (arrastrar y soltar, sin comandos)](#6-publicar-en-github-pages-arrastrar-y-soltar-sin-comandos)
7. [Publicar en Vercel (enlazado con GitHub)](#7-publicar-en-vercel-enlazado-con-github)
8. [Ver y compartir tu proyecto](#8-ver-y-compartir-tu-proyecto)
9. [Problemas frecuentes](#9-problemas-frecuentes)

---

## 1. ¿Qué es la programación web?

La **programación web** consiste en crear páginas y aplicaciones que se abren en un **navegador** (Chrome, Edge, Firefox, Safari).

Funciona con dos partes que se comunican por internet:

| Parte | Qué hace | Ejemplo en este proyecto |
|---|---|---|
| **Cliente (Frontend)** | Lo que ves y con lo que interactúas en el navegador. | Las tarjetas, el carrito y el formulario de pago. |
| **Servidor (Backend)** | Guarda datos y responde a las peticiones. | FakeStoreAPI, que nos entrega la lista de productos. |

Cuando abres la tienda, el navegador hace una **petición** a `https://fakestoreapi.com/products` y el servidor le **responde** con datos en formato **JSON** (texto organizado en llaves y corchetes). Nuestro JavaScript lee esos datos y crea las tarjetas en pantalla.

Una buena forma de recordarlo es pensar en una casa:

- **HTML** = la estructura (paredes, puertas, ventanas).
- **CSS** = la decoración (pintura, muebles, iluminación).
- **JavaScript** = la electricidad y la plomería (lo que hace que las cosas *funcionen*).

---

## 2. Las tecnologías fundamentales, en orden histórico

### 🧱 HTML — 1991
**HyperText Markup Language** (lenguaje de marcado de hipertexto). Lo creó **Tim Berners-Lee** en el CERN (Suiza), junto con el protocolo HTTP y el primer navegador. La primera página web se publicó en 1991.
HTML no es un lenguaje de programación: es un lenguaje de **marcado**. Usa **etiquetas** como `<h1>`, `<p>`, `<img>` o `<button>` para indicar qué es cada cosa en la página. La versión actual es **HTML5**, que trajo etiquetas semánticas (`<header>`, `<main>`, `<footer>`) y APIs como `localStorage`.

### ⚙️ JavaScript — 1995
Lo creó **Brendan Eich** en Netscape, en unos 10 días. Se llamó primero *Mocha*, después *LiveScript* y al final *JavaScript* (aunque no tiene relación con Java). En 1997 se estandarizó con el nombre **ECMAScript**. La gran actualización **ES6 (2015)** trajo `let`/`const`, funciones flecha `=>`, *template strings* y promesas. Más tarde llegaron `async/await` y la **Fetch API**, que usamos para consultar APIs.
Es el **único lenguaje de programación** que entienden todos los navegadores de forma nativa.

### 🎨 CSS — 1996
**Cascading Style Sheets** (hojas de estilo en cascada). Lo propuso **Håkon Wium Lie** en 1994, trabajando con **Bert Bos**, y el W3C publicó CSS1 en 1996. Su idea principal es separar el **contenido** (HTML) de la **presentación** (colores, tamaños, posiciones). Con el tiempo se sumaron Flexbox, Grid, variables y animaciones.

### 📐 Bootstrap — 2011
Es un **framework de CSS** (y algo de JS) que crearon **Mark Otto** y **Jacob Thornton** en Twitter. Trae clases listas como `btn`, `card`, `row` o `col` y componentes como modales y menús. Popularizó el diseño **responsivo** y *mobile first* (primero móvil). Usamos **Bootstrap 5**, que ya no depende de jQuery.

### ⭐ Font Awesome — 2012
Biblioteca de **íconos vectoriales** que creó **Dave Gandy**. Agregas un ícono con una etiqueta como `<i class="fa-solid fa-cart-shopping"></i>`. Como son vectoriales, se ven nítidos en cualquier tamaño y cambian de color con CSS.

### 🧩 Complementos que también usamos
| Tecnología | Año aprox. | Para qué sirve |
|---|---|---|
| **JSON** (Douglas Crockford) | inicios de los 2000 | Formato de texto para intercambiar datos. |
| **API REST** (Roy Fielding, 2000) | 2000 | Forma estándar de pedir datos a un servidor por URL. |
| **jsPDF** (James Hall) | ~2010 | Crear archivos PDF directamente en el navegador. |
| **LocalStorage** (HTML5) | ~2009 | Guardar datos en el navegador aunque cierres la página. |
| **Fetch API** | ~2015 | Hacer peticiones a APIs desde JavaScript. |

---

## 3. Cómo usamos cada tecnología en este proyecto

| Tecnología | Uso en ShopMaster |
|---|---|
| **HTML5** | Estructura en `index.html`: barra de navegación, portada, rejilla de productos, carrito y 3 ventanas modales. |
| **CSS3** | `style.css`: paleta de colores, efectos *hover* en las tarjetas, animaciones de entrada y ajustes para móvil. |
| **Bootstrap 5** | Rejilla responsiva (1 a 4 columnas), modales, panel lateral del carrito (*offcanvas*), formularios y alertas. |
| **Font Awesome** | Íconos de carrito, papelera 🗑️, más ➕, tarjeta 💳, marcas Visa/Mastercard, etc. |
| **JavaScript ES6+** | `script.js`: consulta la API, crea las tarjetas, maneja el carrito, valida el pago y arma el ticket. |
| **Fetch API** | `fetch('https://fakestoreapi.com/products')` trae los 20 productos. |
| **LocalStorage** | Guarda el carrito para que no se pierda al recargar la página. |
| **jsPDF** | Genera el ticket en PDF de **80 mm** de ancho con fuente **Courier** (monoespaciada). |

**Paleta de colores (psicología del color) — estilo boutique de lujo:**

Las tiendas de moda caras (como COS o Massimo Dutti) usan pocos colores, mucho espacio en blanco y tipografía elegante. Por eso cambiamos el azul y el verde originales por esta paleta:

| Color | Código | Significado | Dónde se usa |
|---|---|---|---|
| ⚫ Negro tinta | `#111111` | Lujo, elegancia, autoridad | Botones principales, textos y pie de página |
| 🤍 Marfil | `#FAF8F5` | Limpieza con calidez | Fondo general |
| 🟫 Arena | `#F3EFE9` | Suavidad, naturalidad | Fondo de las fotos de productos |
| 🟡 Dorado | `#B08D57` | Exclusividad y valor | Detalles: categorías, estrellas, subrayados, contador del carrito |
| 🩶 Gris cálido | `#6F6A64` | Legibilidad sin dureza | Descripciones y textos secundarios |

**Tipografía:** **Playfair Display** (con serifa, para títulos y precios, transmite elegancia) + **Inter** (sin serifa, para el texto, moderna y muy legible).

---

## 4. Guía del proyecto, etapa por etapa (con código)

El proyecto tiene **3 archivos** y **una carpeta de imágenes**, todos en la misma carpeta:

```
PROYECTO #5/
├── index.html       ← estructura
├── style.css        ← diseño
├── script.js        ← lógica
└── img/
    ├── hero.jpg     ← foto de ropa del banner principal
    └── editorial.jpg← foto del banner "Menos es más"
```

> 📸 Las fotos son de **Unsplash** (unsplash.com), un banco de imágenes gratuito para uso comercial.

> 💡 Los archivos completos traen comentarios en cada sección. Aquí explicamos las partes más importantes; para ver todo, abre cada archivo.

### Etapa 1 — Esqueleto HTML y librerías (`index.html`)

Todo documento HTML empieza igual. Dentro de `<head>` cargamos las librerías desde un **CDN** (servidores públicos que alojan las librerías, así no hay que descargar nada):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">                                   <!-- permite tildes y ñ -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- clave para móviles -->
  <title>ShopMaster | Boutique Online</title>

  <!-- Fuentes: Playfair Display (títulos) + Inter (texto) -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
  <!-- NUESTRO CSS: siempre al final para poder sobrescribir Bootstrap -->
  <link rel="stylesheet" href="style.css">
</head>
```

Los scripts van **al final del `<body>`**, para que el HTML ya exista cuando JavaScript lo busque:

```html
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="script.js"></script>
</body>
```

### Etapa 2 — Barra de anuncios, navegación y banner principal

```html
<!-- Franja negra superior, típica de tiendas de moda -->
<div class="announcement-bar">Envío gratis en todos los pedidos</div>

<nav id="mainNav" class="navbar navbar-expand-lg sticky-top">
  <a class="navbar-brand brand" href="#inicio">
    <i class="fa-solid fa-cart-shopping brand-icon"></i> <span>ShopMaster</span> <!-- logo = ícono + nombre -->
  </a>
  <button class="icon-btn position-relative"
          data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas">  <!-- abre el carrito -->
    <i class="fa-solid fa-bag-shopping"></i>
    <span id="cartCount" class="cart-badge">0</span>                  <!-- contador -->
  </button>
  <!-- + menú (Inicio, Colección, Editorial, Contacto) y buscador -->
</nav>

<!-- Banner a pantalla completa con foto de ropa de fondo -->
<header id="inicio" class="hero">
  <div class="hero-overlay"></div>               <!-- capa oscura para leer el texto -->
  <div class="container hero-content">
    <p class="eyebrow">Colección Otoño · Invierno 2026</p>
    <h1 class="hero-title">El arte de vestir<br><em>con elegancia</em></h1>
    <a href="#catalogo" class="btn btn-light-lux">Comprar ahora</a>
  </div>
</header>
```

- `navbar`, `sticky-top`, `container`… son **clases de Bootstrap**. `brand`, `hero`, `btn-light-lux`… son **clases nuestras**, definidas en `style.css`.
- `data-bs-toggle="offcanvas"` le dice a Bootstrap que el botón abre el panel lateral, sin escribir JavaScript.
- `id="cartCount"` es el "nombre" que JavaScript usa para encontrar ese elemento.
- La página también incluye una franja de **beneficios**, un **banner editorial** y un **pie de página** con el crédito del autor.

### Etapa 3 — Rejilla de productos responsiva

```html
<div id="productGrid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4"></div>
```

El contenedor empieza **vacío** y JavaScript lo llena. Las clases indican cuántas columnas mostrar: 1 en móvil, 2 en tablet, 3 en laptop y 4 en pantallas grandes.

### Etapa 4 — Modales y panel del carrito

En `index.html` hay **tres modales** (ventanas emergentes) y un **offcanvas**:

| Componente | `id` | Contenido |
|---|---|---|
| Modal de producto | `#productModal` | Imagen grande centrada, lista de detalles, selector de cantidad y botón "Agregar". |
| Carrito (offcanvas) | `#cartOffcanvas` | Lista de productos, total, "Ir a pagar" y "Vaciar". |
| Pasarela de pago | `#checkoutModal` | Formulario: nombre, tarjeta, vencimiento y CVV. |
| Compra exitosa | `#successModal` | Confirmación y botón "Descargar ticket". |

Ejemplo del selector de cantidad:

```html
<div class="qty-selector">
  <button type="button" id="qtyMinus"><i class="fa-solid fa-minus"></i></button>
  <input type="number" id="modalQty" value="1" min="1" max="99">
  <button type="button" id="qtyPlus"><i class="fa-solid fa-plus"></i></button>
</div>
```

### Etapa 5 — Diseño con CSS (`style.css`)

**a) Variables de color.** Se definen una sola vez y se reutilizan en todo el archivo. También reemplazan los colores de Bootstrap:

```css
:root {
  --ink: #111111;     /* negro: lujo */
  --ivory: #faf8f5;   /* marfil: fondo */
  --sand: #f3efe9;    /* arena: fondo de fotos */
  --gold: #b08d57;    /* dorado: exclusividad */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', sans-serif;
  --bs-body-bg: var(--ivory);   /* Bootstrap usará nuestro fondo */
}
```

**b) Banner con foto de ropa de fondo.** La foto va en una capa (`::before`) con un zoom lento tipo cine, y encima una capa oscura degradada para que el texto blanco se lea bien:

```css
.hero { position: relative; min-height: calc(100vh - 110px); display: flex; align-items: center; overflow: hidden; }
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background: url('img/hero.jpg') center / cover no-repeat;  /* cover = cubre todo sin deformar */
  animation: heroZoom 18s ease-out both;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(10,8,6,.85) 0%, rgba(10,8,6,.15) 100%); /* oscuro a la izquierda */
}
```

**c) Tarjetas estilo revista.** Las fotos tienen proporción 4:5 y fondo arena. `mix-blend-mode: multiply` hace que el fondo blanco de las fotos de la API se funda con el color arena:

```css
.product-media { position: relative; aspect-ratio: 4 / 5; background: var(--sand); overflow: hidden; }
.product-media img { width: 100%; height: 100%; object-fit: contain; padding: 14%; mix-blend-mode: multiply;
                     transition: transform 0.8s; }
.product-card:hover .product-media img { transform: scale(1.07); }   /* zoom suave al pasar el ratón */
```

**d) Botón "Vista rápida"** que sube desde abajo al pasar el ratón:

```css
.quick-view { position: absolute; left: 1rem; right: 1rem; bottom: 1rem;
              transform: translateY(calc(100% + 1.5rem)); transition: transform 0.45s; }  /* escondido */
.product-card:hover .quick-view { transform: translateY(0); }                          /* visible */
```

**e) Animación** con `@keyframes`:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Etapa 6 — Consumir la API con Fetch (`script.js`)

```js
const API_URL = 'https://fakestoreapi.com/products';

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);      // 1) pedimos los datos y esperamos (await)
    if (!response.ok) throw new Error('Error');  // 2) si el servidor falla, vamos al catch
    products = await response.json();            // 3) convertimos el JSON a objetos de JS
    renderProducts();                            // 4) los mostramos
  } catch (error) {
    // muestra un mensaje de error con un botón "Reintentar"
  }
}
```

Cada producto que llega de la API tiene esta forma:

```json
{ "id": 1, "title": "Fjallraven - Foldsack No. 1 Backpack", "price": 109.95,
  "description": "...", "category": "men's clothing", "image": "https://...",
  "rating": { "rate": 3.9, "count": 120 } }
```

### Etapa 7 — Crear las tarjetas dinámicamente

Recorremos el arreglo con `.map()` y convertimos cada producto en HTML usando *template strings* (comillas invertidas `` ` ``):

```js
productGrid.innerHTML = filtered.map((p) => `
  <div class="col">
    <article class="product-card">
      <div class="product-media" data-action="view" data-id="${p.id}">
        <img src="${p.image}" alt="${p.title}">
        <button class="quick-view" data-action="view" data-id="${p.id}">Vista rápida</button>
      </div>
      <div class="product-info">
        <span class="product-category">${categoryName(p.category)}</span>  <!-- "Hombre", "Joyería"… -->
        <h3 class="product-title">${p.title}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="view-link" data-action="view" data-id="${p.id}">Ver más →</button>
        </div>
      </div>
    </article>
  </div>`).join('');
```

La API entrega las categorías en inglés. Un objeto las traduce:

```js
const CATEGORY_NAMES = { all: 'Todo', "men's clothing": 'Hombre', "women's clothing": 'Mujer',
                         jewelery: 'Joyería', electronics: 'Tecnología' };
const categoryName = (cat) => CATEGORY_NAMES[cat] ?? cat;   // si no existe, deja el original
```

> 🔒 En el archivo real, los textos pasan por `escapeHTML()`. Es una buena práctica de seguridad: evita que un texto externo se ejecute como código.

**Delegación de eventos:** en vez de poner un "escuchador" en cada botón, ponemos uno solo en la rejilla y revisamos qué se tocó:

```js
productGrid.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-action="view"]');
  if (trigger) openProductModal(Number(trigger.dataset.id));
});
```

Además, el proyecto incluye un **buscador** y **filtros por categoría** que vuelven a llamar a `renderProducts()`.

### Etapa 8 — Carrito y LocalStorage

```js
const STORAGE_KEY = 'shopmaster_cart';

function saveCart() {                       // guarda en el navegador
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {                       // recupera al abrir la página
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}

function addToCart(product, qty) {
  const item = cart.find((i) => i.id === product.id);
  if (item) item.qty += qty;                // si ya existe, sumamos cantidad
  else cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
  saveCart();
  renderCart();                             // redibuja lista, total y contador
}

// Total = suma de (precio × cantidad) de cada producto
const getCartTotal = () => cart.reduce((sum, i) => sum + i.price * i.qty, 0);
```

En el carrito puedes **sumar ➕**, **restar ➖**, **escribir la cantidad** o **eliminar 🗑️**. Cada cambio llama a `saveCart()` y luego a `renderCart()`.

### Etapa 9 — Pasarela de pago y validación

El formulario tiene `novalidate` para usar **nuestra** validación en vez de la del navegador. Bootstrap muestra los errores en rojo con la clase `is-invalid`:

```js
function validatePaymentForm() {
  const digits = $('#cardNumber').value.replace(/\D/g, '');  // quita espacios
  return [
    setValidity($('#cardName'),   /* nombre y apellido */ /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,})+$/.test($('#cardName').value.trim())),
    setValidity($('#cardNumber'), digits.length >= 13 && digits.length <= 19 && luhnCheck(digits)),
    setValidity($('#cardExpiry'), isValidExpiry($('#cardExpiry').value)), // MM/AA y no vencida
    setValidity($('#cardCvv'),    /^\d{3,4}$/.test($('#cardCvv').value))
  ].every(Boolean);
}
```

- **Algoritmo de Luhn:** la fórmula matemática que usan los bancos para detectar números de tarjeta mal escritos.
- **Formato automático:** mientras escribes, la tarjeta se separa en grupos de 4 (`4242 4242 4242 4242`), el vencimiento recibe su `/` y aparece el ícono de Visa o Mastercard.
- 🧪 **Datos de prueba:** `Ana Pérez` · `4242 4242 4242 4242` · `12/30` · `123`.

Al pagar se simula una espera de 1,8 segundos ("Procesando pago..."). Después se crea la **orden**, se vacía el carrito y se genera el ticket.

> ⚠️ Es un pago **simulado**: no se cobra nada ni se envían datos. Para cobros reales se usan servicios como Stripe o PayPal, que manejan los datos de la tarjeta en sus propios servidores.

### Etapa 10 — Ticket térmico en PDF con jsPDF

Las impresoras térmicas usan papel de **58 mm o 80 mm**. Con una fuente **monoespaciada** (Courier) todas las letras miden lo mismo, así que podemos alinear columnas rellenando con espacios:

```js
const TICKET = { width: 80, margin: 4, fontSize: 8, lineHeight: 3.6, cols: 40 };
// Para papel de 58 mm usa: width: 58, cols: 28

// "TOTAL:" a la izquierda y "$242.20" a la derecha
const leftRight = (left, right) =>
  left + ' '.repeat(TICKET.cols - left.length - right.length) + right;

function generateTicketPDF(order) {
  const { jsPDF } = window.jspdf;
  const lines = buildTicketLines(order);                       // arma todas las líneas de texto
  const height = Math.max(TICKET.margin * 2 + lines.length * TICKET.lineHeight + 4, 100);
  const doc = new jsPDF({ unit: 'mm', format: [TICKET.width, height] }); // papel a la medida

  let y = TICKET.margin + 3;
  lines.forEach((line) => {
    doc.setFont('courier', line.bold ? 'bold' : 'normal');
    doc.text(line.text, TICKET.margin, y);
    y += TICKET.lineHeight;
  });
  doc.save(`ticket-${order.id}.pdf`);                          // descarga el archivo
}
```

Resultado (sin logos, solo texto):

```
               SHOPMASTER
           ShopMaster S.A.S.
           NIT 900.123.456-7
----------------------------------------
TICKET:                      SM-12345678
FECHA:                        02/11/2026
HORA:                           17:01:07
CLIENTE:
JOSE NUNEZ PEREZ
----------------------------------------
CANT  DESCRIPCION                IMPORTE
----------------------------------------
2 x Fjallraven - Foldsack No. 1
    Backpack, Fits 15 Laptops
    $109.95 c/u                  $219.90
----------------------------------------
========================================
TOTAL:                           $242.20
========================================
PAGO:                  TARJETA **** 4242
         GRACIAS POR SU COMPRA!
```

> Las tildes se quitan a propósito (`José` → `JOSE`), igual que en muchas impresoras térmicas reales que solo imprimen caracteres básicos (ASCII).

---

## 5. Trabajar el proyecto en Visual Studio Code

### 5.1 Instalar VS Code
1. Entra a **https://code.visualstudio.com**.
2. Haz clic en **Download** (detecta tu sistema: Windows, Mac o Linux).
3. Instálalo con las opciones por defecto. En Windows, marca **"Agregar acción 'Abrir con Code'"**: te dejará abrir carpetas con clic derecho.
4. *(Opcional)* Para tener VS Code en español: abre Extensiones (`Ctrl + Shift + X`), busca **"Spanish Language Pack"**, instálalo y reinicia.

### 5.2 Crear la carpeta y los archivos
1. Crea una carpeta en el Escritorio, por ejemplo `PROYECTO #5`.
2. En VS Code ve a **Archivo → Abrir carpeta…** y elígela.
3. En el panel izquierdo (**Explorador**), pasa el ratón sobre el nombre de la carpeta y haz clic en el ícono **📄+ (Nuevo archivo)**.
4. Crea estos tres archivos, **escribiendo los nombres exactos** en minúsculas:
   - `index.html`
   - `style.css`
   - `script.js`
5. Copia el código de cada archivo del proyecto y pégalo en el archivo correspondiente.
6. Guarda con **`Ctrl + S`** (en Mac: `Cmd + S`). Un punto ⚪ en la pestaña indica que hay cambios sin guardar.

> 💡 El archivo principal **debe llamarse `index.html`**. Es el que buscan los navegadores y servidores al abrir un sitio.

> 💡 Truco: en un `.html` vacío escribe `!` y presiona `Tab`. VS Code genera la estructura básica.

### 5.3 Verlo en el navegador

**Opción A — Rápida:** busca `index.html` en la carpeta y haz doble clic. Se abre en tu navegador. Funciona, pero tienes que recargar (`F5`) cada vez que cambies algo.

**Opción B — Recomendada: extensión Live Server**
1. En VS Code abre **Extensiones** (ícono de cuadritos en la barra izquierda, o `Ctrl + Shift + X`).
2. Busca **"Live Server"**. Instala la de **Ritwick Dey** (tiene millones de descargas).
3. Haz clic en **Install / Instalar**.
4. Abre `index.html` y elige una de estas opciones:
   - Clic derecho dentro del código → **"Open with Live Server"**, o
   - Clic en **"Go Live"** en la barra azul inferior derecha.
5. Se abrirá el navegador en una dirección como `http://127.0.0.1:5500/index.html`.
6. Ahora, **cada vez que guardes (`Ctrl + S`) la página se recarga sola**. ✨
7. Para detenerlo, haz clic en **"Port: 5500"** en la barra inferior.

### 5.4 Probar el flujo completo
1. Espera a que carguen los productos (necesitas internet).
2. Haz clic en **"Ver más"**, elige una cantidad y presiona **"Agregar al carrito"**.
3. Abre el **Carrito** (arriba a la derecha), cambia cantidades o elimina productos.
4. Presiona **"Ir a pagar"** y llena el formulario con los datos de prueba.
5. Presiona **"Pagar ahora"**. Se descargará `ticket-SM-XXXXXXXX.pdf`. 🧾

> 🛠️ Si algo falla, presiona **`F12`** en el navegador y abre la pestaña **Console**. Ahí aparecen los errores en rojo.

---

## 6. Publicar en GitHub Pages (arrastrar y soltar, sin comandos)

**GitHub** es una plataforma para guardar proyectos de código en la nube. **GitHub Pages** convierte un repositorio en una página web **gratis**.

### 6.1 Crear la cuenta
1. Entra a **https://github.com** y haz clic en **Sign up**.
2. Escribe tu **correo**, una **contraseña** y un **nombre de usuario**. Elígelo con cuidado: aparecerá en la dirección de tu página (`tu-usuario.github.io`).
3. Resuelve la verificación ("no soy un robot").
4. Escribe el **código** que te llega al correo.
5. Elige el plan **Free** (gratis).

### 6.2 Crear el repositorio (proyecto)
1. Ya con tu sesión iniciada, haz clic en **"+"** (arriba a la derecha) → **New repository**.
2. **Repository name:** `shopmaster` (sin espacios ni tildes; usa guiones si quieres, por ejemplo `tienda-shopmaster`).
3. **Description** (opcional): "Tienda virtual con carrito y ticket PDF".
4. Elige **Public**. ⚠️ En el plan gratis, GitHub Pages solo funciona con repositorios **públicos**.
5. **No** marques "Add a README file" (así aparece directo la opción para subir archivos).
6. Haz clic en **Create repository**.

### 6.3 Subir los archivos arrastrando y soltando
1. En la página del repositorio recién creado, busca el enlace **"uploading an existing file"** y haz clic.
   *(Si el repositorio ya tiene archivos, usa el botón **Add file → Upload files**.)*
2. Abre tu carpeta del proyecto en el Explorador de Windows.
3. Selecciona `index.html`, `style.css`, `script.js` **y la carpeta `img`** (también puedes incluir `TUTORIAL.md`). Usa Chrome o Edge: permiten arrastrar carpetas.
4. **Arrástralos** y suéltalos en el recuadro que dice *"Drag files here…"*.
5. Espera a que terminen de cargar.
6. Abajo, en **Commit changes**, escribe un mensaje como `Primera versión de ShopMaster`.
7. Haz clic en **Commit changes** (el botón verde).

> ⚠️ Arrastra el **contenido** de la carpeta del proyecto, no la carpeta `PROYECTO #5` completa. `index.html` debe quedar en la **raíz** del repositorio, y las fotos dentro de `img/`. Si olvidas la carpeta `img`, el banner aparecerá vacío.

### 6.4 Activar GitHub Pages
1. En el repositorio, entra a **Settings** ⚙️ (pestaña de arriba).
2. En el menú izquierdo, busca **Pages** (en la sección *Code and automation*).
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. En **Branch**, selecciona **`main`** y la carpeta **`/ (root)`**.
5. Haz clic en **Save**.
6. Espera de 1 a 3 minutos y recarga la página. Arriba aparecerá:
   **"Your site is live at `https://tu-usuario.github.io/shopmaster/`"**
7. Haz clic en **Visit site**. 🎉

### 6.5 Actualizar el sitio
Edita los archivos en tu computador → en GitHub ve a **Add file → Upload files** → arrastra los archivos modificados (los reemplaza) → **Commit changes**. En 1 o 2 minutos verás los cambios publicados.

> 💡 Puedes ver el avance en la pestaña **Actions**: un círculo amarillo 🟡 significa que se está publicando y un check verde ✅ que ya terminó.

---

## 7. Publicar en Vercel (enlazado con GitHub)

**Vercel** es una plataforma de *hosting* muy rápida, con plan gratuito (**Hobby**). Ventaja principal: cada vez que subas cambios a GitHub, **Vercel publica la nueva versión automáticamente**.

### 7.1 Crear la cuenta y vincularla con GitHub
1. Entra a **https://vercel.com** → **Sign Up**.
2. Elige el plan **Hobby** (personal y gratis) y escribe tu nombre.
3. Haz clic en **Continue with GitHub**.
4. GitHub te pedirá permiso: haz clic en **Authorize Vercel**.
5. Listo: tu cuenta de Vercel ya está enlazada con GitHub.

### 7.2 Importar el proyecto
1. En el panel de Vercel haz clic en **Add New… → Project**.
2. En **Import Git Repository** aparecerán tus repositorios. Si no ves `shopmaster`:
   - Haz clic en **Install** o en **"Adjust GitHub App Permissions"**.
   - Elige **Only select repositories**, marca `shopmaster` y guarda con **Install / Save**.
3. Junto a `shopmaster`, haz clic en **Import**.
4. En la pantalla **Configure Project**:
   - **Project Name:** `shopmaster` (formará la dirección `shopmaster.vercel.app` o una parecida si ya existe).
   - **Framework Preset:** **Other** (es HTML/CSS/JS puro).
   - **Root Directory:** `./` (déjalo así).
   - **Build and Output Settings:** no cambies nada. No hace falta compilar.
5. Haz clic en **Deploy**.
6. En unos segundos verás **"Congratulations!"** 🎉 con una vista previa del sitio. Haz clic en ella o en **Continue to Dashboard**.
7. Tu dirección aparece en **Domains**, por ejemplo `https://shopmaster-tu-usuario.vercel.app`.

### 7.3 ¿Público o privado?
| Caso | Qué hacer |
|---|---|
| **Repositorio público** | Funciona igual que en GitHub Pages. Cualquiera puede ver tu código y tu sitio. |
| **Repositorio privado** | Al crearlo en GitHub elige **Private**. Vercel sí puede publicarlo (GitHub Pages gratis no). **El código queda oculto**, pero el sitio se puede visitar con el enlace. |
| **Ocultar también el sitio** | En Vercel: **Settings → Deployment Protection → Vercel Authentication**. Con esto, solo las personas con acceso a tu cuenta o equipo pueden ver las versiones protegidas. En el plan gratis protege principalmente las versiones de prueba (*previews*). Para proteger el dominio principal con contraseña se necesita un plan de pago. |

### 7.4 Actualizaciones automáticas
Cada vez que subas archivos a GitHub (**Upload files → Commit changes**), Vercel lo detecta y publica la nueva versión sola. Puedes ver el historial en la pestaña **Deployments** de tu proyecto.

---

## 8. Ver y compartir tu proyecto

| Plataforma | Tu dirección | Cómo compartir |
|---|---|---|
| **GitHub Pages** | `https://tu-usuario.github.io/shopmaster/` | Copia la URL de **Settings → Pages**. |
| **Vercel** | `https://shopmaster.vercel.app` (o similar) | Copia la URL en **Domains** del panel del proyecto. |
| **Código fuente** | `https://github.com/tu-usuario/shopmaster` | Útil para portafolios y hojas de vida. |

**Ideas para compartir:**
- 📱 Abre el enlace en tu celular para comprobar que el diseño responsivo funciona.
- 💬 Envíalo por WhatsApp, LinkedIn o correo. Funciona en cualquier dispositivo, sin instalar nada.
- 🔳 Genera un **código QR** del enlace (por ejemplo en qr-code-generator.com) para presentaciones o tarjetas.
- 🧑‍💼 Agrégalo a tu **portafolio** con una captura de pantalla y una breve descripción.

---

## 9. Problemas frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| La página se ve sin estilos | `style.css` mal nombrado o en otra carpeta | Revisa que se llame exactamente `style.css` y esté junto a `index.html`. |
| El banner aparece oscuro, sin foto | Falta la carpeta `img` o se llama distinto | Debe existir `img/hero.jpg` junto a `index.html` (en GitHub también). Los nombres distinguen mayúsculas y minúsculas. |
| No aparecen productos | Sin internet o la API no responde | Revisa tu conexión y usa el botón **Reintentar**. Mira la consola (`F12`). |
| GitHub Pages muestra error 404 | `index.html` está en una subcarpeta o el nombre no coincide | Debe estar en la raíz y llamarse `index.html` en minúsculas. Espera 2-3 minutos. |
| Los modales no abren | No cargó el JS de Bootstrap | Verifica el `<script>` de `bootstrap.bundle.min.js` antes de `script.js`. |
| No se descarga el PDF | No cargó jsPDF o el navegador bloqueó la descarga | Revisa tu conexión, usa el botón **Descargar ticket** y permite descargas para el sitio. |
| La tarjeta aparece "no válida" | No pasa el algoritmo de Luhn | Usa la tarjeta de prueba `4242 4242 4242 4242`. |

---

### 💡 Siguientes pasos para emprender
- Cambia `API_URL` por tus propios productos (un archivo `productos.json` o una API propia).
- Edita el objeto `STORE` en `script.js` con los datos de tu negocio.
- Cambia el ticket a 58 mm con `TICKET.width = 58` y `TICKET.cols = 28`.
- Integra una pasarela real (Stripe, PayPal, Mercado Pago) usando sus SDK oficiales.

**La IA no reemplaza al desarrollador… pero te abre la puerta al comercio digital. 🚀**
