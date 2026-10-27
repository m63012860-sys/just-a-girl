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
    overlay.onclick = () => overlay.remove();
    const img = document.createElement('img');
    img.src = rev.image;
    img.style.cssText = "max-width:100%;max-height:100%;border-radius:8px;";
    overlay.appendChild(img);
    document.body.appendChild(overlay);
}

// اختيار صورة وتصغيرها تلقائيًا قبل الحفظ
async function previewReviewImage(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة فقط.');
        input.value = '';
        return;
    }
    try {
        const raw = await fileToDataUrl(file);
        const attempts = [[1000, 0.78], [800, 0.7], [640, 0.6]];
        let result = '';
        for (const [side, quality] of attempts) {
            result = await resizeDataUrl(raw, side, quality);
            if (result.length <= MAX_DOC_CHARS - 20000) break;
        }
        if (result.length > MAX_DOC_CHARS) {
            alert('الصورة كبيرة جدًا حتى بعد التصغير. جربي صورة تانية.');
            input.value = '';
            return;
        }
        pendingReviewImage = result;
        const preview = document.getElementById('reviewImagePreview');
        if (preview) preview.innerHTML = `<img src="${pendingReviewImage}" style="max-width:220px;max-height:260px;border-radius:6px;border:1px solid #ddd;">`;
        const removeBtn = document.getElementById('removeReviewImageBtn');
        if (removeBtn) removeBtn.style.display = 'inline-block';
    } catch (e) {
        console.error(e);
        alert('تعذر قراءة الصورة، جربي صورة تانية.');
    }
}

function clearReviewImage() {
    pendingReviewImage = '';
    const input = document.getElementById('reviewImageInput');
    if (input) input.value = '';
    const preview = document.getElementById('reviewImagePreview');
    if (preview) preview.innerHTML = '';
    const removeBtn = document.getElementById('removeReviewImageBtn');
    if (removeBtn) removeBtn.style.display = 'none';
}

async function addReview() {
    if (!ownerSession) {
        alert('إضافة الآراء متاحة للإدارة فقط.');
        return;
    }
    const name = document.getElementById('reviewCustomerName').value.trim();
    const comment = document.getElementById('reviewMessageText').value.trim();
    const rating = parseInt(document.getElementById('reviewStars').value, 10) || 5;

    if (!name) {
        alert('الرجاء كتابة اسم العميلة.');
        return;
    }
    if (!comment && !pendingReviewImage) {
        alert('اكتبي رسالة أو ارفعي صورة على الأقل.');
        return;
    }

    try {
        const id = Date.now();
        await fbDb.collection('reviews').doc(String(id)).set({ id, name, comment, rating, image: pendingReviewImage });
        document.getElementById('reviewCustomerName').value = '';
        document.getElementById('reviewMessageText').value = '';
        document.getElementById('reviewStars').value = '5';
        clearReviewImage();
    } catch (e) {
        handleWriteError(e, 'تعذر نشر الرأي.');
    }
}

async function deleteReview(id) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا الرأي؟')) return;
    try {
        await fbDb.collection('reviews').doc(String(id)).delete();
    } catch (e) {
        handleWriteError(e, 'تعذر حذف الرأي.');
    }
}

// إظهار/إخفاء أدوات الإدارة حسب حالة تسجيل الدخول
function updateOwnerUI() {
    const form = document.getElementById('ownerReviewForm');
    if (form) form.style.display = ownerSession ? 'block' : 'none';
    const panelBtn = document.getElementById('adminPanelBtn');
    if (panelBtn) panelBtn.style.display = ownerSession ? 'block' : 'none';
    const loginLink = document.getElementById('adminLoginLink');
    if (loginLink) loginLink.style.display = ownerSession ? 'none' : 'inline';
    const logoutLink = document.getElementById('adminLogoutLink');
    if (logoutLink) logoutLink.style.display = ownerSession ? 'inline' : 'none';
    renderProducts();
    renderReviews();
    renderCommunityChat();
}

// =========================================================================
// 💬 مجتمع العملاء (الحذف للمالكة فقط)
// =========================================================================
function renderCommunityChat() {
    const chatBox = document.getElementById('chatMessages');
    if (!chatBox) return;
    const wasNearBottom = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 80;
    chatBox.innerHTML = '';

    communityMessages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `margin-bottom:15px;padding:12px;border-radius:6px;background:${msg.isOwner ? '#fff5f5' : '#ffffff'};border:1px solid ${msg.isOwner ? '#ffcccc' : '#eee'};position:relative;`;
        const ownerBadge = msg.isOwner ? `<span style="background:var(--burgundy);color:var(--gold);font-size:11px;padding:2px 6px;border-radius:4px;margin-right:8px;font-weight:bold;">👑 مالك الموقع</span>` : '';

        let repliesHtml = '';
        if (msg.replies && msg.replies.length > 0) {
            msg.replies.forEach((rep, rIdx) => {
                const repBadge = rep.isOwner ? `<span style="background:var(--burgundy);color:var(--gold);font-size:10px;padding:1px 5px;border-radius:3px;margin-right:5px;font-weight:bold;">👑 مالك</span>` : '';
                repliesHtml += `
                    <div style="margin-top:8px;margin-right:20px;padding:8px;background:#f9f9f9;border-right:3px solid var(--gold);border-radius:4px;font-size:13px;position:relative;">
                        <div style="display:flex;align-items:center;margin-bottom:2px;"><strong>${escapeCommunityText(rep.sender)}</strong>${repBadge}</div>
                        <div style="color:#444;white-space:pre-wrap;">${escapeCommunityText(rep.text)}</div>
                        ${ownerSession ? `<button onclick="deleteReply(${msg.id}, ${rIdx})" style="position:absolute;top:5px;left:5px;background:none;border:none;color:#cc0000;font-size:11px;cursor:pointer;" title="حذف الرد"><i class="fa-solid fa-trash"></i> حذف</button>` : ''}
                    </div>`;
            });
        }

        msgDiv.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
                <div style="display:flex;align-items:center;flex-wrap:wrap;"><strong>${escapeCommunityText(msg.sender)}</strong>${ownerBadge}</div>
                ${ownerSession ? `<button onclick="deleteMessage(${msg.id})" style="background:none;border:none;color:#cc0000;font-size:12px;cursor:pointer;white-space:nowrap;" title="حذف التعليق"><i class="fa-solid fa-trash"></i> حذف</button>` : ''}
            </div>
            <div style="font-size:14px;color:#333;margin-bottom:8px;white-space:pre-wrap;">${escapeCommunityText(msg.text)}</div>
            <button onclick="setReplyTarget(${msg.id})" style="background:none;border:none;color:var(--burgundy);font-size:12px;cursor:pointer;font-weight:bold;"><i class="fa-solid fa-reply"></i> رد</button>
            ${repliesHtml}`;
        chatBox.appendChild(msgDiv);
    });
    if (chatFirstRender || wasNearBottom) chatBox.scrollTop = chatBox.scrollHeight;
    if (communityMessages.length > 0) chatFirstRender = false;
}

function setReplyTarget(msgId) {
    replyingToId = msgId;
    const msg = communityMessages.find(item => item.id === msgId);
    const textInput = document.getElementById('chatInputText');
    if (textInput && msg) {
        textInput.placeholder = `الرد على (${msg.sender})...`;
        textInput.focus();
    }
}

async function deleteMessage(id) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا التعليق وكل الردود التابعة له؟')) return;
    try {
        await fbDb.collection('community').doc(String(id)).delete();
    } catch (e) {
        handleWriteError(e, 'تعذر حذف التعليق.');
    }
}

async function deleteReply(msgId, replyIndex) {
    if (!ownerSession) return;
    const parentMsg = communityMessages.find(item => item.id === msgId);
    if (!parentMsg || !parentMsg.replies || !parentMsg.replies[replyIndex]) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا الرد؟')) return;
    try {
        const newReplies = parentMsg.replies.filter((_, i) => i !== replyIndex);
        await fbDb.collection('community').doc(String(msgId)).update({ replies: newReplies });
    } catch (e) {
        handleWriteError(e, 'تعذر حذف الرد.');
    }
}

async function sendCommunityMessage() {
    const nameInput = document.getElementById('chatSenderName');
    const textInput = document.getElementById('chatInputText');
    if (!nameInput || !textInput || !nameInput.value.trim() || !textInput.value.trim()) {
        alert('الرجاء إدخال الاسم ورسالتك.');
        return;
    }
    if (Date.now() - lastChatSendAt < 3000) {
        alert('استني ثواني قبل إرسال رسالة تانية.');
        return;
    }

    let enteredName = nameInput.value.trim().slice(0, 60);
    const text = textInput.value.trim().slice(0, 1000);
    let isOwner = false;

    // صفة المالك بتتفعّل فقط لما الإدارة تكون مسجلة دخول فعليًا
    if (ownerSession) {
        isOwner = true;
        enteredName = 'Just a Girl (المالك)';
    }

    try {
        if (replyingToId !== null) {
            const parentMsg = communityMessages.find(item => item.id === replyingToId);
            if (!parentMsg) {
                alert('التعليق الذي تحاولين الرد عليه لم يعد موجودًا.');
                replyingToId = null;
                textInput.placeholder = 'اكتب رسالتك أو استفسارك هنا...';
                return;
            }
            await fbDb.collection('community').doc(String(replyingToId)).update({
                replies: firebase.firestore.FieldValue.arrayUnion({ sender: enteredName, text: text, isOwner: isOwner })
            });
            replyingToId = null;
            textInput.placeholder = 'اكتب رسالتك أو استفسارك هنا...';
        } else {
            const id = Date.now();
            await fbDb.collection('community').doc(String(id)).set({
                id: id,
                sender: enteredName,
                text: text,
                isOwner: isOwner,
                replies: []
            });
        }
        lastChatSendAt = Date.now();
        textInput.value = '';
        nameInput.value = '';
    } catch (e) {
        handleWriteError(e, 'تعذر إرسال الرسالة.');
    }
}

// =========================================================================
// 🔎 الفلترة والبحث
// =========================================================================
function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('#categoryNav button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick') === `filterCategory('${category}')`);
    });
    renderProducts();
}

function filterProducts() {
    renderProducts();
}

// =========================================================================
// 🛒 السلة والطلب
// =========================================================================
function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function openCartModal() {
    let modal = document.getElementById('cartModal');
    if(!modal) return;
    const list = document.getElementById('cartItemsList');
    if(!list) return;
    list.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#666;">السلة فارغة حالياً.</p>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `<div><strong>${escapeCommunityText(item.titleAr)}</strong> (مقاس: ${item.size})<br><small>${item.price} ج.م × ${item.qty}</small></div><button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>`;
            list.appendChild(div);
        });
    }
    const totalEl = document.getElementById('cartTotalPrice');
    if(totalEl) totalEl.innerText = total;
    modal.style.display = 'flex';
}

function closeCartModal() { 
    const modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none'; 
}

function removeFromCart(index) { 
    cart.splice(index, 1); 
    updateCartCount(); 
    openCartModal(); 
}

function openProfileModal() { 
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'flex'; 
}

function closeProfileModal() { 
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'none'; 
}

function sendToWhatsApp() {
    if (cart.length === 0) { alert('سلة التسوق فارغة!'); return; }
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const legalChecked = document.getElementById('legalCheck').checked;
    if (!name || !phone || !address) { alert('الرجاء إدخال جميع بيانات الشحن (الاسم، الهاتف، العنوان).'); return; }
    if (!legalChecked) { alert('يجب الموافقة على شروط البراند ودفع الـ 100 جنيه ديبوزيت للمتابعة.'); return; }
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let itemsText = cart.map(item => `• ${item.titleAr} (مقاس: ${item.size}) (كمية: ${item.qty}) - السعر: ${item.price * item.qty} ج.م`).join('\n');
    let message = `مرحباً Just a Girl! أريد تأكيد أوردر جديد:\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}\n\n🛒 المنتجات المطلوبة:\n${itemsText}\n\n💰 إجمالي المنتجات: ${total} ج.م\n⚠️ ملاحظة الديبوزيت: تم الإقرار بدفع 100 جنيه ديبوزيت تأكيد الأوردر للشحن عبر البريد المصري مع المعاينة.\n☑ أوافق على شروط البراند وعدم وجود وسيط.`;
    let orders = localStorage.getItem('jag_orders') || 0;
    orders++;
    localStorage.setItem('jag_orders', orders);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// =========================================================================
// 🔐 تسجيل دخول الإدارة (Firebase Authentication)
// =========================================================================
function openAdminLogin() {
    if (ownerSession) {
        openAdminModal();
        return;
    }
    const err = document.getElementById('adminLoginError');
    if (err) err.innerText = '';
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.style.display = 'flex';
}

function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.style.display = 'none';
}

async function adminLogin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errEl = document.getElementById('adminLoginError');
    if (!email || !password) {
        if (errEl) errEl.innerText = 'اكتبي الإيميل وكلمة المرور.';
        return;
    }
    if (errEl) errEl.innerText = 'جاري تسجيل الدخول...';
    try {
        await fbAuth.signInWithEmailAndPassword(email, password);
        document.getElementById('adminPassword').value = '';
        if (errEl) errEl.innerText = '';
        closeAdminLogin();
        openAdminModal();
    } catch (err) {
        const code = err && err.code;
        let msg = 'تعذر تسجيل الدخول. حاولي مرة أخرى.';
        if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-email') {
            msg = 'الإيميل أو كلمة المرور غير صحيحة.';
        } else if (code === 'auth/too-many-requests') {
            msg = 'محاولات كتير. جربي بعد شوية.';
        } else if (code === 'auth/network-request-failed') {
            msg = 'مشكلة في الاتصال بالإنترنت.';
        } else if (code === 'auth/operation-not-allowed') {
            msg = 'تسجيل الدخول بالإيميل غير مفعّل في Firebase.';
        }
        if (errEl) errEl.innerText = msg;
    }
}

async function adminLogout() {
    try {
        await fbAuth.signOut();
        closeAdminModal();
        alert('تم تسجيل الخروج من وضع الإدارة.');
    } catch (e) {
        console.error(e);
    }
}

// =========================================================================
// ⚙️ لوحة التحكم (بتظهر للمالكة بعد تسجيل الدخول بس)
// =========================================================================
let colorUploadsList = [];

async function handleColorImagesSelection(event) {
    let files = Array.from(event.target.files || []);
    const container = document.getElementById('colorInputsContainer');
    if (files.length > 20) {
        alert('الحد الأقصى 20 صورة، هيتم أخذ أول 20 صورة بس.');
        files = files.slice(0, 20);
    }
    container.innerHTML = '<p style="font-size:13px;color:#888;">جاري تجهيز الصور...</p>';
    colorUploadsList = [];

    for (let i = 0; i < files.length; i++) {
        try {
            const imgData = await compressImageFile(files[i], 700, 0.72);
            colorUploadsList.push({ name: `لون ${colorUploadsList.length + 1}`, image: imgData });
        } catch (e) {
            console.error(e);
        }
    }

    container.innerHTML = '';
    colorUploadsList.forEach((col, i) => {
        let div = document.createElement('div');
        div.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";
        div.innerHTML = `
            <img src="${col.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
            <input type="text" id="colorName_${i}" placeholder="اكتب اسم اللون (مثل: أبيض، أسود)..." style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" value="${col.name}">
        `;
        container.appendChild(div);
    });
}

function addAdminPanelButton() {
    const btn = document.createElement('button');
    btn.id = 'adminPanelBtn';
    btn.innerHTML = "⚙️ لوحة التحكم للإدارة";
    btn.style.cssText = "display: none; position: fixed; bottom: 20px; left: 20px; background: var(--gold); color: var(--burgundy-dark); border: none; padding: 10px 15px; border-radius: 30px; font-weight: bold; cursor: pointer; z-index: 3000; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";
    btn.onclick = openAdminModal;
    document.body.appendChild(btn);

    const modalHTML = `
        <div class="modal" id="adminModal">
            <div class="modal-content" style="max-width: 650px;">
                <span class="close-modal" onclick="closeAdminModal()">&times;</span>
                <h2 style="color: var(--burgundy); margin-bottom: 15px; text-align: center;">لوحة التحكم والإدارة</h2>
                <div style="text-align: center; margin-bottom: 12px;">
                    <button onclick="adminLogout()" style="background: none; border: 1px solid var(--burgundy); color: var(--burgundy); padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-right-from-bracket"></i> تسجيل خروج من وضع الإدارة</button>
                </div>

                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                
                <h3 style="color: var(--burgundy); margin-bottom: 10px; text-align: center;">إضافة منتج جديد</h3>
                <div class="form-group"><label>اسم المنتج (مثل فستان، بلوفر):</label><input type="text" id="admTitleAr" placeholder="اسم المنتج"></div>
                <div class="form-group"><label>نبذة بسيطة (نوع القماش والوصف - سطرين):</label><textarea id="admDesc" rows="2" placeholder="نوع القماشة والوصف..."></textarea></div>
                
                <div style="background: var(--gray-light); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="color: var(--burgundy); margin-bottom: 10px;">المقاسات المتوفرة فقط (اترك المقاس غير المتوفر فارغاً أو 0):</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div><label>مقاس S (السعر):</label><input type="number" id="priceS" placeholder="السعر (لو متوفر)"></div>
                        <div><label>مقاس M (السعر):</label><input type="number" id="priceM" placeholder="السعر (لو متوفر)"></div>
                        <div><label>مقاس L (السعر):</label><input type="number" id="priceL" placeholder="السعر (لو متوفر)"></div>
                        <div><label>مقاس XL (السعر):</label><input type="number" id="priceXL" placeholder="السعر (لو متوفر)"></div>
                        <div><label>مقاس 2XL (السعر):</label><input type="number" id="price2XL" placeholder="السعر (لو متوفر)"></div>
                        <div><label>مقاس 3XL (السعر):</label><input type="number" id="price3XL" placeholder="السعر (لو متوفر)"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label>ارفع صور الألوان (اختر لغاية 20 صوره):</label>
                    <input type="file" id="admImageFiles" accept="image/*" multiple onchange="handleColorImagesSelection(event)">
                </div>
                <div id="colorInputsContainer" style="margin-bottom: 15px;"></div>

                <div class="form-group"><label>القسم:</label>
                    <select id="admCategory">
                        <option value="dresses">فساتين</option><option value="suits">بدل</option><option value="abayas">عبايات</option><option value="jackets">جواكت</option><option value="adults">كبار</option><option value="babies">بيبيز</option><option value="bundles">باكدج</option><option value="offers">عروض خاصة</option>
                    </select>
                </div>
                <button id="saveProductBtn" onclick="addNewProductFromAdmin()" style="background: var(--burgundy); color: white; border: none; width: 100%; padding: 12px; border-radius: 5px; font-weight: bold; cursor: pointer;">حفظ ونشر المنتج فوراً</button>
            </div>
        </div>
    `;
    const divModal = document.createElement('div');
    divModal.innerHTML = modalHTML;
    document.body.appendChild(divModal);
}

function openAdminModal() { 
    if (!ownerSession) return;
    const modal = document.getElementById('adminModal');
    if(modal) modal.style.display = 'flex'; 
}

function closeAdminModal() { 
    const modal = document.getElementById('adminModal');
    if(modal) modal.style.display = 'none'; 
}

async function addNewProductFromAdmin() {
    if (!ownerSession) {
        alert('إضافة المنتجات متاحة للإدارة فقط.');
        return;
    }
    const titleAr = document.getElementById('admTitleAr').value.trim();
    const description = document.getElementById('admDesc').value.trim();
    const category = document.getElementById('admCategory').value;

    if (!titleAr || colorUploadsList.length === 0) {
        alert('الرجاء إدخال اسم المنتج على الأقل ورفع صورة لون واحد على الأقل.');
        return;
    }

    colorUploadsList.forEach((col, idx) => {
        let nameInput = document.getElementById(`colorName_${idx}`);
        if(nameInput && nameInput.value.trim()) {
            col.name = nameInput.value.trim();
        }
    });

    let sizesObj = {};
    let sizesList = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    sizesList.forEach(sz => {
        let p = parseFloat(document.getElementById(`price${sz}`).value) || 0;
        if (p > 0) {
            sizesObj[sz] = { price: p, oldPrice: p + 200, available: true };
        }
    });

    if (Object.keys(sizesObj).length === 0) {
        alert('اكتبي سعر مقاس واحد على الأقل.');
        return;
    }
    if (colorUploadsList.some(c => c.image.length > MAX_DOC_CHARS)) {
        alert('إحدى الصور كبيرة جدًا. جربي صورة أصغر.');
        return;
    }

    const saveBtn = document.getElementById('saveProductBtn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.innerText = 'جاري الحفظ...'; }

    try {
        const id = Date.now();
        const thumbnail = await resizeDataUrl(colorUploadsList[0].image, 420, 0.7);
        const prodRef = fbDb.collection('products').doc(String(id));
        const batch = fbDb.batch();

        batch.set(prodRef, {
            id: id,
            titleAr: titleAr,
            titleEn: titleAr,
            category: category,
            hasDiscount: true,
            image: thumbnail,
            description: description,
            sizes: sizesObj,
            colorCount: colorUploadsList.length
        });
        colorUploadsList.forEach((col, i) => {
            batch.set(prodRef.collection('colors').doc(String(i)), { name: col.name, image: col.image, order: i });
        });
        await batch.commit();

        // تنظيف النموذج
        document.getElementById('admTitleAr').value = '';
        document.getElementById('admDesc').value = '';
        ['S', 'M', 'L', 'XL', '2XL', '3XL'].forEach(sz => { document.getElementById(`price${sz}`).value = ''; });
        document.getElementById('admImageFiles').value = '';
        document.getElementById('colorInputsContainer').innerHTML = '';
        colorUploadsList = [];

        closeAdminModal();
        alert('تم نشر المنتج بنجاح بكل مقاساته وألوانه، وهيظهر لكل الزوار!');
    } catch (e) {
        handleWriteError(e, 'تعذر حفظ المنتج.');
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerText = 'حفظ ونشر المنتج فوراً'; }
    }
}

// =========================================================================
// 🌐 اللغة
// =========================================================================
function toggleLang() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const langText = document.getElementById('langText');
    const catalogTitle = document.getElementById('catalogTitle');
    if(langText) langText.innerText = currentLang === 'ar' ? 'EN' : 'AR';
    if(catalogTitle) catalogTitle.innerText = currentLang === 'ar' ? 'تجميعة المنتجات' : 'Products Catalog';
    initSlider();
    renderProducts();
}

// =========================================================================
// 🔥 الربط مع Firebase (تحميل البيانات المشتركة لحظيًا)
// =========================================================================
function initFirebase() {
    if (!window.fbDb || !window.fbAuth) {
        const grid = document.getElementById('productsGrid');
        if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">تعذر الاتصال بقاعدة البيانات. تأكدي من رفع ملف firebase-config.js.</p>`;
        return;
    }

    // حالة تسجيل دخول الإدارة
    fbAuth.onAuthStateChanged(user => {
        ownerSession = !!user;
        updateOwnerUI();
    });

    // المنتجات
    fbDb.collection('products').orderBy('id').onSnapshot(snap => {
        products = snap.docs.map(d => d.data());
        productsLoaded = true;
        renderProducts();
    }, err => {
        console.error(err);
        productsLoaded = true;
        const grid = document.getElementById('productsGrid');
        if (grid) grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">تعذر تحميل المنتجات. تأكدي من الاتصال بالإنترنت.</p>`;
    });

    // آراء العملاء
    fbDb.collection('reviews').orderBy('id', 'desc').onSnapshot(snap => {
        customerReviews = snap.docs.map(d => d.data());
        renderReviews();
    }, err => console.error(err));

    // مجتمع العملاء
    fbDb.collection('community').orderBy('id').onSnapshot(snap => {
        communityMessages = snap.docs.map(d => d.data());
        renderCommunityChat();
    }, err => console.error(err));
}

window.onload = function() {
    trackUserActivity();
    initSlider();
    renderProducts();
    renderReviews();
    renderCommunityChat();
    addAdminPanelButton();
    initFirebase();
};
