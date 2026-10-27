// =========================================================================
// 🛠️ إعدادات البراند والأساسيات
// =========================================================================
const WHATSAPP_NUMBER = "201283332160"; 
// لا يوجد رقم سري افتراضي: أول مرة تفتحي لوحة الإدارة هيطلب منك تحددي رقمك السري
let adminPin = localStorage.getItem('jag_admin_pin') || null;
let ownerSession = false;      // بتبقى true بعد إدخال الرقم السري الصحيح (لحد ما تقفلي الصفحة أو تسجلي خروج)
let failedPinAttempts = 0;
let pinLockedUntil = 0;

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

// كل رأي: { id, name, comment (اختياري), rating (رقم من 1 إلى 5), image (اختياري - Screenshot) }
let customerReviews = JSON.parse(localStorage.getItem('jag_reviews')) || [
    { id: 1, name: "سارة محمد", comment: "الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!", rating: 5, image: "" }
];
let pendingReviewImage = ""; // الصورة اللي اتختارت ولسه ما اتنشرتش

// هيكل رسائل المجتمع يدعم الردود والحذف
let communityMessages = JSON.parse(localStorage.getItem('jag_community')) || [
    { id: 1, sender: "نوران أحمد", text: "يا جماعة، هل مقاسات الفساتين مضبوطة بالظبط ولا واسعة؟", isOwner: false, replies: [] },
    { id: 2, sender: "Just a Girl (المالك)", text: "أهلاً يا نوران! المقاسات مضبوطة تماماً حسب جدول المقاسات لكل منتج ✨", isOwner: true, replies: [] }
];

let currentLang = 'ar';
let cart = [];
let replyingToId = null; // لتتبع التعليق المراد الرد عليه

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
            <img src="${product.image}" alt="${title}" class="product-img">
            <div class="product-info">
                <div class="product-title">${title}</div>
                <div class="product-desc">${product.description || ''}</div>
                <div class="price-box">
                    <span class="current-price">يبدأ من ${minPrice} ج.م</span>
                </div>
                <button class="view-details-btn" onclick="openProductDetails(${product.id})">
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

// --- آراء العملاء: رسالة و/أو Screenshot (الإضافة والحذف للمالكة فقط) ---
function saveReviews() {
    try {
        localStorage.setItem('jag_reviews', JSON.stringify(customerReviews));
        return true;
    } catch (e) {
        alert('مساحة التخزين في المتصفح امتلأت. جربي صورة أصغر أو احذفي بعض الآراء القديمة.');
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

// اختيار صورة وتصغيرها تلقائيًا قبل الحفظ (عشان مساحة المتصفح)
function previewReviewImage(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة فقط.');
        input.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const maxSide = 1400;
            const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            pendingReviewImage = canvas.toDataURL('image/jpeg', 0.82);

            const preview = document.getElementById('reviewImagePreview');
            if (preview) preview.innerHTML = `<img src="${pendingReviewImage}" style="max-width:220px;max-height:260px;border-radius:6px;border:1px solid #ddd;">`;
            const removeBtn = document.getElementById('removeReviewImageBtn');
            if (removeBtn) removeBtn.style.display = 'inline-block';
        };
        img.onerror = function() { alert('تعذر قراءة الصورة، جربي صورة تانية.'); };
        img.src = e.target.result;
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

    customerReviews.unshift({ id: Date.now(), name, comment, rating, image: pendingReviewImage });
    if (!saveReviews()) {
        customerReviews.shift();
        return;
    }

    document.getElementById('reviewCustomerName').value = '';
    document.getElementById('reviewMessageText').value = '';
    document.getElementById('reviewStars').value = '5';
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

// إظهار/إخفاء نموذج إضافة الآراء حسب حالة دخول الإدارة
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

// --- مجتمع العملاء: الردود وحذف تعليقك أو حذف المالك لأي تعليق ---
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

// حماية النصوص التي يكتبها العملاء من تفسيرها كـ HTML
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

// صاحب التعليق يستطيع حذفه بإثبات الاسم، والمالك يستطيع حذف أي تعليق برمز الإدارة
function canDeleteCommunityItem(authorName) {
    if (ownerSession) return true; // المالكة بعد تسجيل الدخول تحذف أي تعليق بدون سؤال
    const enteredName = prompt('لحذف تعليقك، اكتبي نفس الاسم الذي استخدمتيه عند النشر. إذا كنتِ مالكة الموقع، أدخلي رمز الإدارة لحذف أي تعليق:');
    if (enteredName === null) return false;
    const value = enteredName.trim();
    if (value && value === adminPin) return true;
    if (value && authorName && value.toLocaleLowerCase() === String(authorName).trim().toLocaleLowerCase()) return true;
    alert('لم يتم التحقق من الصلاحية. استخدمي اسم صاحب التعليق نفسه أو رمز الإدارة الصحيح.');
    return false;
}

function deleteMessage(id) {
    const message = communityMessages.find(item => item.id === id);
    if (!message) return;
    if (!canDeleteCommunityItem(message.sender)) return;
    if (confirm('هل أنتِ متأكدة من حذف هذا التعليق وكل الردود التابعة له؟')) {
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

    // لا تمنح صلاحية المالك لمجرد كتابة اسمه؛ يجب إدخال رمز الإدارة الصحيح
    if (ownerSession || (adminPin && enteredName === adminPin)) {
        isOwner = true;
        enteredName = 'Just a Girl (المالك)';
    }

    if (replyingToId !== null) {
        const parentMsg = communityMessages.find(item => item.id === replyingToId);
        if (!parentMsg) {
            alert('التعليق الذي تحاولين الرد عليه لم يعد موجودًا.');
            replyingToId = null;
            textInput.placeholder = 'اكتب رسالتك أو استفسارك هنا...';
            return;
        }
        if (!parentMsg.replies) parentMsg.replies = [];
        parentMsg.replies.push({ sender: enteredName, text, isOwner });
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

// --- لوحة التحكم والأمان ---
function checkOwnerAccess() {
    if (ownerSession) {
        openAdminModal();
        return;
    }

    if (Date.now() < pinLockedUntil) {
        alert('محاولات كتير غلط. حاولي تاني بعد دقيقة.');
        return;
    }

    // أول استخدام: تحديد رقم سري جديد (مفيش رقم افتراضي)
    if (!adminPin) {
        const newPin = prompt('أول مرة: اختاري رقم سري للوحة الإدارة (6 خانات على الأقل):');
        if (newPin === null) return;
        if (newPin.trim().length < 6) {
            alert('الرقم السري قصير. اختاري 6 خانات على الأقل.');
            return;
        }
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
                <input type="text" id="colorName_${i}" placeholder="اكتب اسم اللون (مثل: أبيض، أسود)..." style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" value="لون ${i+1}">
            `;
            container.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
}

function addAdminPanelButton() {
    const btn = document.createElement('button');
    btn.innerHTML = "⚙️ لوحة التحكم للإدارة";
    btn.style.cssText = "position: fixed; bottom: 20px; left: 20px; background: var(--gold); color: var(--burgundy-dark); border: none; padding: 10px 15px; border-radius: 30px; font-weight: bold; cursor: pointer; z-index: 3000; box-shadow: 0 4px 10px rgba(0,0,0,0.2);";
    btn.onclick = checkOwnerAccess;
    document.body.appendChild(btn);

    const modalHTML = `
        <div class="modal" id="adminModal">
            <div class="modal-content" style="max-width: 650px;">
                <span class="close-modal" onclick="closeAdminModal()">&times;</span>
                <h2 style="color: var(--burgundy); margin-bottom: 15px; text-align: center;">لوحة التحكم والإدارة</h2>
                <div style="text-align: center; margin-bottom: 12px;">
                    <button onclick="logoutOwner()" style="background: none; border: 1px solid var(--burgundy); color: var(--burgundy); padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px;"><i class="fa-solid fa-right-from-bracket"></i> تسجيل خروج من وضع الإدارة</button>
                </div>
                
                <div style="background: #fff3f3; padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #ffcccc;">
                    <h4 style="color: var(--burgundy); margin-bottom: 8px;">تغيير رمز الأمان (الباسورد):</h4>
                    <div class="form-group" style="margin-bottom: 8px;"><input type="password" id="oldPinInput" placeholder="الرقم السري القديم"></div>
                    <div class="form-group" style="margin-bottom: 8px;"><input type="password" id="newPinInput" placeholder="الرقم السري الجديد (6 خانات على الأقل)"></div>
                    <button onclick="changeAdminPin()" style="background: var(--burgundy); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 13px;">تحديث الرقم السري</button>
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
                <button onclick="addNewProductFromAdmin()" style="background: var(--burgundy); color: white; border: none; width: 100%; padding: 12px; border-radius: 5px; font-weight: bold; cursor: pointer;">حفظ ونشر المنتج فوراً</button>
            </div>
        </div>
    `;
    const divModal = document.createElement('div');
    divModal.innerHTML = modalHTML;
    document.body.appendChild(divModal);
}

function openAdminModal() { 
    const modal = document.getElementById('adminModal');
    if(modal) modal.style.display = 'flex'; 
}

function closeAdminModal() { 
    const modal = document.getElementById('adminModal');
    if(modal) modal.style.display = 'none'; 
}

function changeAdminPin() {
    let oldInput = document.getElementById('oldPinInput').value.trim();
    let newInput = document.getElementById('newPinInput').value.trim();

    if (oldInput !== adminPin) {
        alert("الرقم السري القديم غير صحيح!");
        return;
    }
    if (newInput.length < 6) {
        alert("الرقم السري الجديد قصير. استخدمي 6 خانات على الأقل.");
        return;
    }

    adminPin = newInput;
    localStorage.setItem('jag_admin_pin', adminPin);
    alert("تم تغيير الرقم السري بنجاح!");
    document.getElementById('oldPinInput').value = '';
    document.getElementById('newPinInput').value = '';
}

function addNewProductFromAdmin() {
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

    const newProd = {
        id: Date.now(),
        titleAr: titleAr,
        titleEn: titleAr,
        category: category,
        hasDiscount: true,
        image: colorUploadsList[0].image,
        description: description,
        colors: colorUploadsList,
        sizes: sizesObj
    };

    products.push(newProd);
    localStorage.setItem('jag_products', JSON.stringify(products));
    renderProducts();
    closeAdminModal();
    alert('تم نشر المنتج بنجاح بكل مقاساته وألوانه!');
}

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

window.onload = function() {
    trackUserActivity();
    initSlider();
    renderProducts();
    renderReviews();
    renderCommunityChat();
    addAdminPanelButton();
};
