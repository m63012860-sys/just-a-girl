// =========================================================================
// 🛠️ إعدادات البراند والأساسيات
// =========================================================================
const WHATSAPP_NUMBER = "201283332160"; 
let adminPin = localStorage.getItem('jag_admin_pin') || null;
let ownerSession = false; 
let failedPinAttempts = 0;
let pinLockedUntil = 0;
let mainProductImageBase64 = "";

const heroBanners = [
    { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200", titleAr: "أناقة شتوية وصيفية متكاملة", titleEn: "Complete Seasonal Elegance" },
    { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200", titleAr: "تشكيلة 'Just a Girl' الجديدة", titleEn: "The New 'Just a Girl' Collection" }
];

let products = JSON.parse(localStorage.getItem('jag_products')) || [
    { 
        id: 1, 
        titleAr: "فستان سهرة مخملي بورجوندي", 
        titleEn: "Burgundy Velvet Evening Dress", 
        category: "dresses", 
        hasDiscount: true, 
        isSoldOut: false,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        description: "فستان مخملي فخم، تلبيس مريح وخامة عالية الجودة.",
        colors: [
            { name: "بورجوندي", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500" },
            { name: "أسود", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500" }
        ],
        sizes: {
            "S": { price: 1200, oldPrice: 1500, available: true },
            "M": { price: 1250, oldPrice: 1500, available: true },
            "XL": { price: 1350, oldPrice: 1650, available: true }
        }
    }
];

let customerReviews = JSON.parse(localStorage.getItem('jag_reviews')) || [
    { id: 1, name: "سارة محمد", comment: "الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!", rating: 5, image: "" }
];
let pendingReviewImage = "";

let communityMessages = JSON.parse(localStorage.getItem('jag_community')) || [
    { id: 1, sender: "نوران أحمد", text: "يا جماعة، هل مقاسات الفساتين مضبوطة بالظبط ولا واسعة؟", isOwner: false, replies: [] },
    { id: 2, sender: "Just a Girl (المالك)", text: "أهلاً يا نوران! المقاسات مضبوطة تماماً حسب جدول المقاسات لكل منتج ✨", isOwner: true, replies: [] }
];

let currentLang = 'ar';
let cart = [];
let replyingToId = null;

window.addEventListener('storage', function(e) {
    if (e.key === 'jag_community') {
        communityMessages = JSON.parse(e.newValue) || [];
        renderCommunityChat();
    }
    if (e.key === 'jag_products') {
        products = JSON.parse(e.newValue) || [];
        renderProducts();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    trackUserActivity();
    initSlider();
    renderProducts();
    renderReviews();
    renderCommunityChat();
    updateCartCount();
    addAdminPanelButton();

    const mainImgInput = document.getElementById('newProdImageFile');
    if (mainImgInput) {
        mainImgInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    mainProductImageBase64 = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

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
        div.className = `hero-slide ${index === 0 ? 'active' : ''}`; div.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner.image}')`;
        div.innerHTML = `<div class="hero-content"><h2>${currentLang === 'ar' ? banner.titleAr : banner.titleEn}</h2><p>Just a Girl - Luxury Fashion</p></div>`;
        slider.appendChild(div);
    });
    let currentSlide = 0;
    setInterval(() => {
        const slides = document.querySelectorAll('.hero-slide');
        if(slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

function renderProducts(itemsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (itemsToRender.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-size: 18px;">لا توجد منتجات مطابقة للبحث.</p>`;
        return;
    }
    itemsToRender.forEach(product => {
        const title = currentLang === 'ar' ? product.titleAr : product.titleEn;
        let availableSizes = Object.values(product.sizes).filter(s => s.available && s.price > 0);
        let pricesArr = availableSizes.map(s => s.price);
        let minPrice = pricesArr.length > 0 ? Math.min(...pricesArr) : 0;
        let hasAnyDiscount = Object.values(product.sizes).some(s => s.oldPrice && s.oldPrice > s.price);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${hasAnyDiscount ? `<span class="discount-badge">خصم</span>` : ''}
            ${product.isSoldOut ? `<span class="soldout-badge" style="position: absolute; top: 10px; left: 10px; background: #222; color: #D4AF37; padding: 4px 10px; font-size: 12px; border-radius: 4px; font-weight: bold; z-index: 5;">نفذت الكمية</span>` : ''}
            <img src="${product.image}" alt="${title}" class="product-img" style="${product.isSoldOut ? 'filter: grayscale(80%);' : ''}">
            <div class="product-info">
                <div class="product-title">${title}</div>
                <div class="product-desc" style="font-size:12px; color:#666; margin-bottom:8px;">${product.description || ''}</div>
                <div class="price-box">
                    <span class="current-price">${product.isSoldOut ? 'نفذت الكمية' : 'يبدأ من ' + minPrice + ' ج.م'}</span>
                </div>
                <button class="add-to-cart-btn" onclick="openProductDetails(${product.id})" style="${product.isSoldOut ? 'background: #777; cursor: not-allowed;' : ''}">
                    ${currentLang === 'ar' ? 'عرض واختيار المقاس واللون' : 'View Details'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
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

    const content = document.getElementById('productModalContent');
    let sizesHtml = '';
    let firstAvailablePrice = 0;
    let firstAvailableOldPrice = 0;
    let count = 0;

    Object.keys(product.sizes).forEach((sizeKey) => {
        let sizeData = product.sizes[sizeKey];
        if (sizeData.available && sizeData.price > 0) {
            if(count === 0) { firstAvailablePrice = sizeData.price; firstAvailableOldPrice = sizeData.oldPrice; }
            sizesHtml += `
                <label style="display: inline-block; margin: 5px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer;">
                    <input type="radio" name="selectedSize" value="${sizeKey}" data-price="${sizeData.price}" data-old="${sizeData.oldPrice \vert{}\vert{} 0}" ${count === 0 ? 'checked' : ''} onchange="updateModalPrice(this)">
                    <strong>مقاس ${sizeKey}</strong> (${sizeData.price} ج.م)
                </label>
            `;
            count++;
        }
    });

    let colorsHtml = '';
    if(product.colors && product.colors.length > 0) {
        product.colors.forEach((col) => {
            colorsHtml += `
                <div style="text-align: center; cursor: pointer;" onclick="changeMainImage('${col.image}')">
                    <img src="${col.image}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 50%; border: 2px solid var(--burgundy);">
                    <div style="font-size: 11px; margin-top: 3px; font-weight: bold; color: var(--burgundy);">${col.name}</div>
                </div>
            `;
        });
    }

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 240px;">
                <img id="modalMainImg" src="${product.image}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                <div style="display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; padding-bottom: 5px;">
                    ${colorsHtml}
                </div>
            </div>
            <div style="flex: 1; min-width: 240px;">
                <h2 style="color: var(--burgundy); margin-bottom: 8px;">${product.titleAr}</h2>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.5;">${product.description || ''}</p>
                
                <div class="price-box" style="margin-bottom: 15px;">
                    <span id="modalCurrentPrice" class="current-price">${product.isSoldOut ? 'نفذت الكمية' : firstAvailablePrice + ' ج.م'}</span>
                    <span id="modalOldPrice" class="old-price">${!product.isSoldOut && firstAvailableOldPrice > 0 ? firstAvailableOldPrice + ' ج.م' : ''}</span>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="font-weight: bold; color: var(--burgundy); display: block; margin-bottom: 5px;">المقاسات المتوفرة:</label>
                    <div>${product.isSoldOut ? '<span style="color:red; font-weight:bold;">عذراً، هذا المنتج نفذ تماماً حالياً.</span>' : sizesHtml}</div>
                </div>

                ${!product.isSoldOut ? `<button class="add-to-cart-btn" onclick="addToCartWithOptions(${product.id})">إضافة للسلة</button>` : `<button class="add-to-cart-btn" style="background:#777; cursor:not-allowed;" disabled>نفذت الكمية</button>`}
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}

function changeMainImage(imgUrl) {
    const mainImg = document.getElementById('modalMainImg');
    if(mainImg) mainImg.src = imgUrl;
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
    if(product.isSoldOut) { alert('عذراً، هذا المنتج نفذت كميته.'); return; }
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

// --- آراء العملاء ---
function saveReviews() {
    try {
        localStorage.setItem('jag_reviews', JSON.stringify(customerReviews));
        return true;
    } catch (e) {
        alert('مساحة التخزين في المتصفح امتلأت.');
        return false;
    }
}

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
            <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>${rev.comment ? `<p style="font-style: italic; color: #444; margin-bottom: 10px; white-space: pre-wrap;">"${escapeCommunityText(rev.comment)}"</p>` : ''}
            ${hasImage ? `<img src="${rev.image}" alt="رأي عميلة" onclick="openReviewImage(${rev.id})" style="width: 100%; border-radius: 6px; border: 1px solid #eee; margin-bottom: 10px; cursor: zoom-in;">` : ''}
            <strong style
