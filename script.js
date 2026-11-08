```javascript
/* =========================================================================
   JUST A GIRL — Complete Store JavaScript (Local Storage Edition)
   ========================================================================= */
'use strict';

const WHATSAPP_NUMBER = '201283332160';

const STORAGE_KEYS = {
  products: 'jag_products',
  cart: 'jag_cart',
  reviews: 'jag_reviews',
  community: 'jag_community'
};

// غيّري بيانات الدخول محليًا. هذه حماية تجريبية وليست آمنة فعليًا.
const OWNER_EMAIL = 'owner@example.com';
const OWNER_PASSWORD = 'CHANGE_THIS_PASSWORD';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    titleAr: 'سوت ميلتون',
    titleEn: 'Milton Suit',
    category: 'sets',
    image: 'https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg',
    description: 'بيلبس لحد 95 كيلو 🫶 الخامة ميلتون لايت',
    outOfStock: false,
    colors: [
      {name:'بني',image:'https://i.postimg.cc/mgqbfLYq/IMG-20261107-131942-088.jpg'},
      {name:'برجندي',image:'https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg'},
      {name:'بيج',image:'https://i.postimg.cc/vmJH9YDJ/IMG-20261107-131936-134.jpg'},
      {name:'جرين',image:'https://i.postimg.cc/TYtd0qpc/IMG-20261107-131936-307.jpg'},
      {name:'بينك',image:'https://i.postimg.cc/K84ZHkMD/IMG-20261107-131936-360.jpg'}
    ],
    sizes: {
      '1y':{price:0,available:false}, '2y':{price:0,available:false},
      '3y':{price:0,available:false}, '4y':{price:0,available:false},
      '6y':{price:0,available:false}, '8y':{price:0,available:false},
      '10y':{price:0,available:false}, '12y':{price:0,available:false},
      XS:{price:0,available:false}, S:{price:0,available:false},
      M:{price:0,available:false}, L:{price:0,available:false},
      XL:{price:0,available:false}, '2XL':{price:0,available:false},
      '3XL':{price:0,available:false}, Free:{price:470,available:true}
    }
  },
  {
    id:'2',
    titleAr:'سويت شيرت كاجوال',
    titleEn:'College Sweatshirt',
    category:'blouses',
    image:'https://i.postimg.cc/dVqkx8PP/IMG-20261107-131821-682.jpg',
    description:'جينة صافي فائقة النعومة والجودة ❤️ المقاس فري سايز',
    outOfStock:false,
    colors:[
      {name:'بني',image:'https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg'},
      {name:'برجندي',image:'https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg'},
      {name:'أسود',image:'https://i.postimg.cc/ZnpB1HK1/IMG-20261107-131820-991.jpg'}
    ],
    sizes: {
      '1y':{price:0,available:false}, '2y':{price:0,available:false},
      '3y':{price:0,available:false}, '4y':{price:0,available:false},
      '6y':{price:0,available:false}, '8y':{price:0,available:false},
      '10y':{price:0,available:false}, '12y':{price:0,available:false},
      XS:{price:0,available:false}, S:{price:0,available:false},
      M:{price:0,available:false}, L:{price:0,available:false},
      XL:{price:0,available:false}, '2XL':{price:0,available:false},
      '3XL':{price:0,available:false}, Free:{price:440,available:true}
    }
  }
];

const HERO_BANNERS = [
  {image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',titleAr:'أناقة شتوية وصيفية متكاملة'},
  {image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',titleAr:'تشكيلة Just a Girl الجديدة'}
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Storage read error:', error);
    return fallback;
  }
}

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage error:', error);
    alert('تعذر الحفظ. قد تكون مساحة التخزين ممتلئة.');
    return false;
  }
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[ch]));
}

function safeImage(url) {
  const value = String(url || '').trim();
  return /^https?:\/\//i.test(value) ? value : '';
}

function normalizeProduct(p) {
  const colors = Array.isArray(p.colors) ? p.colors.map(c => ({
    name: String(c.name || ''),
    image: safeImage(c.image)
  })).filter(c => c.name && c.image) : [];
  const sizes = {};
  if (p.sizes && typeof p.sizes === 'object') {
    Object.entries(p.sizes).forEach(([size, data]) => {
      sizes[size] = {
        price: Math.max(0, Number(data?.price) || 0),
        available: Boolean(data?.available) && Number(data?.price) > 0
      };
    });
  }
  return {
    ...p,
    id: String(p.id ?? Date.now()),
    titleAr: String(p.titleAr || p.title || 'منتج جديد'),
    titleEn: String(p.titleEn || p.titleAr || ''),
    category: String(p.category || 'sets'),
    image: safeImage(p.image),
    description: String(p.description || ''),
    outOfStock: Boolean(p.outOfStock),
    colors,
    sizes
  };
}

let products = readJSON(STORAGE_KEYS.products, null);
if (!Array.isArray(products) || !products.length) {
  products = DEFAULT_PRODUCTS.map(p => ({...p}));
}
products = products.map(normalizeProduct);

let cart = readJSON(STORAGE_KEYS.cart, []);
if (!Array.isArray(cart)) cart = [];

let customerReviews = readJSON(STORAGE_KEYS.reviews, [
  {id:'review-1', name:'سارة محمد', comment:'الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!', rating:5}
]);

let communityMessages = readJSON(STORAGE_KEYS.community, [
  {id:'msg-1', sender:'نوران أحمد', text:'يا جماعة، هل مقاسات الهوديات مضبوطة بالظبط؟', isOwner:false, replies:[]},
  {id:'msg-2', sender:'Just a Girl', text:'أهلاً يا نوران! المقاسات مضبوطة حسب الجدول ✨', isOwner:true, replies:[]}
]);

let ownerSession = false;
let selectedSizeForCart = null;
let selectedPriceForCart = null;
let selectedColorForCart = '';
let selectedProductForCart = null;
let currentSlide = 0;
let sliderTimer = null;

document.addEventListener('DOMContentLoaded', initStore);

function injectStoreStyles() {
  if (document.getElementById('jag-polished-styles')) return;
  const style = document.createElement('style');
  style.id = 'jag-polished-styles';
  style.textContent = `
    :root{--jag-wine:#4A040D;--jag-wine2:#6b1724;--jag-gold:#D4AF37;--jag-cream:#fffaf5;--jag-line:#eadfda}
    .jag-detail-wrap{direction:rtl;text-align:right;color:#342326}
    .jag-detail-image-wrap{position:relative;background:var(--jag-cream);border:1px solid var(--jag-line);border-radius:18px;padding:12px;text-align:center}
    .jag-detail-image{width:100%;height:clamp(240px,48vw,430px);object-fit:contain;border-radius:12px}
    .jag-main-image-btn{margin-top:8px!important;background:#fff!important;color:var(--jag-wine)!important;border:1px solid var(--jag-gold)!important;border-radius:20px!important;padding:8px 14px!important}
    .jag-detail-title{color:var(--jag-wine);margin:16px 0 6px}
    .jag-detail-description{color:#716267;line-height:1.8}
    .jag-option-section{margin:18px 0}
    .jag-option-heading{display:block;color:var(--jag-wine);font-weight:700;margin-bottom:10px}
    .jag-color-list,.jag-size-list{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
    .jag-color-choice{width:58px;height:68px;padding:4px!important;border:2px solid transparent!important;border-radius:13px!important;background:#fff!important;display:flex;flex-direction:column;align-items:center;gap:3px;overflow:hidden}
    .jag-color-choice img{width:42px;height:42px;border-radius:50%;object-fit:cover;border:1px solid #e5d8d2}
    .jag-color-choice span{font-size:11px;color:#514047}
    .jag-color-choice.active{border-color:var(--jag-gold)!important;background:#fffaf0!important}
    .jag-size-choice{border:1px solid #dfd1cc!important;background:#fff!important;color:#4b3037!important;border-radius:10px!important;padding:10px 13px!important;min-width:74px}
    .jag-size-choice.active{background:var(--jag-wine)!important;color:#fff!important;border-color:var(--jag-gold)!important}
    .jag-current-price{font-size:22px;font-weight:800;color:var(--jag-wine);margin:12px 0}
    .jag-selection-notice{background:#fff8eb;border:1px solid #f0dfb1;padding:11px 13px;border-radius:12px;color:#604b23}
    .jag-primary-btn{background:var(--jag-wine)!important;color:#fff!important;border:1px solid var(--jag-gold)!important;border-radius:24px!important;padding:12px 22px!important}
    .jag-primary-btn:disabled{opacity:.45;cursor:not-allowed}
    .jag-review-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
    .review-card{background:#fff;border:1px solid var(--jag-line);border-radius:16px;padding:18px;box-shadow:0 5px 18px rgba(74,4,13,.05);text-align:right}
    .jag-review-stars{color:var(--jag-gold);letter-spacing:2px;font-size:18px}
    .jag-chat-message{background:#fff;border:1px solid var(--jag-line);border-radius:16px;padding:15px;margin:12px 0;text-align:right}
    .jag-chat-message.owner{background:#fff8f0;border:1px solid #e4c979}
    .jag-chat-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--jag-wine);font-weight:700}
    .jag-owner-badge{font-size:11px;background:#f5e6b7;color:#634b13;border:1px solid #d8b957;border-radius:20px;padding:3px 8px}
    .jag-chat-text{line-height:1.8;color:#44383b;white-space:pre-wrap;overflow-wrap:anywhere}
    .jag-chat-actions{display:flex;gap:8px;flex-wrap:wrap}
    .jag-chat-actions button,.jag-reply button{border:1px solid #e2d4ce;border-radius:18px;background:#fff;color:var(--jag-wine);padding:6px 12px}
    .jag-replies{margin:12px 18px 0 0;padding-right:12px;border-right:3px solid var(--jag-gold)}
    .jag-reply{background:#faf7f4;border-radius:12px;padding:10px;margin:8px 0}
    .jag-reply.owner{background:#fff8e8}
    .jag-reply-form{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
    .jag-reply-form input{min-width:0;flex:1 1 130px;padding:9px;border:1px solid var(--jag-line);border-radius:9px}
    .product-card{overflow:hidden;border-radius:16px}
    .product-img{width:100%;object-fit:cover}
  `;
  document.head.appendChild(style);
}

function initStore() {
  injectStoreStyles();
  initSlider();
  renderProducts(products);
  updateCartCount();
  renderReviews();
  renderCommunityChat();
  updateOwnerUI();
  ensureAdminButton();

  const search = document.getElementById('searchInput');
  if (search) search.addEventListener('input', filterProducts);

  document.addEventListener('click', event => {
    if (event.target === document.getElementById('productModal')) closeProductModal();
    if (event.target === document.getElementById('cartModal')) closeCartModal();
    if (event.target === document.getElementById('profileModal')) closeProfileModal();
  });
}

function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  slider.innerHTML = '';
  HERO_BANNERS.forEach((banner, index) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,.28)),url("${banner.image}")`;
    slide.innerHTML = `<div class="hero-content"><h2>${escapeHTML(banner.titleAr)}</h2><p>Just a Girl - Luxury Fashion</p></div>`;
    slider.appendChild(slide);
  });
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    const slides = slider.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4500);
}

function ensureAdminButton() {
  if (document.getElementById('floatingAdminBtn')) return;
  const button = document.createElement('button');
  button.id = 'floatingAdminBtn';
  button.type = 'button';
  button.textContent = '⚙️ دخول المالكة';
  button.style.cssText = 'position:fixed;bottom:18px;left:18px;z-index:999;background:#4A040D;color:#fff;border:1px solid #D4AF37;border-radius:25px;padding:11px 16px;cursor:pointer;font-weight:bold;';
  button.addEventListener('click', openProfileModal);
  document.body.appendChild(button);
}

function minProductPrice(product) {
  const prices = Object.values(product.sizes || {}).filter(s => s && s.available && Number(s.price) > 0).map(s => Number(s.price));
  return prices.length ? Math.min(...prices) : 0;
}

function renderProducts(itemsToRender = products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!itemsToRender.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#666">لا توجد منتجات في هذا القسم حالياً.</p>';
    return;
  }
  itemsToRender.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const price = minProductPrice(product);
    const adminButtons = ownerSession ? `
      <div style="display:flex;gap:6px;margin-top:10px">
        <button type="button" onclick="openEditProductModal('${escapeHTML(product.id)}')">تعديل</button>
        <button type="button" onclick="deleteProduct('${escapeHTML(product.id)}')">حذف</button>
        <button type="button" onclick="toggleOutOfStock('${escapeHTML(product.id)}')">${product.outOfStock ? 'إتاحة' : 'نفد'}</button>
      </div>` : '';
    card.innerHTML = `
      ${product.outOfStock ? '<span class="stock-badge">نفد</span>' : ''}
      <img class="product-img" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.titleAr)}" loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${escapeHTML(product.titleAr)}</h3>
        <p class="product-desc">${escapeHTML(product.description)}</p>
        <div class="price-box">${price ? `يبدأ من ${price} ج.م` : 'السعر حسب المقاس'}</div>
        <button type="button" onclick="openProductDetails('${escapeHTML(product.id)}')">عرض التفاصيل</button>
        ${adminButtons}
      </div>`;
    grid.appendChild(card);
  });
}

function filterCategory(category, clickedButton) {
  document.querySelectorAll('#categoryNav button').forEach(button => button.classList.remove('active'));
  if (clickedButton) clickedButton.classList.add('active');
  const title = document.getElementById('catalogTitle');
  if (category === 'all') {
    if (title) title.textContent = 'تجميعة المنتجات';
    renderProducts(products);
  } else {
    if (title && clickedButton) title.textContent = clickedButton.textContent.trim();
    renderProducts(products.filter(p => p.category === category));
  }
}

function filterProducts() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const query = input.value.trim().toLocaleLowerCase('ar');
  renderProducts(products.filter(p => `${p.titleAr} ${p.titleEn} ${p.description} ${p.category}`.toLocaleLowerCase('ar').includes(query)));
}

function openAddProductModal() {
  if (!ownerSession) return alert('تسجيل دخول المالكة مطلوب.');
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  if (!modal || !content) return alert('عناصر نافذة المنتجات غير موجودة في HTML.');
  content.innerHTML = productFormHTML();
  modal.style.display = 'flex';
}

function productFormHTML(product = null) {
  const editing = Boolean(product);
  const p = product || {titleAr:'',titleEn:'',category:'sets',image:'',description:'',outOfStock:false,colors:[],sizes:{Free:{price:0,available:false}}};
  const sizeRows = Object.entries(p.sizes || {}).map(([size, data]) => `
    <label style="display:flex;gap:6px;align-items:center;margin:5px 0">
      <input type="checkbox" class="size-available" data-size="${escapeHTML(size)}" ${data.available ? 'checked' : ''}>
      <span>${escapeHTML(size)}</span>
      <input type="number" min="0" class="size-price" data-size="${escapeHTML(size)}" value="${Number(data.price) || 0}" placeholder="السعر" style="width:95px">
    </label>`).join('');
  const colorsText = (p.colors || []).map(c => `${c.name}|${c.image}`).join('\n');
  return `
    <button type="button" onclick="closeProductModal()">×</button>
    <h2>${editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
    <label>اسم المنتج بالعربي</label><input id="jagTitleAr" value="${escapeHTML(p.titleAr)}">
    <label>اسم المنتج بالإنجليزي</label><input id="jagTitleEn" value="${escapeHTML(p.titleEn || '')}">
    <label>القسم</label>
    <select id="jagCategory">
      ${['hoodies','pants','kids','pajamas','sets','dresses','suits','jackets','bundles','offers','blouses'].map(c => `<option value="${c}" ${p.category === c ? 'selected' : ''}>${c}</option>`).join('')}
    </select>
    <label>رابط الصورة الرئيسية</label><input id="jagImage" value="${escapeHTML(p.image)}" placeholder="https://...">
    <label>الوصف</label><textarea id="jagDescription">${escapeHTML(p.description)}</textarea>
    <label>الألوان — كل سطر: الاسم|رابط الصورة</label><textarea id="jagColors" rows="4">${escapeHTML(colorsText)}</textarea>
    <label>المقاسات والأسعار</label><div>${sizeRows}</div>
    <label><input type="checkbox" id="jagOutOfStock" ${p.outOfStock ? 'checked' : ''}> المنتج غير متاح حالياً</label>
    <button type="button" onclick="${editing ? `saveEditedProduct('${escapeHTML(p.id)}')` : 'saveNewProduct()'}">حفظ المنتج</button>`;
}

function collectProductForm(existing = {}) {
  const titleAr = document.getElementById('jagTitleAr')?.value.trim();
  const image = safeImage(document.getElementById('jagImage')?.value);
  if (!titleAr) throw new Error('اكتبي اسم المنتج.');
  if (!image) throw new Error('أدخلي رابط صورة صحيح.');
  const sizes = {};
  document.querySelectorAll('.size-available').forEach(check => {
    const size = check.dataset.size;
    const priceInput = document.querySelector(`.size-price[data-size="${CSS.escape(size)}"]`);
    const price = Number(priceInput?.value || 0);
    sizes[size] = {available:check.checked && price > 0,price:price > 0 ? price : 0};
  });
  if (!Object.values(sizes).some(s => s.available)) throw new Error('حددي مقاساً واحداً على الأقل واكتبي سعره.');
  const colors = (document.getElementById('jagColors')?.value || '').split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [name, ...urlParts] = line.split('|');
    return {name:name.trim(),image:safeImage(urlParts.join('|').trim())};
  }).filter(c => c.name && c.image);
  return normalizeProduct({
    ...existing,
    id:existing.id || String(Date.now()),
    titleAr,
    titleEn:document.getElementById('jagTitleEn')?.value.trim() || titleAr,
    category:document.getElementById('jagCategory')?.value || 'sets',
    image,
    description:document.getElementById('jagDescription')?.value.trim() || '',
    colors,
    sizes,
    outOfStock:Boolean(document.getElementById('jagOutOfStock')?.checked)
  });
}

function saveNewProduct() {
  if (!ownerSession) return alert('غير مسموح.');
  try {
    const product = collectProductForm();
    products.unshift(product);
    if (!saveLocal(STORAGE_KEYS.products, products)) { products.shift(); return; }
    renderProducts(products);
    closeProductModal();
    alert('تم حفظ المنتج على هذا المتصفح فقط.');
  } catch (error) {
    alert(error.message || 'حدث خطأ أثناء إضافة المنتج.');
  }
}

function openEditProductModal(productId) {
  if (!ownerSession) return;
  const product = products.find(p => String(p.id) === String(productId));
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  if (!product || !modal || !content) return;
  content.innerHTML = productFormHTML(product);
  modal.style.display = 'flex';
}

function saveEditedProduct(productId) {
  if (!ownerSession) return;
  try {
    const index = products.findIndex(p => String(p.id) === String(productId));
    if (index < 0) throw new Error('المنتج غير موجود.');
    const previous = products[index];
    products[index] = collectProductForm(previous);
    if (!saveLocal(STORAGE_KEYS.products, products)) { products[index] = previous; return; }
    renderProducts(products);
    closeProductModal();
  } catch (error) {
    alert(error.message || 'تعذر حفظ التعديلات.');
  }
}

function deleteProduct(productId) {
  if (!ownerSession) return;
  if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return;
  const previous = products;
  products = products.filter(p => String(p.id) !== String(productId));
  if (!saveLocal(STORAGE_KEYS.products, products)) { products = previous; return; }
  renderProducts(products);
}

function toggleOutOfStock(productId) {
  if (!ownerSession) return;
  const product = products.find(p => String(p.id) === String(productId));
  if (!product) return;
  product.outOfStock = !product.outOfStock;
  if (!saveLocal(STORAGE_KEYS.products, products)) {
    product.outOfStock = !product.outOfStock;
    return;
  }
  renderProducts(products);
}
function openProductDetails(productId) {
  const product = products.find(p => String(p.id) === String(productId));
  const modal = document.getElementById('productModal');
  const content = document.getElementById('productModalContent');
  if (!product || !modal || !content) return;

  selectedProductForCart = product;
  selectedSizeForCart = null;
  selectedPriceForCart = null;
  selectedColorForCart = '';

  const availableSizes = Object.entries(product.sizes || {}).filter(([,v]) => v && v.available && Number(v.price) > 0);

  const sizeHTML = availableSizes.map(([size, data]) => `
    <button type="button" class="jag-size-choice" data-size="${escapeHTML(size)}" onclick="selectSizeForCart('${escapeHTML(size)}',${Number(data.price)})">
      ${escapeHTML(size)}
    </button>`).join('');

  const colorsHTML = (product.colors || []).map((color, index) => `
    <button type="button" class="jag-color-choice" data-color-index="${index}" onclick="selectProductColor(${index})" aria-label="${escapeHTML(color.name)}">
      <img src="${escapeHTML(color.image)}" alt="">
      <span>${escapeHTML(color.name)}</span>
    </button>`).join('');

  content.innerHTML = `
    <div class="jag-detail-wrap">
      <button type="button" onclick="closeProductModal()" aria-label="إغلاق">×</button>
      <div class="jag-detail-image-wrap">
        <img id="jagDetailImage" class="jag-detail-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(product.titleAr)}">
        <button type="button" class="jag-main-image-btn" onclick="resetProductMainImage()">↶ العودة للصورة الرئيسية</button>
      </div>
      <h2 class="jag-detail-title">${escapeHTML(product.titleAr)}</h2>
      <p class="jag-detail-description">${escapeHTML(product.description)}</p>
      ${colorsHTML ? `<div class="jag-option-section"><strong class="jag-option-heading">اختاري اللون</strong><div class="jag-color-list">${colorsHTML}</div></div>` : ''}
      <div class="jag-option-section">
        <strong class="jag-option-heading">اختاري المقاس</strong>
        <div class="jag-size-list">${sizeHTML || 'لا توجد مقاسات متاحة حالياً'}</div>
      </div>
      <div id="jagCurrentPrice" class="jag-current-price">السعر: اختاري المقاس</div>
      <p id="jagSelectionNotice" class="jag-selection-notice">اختاري اللون والمقاس قبل إضافة المنتج إلى السلة.</p>
      <button id="jagAddToCartBtn" type="button" class="jag-primary-btn" onclick="addToCart('${escapeHTML(product.id)}')" ${product.outOfStock || !availableSizes.length ? 'disabled' : ''}>
        ${product.outOfStock ? 'نفد المنتج' : 'إضافة إلى السلة 🛍️'}
      </button>
    </div>`;
  modal.style.display = 'flex';
  if (product.colors?.length) selectProductColor(0);
}

function selectSizeForCart(size, price) {
  selectedSizeForCart = String(size);
  selectedPriceForCart = Number(price);
  document.querySelectorAll('.jag-size-choice').forEach(btn => btn.classList.toggle('active', btn.dataset.size === selectedSizeForCart));
  const priceEl = document.getElementById('jagCurrentPrice');
  if (priceEl) priceEl.textContent = `السعر: ${selectedPriceForCart} ج.م`;
  updateProductSelectionNotice();
}

function selectProductColor(index) {
  if (!selectedProductForCart) return;
  const color = selectedProductForCart.colors?.[Number(index)];
  if (!color) return;
  selectedColorForCart = color.name;
  const img = document.getElementById('jagDetailImage');
  if (img && safeImage(color.image)) img.src = color.image;
  document.querySelectorAll('.jag-color-choice').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.colorIndex) === Number(index)));
  updateProductSelectionNotice();
}

function resetProductMainImage() {
  if (!selectedProductForCart) return;
  const img = document.getElementById('jagDetailImage');
  if (img) img.src = selectedProductForCart.image;
}

function updateProductSelectionNotice() {
  const notice = document.getElementById('jagSelectionNotice');
  if (!notice) return;
  const parts = [];
  if (selectedColorForCart) parts.push(`اللون: ${selectedColorForCart}`);
  if (selectedSizeForCart) parts.push(`المقاس: ${selectedSizeForCart}`);
  if (selectedPriceForCart) parts.push(`السعر: ${selectedPriceForCart} ج.م`);
  notice.textContent = parts.length ? parts.join(' — ') : 'اختاري اللون والمقاس قبل إضافة المنتج إلى السلة.';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
}

function addToCart(productId) {
  const product = products.find(p => String(p.id) === String(productId));
  if (!product || product.outOfStock) return alert('المنتج غير متاح حالياً.');
  if (!selectedSizeForCart || !selectedPriceForCart) return alert('اختاري المقاس أولاً.');
  if (product.colors?.length && !selectedColorForCart) return alert('اختاري اللون أولاً.');

  const existing = cart.find(item =>
    String(item.id) === String(productId) &&
    item.size === selectedSizeForCart &&
    item.color === selectedColorForCart
  );

  if (existing) existing.qty += 1;
  else cart.push({
    id:String(product.id),
    title:product.titleAr,
    price:selectedPriceForCart,
    qty:1,
    size:selectedSizeForCart,
    color:selectedColorForCart
  });

  if (!saveLocal(STORAGE_KEYS.cart, cart)) return;
  updateCartCount();
  closeProductModal();
  alert('تمت إضافة المنتج إلى السلة 🛍️');
}

function updateCartCount() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function openCartModal() {
  const modal = document.getElementById('cartModal');
  const list = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalPrice');
  if (!modal || !list) return;

  list.innerHTML = '';
  let total = 0;
  if (!cart.length) list.innerHTML = '<p>سلة التسوق فارغة حالياً.</p>';

  cart.forEach((item, index) => {
    const lineTotal = Number(item.price) * Number(item.qty);
    total += lineTotal;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;border-bottom:1px solid #eee;padding:10px 0';
    row.innerHTML = `
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <div>اللون: ${escapeHTML(item.color || '—')} | المقاس: ${escapeHTML(item.size)}</div>
        <small>${Number(item.price)} ج.م × ${Number(item.qty)}</small>
      </div>
      <div>
        <button type="button" onclick="changeCartQty(${index},-1)">−</button>
        <button type="button" onclick="changeCartQty(${index},1)">+</button>
        <button type="button" onclick="removeFromCart(${index})">حذف</button>
      </div>`;
    list.appendChild(row);
  });

  if (totalEl) totalEl.textContent = total;
  modal.style.display = 'flex';
}

function changeCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty = Number(cart[index].qty) + delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  if (!saveLocal(STORAGE_KEYS.cart, cart)) return;
  updateCartCount();
  openCartModal();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  if (!saveLocal(STORAGE_KEYS.cart, cart)) return;
  updateCartCount();
  openCartModal();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.style.display = 'none';
}

function sendToWhatsApp() {
  const name = document.getElementById('clientName')?.value.trim();
  const phone = document.getElementById('clientPhone')?.value.trim();
  const address = document.getElementById('clientAddress')?.value.trim();
  const legalCheck = document.getElementById('legalCheck')?.checked;

  if (!name || !phone || !address) return alert('اكتبي الاسم ورقم الهاتف والعنوان بالتفصيل.');
  if (!legalCheck) return alert('يرجى الموافقة على شروط الطلب أولاً.');
  if (!cart.length) return alert('سلة التسوق فارغة.');

  let total = 0;
  let message = `✨ طلب جديد من موقع Just a Girl ✨\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}\n\n🛍️ المنتجات:\n`;

  cart.forEach(item => {
    const line = Number(item.price) * Number(item.qty);
    total += line;
    message += `- ${item.title} | اللون: ${item.color || '—'} | المقاس: ${item.size} × ${item.qty} = ${line} ج.م\n`;
  });

  message += `\n💰 الإجمالي: ${total} ج.م\n`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}function renderCommunityChat() {
  const box = document.getElementById('communityChatBox');
  if (!box) return;
  box.innerHTML = '';

  if (!communityMessages.length) {
    box.innerHTML = '<p>لا توجد رسائل حالياً.</p>';
    return;
  }

  communityMessages.forEach(msg => {
    const item = document.createElement('article');
    item.className = `jag-chat-message ${msg.isOwner ? 'owner' : ''}`;

    const repliesHTML = (msg.replies || []).map(reply => `
      <div class="jag-reply ${reply.isOwner ? 'owner' : ''}">
        <div class="jag-chat-head">
          ${escapeHTML(reply.sender)}
          ${reply.isOwner ? '<span class="jag-owner-badge">👑 مالكة الموقع</span>' : ''}
        </div>
        <p class="jag-chat-text">${escapeHTML(reply.text)}</p>
        ${ownerSession ? `<button type="button" onclick="deleteCommunityReply('${escapeHTML(msg.id)}','${escapeHTML(reply.id)}')">حذف الرد</button>` : ''}
      </div>`).join('');

    item.innerHTML = `
      <div class="jag-chat-head">
        ${escapeHTML(msg.sender)}
        ${msg.isOwner ? '<span class="jag-owner-badge">👑 مالكة الموقع</span>' : ''}
      </div>
      <p class="jag-chat-text">${escapeHTML(msg.text)}</p>
      <div class="jag-chat-actions">
        ${ownerSession ? `<button type="button" onclick="deleteCommunityMessage('${escapeHTML(msg.id)}')">حذف الرسالة</button>` : ''}
        <button type="button" onclick="toggleReplyBox('${escapeHTML(msg.id)}')">💬 رد</button>
      </div>
      <div id="replyBox_${escapeHTML(msg.id)}" class="jag-reply-form" style="display:none">
        <input id="replyName_${escapeHTML(msg.id)}" placeholder="اسمك (اختياري)" maxlength="40">
        <input id="replyText_${escapeHTML(msg.id)}" placeholder="اكتبي ردك" maxlength="500">
        <button type="button" onclick="sendCommunityReply('${escapeHTML(msg.id)}')">إرسال الرد</button>
      </div>
      <div class="jag-replies">${repliesHTML}</div>`;

    box.appendChild(item);
  });
}

function sendCommunityMessage() {
  const input = document.getElementById('communityInput');
  const nameInput = document.getElementById('chatSenderName');

  if (!input || !input.value.trim()) return alert('اكتبي الرسالة أولاً.');

  const message = {
    id:String(Date.now()),
    sender:nameInput?.value.trim() || (ownerSession ? 'Just a Girl' : 'زائرة'),
    text:input.value.trim(),
    isOwner:ownerSession,
    replies:[]
  };

  communityMessages.push(message);

  if (!saveLocal(STORAGE_KEYS.community, communityMessages)) {
    communityMessages.pop();
    return;
  }

  input.value = '';
  renderCommunityChat();
}

function toggleReplyBox(messageId) {
  const box = document.getElementById(`replyBox_${messageId}`);
  if (box) box.style.display = box.style.display === 'none' ? 'flex' : 'none';
}

function sendCommunityReply(messageId) {
  const name = document.getElementById(`replyName_${messageId}`)?.value.trim();
  const input = document.getElementById(`replyText_${messageId}`);

  if (!input || !input.value.trim()) return alert('اكتبي الرد أولاً.');

  const msg = communityMessages.find(m => String(m.id) === String(messageId));
  if (!msg) return;

  msg.replies = Array.isArray(msg.replies) ? msg.replies : [];

  const reply = {
    id:String(Date.now()),
    sender:name || (ownerSession ? 'Just a Girl' : 'عميلة'),
    text:input.value.trim(),
    isOwner:ownerSession
  };

  msg.replies.push(reply);

  if (!saveLocal(STORAGE_KEYS.community, communityMessages)) {
    msg.replies.pop();
    return;
  }

  renderCommunityChat();
}

function deleteCommunityMessage(messageId) {
  if (!ownerSession) return;
  if (!confirm('حذف الرسالة وكل الردود عليها؟')) return;

  const previous = communityMessages;
  communityMessages = communityMessages.filter(m => String(m.id) !== String(messageId));

  if (!saveLocal(STORAGE_KEYS.community, communityMessages)) {
    communityMessages = previous;
    return;
  }

  renderCommunityChat();
}

function deleteCommunityReply(messageId, replyId) {
  if (!ownerSession) return;

  const msg = communityMessages.find(m => String(m.id) === String(messageId));
  if (!msg) return;

  const previous = [...(msg.replies || [])];
  msg.replies = (msg.replies || []).filter(r => String(r.id) !== String(replyId));

  if (!saveLocal(STORAGE_KEYS.community, communityMessages)) {
    msg.replies = previous;
    return;
  }

  renderCommunityChat();
}

function renderReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  container.classList.add('jag-review-grid');
  container.innerHTML = '';

  if (!customerReviews.length) {
    container.innerHTML = '<p>لا توجد تقييمات حتى الآن.</p>';
    return;
  }

  customerReviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'review-card';

    const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));

    card.innerHTML = `
      <div class="jag-review-stars" aria-label="التقييم ${rating} من 5">
        ${'★'.repeat(rating)}${'☆'.repeat(5-rating)}
      </div>
      <p>${escapeHTML(review.comment)}</p>
      <strong>${escapeHTML(review.name)}</strong>`;

    container.appendChild(card);
  });
}

function addCustomerReview() {
  const name = document.getElementById('reviewName')?.value.trim();
  const comment = document.getElementById('reviewComment')?.value.trim();
  const rating = Number(document.getElementById('reviewRating')?.value || 5);

  if (!name || !comment) return alert('اكتبي الاسم والتقييم.');

  const review = {
    id:String(Date.now()),
    name,
    comment,
    rating:Math.max(1, Math.min(5, rating))
  };

  customerReviews.unshift(review);

  if (!saveLocal(STORAGE_KEYS.reviews, customerReviews)) {
    customerReviews.shift();
    return;
  }

  renderReviews();

  const nameEl = document.getElementById('reviewName');
  const commentEl = document.getElementById('reviewComment');

  if (nameEl) nameEl.value = '';
  if (commentEl) commentEl.value = '';
}

function loginAdmin() {
  const email = document.getElementById('adminEmailInput')?.value.trim();
  const password = document.getElementById('adminPasswordInput')?.value;

  if (!email || !password) return alert('اكتبي البريد الإلكتروني وكلمة المرور.');

  if (email !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
    return alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
  }

  ownerSession = true;
  closeProfileModal();
  updateOwnerUI();
  renderProducts(products);
  renderCommunityChat();

  alert('تم تسجيل الدخول. تذكري أن هذا تسجيل تجريبي محلي وليس حماية آمنة.');
}

function logoutAdmin() {
  ownerSession = false;
  updateOwnerUI();
  renderProducts(products);
  renderCommunityChat();
  closeProfileModal();
}

function updateOwnerUI() {
  const panel = document.getElementById('adminPanelContainer');
  if (panel) panel.style.display = ownerSession ? 'block' : 'none';

  const button = document.getElementById('floatingAdminBtn');
  if (button) {
    button.textContent = ownerSession ? '⚙️ لوحة تحكم المالكة' : '⚙️ دخول المالكة';
  }
}

function openProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.style.display = 'flex';
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.style.display = 'none';
}

function openReviewsModal() {
  const el = document.getElementById('reviewsModal');
  if (el) el.style.display = 'flex';
}

function closeReviewsModal() {
  const el = document.getElementById('reviewsModal');
  if (el) el.style.display = 'none';
}

Object.assign(window, {
  filterCategory,
  filterProducts,
  openAddProductModal,
  saveNewProduct,
  openEditProductModal,
  saveEditedProduct,
  deleteProduct,
  toggleOutOfStock,
  openProductDetails,
  selectSizeForCart,
  selectProductColor,
  resetProductMainImage,
  closeProductModal,
  addToCart,
  updateCartCount,
  openCartModal,
  changeCartQty,
  removeFromCart,
  closeCartModal,
  sendToWhatsApp,
  sendCommunityMessage,
  toggleReplyBox,
  sendCommunityReply,
  deleteCommunityMessage,
  deleteCommunityReply,
  renderReviews,
  addCustomerReview,
  loginAdmin,
  logoutAdmin,
  updateOwnerUI,
  openProfileModal,
  closeProfileModal,
  openReviewsModal,
  closeReviewsModal
});
