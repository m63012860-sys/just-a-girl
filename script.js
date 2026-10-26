// =========================================================================
// 🛠️ الكود الشامل والمصحح لمنع تعطل الأزرار
// =========================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYcjNMku4yc6ekL8ZaaXe8Bg6Linbi4Mo",
  authDomain: "just-a-girl-6313e.firebaseapp.com",
  projectId: "just-a-girl-6313e",
  storageBucket: "just-a-girl-6313e.firebasestorage.app",
  messagingSenderId: "571477381444",
  appId: "1:571477381444:web:0cbbcc2de547680728c711",
  measurementId: "G-PKZ9DPQ16R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

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

let products = [];
let customerReviews = JSON.parse(localStorage.getItem('jag_reviews')) || [
    { id: 1, name: "سارة محمد", comment: "الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!", rating: 5, image: "" }
];
let pendingReviewImage = "";

let communityMessages = JSON.parse(localStorage.getItem('jag_community')) || [
    { id: 1, sender: "نوران أحمد", text: "يا جماعة، هل مقاسات الفساتين مضبوطة بالظبط ولا واسعة؟", isOwner: false, replies: [] },
    { id: 2, sender: "Just a Girl (المالك)", text: "أهلاً يا نوران! المقاسات مضبوطة تماماً حسب جدول المقاسات لكل منتج ✨", isOwner: true, replies: [] }
];

let currentLang = 'ar';
let cart = JSON.parse(localStorage.getItem('just_girl_cart')) || [];
let replyingToId = null;

document.addEventListener('DOMContentLoaded', () => {
    try { trackUserActivity(); } catch(e) {}
    try { initSlider(); } catch(e) {}
    try { initProductsListener(); } catch(e) {}
    try { renderReviews(); } catch(e) {}
    try { renderCommunityChat(); } catch(e) {}
    try { updateCartCount(); } catch(e) {}
    try { addAdminPanelButton(); } catch(e) {}

    // ربط أزرار الإغلاق والعرض بشكل آمن
    const adminCloseBtn = document.querySelector('#adminModal .close-modal');
    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', closeAdminModal);
    }
});

function compressImage(base64Str, maxWidth, quality, callback) {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', quality));
    };
}

function initProductsListener() {
    onSnapshot(collection(db, "products"), (snapshot) => {
        products = [];
        snapshot.forEach((docSnap) => {
            products.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderProducts();
        renderAdminProductsList();
    }, (error) => {
        console.error("خطأ في جلب المنتجات: ", error);
    });
}

function trackUserActivity() {
    let visits = localStorage.getItem('jag_visits') || 0;
    visits++;
    localStorage.setItem('jag_visits', visits);
    if(document.getElementById('visitCountDisplay')) document.getElementById('visitCountDisplay').innerText = visits;
    if(document.getElementById('orderCountDisplay')) document.getElementById('orderCountDisplay').innerText = localStorage.getItem('jag_orders') || 0;
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
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-size: 18px;">لا توجد منتجات مطابقة حالياً.</p>`;
        return;
    }
    itemsToRender.forEach(product => {
        const title = currentLang === 'ar' ? (product.titleAr || product.name) : (product.titleEn || product.name);
        const desc = product.description || product.desc || '';
        const img = product.image || '';
        const isSoldOut = product.isSoldOut || false;
        
        let availableSizes = product.sizes ? Object.values(product.sizes).filter(s => s.available && s.price > 0) : [];
        let pricesArr = availableSizes.map(s => s.price);
        let minPrice = pricesArr.length > 0 ? Math.min(...pricesArr) : (product.price || 0);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.hasDiscount ? `<span class="discount-badge">خصم</span>` : ''}
            ${isSoldOut ? `<span class="soldout-badge" style="position: absolute; top: 10px; left: 10px; background: #222; color: #D4AF37; padding: 4px 10px; font-size: 12px; border-radius: 4px; font-weight: bold; z-index: 5;">نفذت الكمية</span>` : ''}
            <img src="${img}" alt="${title}" class="product-img" style="${isSoldOut ? 'filter: grayscale(80%);' : ''}">
            <div class="product-info">
                <div class="product-title">${title}</div>
                <div class="product-desc" style="font-size:12px; color:#666; margin-bottom:8px;">${desc}</div>
                <div class="price-box">
                    <span class="current-price">${isSoldOut ? 'نفذت الكمية' : (typeof minPrice === 'number' ? 'يبدأ من ' + minPrice + ' ج.م' : minPrice)}</span>
                </div>
                <button class="add-to-cart-btn" onclick="openProductDetails('${product.id}')" style="${isSoldOut ? 'background: #777; cursor: not-allowed;' : ''}">
                    ${currentLang === 'ar' ? 'عرض واختيار المقاس واللون' : 'View Details'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderAdminProductsList() {
    const adminListContainer = document.getElementById("adminProductsListContainer");
    if (!adminListContainer) return;
    adminListContainer.innerHTML = "";
    if (products.length === 0) {
        adminListContainer.innerHTML = "<p style='font-size:12px; color:#666; text-align:center;'>لا توجد منتجات في القاعدة.</p>";
        return;
    }
    products.forEach(product => {
        const title = product.titleAr || product.name || 'بدون اسم';
        adminListContainer.innerHTML += `
          <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px 12px; margin-bottom:6px; border-radius:4px; border:1px solid #ddd;">
            <span style="font-size:13px; font-weight:bold;">${title}</span>
            <button onclick="window.deleteProductFromStore('${product.id}')" style="background:none; border:none; color:#c00; cursor:pointer;"><i class="fa-solid fa-trash"></i> حذف</button>
          </div>
        `;
    });
}

window.openProductDetails = function(productId) {
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

    if (product.sizes) {
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
    }

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
                <h2 style="color: var(--burgundy); margin-bottom: 8px;">${product.titleAr || product.name}</h2>
                <p style="font-size: 13px; color: #666; margin-bottom: 12px; line-height: 1.5;">${product.description || product.desc || ''}</p>
                
                <div class="price-box" style="margin-bottom: 15px;">
                    <span id="modalCurrentPrice" class="current-price">${product.isSoldOut ? 'نفذت الكمية' : (firstAvailablePrice ? firstAvailablePrice + ' ج.م' : product.price)}</span>
                    <span id="modalOldPrice" class="old-price">${!product.isSoldOut && firstAvailableOldPrice > 0 ? firstAvailableOldPrice + ' ج.م' : ''}</span>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="font-weight: bold; color: var(--burgundy); display: block; margin-bottom: 5px;">المقاسات المتوفرة:</label>
                    <div>${product.isSoldOut ? '<span style="color:red; font-weight:bold;">عذراً، هذا المنتج نفذ تماماً حالياً.</span>' : (sizesHtml || '<span>متوفر بالسعر القياسي</span>')}</div>
                </div>

                ${!product.isSoldOut ? `<button class="add-to-cart-btn" onclick="addToCartWithOptions('${product.id}')">إضافة للسلة</button>` : `<button class="add-to-cart-btn" style="background:#777; cursor:not-allowed;" disabled>نفذت الكمية</button>`}
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

window.closeProductModal = function() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}

window.changeMainImage = function(imgUrl) {
    const mainImg = document.getElementById('modalMainImg');
    if(mainImg) mainImg.src = imgUrl;
}

window.updateModalPrice = function(radio) {
    let price = radio.getAttribute('data-price');
    let oldPrice = radio.getAttribute('data-old');
    const currPriceEl = document.getElementById('modalCurrentPrice');
    const oldPriceEl = document.getElementById('modalOldPrice');
    if(currPriceEl) currPriceEl.innerText = price + ' ج.م';
    if(oldPriceEl) oldPriceEl.innerText = oldPrice > 0 ? oldPrice + ' ج.م' : '';
}

window.addToCartWithOptions = function(productId) {
    const product = products.find(p => p.id === productId);
    if(!product || product.isSoldOut) { alert('عذراً، هذا المنتج نفذت كميته.'); return; }
    
    const selectedSizeRadio = document.querySelector('input[name="selectedSize"]:checked');
    let sizeKey = selectedSizeRadio ? selectedSizeRadio.value : 'قياسي';
    let price = selectedSizeRadio ? parseFloat(selectedSizeRadio.getAttribute('data-price')) : parseFloat(product.price || 0);
    let mainImg = document.getElementById('modalMainImg') ? document.getElementById('modalMainImg').src : product.image;

    let cartItemKey = `${productId}-${sizeKey}`;
    const existing = cart.find(item => item.cartKey === cartItemKey);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            cartKey: cartItemKey,
            id: product.id,
            titleAr: product.titleAr || product.name,
            titleEn: product.titleEn || product.name,
            price: price,
            size: sizeKey,
            image: mainImg,
            qty: 1
        });
    }
    saveCart();
    updateCartCount();
    closeProductModal();
    alert('تمت إضافة المنتج إلى السلة بنجاح!');
}

function saveCart() {
    localStorage.setItem('just_girl_cart', JSON.stringify(cart));
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

window.openReviewImage = function(id) {
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

window.previewReviewImage = function(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        compressImage(e.target.result, 400, 0.7, (compressed) => {
            pendingReviewImage = compressed;
            const preview = document.getElementById('reviewImagePreview');
            if (preview) preview.innerHTML = `<img src="${pendingReviewImage}" style="max-width:220px;max-height:260px;border-radius:6px;border:1px solid #ddd;">`;
            const removeBtn = document.getElementById('removeReviewImageBtn');
            if (removeBtn) removeBtn.style.display = 'inline-block';
        });
    };
    reader.readAsDataURL(file);
}

window.clearReviewImage = function() {
    pendingReviewImage = '';
    const input = document.getElementById('reviewImageInput');
    if (input) input.value = '';
    const preview = document.getElementById('reviewImagePreview');
    if (preview) preview.innerHTML = '';
    const removeBtn = document.getElementById('removeReviewImageBtn');
    if (removeBtn) removeBtn.style.display = 'none';
}

window.addReview = function() {
    if (!ownerSession) { alert('إضافة الآراء متاحة للإدارة فقط.'); return; }
    const name = document.getElementById('reviewCustomerName').value.trim();
    const comment = document.getElementById('reviewMessageText').value.trim();
    const rating = parseInt(document.getElementById('reviewStars').value, 10) || 5;

    if (!name) { alert('الرجاء كتابة اسم العميلة.'); return; }
    customerReviews.unshift({ id: Date.now(), name, comment, rating, image: pendingReviewImage });
    try { localStorage.setItem('jag_reviews', JSON.stringify(customerReviews)); } catch(e){}
    document.getElementById('reviewCustomerName').value = '';
    document.getElementById('reviewMessageText').value = '';
    clearReviewImage();
    renderReviews();
}

window.deleteReview = function(id) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا الرأي؟')) return;
    customerReviews = customerReviews.filter(r => r.id !== id);
    try { localStorage.setItem('jag_reviews', JSON.stringify(customerReviews)); } catch(e){}
    renderReviews();
}

function logoutOwner() {
    ownerSession = false;
    closeAdminModal();
    renderReviews();
    alert('تم تسجيل الخروج من وضع الإدارة.');
}

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

window.setReplyTarget = function(msgId) {
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

window.deleteMessage = function(id) {
    const message = communityMessages.find(item => item.id === id);
    if (!message) return;
    if (!canDeleteCommunityItem(message.sender)) return;
    if (confirm('هل أنتِ متأكدة من حذف هذا التعليق؟')) {
        communityMessages = communityMessages.filter(item => item.id !== id);
        try { localStorage.setItem('jag_community', JSON.stringify(communityMessages)); } catch(e){}
        renderCommunityChat();
    }
}

window.deleteReply = function(msgId, replyIndex) {
    const parentMsg = communityMessages.find(item => item.id === msgId);
    const reply = parentMsg?.replies?.[replyIndex];
    if (!reply || !canDeleteCommunityItem(reply.sender)) return;
    if (confirm('هل أنتِ متأكدة من حذف هذا الرد؟')) {
        parentMsg.replies.splice(replyIndex, 1);
        try { localStorage.setItem('jag_community', JSON.stringify(communityMessages)); } catch(e){}
        renderCommunityChat();
    }
}

window.sendCommunityMessage = function() {
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

    try { localStorage.setItem('jag_community', JSON.stringify(communityMessages)); } catch(e){}
    textInput.value = '';
    nameInput.value = '';
    renderCommunityChat();
}

window.filterCategory = function(category) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

window.filterProducts = function() {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(query)) || 
        (p.titleEn && p.titleEn.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query))
    );
    renderProducts(filtered);
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

window.openCartModal = function() {
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

window.closeCartModal = function() { 
    const modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none'; 
}

window.removeFromCart = function(index) { 
    cart.splice(index, 1); 
    saveCart();
    updateCartCount(); 
    openCartModal(); 
}

window.openProfileModal = function() { 
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'flex'; 
}

window.closeProfileModal = function() { 
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'none'; 
}

window.sendToWhatsApp = function() {
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
    try { localStorage.setItem('jag_orders', orders); } catch(e){}
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

function checkOwnerAccess() {
    if (ownerSession) { openAdminModal(); return; }
    if (Date.now() < pinLockedUntil) { alert('محاولات كتير غلط. حاولي تاني بعد دقيقة.'); return; }

    if (!adminPin) {
        const newPin = prompt('أول مرة: اختاري رقم سري لوحة الإدارة (6 خانات على الأقل):');
        if (newPin === null) return;
        if (newPin.trim().length < 6) { alert('الرقم السري قصير. اختاري 6 خانات على الأقل.'); return; }
        adminPin = newPin.trim();
        try { localStorage.setItem('jag_admin_pin', adminPin); } catch(e){}
        ownerSession = true;
        openAdminModal();
        return;
    }

    const inputPin = prompt("أدخلي رمز الأمان السري:");
    if (inputPin === null) return;

    if (inputPin === adminPin) {
        failedPinAttempts = 0;
        ownerSession = true;
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

window.handleColorImagesSelection = function(event) {
    const files = event.target.files;
    const container = document.getElementById('colorInputsContainer');
    if(!container) return;
    container.innerHTML = '';
    colorUploadsList = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImage(e.target.result, 400, 0.7, (compressedData) => {
                colorUploadsList.push({ name: `لون ${i+1}`, image: compressedData });
                
                let div = document.createElement('div');
                div.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";
                div.innerHTML = `
                    <img src="${compressedData}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <input type="text" id="colorName_${i}" placeholder="اكتب اسم اللون..." style="flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" value="لون ${i+1}">
                `;
                container.appendChild(div);
            });
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

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'flex';
        renderAdminProductsList();
    }
}

window.closeAdminModal = function() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
}

window.addNewProductFromPanel = async function() {
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
            reader.onload = (e) => {
                compressImage(e.target.result, 600, 0.7, (compressed) => resolve(compressed));
            };
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

    try {
        await addDoc(collection(db, "products"), {
            titleAr: title,
            titleEn: title,
            category: category,
            description: description,
            image: imageSrc,
            colors: colorUploadsList,
            sizes: sizes,
            isSoldOut: false,
            hasDiscount: false,
            createdAt: new Date()
        });

        alert('✅ تم إضافة المنتج بنجاح إلى قاعدة بيانات فايربيس!');
        
        if(titleInput) titleInput.value = '';
        if(descInput) descInput.value = '';
        mainProductImageBase64 = "";
        if(imageInput) imageInput.value = '';
        colorUploadsList = [];
        const colContainer = document.getElementById('colorInputsContainer');
        if(colContainer) colContainer.innerHTML = '';
        sizeKeys.forEach(key => {
            let input = document.getElementById(`size_${key}`);
            if(input) input.value = '';
        });

        closeAdminModal();
    } catch (e) {
        console.error("خطأ أثناء الإضافة لـ Firestore: ", e);
        alert('❌ حدث خطأ أثناء إضافة المنتج للقاعدة، يرجى التأكد من قواعد الأمان (Rules) في فايربيس.');
    }
};

window.deleteProductFromStore = async function(productId) {
    if (confirm("هل أنتِ متأكدة من حذف هذا المنتج نهائياً من المتجر؟")) {
        try {
            await deleteDoc(doc(db, "products", productId));
            alert("تم الحذف بنجاح!");
        } catch (e) {
            console.error("خطأ في الحذف من Firestore: ", e);
            alert("حدث خطأ أثناء محاولة الحذف.");
        }
    }
};
