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
   =========================================================================
    { 
        id: "2", // غيري رقم الـ ID لكل منتج جديد (مثلاً: 2، 3، 4...)
        titleAr: "اكتبي اسم المنتج بالعربي هنا", 
        titleEn: "Product Name in English", 
        category: "hoodies", // الأقسام المتاحة: hoodies, pants, kids, pajamas, sets, dresses, suits, jackets, bundles, offers
        hasDiscount: false, // اكتبي true لو عليه خصم، أو false لو السعر عادي
        image: "رابط_الصورة_الرئيسية_للمنتج.jpg", 
        description: "اكتبي هنا وصف الخامات وتفاصيل التلبيس والنوع...",
        outOfStock: false, // false لو متاح، و true لو خلصان
        
        // الألوان الأساسية (تقدري تغيري الروابط وتسيبي الأسماء زي ما هي أو تعدليها)
        colors: [
            { name: "أسود", image: "رابط_صورة_اللون_الأسود.jpg" },
            { name: "برجندي", image: "رابط_صورة_اللون_البرجندي.jpg" },
            { name: "بيج", image: "رابط_صورة_اللون_البيج.jpg" }
        ],
        
        // جميع المقاسات جاهزة أمامك (اكتبي السعر بالأرقام، أو اجعلي السعر 0 والـ available بـ false لو مش نازل)
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
            "S": { price: 600, available: true },   // مثال لمقاس متوفر بسعر 600
            "M": { price: 650, available: true },   // مثال لمقاس متوفر بسعر 650
            "L": { price: 700, available: true },   // مثال لمقاس متوفر بسعر 700
            "XL": { price: 750, available: true },
            "2XL": { price: 0, available: false },
            "3XL": { price: 0, available: false },
            "Free": { price: 0, available: false }
        }
    },
   ========================================================================= */
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
    },
    { 
        id: "2", 
        titleAr: "سويت شيرت كاجوال", 
        titleEn: "College Sweatshirt", 
        category: "blouses", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/dVqkx8PP/IMG-20261107-131821-682.jpg", 
        description: "جينة صافي فائقة النعومة والجودة ❤️❤️❤️📐 المقاس: فري سايز (Free Size) لحد 95 كيلو مرتاح جداً ❤️",
        outOfStock: false,
        colors: [
            { name: "بنى", image: "https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg" },
            { name: "برجندي", image: "https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg" },
            { name: "اسود", image: "https://i.postimg.cc/ZnpB1HK1/IMG-20261107-131820-991.jpg" }
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
            "Free": { price: 440, available: true }
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

function filterCategory(cat) {
    document.querySelectorAll('#categoryNav button').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    
    const title = document.getElementById('catalogTitle');
    if (cat === 'all') {
        if(title) title.innerText = "تجميعة المنتجات";
        renderProducts(products);
    } else {
        if(title && event) title.innerText = event.target.innerText;
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

function filterProducts() {
    const input = document.getElementById('searchInput');
    if(!input) return;
    const query = input.value.toLowerCase();
    const filtered = products.filter(p => 
        (p.titleAr && p.titleAr.toLowerCase().includes(query)) || 
        (p.description && p.description.toLowerCase().includes(query))
    );
    renderProducts(filtered);
}

function openAddProductModal() {
    if (!ownerSession) { alert('متاحة للإدارة فقط.'); return; }
    let modal = document.getElementById('productModal');
    let content = document.getElementById('productModalContent');
    if(!modal || !content) return;

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">إضافة منتج جديد</h2>
        <div class="form-group"><label>اسم المنتج:</label><input type="text" id="newTitle" placeholder="اسم المنتج"></div>
        <div class="form-group"><label>رابط الصورة الرئيسية:</label><input type="text" id="newImage" placeholder="رابط الصورة"></div>
        <div class="form-group"><label>الوصف:</label><textarea id="newDesc" placeholder="تفاصيل المنتج"></textarea></div>
        <button onclick="saveNewProduct()" style="width:100%; background:#4A040D; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">إضافة المنتج</button>
    `;
    modal.style.display = 'flex';
}

function saveNewProduct() {
    let title = document.getElementById('newTitle').value;
    let image = document.getElementById('newImage').value;
    let desc = document.getElementById('newDesc').value;

    if(!title || !image) {
        alert('برجاء إدخال اسم المنتج ورابط الصورة على الأقل.');
        return;
    }

    let newProd = {
        id: Date.now().toString(),
        titleAr: title,
        titleEn: title,
        category: "sets",
        image: image,
        description: desc,
        outOfStock: false,
        colors: [],
        sizes: { "Free": { price: 500, available: true } }
    };

    products.push(newProd);
    localStorage.setItem('jag_products', JSON.stringify(products));
    closeProductModal();
    renderProducts(products);
    alert('تم إضافة المنتج بنجاح! ✨');
}

function openEditProductModal(productId) {
    if (!ownerSession) return;
    const product = products.find(p => p.id == productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    let content = document.getElementById('productModalContent');
    if(!modal || !content) return;

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">تعديل المنتج</h2>
        <div class="form-group"><label>اسم المنتج:</label><input type="text" id="editTitle" value="${product.titleAr}"></div>
        <div class="form-group"><label>رابط الصورة الرئيسية:</label><input type="text" id="editImage" value="${product.image}"></div>
        <div class="form-group"><label>الوصف:</label><textarea id="editDesc">${product.description || ''}</textarea></div>
        <button onclick="saveEditedProduct('${product.id}')" style="width:100%; background:#4A040D; color:#fff; border:none; padding:10px; border-radius:5px; font-weight:bold; cursor:pointer;">حفظ التعديلات</button>
    `;
    modal.style.display = 'flex';
}

function saveEditedProduct(productId) {
    let product = products.find(p => p.id == productId);
    if (product) {
        product.titleAr = document.getElementById('editTitle').value;
        product.image = document.getElementById('editImage').value;
        product.description = document.getElementById('editDesc').value;
        
        localStorage.setItem('jag_products', JSON.stringify(products));
        closeProductModal();
        renderProducts(products);
        alert('تم تعديل المنتج بنجاح! ✨');
    }
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
    let content = document.getElementById('productModalContent');
    if(!modal || !content) return;

    let sizesHtml = '';
    if (product.sizes) {
        for (let [sizeKey, sizeData] of Object.entries(product.sizes)) {
            if (sizeData.available && sizeData.price > 0) {
                sizesHtml += `<button onclick="selectSizeForCart('${sizeKey}', ${sizeData.price})" style="padding:8px 15px; border:1px solid #D4AF37; background:#fff; border-radius:5px; cursor:pointer; margin:4px; font-weight:bold;">${sizeKey} (${sizeData.price} ج.م)</button>`;
            }
        }
    }

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <div style="text-align:center;">
            <img src="${product.image}" style="max-height:280px; width:100%; object-fit:contain; border-radius:8px; margin-bottom:15px;">
            <h2 style="color:#4A040D; margin-bottom:10px;">${product.titleAr}</h2>
            <p style="color:#666; font-size:14px; margin-bottom:15px;">${product.description || ''}</p>
            <div style="margin-bottom:15px;">
                <strong style="display:block; margin-bottom:8px; color:#4A040D;">اختر المقاس:</strong>
                <div id="modalSizesContainer">${sizesHtml || '<p style="color:#888;">متاح بمقاس فري سايز</p>'}</div>
            </div>
            <button onclick="addToCart('${product.id}')" style="background:#4A040D; color:#fff; border:none; padding:10px 25px; border-radius:5px; font-weight:bold; cursor:pointer; width:100%;">إضافة إلى السلة 🛍️</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}

// =========================================================================
// 🛒 إدارة سلة الشراء والطلب عبر الواتساب
// =========================================================================
function selectSizeForCart(size, price) {
    selectedSizeForCart = size;
    alert(`تم اختيار مقاس: ${size} بسعر ${price} ج.م`);
}

function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if(!product) return;

    cart.push({
        id: product.id,
        title: product.titleAr,
        price: 470,
        qty: 1,
        size: selectedSizeForCart || "Free"
    });

    localStorage.setItem('jag_cart', JSON.stringify(cart));
    updateCartCount();
    closeProductModal();
    alert('تم إضافة المنتج إلى السلة بنجاح! 🛍️');
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function openCartModal() {
    let modal = document.getElementById('cartModal');
    let listContainer = document.getElementById('cartItemsList');
    let totalPriceEl = document.getElementById('cartTotalPrice');
    if(!modal) return;

    listContainer.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#666; padding:20px;">سلة التسوق فارغة حالياً.</p>`;
    } else {
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.qty;
            total += itemTotal;
            listContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:8px;">
                    <div>
                        <strong>${item.title}</strong> (مقاس: ${item.size})
                        <div style="font-size:12px; color:#666;">${item.price} ج.م × ${item.qty}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#c00; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }

    if(totalPriceEl) totalPriceEl.innerText = total;
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
    openCartModal();
}

function sendToWhatsApp() {
    let name = document.getElementById('clientName').value.trim();
    let phone = document.getElementById('clientPhone').value.trim();
    let address = document.getElementById('clientAddress').value.trim();
    let legalCheck = document.getElementById('legalCheck').checked;

    if(!name || !phone || !address) {
        alert('برجاء إدخال الاسم، رقم الهاتف، والعنوان بالتفصيل.');
        return;
    }

    if(!legalCheck) {
        alert('يجب الموافقة على شروط البراند ودفع الديبوزيت أولاً.');
        return;
    }

    if(cart.length === 0) {
        alert('سلة التسوق فارغة!');
        return;
    }

    let message = `✨ طلب جديد من موقع Just a Girl ✨\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}\n\n🛍️ المنتجات:\n`;
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.title} (مقاس: ${item.size}) × ${item.qty} (${item.price * item.qty} ج.م)\n`;
        total += item.price * item.qty;
    });

    message += `\n💰 الإجمالي: ${total} ج.م\n✨ تم الموافقة على تحويل ديبوزيت 100 جنيه ومعاينة الاستلام.`;

    let encodedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(encodedUrl, '_blank');
}

// =========================================================================
// 💬 نظام مجتمع العملاء والإدارة
// =========================================================================
function renderCommunityChat() {
    const chatBox = document.getElementById('communityChatBox');
    if (!chatBox) return;
    chatBox.innerHTML = '';

    if (communityMessages.length === 0) {
        chatBox.innerHTML = `<p style="text-align:center; color:#888; font-size:13px; padding:20px;">لا توجد استفسارات حالياً. كوني أول من يشارك! ✨</p>`;
        return;
    }

    communityMessages.forEach((msg) => {
        let repliesHtml = '';
        if (msg.replies && msg.replies.length > 0) {
            msg.replies.forEach((rep) => {
                repliesHtml += `
                    <div style="margin-top: 8px; margin-right: 20px; background: ${rep.isOwner ? '#fff0f2' : '#f9f9f9'}; padding: 8px 12px; border-radius: 6px; border-right: 3px solid ${rep.isOwner ? '#4A040D' : '#D4AF37'};">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="font-size: 12px; color: ${rep.isOwner ? '#4A040D' : '#333'};">
                                ${rep.sender} ${rep.isOwner ? '<span style="background:#4A040D; color:#fff; font-size:10px; padding:1px 6px; border-radius:10px; margin-right:4px;">✨ (المالك)</span>' : ''}
                            </strong>
                            ${ownerSession ? `<button onclick="deleteCommunityReply('${msg.id}', '${rep.id}')" style="background:none; border:none; color:#c00; font-size:11px; cursor:pointer;">حذف الرد</button>` : ''}
                        </div>
                        <p style="margin: 4px 0 0 0; font-size: 13px; color: #444;">${rep.text}</p>
                    </div>
                `;
            });
        }

        let deleteBtnHtml = ownerSession 
            ? `<button onclick="deleteCommunityMessage('${msg.id}')" style="background:none; border:none; color:#c00; font-size:12px; cursor:pointer; font-weight:bold;">حذف</button>` 
            : '';

        chatBox.innerHTML += `
            <div style="margin-bottom: 15px; background: ${msg.isOwner ? '#fff5f7' : '#fff'}; padding: 12px; border-radius: 8px; border: 1px solid #eee; position:relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #4A040D; font-size: 14px;">
                        ${msg.sender} ${msg.isOwner ? '<span style="background:#4A040D; color:#fff; font-size:10px; padding:2px 8px; border-radius:10px; margin-right:4px;">✨ (المالك)</span>' : ''}
                    </strong>
                    ${deleteBtnHtml}
                </div>
                
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #333; line-height: 1.5;">${msg.text}</p>
                
                <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
                    <button onclick="toggleReplyBox('${msg.id}')" style="background:none; border:none; color:#D4AF37; cursor:pointer; font-size:12px; font-weight:bold;">
                        💬 رد
                    </button>
                </div>

                <div id="replyBox_${msg.id}" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee;">
                    <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                        <input type="text" id="replyName_${msg.id}" placeholder="اكتبي اسمك..." style="width: 30%; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
                        <input type="text" id="replyText_${msg.id}" placeholder="اكتبي ردك هنا..." style="flex: 1; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
                        <button onclick="sendCommunityReply('${msg.id}')" style="background: #4A040D; color: #fff; border: none; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">إرسال الرد</button>
                    </div>
                </div>

                <div class="replies-container">
                    ${repliesHtml}
                </div>
            </div>
        `;
    });
}

function sendCommunityMessage() {
    const input = document.getElementById('communityInput');
    const nameInput = document.getElementById('chatSenderName');
    if (!input || !input.value.trim()) return;

    let text = input.value.trim();
    let senderName = nameInput && nameInput.value.trim() 
        ? nameInput.value.trim() 
        : (ownerSession ? "Just a Girl (المالك)" : "زائرة للموقع");

    let newMsg = {
        id: Date.now().toString(),
        sender: senderName,
        text: text,
        isOwner: ownerSession,
        replies: []
    };

    communityMessages.push(newMsg);
    localStorage.setItem('jag_community', JSON.stringify(communityMessages));
    input.value = '';
    renderCommunityChat();
}

function toggleReplyBox(msgId) {
    const box = document.getElementById(`replyBox_${msgId}`);
    if (box) {
        box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
}

function sendCommunityReply(msgId) {
    const nameEl = document.getElementById(`replyName_${msgId}`);
    const textEl = document.getElementById(`replyText_${msgId}`);
    
    if (!textEl || !textEl.value.trim()) return;

    let replyText = textEl.value.trim();
    let replySender = (nameEl && nameEl.value.trim()) 
        ? nameEl.value.trim() 
        : (ownerSession ? "Just a Girl (المالك)" : "عميلة");

    let msg = communityMessages.find(m => m.id == msgId);
    if (msg) {
        if (!msg.replies) msg.replies = [];
        let newReply = {
            id: Date.now().toString(),
            sender: replySender,
            text: replyText,
            isOwner: ownerSession
        };
        msg.replies.push(newReply);
        
        localStorage.setItem('jag_community', JSON.stringify(communityMessages));
        renderCommunityChat();
    }
}

function deleteCommunityMessage(msgId) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذه الرسالة وكل الردود عليها؟')) return;

    communityMessages = communityMessages.filter(m => m.id != msgId);
    localStorage.setItem('jag_community', JSON.stringify(communityMessages));
    renderCommunityChat();
}

function deleteCommunityReply(msgId, replyId) {
    if (!ownerSession) return;
    let msg = communityMessages.find(m => m.id == msgId);
    if (msg && msg.replies) {
        msg.replies = msg.replies.filter(r => r.id != replyId);
        localStorage.setItem('jag_community', JSON.stringify(communityMessages));
        renderCommunityChat();
    }
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

function loginAdmin() {
    let email = document.getElementById('adminEmailInput').value;
    let pass = document.getElementById('adminPasswordInput').value;
    if (email === adminEmail && pass === adminPass) {
        ownerSession = true;
        localStorage.setItem('jag_owner_session', 'true');
        alert('أهلاً بكِ يا ملكة البراند! تم تسجيل الدخول بنجاح 👑');
        closeProfileModal();
        updateOwnerUI();
        renderProducts(products);
        renderCommunityChat();
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة!');
    }
}

function logoutAdmin() {
    ownerSession = false;
    localStorage.setItem('jag_owner_session', 'false');
    alert('تم تسجيل الخروج بنجاح.');
    closeProfileModal();
    updateOwnerUI();
    renderProducts(products);
    renderCommunityChat();
}

function updateOwnerUI() {
    const adminPanel = document.getElementById('adminPanelContainer');
    if (adminPanel) {
        adminPanel.style.display = ownerSession ? 'block' : 'none';
    }
}

function openProfileModal() {
    let modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'flex';
}

function closeProfileModal() {
    let modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'none';
}

function closeCartModal() {
    let modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none';
}

function closeProductModal() { 
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none'; 
}
