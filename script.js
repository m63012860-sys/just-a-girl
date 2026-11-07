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
        id: 1, 
        titleAr: "هودي شتوي أنيق", 
        titleEn: "Elegant Winter Hoodie", 
        category: "hoodies", 
        hasDiscount: true, 
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500",
        description: "هودي خامة ممتازة وتلبيس راقي ومريح.",
        outOfStock: false,
        colors: [{ name: "أسود", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" }],
        sizes: { "M": { price: 650, oldPrice: 750, available: true } }
    },
    { 
        id: "2", 
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
        sizes: { 
            "1y": { price: 0, available: false },
            "2y": { price: 0, available: false },
            "3y": { price: 0, available: false },
            "4y": { price: 0, available: false },
            "6y": { price: 0, available: false },
            "8y": { price: 0, available: false },
            "10y": { price: 0, available: false },
            "12y": { price: 0, available: false },
            "XS": { price: 0, available: false },
            "S": { price: 0, available: false },
            "M": { price: 0, available: false },
            "L": { price: 0, available: false },
            "XL": { price: 0, available: false },
            "2XL": { price: 0, available: false },
            "3XL": { price: 0, available: false },
            "Free": { price: 470, available: true }
        }
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

// =========================================================================
// 🌐 جلب البيانات سحابياً من Firebase عند فتح الموقع
// =========================================================================
async function loadCloudData() {
    if (window.db && window.firestoreTools) {
        try {
            const { collection, getDocs } = window.firestoreTools;
            const prodSnap = await getDocs(collection(window.db, "products"));
            if (!prodSnap.empty) {
                products = [];
                prodSnap.forEach(doc => {
                    products.push({ id: doc.id, ...doc.data() });
                });
                renderProducts(products);
            }

            const chatSnap = await getDocs(collection(window.db, "community"));
            if (!chatSnap.empty) {
                communityMessages = [];
                chatSnap.forEach(doc => {
                    communityMessages.push({ id: doc.id, ...doc.data() });
                });
                renderCommunityChat();
            }
        } catch (error) {
            console.log("جاري الاعتماد على التخزين المحلي مؤقتاً:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    renderProducts(products);
    updateCartCount();
    renderReviews();
    renderCommunityChat();
    updateOwnerUI();
    ensureAdminButton();
    loadCloudData();
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
// 🛍️ عرض وإدارة المنتجات
// =========================================================================
function renderProducts(itemsToRender = products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; color:#666;">لا توجد منتجات مضافة حالياً.</p>`;
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

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function openProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    if(!modal || !content) return;

    let availableSizesKeys = Object.keys(product.sizes || {}).filter(s => product.sizes[s].available && product.sizes[s].price > 0);
    selectedSizeForCart = availableSizesKeys.length > 0 ? availableSizesKeys[0] : "";
    let initialPrice = selectedSizeForCart ? product.sizes[selectedSizeForCart].price : 500;

    let sizesButtonsHtml = '';
    Object.keys(product.sizes || {}).forEach(sKey => {
        let sData = product.sizes[sKey];
        if(sData.available && sData.price > 0) {
            let isSelected = (sKey === selectedSizeForCart);
            sizesButtonsHtml += `
                <button type="button" onclick="selectProductSize('${sKey}', ${sData.price}, this)" 
                    class="size-btn" 
                    style="background: ${isSelected ? '#4A040D' : '#f7f4ed'}; color: ${isSelected ? '#fff' : '#4A040D'}; border: 1px solid #D4AF37; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s;">
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
                <button type="button" onclick="resetToOriginalImage('${product.image}')" style="margin-top:6px; background:none; border:1px solid #D4AF37; color:#4A040D; padding:3px 10px; border-radius:15px; font-size:11px; cursor:pointer;">🔄 العودة للصورة الأصلية</button>
            </div>
            <div style="flex: 1; min-width: 220px;">
                <h2 style="color: #4A040D; margin-bottom: 6px; font-family:'Playfair Display',serif;">${product.titleAr}</h2>
                <p style="font-size: 12px; color: #666; margin-bottom: 10px; line-height:1.4;">${product.description || ''}</p>
                
                <div style="margin-bottom: 10px; font-size: 15px; font-weight: bold; color: #4A040D;">
                    السعر الحالي: <span id="dynamicPriceDisplay">${initialPrice}</span> ج.م
                </div>

                <div style="margin-bottom: 10px;">
                    <strong style="color:#4A040D; display:block; font-size:12px; margin-bottom:4px;">اختر المقاس المطلـوب:</strong> 
                    <div style="display:flex; gap:5px; flex-wrap:wrap;" id="productSizesContainer">
                        ${sizesButtonsHtml}
                    </div>
                </div>

                ${colorsHtml ? `<div style="margin-bottom: 10px;"><strong style="color:#4A040D; display:block; font-size:12px; margin-bottom:3px;">الألوان المتوفرة:</strong> <div style="display:flex; gap:6px; flex-wrap:wrap;">${colorsHtml}</div></div>` : ''}
                
                <button class="view-details-btn" onclick="addToCartWithSelectedSize('${product.id}')" ${product.outOfStock ? 'disabled style="background:#ccc;"' : ''}>
                    ${product.outOfStock ? 'نفذت الكمية' : 'إضافة للسلة بالمقاس المحدد'}
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function selectProductSize(sizeKey, priceVal, btnElement) {
    selectedSizeForCart = sizeKey;
    const container = document.getElementById('productSizesContainer');
    if(container) {
        Array.from(container.children).forEach(btn => {
            btn.style.background = '#f7f4ed';
            btn.style.color = '#4A040D';
        });
    }
    btnElement.style.background = '#4A040D';
    btnElement.style.color = '#fff';

    const priceDisplay = document.getElementById('dynamicPriceDisplay');
    if(priceDisplay) {
        priceDisplay.innerText = priceVal;
    }
}

function addToCartWithSelectedSize(productId) {
    const product = products.find(p => p.id == productId);
    if (!product || product.outOfStock) return;

    if (!selectedSizeForCart || !product.sizes[selectedSizeForCart]) {
        alert('يرجى اختيار المقاس أولاً.');
        return;
    }

    let chosenSizeData = product.sizes[selectedSizeForCart];
    
    cart.push({ 
        id: product.id, 
        titleAr: product.titleAr, 
        size: selectedSizeForCart, 
        price: chosenSizeData.price, 
        qty: 1 
    });

    localStorage.setItem('jag_cart', JSON.stringify(cart));
    updateCartCount();
    closeProductModal();
    alert(`تمت إضافة "${product.titleAr}" (مقاس ${selectedSizeForCart}) بسعر ${chosenSizeData.price} ج.م إلى السلة بنجاح!`);
}

function changeProductDisplayImage(imgUrl, colorName) {
    const mainImg = document.getElementById('mainDetailImage');
    const indicator = document.getElementById('colorNameIndicator');
    if(mainImg) mainImg.src = imgUrl;
    if(indicator) indicator.innerText = `اللون المختار: ${colorName}`;
}

function resetToOriginalImage(originalImgUrl) {
    const mainImg = document.getElementById('mainDetailImage');
    const indicator = document.getElementById('colorNameIndicator');
    if(mainImg) mainImg.src = originalImgUrl;
    if(indicator) indicator.innerText = `الصورة الأصلية للمنتج`;
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}
