// =========================================================================
// 🛠️ إعدادات البراند والأساسيات
// =========================================================================
const WHATSAPP_NUMBER = "201283332160"; 

let adminEmail = localStorage.getItem('jag_admin_email') || "m63012860@gmail.com";
let adminPass = localStorage.getItem('jag_admin_pass') || "123456";
let ownerSession = localStorage.getItem('jag_owner_session') === 'true';

const heroBanners = [
    { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200", titleAr: "أناقة شتوية وصيفية متكاملة", titleEn: "Complete Seasonal Elegance" },
    { image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200", titleAr: "تشكيلة 'Just a Girl' الجديدة", titleEn: "The New 'Just a Girl' Collection" }
];

let products = JSON.parse(localStorage.getItem('jag_products')) || [
    { 
        id: "1", 
        titleAr: "سوت ميلتون", 
        titleEn: "Milton Suit", 
        category: "sets", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg", 
        description: "بيلبس لحد 95 كيلو 🫶 أبعاد 💖 الخامة ميلتون لايت",
        outOfStock: false,
        colors: [
            { name: "بنى", image: "https://i.postimg.cc/mgqbfLYq/IMG-20261107-131942-088.jpg" },
            { name: "برجندي", image: "https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg" },
            { name: "بيج", image: "https://i.postimg.cc/vmJH9YDJ/IMG-20261107-131936-134.jpg" },
            { name: "جرين", image: "https://i.postimg.cc/TYtd0qpc/IMG-20261107-131936-307.jpg" },
            { name: "بينك", image: "https://i.postimg.cc/K84ZHkMD/IMG-20261107-131936-360.jpg" }
        ],
        sizes: { "Free": { price: 470, available: true } }
    },
    { 
        id: "2", 
        titleAr: "سويت شيرت كاجوال", 
        titleEn: "College Sweatshirt", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/dVqkx8PP/IMG-20261107-131821-682.jpg", 
        description: "جينة صافي فائقة النعومة والجودة ❤️❤️❤️ المقاس: فري سايز لحد 95 كيلو مرتاح جداً",
        outOfStock: false,
        colors: [
            { name: "برجندي", image: "https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg" },
            { name: "اسود", image: "https://i.postimg.cc/ZnpB1HK1/IMG-20261107-131820-991.jpg" }
        ],
        sizes: { "Free": { price: 440, available: true } } 
    },
    { 
        id: "3", 
        titleAr: "جمبسوت", 
        titleEn: "", 
        category: "pajamas", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/90PKDGgg/IMG-20261108-004310-807.jpg", 
        description: "فري سايز لحد 85 🫶❤️الخامة موهير مبطن 🫶❤️",
        outOfStock: false,
        colors: [{ name: "مجمع اشكال", image: "https://i.postimg.cc/Xqg1jnXH/IMG-20261108-004306-171.jpg" }],
        sizes: { "Free": { price: 270, available: true } }
    },
    { 
        id: "4", 
        titleAr: "بيجامة", 
        titleEn: "", 
        category: "pajamas", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/DwQrRxJ6/IMG-20261107-131925-383.jpg", 
        description: "فري سايز لحد 85كيلو مرتاح ❣️الخامه مبطن موهير تقيل جدا جدا 💯",
        outOfStock: false,
        colors: [{ name: "اشكال", image: "https://i.postimg.cc/4yrvRMQD/IMG-20261107-131930-120.jpg" }],
        sizes: { "Free": { price: 220, available: true } }
    },
    { 
        id: "5", 
        titleAr: "سويت شيرت", 
        titleEn: "", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/yNrs2pQD/IMG-20261108-004239-688.jpg", 
        description: "مقاس فري سايز بيلبس لحد 95كيلوًا 🫶💖 الخامه ميلتون لايت",
        outOfStock: false,
        colors: [{ name: "تفاصيل", image: "https://i.postimg.cc/W3Bj1FPq/IMG-20261108-004244-801.jpg" }],
        sizes: { "Free": { price: 270, available: true } }
    }
];

let customerReviews = JSON.parse(localStorage.getItem('jag_reviews')) || [
    { id: 1, name: "سارة محمد", comment: "الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!", rating: 5, image: "" }
];

let communityMessages = JSON.parse(localStorage.getItem('jag_community')) || [
    { id: 1, sender: "نوران أحمد", text: "يا جماعة، هل مقاسات الهوديات مضبوطة بالظبط؟", isOwner: false, replies: [] },
    { id: 2, sender: "Just a Girl (المالك)", text: "أهلاً يا نوران! المقاسات مضبوطة تماماً حسب الجدول ✨", isOwner: true, replies: [] }
];

let cart = JSON.parse(localStorage.getItem('jag_cart')) || [];
let currentBase64Image = "";
let colorUploadsList = [];
let selectedSizeForCart = "";

function findProduct(id) {
    return products.find(p => String(p.id) === String(id));
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    renderProducts(products);
    updateCartCount();
    renderReviews();
    renderCommunityChat();
    updateOwnerUI();
    ensureAdminButton();
});

function ensureAdminButton() {
    let btn = document.getElementById('floatingAdminBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'floatingAdminBtn';
        btn.innerHTML = "⚙️ لوحة التحكم والإدارة";
        btn.onclick = () => openProfileModal();
        document.body.appendChild(btn);
    }
}

function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    slider.innerHTML = '';
    heroBanners.forEach((banner, index) => {
        const div = document.createElement('div');
        div.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        div.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner.image}')`;
        div.innerHTML = `<div class="hero-content"><h2>${banner.titleAr}</h2><p>Just a Girl - Luxury Fashion</p></div>`;
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

// =========================================================================
// 🛍️ عرض المنتجات وتصفيتها حسب الأقسام (الكل، الهوديات، البناطيل، إلخ)
// =========================================================================
function renderProducts(itemsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:#666;">لا توجد منتجات مضافة في هذا القسم حالياً.</p>`;
        return;
    }

    itemsToRender.forEach(product => {
        let availableSizes = Object.values(product.sizes || {}).filter(s => s.available && s.price > 0);
        let pricesArr = availableSizes.map(s => s.price);
        let minPrice = pricesArr.length > 0 ? Math.min(...pricesArr) : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.position = 'relative';

        let adminControlsHtml = '';
        if (ownerSession) {
            adminControlsHtml = `
                <div style="display: flex; gap: 5px; margin-top: 10px; border-top: 1px dashed #ddd; padding-top: 8px;">
                    <button type="button" onclick="openEditProductModal('${product.id}')" style="flex:1; background:#D4AF37; color:#fff; border:none; padding:6px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">تعديل</button>
                    <button type="button" onclick="deleteProduct('${product.id}')" style="flex:1; background:#c00; color:#fff; border:none; padding:6px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">حذف</button>
                    <button type="button" onclick="toggleOutOfStock('${product.id}')" style="flex:1; background:#555; color:#fff; border:none; padding:6px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold;">${product.outOfStock ? 'إتاحة' : 'نفذ'}</button>
                </div>
            `;
        }

        card.innerHTML = `
            ${product.outOfStock ? '<span style="position:absolute; top:10px; left:10px; background:#c00; color:#fff; padding:3px 8px; font-size:12px; border-radius:4px; font-weight:bold; z-index:2;">نفذ</span>' : ''}
            <img src="${product.image}" alt="${product.titleAr}" class="product-img">
            <div class="product-info">
                <div class="product-title">${product.titleAr}</div>
                <div class="product-desc">${product.description || ''}</div>
                <div class="price-box">يبدأ من ${minPrice} ج.م</div>
                <button class="view-details-btn" onclick="openProductDetails('${product.id}')">عرض والتفاصيل</button>
                ${adminControlsHtml}
            </div>
        `;
        grid.appendChild(card);
    });
}

// دالة فلترة الأقسام (تعمل مع أزرار الأقسام في المتجر)
function filterCategory(categoryName) {
    if (categoryName === 'all' || !categoryName) {
        renderProducts(products);
    } else {
        let filtered = products.filter(p => p.category === categoryName);
        renderProducts(filtered);
    }
}

// =========================================================================
// 🛒 إدارة عربة التسوق وزر العربة العلوي
// =========================================================================
function openCartModal() {
    let modal = document.getElementById('cartModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    let cartItemsHtml = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsHtml = `<p style="text-align:center; color:#666; padding:20px;">عربة التسوق فارغة حالياً.</p>`;
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * (item.quantity || 1);
            totalPrice += itemTotal;
            cartItemsHtml += `
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #eee; padding:10px 0;">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                    <div style="flex:1; margin-right:10px;">
                        <h4 style="margin:0; font-size:14px; color:#4A040D;">${item.title}</h4>
                        <div style="font-size:12px; color:#555;">المقاس: ${item.size} | السعر: ${item.price} ج.م</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:#c00; color:#fff; border:none; padding:5px 8px; border-radius:4px; cursor:pointer; font-size:11px;">حذف</button>
                </div>
            `;
        });
    }

    modal.innerHTML = `
        <div class="modal-content" style="max-width:400px;">
            <span class="close-modal" onclick="closeCartModal()">&times;</span>
            <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">عربة التسوق 🛍️</h2>
            <div style="max-height:250px; overflow-y:auto; margin-bottom:15px;">${cartItemsHtml}</div>
            <div style="font-weight:bold; font-size:16px; margin-bottom:15px; text-align:left; color:#4A040D;">الإجمالي: ${totalPrice} ج.م</div>
            <button onclick="checkoutWhatsApp()" style="width:100%; background:#25D366; color:#fff; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; font-size:14px;">إتمام الطلب عبر واتساب 💬</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeCartModal() {
    let modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('jag_cart', JSON.stringify(cart));
    updateCartCount();
    openCartModal(); // تحديث النافذة
}

function updateCartCount() {
    let badge = document.getElementById('cartCountBadge');
    if(badge) badge.innerText = cart.length;
}

function checkoutWhatsApp() {
    if (cart.length === 0) { alert('عربة التسوق فارغة!'); return; }
    let msg = "مرحباً، أرغب في إتمام الطلب التالي من متجر Just a Girl:\n\n";
    let total = 0;
    cart.forEach(item => {
        msg += `- ${item.title} (المقاس: ${item.size}) - ${item.price} ج.م\n`;
        total += item.price;
    });
    msg += `\nالإجمالي الكلي: ${total} ج.م`;
    let url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ربط زر العربة العلوي تلقائياً إن وجد في الهيدر
document.addEventListener('click', (e) => {
    if (e.target.closest('#cartBtn') || e.target.closest('.cart-icon-container')) {
        openCartModal();
    }
});

// =========================================================================
// 👤 زر حساب الإدارة (بجانب اللغة الإنجليزية)
// =========================================================================
function openProfileModal() {
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    if (ownerSession) {
        modal.innerHTML = `
            <div class="modal-content" style="max-width:400px;">
                <span class="close-modal" onclick="closeProfileModal()">&times;</span>
                <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">لوحة تحكم المالكة ⚙️</h2>
                <button onclick="openAddProductModal(); closeProfileModal();" style="width:100%; background:#4A040D; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; margin-bottom:10px; cursor:pointer;">+ إضافة منتج جديد</button>
                <button onclick="logoutOwner()" style="width:100%; background:#c00; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">تسجيل الخروج من الإدارة</button>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="modal-content" style="max-width:350px;">
                <span class="close-modal" onclick="closeProfileModal()">&times;</span>
                <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">تسجيل دخول الإدارة 🔐</h2>
                <div class="form-group"><label>البريد الإلكتروني:</label><input type="email" id="loginEmail" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; margin-bottom:10px;"></div>
                <div class="form-group"><label>كلمة المرور:</label><input type="password" id="loginPass" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; margin-bottom:15px;"></div>
                <button onclick="loginOwner()" style="width:100%; background:#4A040D; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">دخول</button>
            </div>
        `;
    }
    modal.style.display = 'flex';
}

function closeProfileModal() {
    let modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'none';
}

function loginOwner() {
    let em = document.getElementById('loginEmail').value.trim();
    let pa = document.getElementById('loginPass').value.trim();
    if(em === adminEmail && pa === adminPass) {
        ownerSession = true;
        localStorage.setItem('jag_owner_session', 'true');
        closeProfileModal();
        renderProducts(products);
        alert('مرحباً بكِ يا مالكة المتجر ✨');
    } else {
        alert('البيانات غير صحيحة!');
    }
}

function logoutOwner() {
    ownerSession = false;
    localStorage.setItem('jag_owner_session', 'false');
    closeProfileModal();
    renderProducts(products);
    alert('تم تسجيل الخروج بنجاح.');
}

function updateOwnerUI() {}

// ربط زر الحساب العلوي (بجانب اللغة الإنجليزية) تلقائياً
document.addEventListener('click', (e) => {
    if (e.target.closest('#accountBtn') || e.target.closest('.user-icon') || e.target.closest('.fa-user') || e.target.closest('[onclick*="Profile"]')) {
        openProfileModal();
    }
});

// =========================================================================
// ⭐ رندر آراء العملاء (Customer Reviews)
// =========================================================================
function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer') || document.getElementById('customerReviewsGrid');
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '';
    
    customerReviews.forEach(rev => {
        let stars = '⭐'.repeat(rev.rating || 5);
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.cssText = "background:#fff; border:1px solid #eee; padding:15px; border-radius:8px; margin-bottom:10px;";
        card.innerHTML = `
            <div style="font-weight:bold; color:#4A040D; margin-bottom:5px;">${rev.name}</div>
            <div style="color:#D4AF37; margin-bottom:5px; font-size:12px;">${stars}</div>
            <p style="color:#555; font-size:13px; margin:0;">${rev.comment}</p>
        `;
        reviewsContainer.appendChild(card);
    });
}

// =========================================================================
// 💬 رندر مجتمع المتجر (Community Chat)
// =========================================================
function renderCommunityChat() {
    const chatContainer = document.getElementById('communityContainer') || document.getElementById('communityChatBox');
    if (!chatContainer) return;
    chatContainer.innerHTML = '';

    communityMessages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `background:${msg.isOwner ? '#fcf8f2' : '#f9f9f9'}; border:1px solid #ddd; padding:10px; border-radius:6px; margin-bottom:8px;`;
        msgDiv.innerHTML = `
            <div style="font-weight:bold; font-size:12px; color:${msg.isOwner ? '#D4AF37' : '#4A040D'}; margin-bottom:3px;">${msg.sender}</div>
            <div style="font-size:13px; color:#333;">${msg.text}</div>
        `;
        chatContainer.appendChild(msgDiv);
    });
}

// =========================================================================
// 🔍 تفاصيل المنتج وإضافته للسلة
// =========================================================================
function openProductDetails(productId) {
    const product = findProduct(productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    const content = document.getElementById('productModalContent') || modal.appendChild(document.createElement('div'));
    content.className = 'modal-content';

    let availableSizesKeys = Object.keys(product.sizes || {}).filter(s => product.sizes[s].available && product.sizes[s].price > 0);
    selectedSizeForCart = availableSizesKeys.length > 0 ? availableSizesKeys[0] : "Free";
    let initialPrice = product.sizes[selectedSizeForCart] ? product.sizes[selectedSizeForCart].price : 500;

    let sizesButtonsHtml = '';
    Object.keys(product.sizes || {}).forEach(sKey => {
        let sData = product.sizes[sKey];
        if(sData.available && sData.price > 0) {
            let isSelected = (sKey === selectedSizeForCart);
            sizesButtonsHtml += `
                <button type="button" onclick="selectProductSize('${sKey}', ${sData.price}, this)" 
                    class="size-btn" 
                    style="background: ${isSelected ? '#4A040D' : '#f7f4ed'}; color: ${isSelected ? '#fff' : '#4A040D'}; border: 1px solid #D4AF37; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">
                    ${sKey}: ${sData.price} ج.م
                </button>`;
        }
    });

    let colorsHtml = '';
    if(product.colors && product.colors.length > 0) {
        product.colors.forEach(col => {
            if(col.image) {
                colorsHtml += `
                    <div onclick="changeProductDisplayImage('${col.image}', '${col.name}')" style="text-align:center; display:inline-block; margin:4px; cursor:pointer;" title="عرض لون ${col.name}">
                        <img src="${col.image}" style="width:40px; height:40px; object-fit:cover; border-radius:50%; border:2px solid #D4AF37;">
                        <div style="font-size:10px; color:#4A040D; font-weight:bold;">${col.name}</div>
                    </div>`;
            }
        });
    }

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 220px; text-align:center;">
                <img id="mainDetailImage" src="${product.image}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
                <div id="colorNameIndicator" style="margin-top:6px; font-size:13px; font-weight:bold; color:#4A040D;">الصورة الأصلية للمنتج</div>
                <button type="button" onclick="resetToOriginalImage('${product.image}')" style="margin-top:6px; background:none; border:1px solid #D4AF37; color:#4A040D; padding:3px 10px; border-radius:15px; font-size:11px; cursor:pointer;">🔄 الصورة الأصلية</button>
            </div>
            <div style="flex: 1; min-width: 220px;">
                <h2 style="color: #4A040D; margin-bottom: 5px; font-family:'Playfair Display', serif;">${product.titleAr}</h2>
                <div id="modalProductPrice" style="color: #D4AF37; font-size: 18px; font-weight: bold; margin-bottom: 10px;">السعر: ${initialPrice} ج.م</div>
                <p style="color: #555; font-size: 13px; line-height: 1.6; margin-bottom: 15px;">${product.description || ''}</p>
                
                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-size:12px; font-weight:bold; color:#4A040D; margin-bottom:5px;">اختر المقاس:</label>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">${sizesButtonsHtml || '<span style="font-size:12px; color:#666;">مقاس موحد (Free Size)</span>'}</div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display:block; font-size:12px; font-weight:bold; color:#4A040D; margin-bottom:5px;">الألوان المتاحة:</label>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">${colorsHtml || '<span>لون أساسي</span>'}</div>
                </div>

                <button onclick="addToCartFromModal('${product.id}')" style="width: 100%; background: #4A040D; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">أضف إلى السلة 🛍️</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function selectProductSize(sizeKey, price, btnEl) {
    selectedSizeForCart = sizeKey;
    document.querySelectorAll('.size-btn').forEach(b => {
        b.style.background = '#f7f4ed';
        b.style.color = '#4A040D';
    });
    btnEl.style.background = '#4A040D';
    btnEl.style.color = '#fff';
    
    let priceEl = document.getElementById('modalProductPrice');
    if(priceEl) priceEl.innerText = `السعر: ${price} ج.م`;
}

function changeProductDisplayImage(imgUrl, colorName) {
    let imgEl = document.getElementById('mainDetailImage');
    let indEl = document.getElementById('colorNameIndicator');
    if(imgEl) imgEl.src = imgUrl;
    if(indEl) indEl.innerText = `لون: ${colorName}`;
}

function resetToOriginalImage(originalUrl) {
    let imgEl = document.getElementById('mainDetailImage');
    let indEl = document.getElementById('colorNameIndicator');
    if(imgEl) imgEl.src = originalUrl;
    if(indEl) indEl.innerText = `الصورة الأصلية للمنتج`;
}

function closeProductModal() {
    let modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none';
}

function addToCartFromModal(productId) {
    let product = findProduct(productId);
    if (!product) return;

    let price = 500;
    if (selectedSizeForCart && product.sizes[selectedSizeForCart]) {
        price = product.sizes[selectedSizeForCart].price;
    }

    cart.push({
        id: product.id,
        title: product.titleAr,
        price: price,
        size: selectedSizeForCart || 'Free',
        image: product.image,
        quantity: 1
    });

    localStorage.setItem('jag_cart', JSON.stringify(cart));
    updateCartCount();
    closeProductModal();
    alert('تم إضافة المنتج إلى السلة بنجاح! 🛍️✨');
}

// نافذة إضافة منتج جديد
function openAddProductModal() {
    if (!ownerSession) { alert('متاحة للإدارة فقط.'); return; }
    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    currentBase64Image = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500";
    colorUploadsList = [];

    const content = document.getElementById('productModalContent') || modal.appendChild(document.createElement('div'));
    content.className = 'modal-content';
    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">إضافة منتج جديد</h2>
        <div class="form-group"><label>اسم المنتج:</label><input type="text" id="addProdTitle" placeholder="مثال: هودي شتوي"></div>
        <div class="form-group"><label>القسم:</label>
            <select id="addProdCat" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <option value="hoodies">هوديات (Hoodies)</option>
                <option value="pants">بناطيل (Pants)</option>
                <option value="kids">أطفال (Kids)</option>
                <option value="pajamas">بيجامات (Pajamas)</option>
                <option value="sets">طقمة (Sets)</option>
            </select>
        </div>
        <div class="form-group"><label>رابط الصورة:</label><input type="text" id="mainImgUrlInput" placeholder="رابط الصورة..." oninput="handleMainImageUrl(event)" style="width:100%; padding:7px; border:1px solid #ccc; border-radius:4px;"></div>
        <div class="form-group"><label>الوصف:</label><textarea id="addProdDesc" placeholder="تفاصيل الخامات..."></textarea></div>
        <div class="form-group"><label>سعر فري سايز:</label><input type="number" id="price_Free" placeholder="500" style="width:100%; padding:7px; border:1px solid #ccc; border-radius:4px;"></div>
        <button onclick="saveNewAdvancedProduct()" style="width:100%; background:#4A040D; color:#fff; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer; margin-top:10px;">حفظ ونشر المنتج</button>
    `;
    modal.style.display = 'flex';
}

function handleMainImageUrl(event) {
    let urlVal = event.target.value.trim();
    if(urlVal) currentBase64Image = urlVal;
}

function saveNewAdvancedProduct() {
    let title = document.getElementById('addProdTitle').value.trim();
    let category = document.getElementById('addProdCat').value;
    let description = document.getElementById('addProdDesc').value.trim();
    let priceFree = parseFloat(document.getElementById('price_Free').value) || 500;

    if (!title) { alert('يرجى إدخال اسم المنتج.'); return; }

    let newProduct = {
        id: String(Date.now()),
        titleAr: title,
        titleEn: title,
        category: category,
        hasDiscount: false,
        image: currentBase64Image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
        description: description,
        outOfStock: false,
        colors: [{ name: "الأساسي", image: currentBase64Image }],
        sizes: { "Free": { price: priceFree, available: true } }
    };

    products.unshift(newProduct);
    localStorage.setItem('jag_products', JSON.stringify(products));
    closeProductModal();
    renderProducts(products);
    alert('تم إضافة المنتج بنجاح!');
}

function deleteProduct(productId) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) return;
    products = products.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('jag_products', JSON.stringify(products));
    renderProducts(products);
}

function toggleOutOfStock(productId) {
    if (!ownerSession) return;
    let product = findProduct(productId);
    if (product) {
        product.outOfStock = !product.outOfStock;
        localStorage.setItem('jag_products', JSON.stringify(products));
        renderProducts(products);
    }
}

function openEditProductModal(productId) {
    let product = findProduct(productId);
    if (!product) return;
    openAddProductModal();
    document.getElementById('addProdTitle').value = product.titleAr;
    document.getElementById('addProdDesc').value = product.description;
    document.getElementById('mainImgUrlInput').value = product.image;
    currentBase64Image = product.image;
    // تعديل مؤقت للـ ID للاستبدال
    products = products.filter(p => String(p.id) !== String(productId));
}
