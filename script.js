// =========================================================================
// 🛠️ إعدادات البراند والأساسيات
// =========================================================================
const WHATSAPP_NUMBER = "201283332160";

// بتبقى true لما المالكة تسجل دخول (Firebase Authentication)
let ownerSession = false;

const heroBanners = [
    { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200", titleAr: "أناقة شتوية وصيفية متكاملة", titleEn: "Complete Seasonal Elegance" },
    { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200", titleAr: "تشكيلة 'Just a Girl' الجديدة", titleEn: "The New 'Just a Girl' Collection" }
];

// البيانات دلوقتي بتتحمل من Firebase (مشتركة بين كل الزوار)
let products = [];
let productsLoaded = false;
let currentCategory = 'all';
let colorsCache = {};          // صور الألوان بتتحمل لما حد يفتح المنتج بس
let currentModalProductId = null;
let currentModalColors = [];

// كل رأي: { id, name, comment (اختياري), rating (رقم من 1 إلى 5), image (اختياري - Screenshot) }
let customerReviews = [];
let pendingReviewImage = ""; // الصورة اللي اتختارت ولسه ما اتنشرتش

// هيكل رسائل المجتمع يدعم الردود والحذف
let communityMessages = [];
let chatFirstRender = true;
let lastChatSendAt = 0;

let currentLang = 'ar';
let cart = [];
let replyingToId = null; // لتتبع التعليق المراد الرد عليه
let heroTimer = null;

// الحد الأقصى لحجم الصورة المحفوظة (Firebase بيسمح بحوالي 1MB للمستند الواحد)
const MAX_DOC_CHARS = 900000;

// =========================================================================
// 🔧 دوال مساعدة
// =========================================================================
function handleWriteError(e, fallbackMsg) {
    console.error(e);
    if (e && e.code === 'permission-denied') {
        alert('ليس لديك صلاحية لتنفيذ هذا الإجراء. تأكدي إنك مسجلة دخول بحساب الإدارة.');
    } else {
        alert(fallbackMsg + '\nتأكدي من الاتصال بالإنترنت وحاولي مرة أخرى.');
    }
}

// حماية النصوص التي يكتبها العملاء من تفسيرها كـ HTML
function escapeCommunityText(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// تصغير الصورة وضغطها (عشان تتخزن بحجم صغير وتتحمل بسرعة)
function resizeDataUrl(dataUrl, maxSide, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onerror = () => reject(new Error('تعذر قراءة الصورة'));
        img.onload = () => {
            const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}

async function compressImageFile(file, maxSide, quality) {
    const raw = await fileToDataUrl(file);
    return resizeDataUrl(raw, maxSide, quality);
}

// =========================================================================
// 👤 إحصائيات الزائر (محلية في متصفحه هو بس، وده مقصود)
// =========================================================================
function trackUserActivity() {
    let visits = localStorage.getItem('jag_visits') || 0;
    visits++;
    localStorage.setItem('jag_visits', visits);
    let orders = localStorage.getItem('jag_orders') || 0;
    if(document.getElementById('visitCountDisplay')) document.getElementById('visitCountDisplay').innerText = visits;
    if(document.getElementById('orderCountDisplay')) document.getElementById('orderCountDisplay').innerText = orders;
}

function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    slider.innerHTML = '';
    heroBanners.forEach((banner, index) => {
        const div = document.createElement('div');
        div.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner.image}')`;
        div.innerHTML = `<div class="hero-content"><h2>${currentLang === 'ar' ? banner.titleAr : banner.titleEn}</h2><p>Just a Girl - Luxury Fashion</p></div>`;
        slider.appendChild(div);
    });
    let currentSlide = 0;
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(() => {
        const slides = document.querySelectorAll('.hero-slide');
        if(slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

// =========================================================================
// 🛍️ المنتجات
// =========================================================================
function getFilteredProducts() {
    const input = document.getElementById('searchInput');
    const query = input ? input.value.trim().toLowerCase() : '';
    return products.filter(p => {
        const categoryOk = currentCategory === 'all' || p.category === currentCategory;
        const searchOk = !query ||
            (p.titleAr || '').toLowerCase().includes(query) ||
            (p.titleEn || '').toLowerCase().includes(query) ||
            (p.category || '').toLowerCase().includes(query);
        return categoryOk && searchOk;
    });
}

function renderProducts(itemsToRender) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const items = itemsToRender || getFilteredProducts();
    grid.innerHTML = '';

    if (!productsLoaded) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-size: 18px;">جاري تحميل المنتجات...</p>`;
        return;
    }
    if (items.length === 0) {
        const msg = products.length === 0 ? 'لا توجد منتجات حالياً.' : 'لا توجد منتجات مطابقة للبحث.';
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-size: 18px;">${msg}</p>`;
        return;
    }
    items.forEach(product => {
        const title = currentLang === 'ar' ? product.titleAr : product.titleEn;
        const sizes = product.sizes || {};
        let availableSizes = Object.values(sizes).filter(s => s.available && s.price > 0);
        let pricesArr = availableSizes.map(s => s.price);
        let minPrice = pricesArr.length > 0 ? Math.min(...pricesArr) : 0;
        let hasAnyDiscount = Object.values(sizes).some(s => s.oldPrice && s.oldPrice > s.price);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${hasAnyDiscount ? `<span class="discount-badge">خصم</span>` : ''}
            <img src="${product.image}" alt="${escapeCommunityText(title)}" class="product-img" loading="lazy">
            <div class="product-info">
                <div class="product-title">${escapeCommunityText(title)}</div>
                <div class="product-desc">${escapeCommunityText(product.description || '')}</div>
                <div class="price-box">
                    <span class="current-price">يبدأ من ${minPrice} ج.م</span>
                </div>
                <button class="view-details-btn" onclick="openProductDetails(${product.id})">
                    ${currentLang === 'ar' ? 'عرض واختيار المقاس واللون' : 'View Details'}
                </button>
                ${ownerSession ? `<button onclick="deleteProduct(${product.id})" style="display:block;width:100%;margin-top:8px;background:none;border:1px solid #cc0000;color:#cc0000;padding:6px;border-radius:5px;cursor:pointer;font-size:12px;"><i class="fa-solid fa-trash"></i> حذف المنتج (للإدارة)</button>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

async function deleteProduct(id) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج نهائيًا؟')) return;
    try {
        const ref = fbDb.collection('products').doc(String(id));
        const colorsSnap = await ref.collection('colors').get();
        const batch = fbDb.batch();
        colorsSnap.forEach(d => batch.delete(d.ref));
        batch.delete(ref);
        await batch.commit();
        delete colorsCache[id];
    } catch (e) {
        handleWriteError(e, 'تعذر حذف المنتج.');
    }
}

// صور الألوان بتتحمل لما حد يفتح المنتج (علشان الصفحة الرئيسية تفضل سريعة)
async function getProductColors(product) {
    if (colorsCache[product.id]) return colorsCache[product.id];
    const snap = await fbDb.collection('products').doc(String(product.id)).collection('colors').orderBy('order').get();
    let cols = snap.docs.map(d => d.data());
    if (cols.length === 0) cols = [{ name: '', image: product.image }];
    colorsCache[product.id] = cols;
    return cols;
}

function openProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content" id="productModalContent"></div>`;
        document.body.appendChild(modal);
    }

    currentModalProductId = productId;
    currentModalColors = [];

    const content = document.getElementById('productModalContent');
    let sizesHtml = '';
    let firstAvailablePrice = 0;
    let firstAvailableOldPrice = 0;
    let count = 0;

    Object.keys(product.sizes || {}).forEach((sizeKey) => {
        let sizeData = product.sizes[sizeKey];
        if (sizeData.available && sizeData.price > 0) {
            if(count === 0) { firstAvailablePrice = sizeData.price; firstAvailableOldPrice = sizeData.oldPrice; }
            sizesHtml += `
                <label style="display: inline-block; margin: 5px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="selectedSize" value="${sizeKey}" data-price="${sizeData.price}" data-old="${sizeData.oldPrice || 0}" ${count === 0 ? 'checked' : ''} onchange="updateModalPrice(this)">
                    <strong>مقاس ${sizeKey}</strong> (${sizeData.price} ج.م)
                </label>
            `;
            count++;
        }
    });

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 240px;">
                <img id="modalMainImg" src="${product.image}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                <div id="modalColors" style="display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; padding-bottom: 5px;">
                    <span style="font-size: 12px; color: #888;">جاري تحميل الألوان...</span>
                </div>
            </div>
            <div style="flex: 1; min-width: 240px;">
                <h2 style="color: var(--burgundy); margin-bottom: 8px;">${escapeCommunityText(product.titleAr)}</h2>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.5;">${escapeCommunityText(product.description || '')}</p>
                
                <div class="price-box" style="margin-bottom: 15px;">
                    <span id="modalCurrentPrice" class="current-price">${firstAvailablePrice} ج.م</span>
                    <span id="modalOldPrice" class="old-price">${firstAvailableOldPrice ? firstAvailableOldPrice + ' ج.م' : ''}</span>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="font-weight: bold; color: var(--burgundy); display: block; margin-bottom: 5px;">المقاسات المتوفرة:</label>
                    <div>${sizesHtml}</div>
                </div>

                <button class="add-to-cart-btn" onclick="addToCartWithOptions(${product.id})">
                    إضافة للسلة
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';

    getProductColors(product).then(cols => {
        if (currentModalProductId !== productId) return;
        currentModalColors = cols;
        const box = document.getElementById('modalColors');
        if (!box) return;
        const hasNames = cols.some(c => c.name);
        box.innerHTML = hasNames ? cols.map((col, i) => `
            <div style="text-align: center; cursor: pointer;" onclick="changeMainImageByIndex(${i})">
                <img src="${col.image}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 50%; border: 2px solid var(--burgundy);">
                <div style="font-size: 11px; margin-top: 3px; font-weight: bold; color: var(--burgundy);">${escapeCommunityText(col.name)}</div>
            </div>
        `).join('') : '';
        const mainImg = document.getElementById('modalMainImg');
        if (mainImg && cols[0] && cols[0].image) mainImg.src = cols[0].image;
    }).catch(err => {
        console.error(err);
        const box = document.getElementById('modalColors');
        if (box) box.innerHTML = '';
    });
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
    currentModalProductId = null;
}

function changeMainImage(imgUrl) {
    const mainImg = document.getElementById('modalMainImg');
    if(mainImg) mainImg.src = imgUrl;
}

function changeMainImageByIndex(index) {
    const col = currentModalColors[index];
    if (col) changeMainImage(col.image);
}

function updateModalPrice(radio) {
    let price = radio.getAttribute('data-price');
    let oldPrice = radio.getAttribute('data-old');
    const currPriceEl = document.getElementById('modalCurrentPrice');
    const oldPriceEl = document.getElementById('modalOldPrice');
    if(currPriceEl) currPriceEl.innerText = price + ' ج.م';
    if(oldPriceEl) oldPriceEl.innerText = oldPrice > 0 ? oldPrice + ' ج.م' : '';
}

function addToCartWithOptions(productId) {
    const product = products.find(p => p.id === productId);
    const selectedSizeRadio = document.querySelector('input[name="selectedSize"]:checked');
    
    if (!selectedSizeRadio) {
        alert('الرجاء اختيار المقاس المناسب أولاً.');
        return;
    }

    let sizeKey = selectedSizeRadio.value;
    let price = parseFloat(selectedSizeRadio.getAttribute('data-price'));
    let mainImg = document.getElementById('modalMainImg') ? document.getElementById('modalMainImg').src : product.image;

    let cartItemKey = `${productId}-${sizeKey}`;
    const existing = cart.find(item => item.cartKey === cartItemKey);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            cartKey: cartItemKey,
            id: product.id,
            titleAr: product.titleAr,
            titleEn: product.titleEn,
            price: price,
            size: sizeKey,
            image: mainImg,
            qty: 1
        });
    }
    updateCartCount();
    closeProductModal();
    alert('تمت إضافة المنتج إلى السلة بنجاح!');
}

// =========================================================================
// ⭐ آراء العملاء: رسالة و/أو Screenshot (الإضافة والحذف للمالكة فقط)
// =========================================================================
function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    customerReviews.forEach(rev => {
        const stars = typeof rev.rating === 'number' ? '⭐'.repeat(rev.rating) : (rev.rating || '');
        const hasImage = typeof rev.image === 'string' && rev.image.indexOf('data:image/') === 0;
        const card = document.createElement('div');
        card.style.cssText = "position: relative; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-top: 3px solid var(--gold);";
        card.innerHTML = `
            ${ownerSession ? `<button onclick="deleteReview(${rev.id})" style="position:absolute;top:8px;left:8px;background:none;border:none;color:#cc0000;font-size:12px;cursor:pointer;" title="حذف الرأي"><i class="fa-solid fa-trash"></i> حذف</button>` : ''}
            <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>
            ${rev.comment ? `<p style="font-style: italic; color: #444; margin-bottom: 10px; white-space: pre-wrap;">"${escapeCommunityText(rev.comment)}"</p>` : ''}
            ${hasImage ? `<img src="${rev.image}" alt="رأي عميلة" onclick="openReviewImage(${rev.id})" style="width: 100%; border-radius: 6px; border: 1px solid #eee; margin-bottom: 10px; cursor: zoom-in;">` : ''}
            <strong style="color: var(--burgundy);">- ${escapeCommunityText(rev.name)}</strong>
        `;
        grid.appendChild(card);
    });
}

// تكبير الـScreenshot عند الضغط عليه
function openReviewImage(id) {
    const rev = customerReviews.find(r => r.id === id);
    if (!rev || !rev.image) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:5000;cursor:zoom-out;padding:20px;";
    overlay.onclick =
