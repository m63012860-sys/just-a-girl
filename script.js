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
        div.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner.image}')`;
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
                    <input type="radio" name="selectedSize" value="${sizeKey}" data-price="${sizeData.price}" data-old="${sizeData.oldPrice || 0}" ${count === 0 ? 'checked' : ''} onchange="updateModalPrice(this)">
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
            <div style="font-size: 16px; margin-bottom: 8px;">${stars}</div>
            ${rev.comment ? `<p style="font-style: italic; color: #444; margin-bottom: 10px; white-space: pre-wrap;">"${escapeCommunityText(rev.comment)}"</p>` : ''}
            ${hasImage ? `<img src="${rev.image}" alt="رأي عميلة" onclick="openReviewImage(${rev.id})" style="width: 100%; border-radius: 6px; border: 1px solid #eee; margin-bottom: 10px; cursor: zoom-in;">` : ''}
            <strong style="color: var(--burgundy);">- ${escapeCommunityText(rev.name)}</strong>
        `;
        grid.appendChild(card);
    });
}

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

function previewReviewImage(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        pendingReviewImage = e.target.result;
        const preview = document.getElementById('reviewImagePreview');
        if (preview) preview.innerHTML = `<img src="${pendingReviewImage}" style="max-width:220px;max-height:260px;border-radius:6px;border:1px solid #ddd;">`;
        const removeBtn = document.getElementById('removeReviewImageBtn');
        if (removeBtn) removeBtn.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
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

function addReview() {
    if (!ownerSession) { alert('إضافة الآراء متاحة للإدارة فقط.'); return; }
    const name = document.getElementById('reviewCustomerName').value.trim();
    const comment = document.getElementById('reviewMessageText').value.trim();
    const rating = parseInt(document.getElementById('reviewStars').value, 10) || 5;

    if (!name) { alert('الرجاء كتابة اسم العميلة.'); return; }
    customerReviews.unshift({ id: Date.now(), name, comment, rating, image: pendingReviewImage });
    saveReviews();
    document.getElementById('reviewCustomerName').value = '';
    document.getElementById('reviewMessageText').value = '';
    clearReviewImage();
    renderReviews();
}

function deleteReview(id) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا الرأي؟')) return;
    customerReviews = customerReviews.filter(r => r.id !== id);
    saveReviews();
    renderReviews();
}

function updateOwnerUI() {
    const form = document.getElementById('ownerReviewForm');
    if (form) form.style.display = ownerSession ? 'block' : 'none';
    renderReviews();
}

function logoutOwner() {
    ownerSession = false;
    closeAdminModal();
    updateOwnerUI();
    alert('تم تسجيل الخروج من وضع الإدارة.');
}

// --- مجتمع العملاء ---
function renderCommunityChat() {
    const chatBox = document.getElementById('chatMessages');
    if (!chatBox) return;
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
                        <button onclick="deleteReply(${msg.id}, ${rIdx})" style="position:absolute;top:5px;left:5px;background:none;border:none;color:#cc0000;font-size:11px;cursor:pointer;" title="حذف الرد"><i class="fa-solid fa-trash"></i> حذف</button>
                    </div>`;
            });
        }

        msgDiv.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
                <div style="display:flex;align-items:center;flex-wrap:wrap;"><strong>${escapeCommunityText(msg.sender)}</strong>${ownerBadge}</div>
                <button onclick="deleteMessage(${msg.id})" style="background:none;border:none;color:#cc0000;font-size:12px;cursor:pointer;white-space:nowrap;" title="حذف التعليق"><i class="fa-solid fa-trash"></i> حذف</button>
            </div>
            <div style="font-size:14px;color:#333;margin-bottom:8px;white-space:pre-wrap;">${escapeCommunityText(msg.text)}</div>
            <button onclick="setReplyTarget(${msg.id})" style="background:none;border:none;color:var(--burgundy);font-size:12px;cursor:pointer;font-weight:bold;"><i class="fa-solid fa-reply"></i> رد</button>
            ${repliesHtml}`;
        chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeCommunityText(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
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

function canDeleteCommunityItem(authorName) {
    if (ownerSession) return true;
    const enteredName = prompt('لحذف تعليقك، اكتبي نفس الاسم الذي استخدمتيه عند النشر أو رمز الإدارة:');
    if (enteredName === null) return false;
    const value = enteredName.trim();
    if (value && value === adminPin) return true;
    if (value && authorName && value.toLocaleLowerCase() === String(authorName).trim().toLocaleLowerCase()) return true;
    alert('لم يتم التحقق من الصلاحية.');
    return false;
}

function deleteMessage(id) {
    const message = communityMessages.find(item => item.id === id);
    if (!message) return;
    if (!canDeleteCommunityItem(message.sender)) return;
    if (confirm('هل أنتِ متأكدة من حذف هذا التعليق؟')) {
        communityMessages = communityMessages.filter(item => item.id !== id);
        localStorage.setItem('jag_community', JSON.stringify(communityMessages));
        renderCommunityChat();
    }
}

function deleteReply(msgId, replyIndex) {
    const parentMsg = communityMessages.find(item => item.id === msgId);
    const reply = parentMsg?.replies?.[replyIndex];
    if (!reply || !canDeleteCommunityItem(reply.sender)) return;
    if (confirm('هل أنتِ متأكدة من حذف هذا الرد؟')) {
        parentMsg.replies.splice(replyIndex, 1);
        localStorage.setItem('jag_community', JSON.stringify(communityMessages));
        renderCommunityChat();
    }
}

function sendCommunityMessage() {
    const nameInput = document.getElementById('chatSenderName');
    const textInput = document.getElementById('chatInputText');
    if (!nameInput || !textInput || !nameInput.value.trim() || !textInput.value.trim()) {
        alert('الرجاء إدخال الاسم ورسالتك.');
        return;
    }

    let enteredName = nameInput.value.trim();
    const text = textInput.value.trim();
    let isOwner = false;

    if (ownerSession || (adminPin && enteredName === adminPin)) {
        isOwner = true;
        enteredName = 'Just a Girl (المالك)';
    }

    if (replyingToId !== null) {
        const parentMsg = communityMessages.find(item => item.id === replyingToId);
        if (parentMsg) {
            if (!parentMsg.replies) parentMsg.replies = [];
            parentMsg.replies.push({ sender: enteredName, text, isOwner });
        }
        replyingToId = null;
        textInput.placeholder = 'اكتب رسالتك أو استفسارك هنا...';
    } else {
        communityMessages.push({
            id: Date.now(),
            sender: enteredName,
            text,
            isOwner,
            replies: []
        });
    }

    localStorage.setItem('jag_community', JSON.stringify(communityMessages));
    textInput.value = '';
    nameInput.value = '';
    renderCommunityChat();
}

function filterCategory(category) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => 
        p.titleAr.toLowerCase().includes(query) || 
        p.titleEn.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderProducts(filtered);
}

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
            div.innerHTML = `<div><strong>${item.titleAr}</strong> (مقاس: ${item.size})<br><small>${item.price} ج.م × ${item.qty}</small></div><button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>`;
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
    if (!name || !phone || !address) { alert('الرجاء إدخال جميع بيانات الشحن.'); return; }
    if (!legalChecked) { alert('يجب الموافقة على شروط البراند ودفع الديبوزيت للمتابعة.'); return; }
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let itemsText = cart.map(item => `• ${item.titleAr} (مقاس: ${item.size}) (كمية: ${item.qty}) - السعر: ${item.price * item.qty} ج.م`).join('\n');
    let message = `مرحباً Just a Girl! أريد تأكيد أوردر جديد:\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}\n\n🛒 المنتجات المطلوبة:\n${itemsText}\n\n💰 إجمالي المنتجات: ${total} ج.م\n⚠️ ملاحظة الديبوزيت: تم الإقرار بدفع 100 جنيه ديبوزيت تأكيد الأوردر للشحن عبر البريد المصري مع المعاينة.\n☑ أوافق على شروط البراند وعدم وجود وسيط.`;
    let orders = localStorage.getItem('jag_orders') || 0;
    orders++;
    localStorage.setItem('jag_orders', orders);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- لوحة التحكم والأمان وإدارة وتعديل المنتجات ---
function checkOwnerAccess() {
    if (ownerSession) { openAdminModal(); return; }
    if (Date.now() < pinLockedUntil) { alert('محاولات كتير غلط. حاولي تاني بعد دقيقة.'); return; }

    if (!adminPin) {
        const newPin = prompt('أول مرة: اختاري رقم سري لوحة الإدارة (6 خانات على الأقل):');
        if (newPin === null) return;
        if (newPin.trim().length < 6) { alert('الرقم السري قصير. اختاري 6 خانات على الأقل.'); return; }
        adminPin = newPin.trim();
        localStorage.setItem('jag_admin_pin', adminPin);
        ownerSession = true;
        updateOwnerUI();
        openAdminModal();
        return;
    }

    const inputPin = prompt("أدخلي رمز الأمان السري:");
    if (inputPin === null) return;

    if (inputPin === adminPin) {
        failedPinAttempts = 0;
        ownerSession = true;
        updateOwnerUI();
        openAdminModal();
    } else {
        failedPinAttempts++;
        if (failedPinAttempts >= 5) {
            failedPinAttempts = 0;
            pinLockedUntil = Date.now() + 60000;
            alert('محاولات كتير غلط. حاولي تاني بعد دقيقة.');
        } else {
            alert("رمز الأمان خطأ!");
        }
    }
}

let colorUploadsList = [];

function handleColorImagesSelection(event) {
    const files = event.target.files;
    const container = document.getElementById('colorInputsContainer');
    container.innerHTML = '';
    colorUploadsList = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            let imgData = e.target.result;
            colorUploadsList.push({ name: `لون ${i+1}`, image: imgData });
            
            let div = document.createElement('div');
            div.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";
            div.innerHTML = `
                <img src="${imgData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                <input type="text" id="colorName_${i}" placeholder="اكتب اسم اللون..." style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" value="لون ${i+1}">
            `;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
}

function addAdminPanelButton() {
    if (document.getElementById('adminPanelFloatBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'adminPanelFloatBtn';
    btn.innerHTML = "⚙️ لوحة التحكم للإدارة";
    btn.style.cssText = "position: fixed; bottom: 20px; left: 20px; background: var(--gold); color: var(--burgundy-dark); border: none; padding: 10px 15px; border-radius: 30px; font-weight: bold; cursor: pointer; z-index: 3000; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";
    btn.onclick = checkOwnerAccess;
    document.body.appendChild(btn);
}

// دالة الإضافة المفصلة والآمنة لتحديد مكان الخطأ بالضبط
async function addNewProductFromPanel() {
    const titleInput = document.getElementById('newProdTitle');
    const descInput = document.getElementById('newProdDesc');
    const categorySelect = document.getElementById('newProdCategory');
    const imageInput = document.getElementById('newProdImageFile');

    const title = titleInput ? titleInput.value.trim() : '';
    const category = categorySelect ? categorySelect.value : 'dresses';
    const description = descInput ? descInput.value.trim() : '';

    if (!title) {
        alert('❌ خطأ: يرجى كتابة اسم المنتج في الحقل المخصص.');
        if (titleInput) titleInput.focus();
        return;
    }

    let imageSrc = mainProductImageBase64;
    if (!imageSrc && imageInput && imageInput.files && imageInput.files[0]) {
        imageSrc = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => resolve("");
            reader.readAsDataURL(imageInput.files[0]);
        });
    }

    if (!imageSrc) {
        alert('❌ خطأ: لم يتم اختيار أو قراءة الصورة الرئيسية للمنتج.');
        return;
    }

    let sizes = {};
    let sizeKeys = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

    sizeKeys.forEach(key => {
        let input = document.getElementById(`size_${key}`);
        if (input && input.value.trim() !== '' && !isNaN(input.value) && parseFloat(input.value) > 0) {
            let price = parseFloat(input.value);
            sizes[key] = { price: price, oldPrice: 0, available: true };
        }
    });

    let hasAnySize = Object.keys(sizes).length > 0;
    if (!hasAnySize) {
        alert('❌ خطأ: يجب إدخال سعر واحد على الأقل لمقاس واحد.');
        return;
    }

    let newProduct = {
        id: Date.now(),
        titleAr: title,
        titleEn: title,
        category: category,
        hasDiscount: false,
        isSoldOut: false,
        image: imageSrc,
        description: description,
        colors: colorUploadsList.length > 0 ? colorUploadsList : [{ name: "افتراضي", image: imageSrc }],
        sizes: sizes
    };

    products.unshift(newProduct);
    try {
        localStorage.setItem('jag_products', JSON.stringify(products));
        alert('✅ تم إضافة المنتج بنجاح وتحديث المتجر!');
        closeAdminModal();
        renderProducts();
        
        // إعادة تعيين الحقول
        if(titleInput) titleInput.value = '';
        if(descInput) descInput.value = '';
        if(imageInput) imageInput.value = '';
        mainProductImageBase64 = "";
        colorUploadsList = [];
        const container = document.getElementById('colorInputsContainer');
        if(container) container.innerHTML = '';
        sizeKeys.forEach(k => {
            let inp = document.getElementById(`size_${k}`);
            if(inp) inp.value = '';
        });
    } catch(err) {
        alert('❌ حدث خطأ أثناء حفظ المنتج (ربما حجم الصور كبير جداً لمساحة المتصفح).');
    }
}
