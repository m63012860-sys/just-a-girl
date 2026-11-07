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

/* =========================================================================
   📌 دليل إضافة منتج جديد في مصفوفة products (احفظي هذا القالب كمرجع لكِ):
    { 
        id: "2", 
        titleAr: "اكتبي اسم المنتج بالعربي هنا", 
        titleEn: "Product Name in English", 
        category: "sets", 
        hasDiscount: false, 
        image: "رابط_الصورة.jpg", 
        description: "الوصف...",
        outOfStock: false,
        colors: [
            { name: "اللون", image: "رابط_صورة_اللون.jpg" }
        ],
        sizes: { 
            "Free": { price: 470, available: true }
        }
    }
   ========================================================================= */

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

function openAddProductModal() {
    if (!ownerSession) { alert('متاحة للإدارة فقط.'); return; }
    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content" id="productModalContent"></div>`;
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
}

function deleteProduct(productId) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج نهائياً؟')) return;
    products = products.filter(p => p.id != productId);
    localStorage.setItem('jag_products', JSON.stringify(products));
    renderProducts(products);
}

function toggleOutOfStock(productId) {
    if (!ownerSession) return;
    let product = products.find(p => p.id == productId);
    if (product) {
        product.outOfStock = !product.outOfStock;
        localStorage.setItem('jag_products', JSON.stringify(products));
        renderProducts(products);
    }
}

function openProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    let modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    if(!modal || !content) return;
    modal.style.display = 'flex';
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCommunityChat() {
    const chatBox = document.getElementById('communityChatBox');
    if(!chatBox) return;
    chatBox.innerHTML = '';
    communityMessages.forEach((msg) => {
        chatBox.innerHTML += `
            <div style="margin-bottom: 12px; background: ${msg.isOwner ? '#fcf8f2' : '#fff'}; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
                <strong>${msg.sender}:</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #444;">${msg.text}</p>
            </div>
        `;
    });
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if(!container) return;
    container.innerHTML = '';
    customerReviews.forEach(rev => {
        container.innerHTML += `
            <div class="review-card" style="background:#fff; padding:15px; border-radius:8px; border:1px solid #eee; margin-bottom:10px;">
                <div style="color:#D4AF37; margin-bottom:5px;">${'★'.repeat(rev.rating)}</div>
                <p style="font-size:13px; color:#444; margin-bottom:8px;">"${rev.comment}"</p>
                <strong style="font-size:12px; color:#4A040D;">- ${rev.name}</strong>
            </div>
        `;
    });
}

function openProfileModal() {
    let modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'flex';
}

function updateOwnerUI() {}
