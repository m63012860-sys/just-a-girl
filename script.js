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
        description: "جينة صافي فائقة النعومة والجودة ❤️❤️❤️📐 المقاس: فري سايز بنى اسود برجندى لبنى (Free Size) لحد 95 كيلو مرتاح جداً ❤️",
        outOfStock: false,
        colors: [
            { name: "بنى", image: "https://i.postimg.cc/mgqbfLYq/IMG-20261107-131942-088.jpg" },
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
        colors: [
            { name: "مجمع اشكال", image: "https://i.postimg.cc/Xqg1jnXH/IMG-20261108-004306-171.jpg" },
            { name: "اشكال", image: "https://i.postimg.cc/7Zht484g/IMG-20261108-004311-155.jpg" },
            { name: "اشكال", image: "https://i.postimg.cc/RZYsVsV4/IMG-20261108-004311-245.jpg" },
            { name: "اشكال", image: "https://i.postimg.cc/V6QKXJCB/IMG-20261108-004311-401.jpg" },
            { name: "اشكال", image: "https://i.postimg.cc/NG8z7kbd/IMG-20261108-004310-980.jpg" }
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
            "Free": { price: 270, available: true }
        }
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
        colors: [
            { name: "اشكال", image: "https://i.postimg.cc/4yrvRMQD/IMG-20261107-131930-120.jpg" },
            { name: "اشكال", image: "https://i.postimg.cc/44KFjTJv/IMG-20261108-010416-978.jpg" }
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
            "Free": { price: 220, available: true }
        }
    },
    { 
        id: "5", 
        titleAr: "سويت شيرت", 
        titleEn: "", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/yNrs2pQD/IMG-20261108-004239-688.jpg", 
        description: "مقاس فري سايز بيلبس لحد 95كيلوًا 🫶💖الالوان رمادي أبيض بينك بيبي بلو.احمر لافندر منت مارون/ بيج اسود بني ❤️💖✨❤️ الخامه ميلتون لايت",
        outOfStock: false,
        colors: [
            { name: "تفاصيل", image: "https://i.postimg.cc/W3Bj1FPq/IMG-20261108-004244-801.jpg" }
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
            "Free": { price: 270, available: true }
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

// ✅ دالة مساعدة: بتدور على المنتج سواء الـ id نص أو رقم
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
// 🛍️ عرض وإدارة المنتجات (تعديل، حذف، نفذ)
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

// 1. فتح نافذة إضافة منتج
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

    currentBase64Image = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500";
    colorUploadsList = [];

    const content = document.getElementById('productModalContent');
    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px; font-family:'Playfair Display', serif;">إضافة منتج جديد</h2>
        
        <div class="form-group"><label>اسم المنتج:</label><input type="text" id="addProdTitle" placeholder="مثال: فستان سهرة أو هودي"></div>
        
        <div class="form-group"><label>القسم:</label>
            <select id="addProdCat" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:5px;">
                <option value="hoodies">هوديات (Hoodies)</option>
                <option value="pants">بناطيل (Pants)</option>
                <option value="kids">أطفال (Kids)</option>
                <option value="pajamas">بيجامات (Pajamas)</option>
                <option value="sets">طقمة (Sets)</option>
                <option value="dresses">الفساتين (Dresses)</option>
                <option value="suits">البدل (Suits)</option>
                <option value="jackets">الجواكت (Jackets)</option>
                <option value="bundles">باكدج (Bundles)</option>
                <option value="offers">عروض خاصة</option>
                <option value="mens">رجالي (Men's)</option>
                <option value="blouses">بلوزات (Blouses)</option>
            </select>
        </div>

        <div class="form-group">
            <label>رفع الصورة الرئيسية من الجهاز أو رابط خارجي:</label>
            <input type="file" id="mainImageFile" accept="image/*" onchange="handleMainImageUpload(event)" style="padding:5px; margin-bottom:5px;">
            <input type="text" id="mainImgUrlInput" placeholder="أو ائتي برابط صورة مباشرة (URL)..." oninput="handleMainImageUrl(event)" style="padding:7px; width:100%; border:1px solid #ccc; border-radius:4px; font-size:13px;">
            <div id="mainImgPreviewContainer" style="margin-top:8px;">
                <img id="mainImgPreview" src="${currentBase64Image}" style="width:80px; height:80px; object-fit:cover; border-radius:6px; border:1px solid #ddd;">
            </div>
        </div>

        <div class="form-group"><label>وصف المنتج:</label><textarea id="addProdDesc" placeholder="تفاصيل الخامات والمميزات..."></textarea></div>
        
        <hr style="margin: 15px 0; border:0; border-top:1px solid #eee;">
        <h4 style="color:#4A040D; margin-bottom:8px;">أسعار المقاسات:</h4>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 15px;">
            <div><label style="font-size:12px;">1 سنة:</label><input type="number" id="price_1y" placeholder="0"></div>
            <div><label style="font-size:12px;">2 سنة:</label><input type="number" id="price_2y" placeholder="0"></div>
            <div><label style="font-size:12px;">3 سنوات:</label><input type="number" id="price_3y" placeholder="0"></div>
            <div><label style="font-size:12px;">4 سنوات:</label><input type="number" id="price_4y" placeholder="0"></div>
            <div><label style="font-size:12px;">6 سنوات:</label><input type="number" id="price_6y" placeholder="0"></div>
            <div><label style="font-size:12px;">8 سنوات:</label><input type="number" id="price_8y" placeholder="0"></div>
            <div><label style="font-size:12px;">10 سنوات:</label><input type="number" id="price_10y" placeholder="0"></div>
            <div><label style="font-size:12px;">12 سنة:</label><input type="number" id="price_12y" placeholder="0"></div>
            <div><label style="font-size:12px;">XS:</label><input type="number" id="price_XS" placeholder="0"></div>
            <div><label style="font-size:12px;">S:</label><input type="number" id="price_S" placeholder="0"></div>
            <div><label style="font-size:12px;">M:</label><input type="number" id="price_M" placeholder="0"></div>
            <div><label style="font-size:12px;">L:</label><input type="number" id="price_L" placeholder="0"></div>
            <div><label style="font-size:12px;">XL:</label><input type="number" id="price_XL" placeholder="0"></div>
            <div><label style="font-size:12px;">2XL:</label><input type="number" id="price_2XL" placeholder="0"></div>
            <div><label style="font-size:12px;">3XL:</label><input type="number" id="price_3XL" placeholder="0"></div>
            <div><label style="font-size:12px;">Free Size:</label><input type="number" id="price_Free" placeholder="0"></div>
        </div>

        <hr style="margin: 15px 0; border:0; border-top:1px solid #eee;">
        <h4 style="color:#4A040D; margin-bottom:8px;">ألوان المنتج (حتى 25 لوناً):</h4>
        <div id="colorUploadsContainer" style="max-height: 180px; overflow-y: auto; border: 1px dashed #D4AF37; padding: 10px; border-radius: 6px; margin-bottom: 15px;"></div>
        <button type="button" onclick="addColorUploadField()" style="background:#f7f4ed; border:1px solid #D4AF37; color:#4A040D; padding:8px; border-radius:5px; font-weight:bold; cursor:pointer; width:100%; margin-bottom:15px;">+ إضافة لون جديد</button>

        <button onclick="saveNewAdvancedProduct()" style="width:100%; background:#4A040D; color:#fff; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer;">حفظ ونشر المنتج</button>
    `;
    modal.style.display = 'flex';
    addColorUploadField();
}

// 2. تعديل منتج قائم
function openEditProductModal(productId) {
    if (!ownerSession) return;
    const product = findProduct(productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content" id="productModalContent"></div>`;
        document.body.appendChild(modal);
    }

    let firstPrice = 500;
    for(let s in product.sizes) {
        if(product.sizes[s].price) { firstPrice = product.sizes[s].price; break; }
    }

    const content = document.getElementById('productModalContent');
    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color: #4A040D; text-align: center; margin-bottom: 15px;">تعديل المنتج</h2>
        <div class="form-group"><label>اسم المنتج:</label><input type="text" id="editProdTitle" value="${product.titleAr}"></div>
        <div class="form-group"><label>السعر الافتراضي (ج.م):</label><input type="number" id="editProdPrice" value="${firstPrice}"></div>
        <div class="form-group"><label>رابط الصورة:</label><input type="text" id="editProdImg" value="${product.image}"></div>
        <div class="form-group"><label>الوصف:</label><textarea id="editProdDesc">${product.description || ''}</textarea></div>
        <button onclick="saveEditedProduct('${product.id}')" style="width:100%; background:#D4AF37; color:#fff; border:none; padding:12px; border-radius:5px; font-weight:bold; cursor:pointer;">تحديث بيانات المنتج</button>
    `;
    modal.style.display = 'flex';
}

function saveEditedProduct(productId) {
    let product = findProduct(productId);
    if (!product) return;

    let newTitle = document.getElementById('editProdTitle').value.trim();
    let newPrice = parseFloat(document.getElementById('editProdPrice').value) || 0;
    let newImg = document.getElementById('editProdImg').value.trim();
    let newDesc = document.getElementById('editProdDesc').value.trim();

    if (newTitle) { product.titleAr = newTitle; product.titleEn = newTitle; }
    if (newPrice > 0) {
        for(let s in product.sizes) {
            if (product.sizes[s].available) {
                product.sizes[s].price = newPrice;
                break;
            }
        }
    }
    if (newImg) { product.image = newImg; }
    product.description = newDesc;

    localStorage.setItem('jag_products', JSON.stringify(products));
    closeProductModal();
    renderProducts(products);
    alert('تم تحديث المنتج بنجاح!');
}

// 3. حذف منتج
function deleteProduct(productId) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذا المنتج نهائياً؟')) return;
    products = products.filter(p => String(p.id) !== String(productId));
    localStorage.setItem('jag_products', JSON.stringify(products));
    renderProducts(products);
}

// 4. تفعيل أو إلغاء حالة نفذ / إتاحة
function toggleOutOfStock(productId) {
    if (!ownerSession) return;
    let product = findProduct(productId);
    if (product) {
        product.outOfStock = !product.outOfStock;
        localStorage.setItem('jag_products', JSON.stringify(products));
        renderProducts(products);
    }
}

function handleMainImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentBase64Image = e.target.result;
            document.getElementById('mainImgPreview').src = currentBase64Image;
        };
        reader.readAsDataURL(file);
    }
}

function handleMainImageUrl(event) {
    let urlVal = event.target.value.trim();
    if(urlVal) {
        currentBase64Image = urlVal;
        document.getElementById('mainImgPreview').src = urlVal;
    }
}

function addColorUploadField() {
    if (colorUploadsList.length >= 25) { alert('الحد الأقصى 25 لوناً.'); return; }
    const index = colorUploadsList.length;
    colorUploadsList.push({ name: '', image: '' });

    const container = document.getElementById('colorUploadsContainer');
    const div = document.createElement('div');
    div.id = `color_row_${index}`;
    div.style.cssText = "display: flex; gap: 10px; align-items: center; margin-bottom: 10px; background:#fff; padding:6px; border-radius:5px; border:1px solid #eee;";
    div.innerHTML = `
        <input type="text" placeholder="اسم اللون (مثال: برجندي)" id="color_name_${index}" oninput="updateColorData(${index})" style="flex:1; padding:7px; border:1px solid #ccc; border-radius:4px; font-size:13px;">
        <input type="file" accept="image/*" onchange="handleColorImageUpload(event, ${index})" style="font-size:11px; width:120px;">
        <input type="text" placeholder="أو رابط URL" id="color_url_${index}" oninput="updateColorUrl(${index})" style="width:90px; padding:6px; font-size:11px; border:1px solid #ccc; border-radius:4px;">
        <img id="color_preview_${index}" src="" style="width:32px; height:32px; object-fit:cover; border-radius:4px; display:none; border:1px solid #ddd;">
        <button type="button" onclick="removeColorField(${index})" style="background:#c00; color:#fff; border:none; padding:5px 8px; border-radius:4px; cursor:pointer; font-size:11px;">حذف</button>
    `;
    container.appendChild(div);
}

function updateColorData(index) {
    let nameVal = document.getElementById(`color_name_${index}`).value;
    if(colorUploadsList[index]) colorUploadsList[index].name = nameVal;
}

function updateColorUrl(index) {
    let urlVal = document.getElementById(`color_url_${index}`).value.trim();
    if(colorUploadsList[index] && urlVal) {
        colorUploadsList[index].image = urlVal;
        let prevImg = document.getElementById(`color_preview_${index}`);
        prevImg.src = urlVal;
        prevImg.style.display = 'block';
    }
}

function handleColorImageUpload(event, index) {
    const file = event.target.files[0];
    if (file && colorUploadsList[index]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            colorUploadsList[index].image = e.target.result;
            let prevImg = document.getElementById(`color_preview_${index}`);
            prevImg.src = e.target.result;
            prevImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeColorField(index) {
    const row = document.getElementById(`color_row_${index}`);
    if (row) row.remove();
    colorUploadsList[index] = null;
}

function saveNewAdvancedProduct() {
    let title = document.getElementById('addProdTitle').value.trim();
    let category = document.getElementById('addProdCat').value;
    let description = document.getElementById('addProdDesc').value.trim();

    if (!title) { alert('يرجى إدخال اسم المنتج.'); return; }

    let sizeKeys = ["1y", "2y", "3y", "4y", "6y", "8y", "10y", "12y", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Free"];
    let sizesObj = {};
    sizeKeys.forEach(s => {
        let inputEl = document.getElementById(`price_${s}`);
        let pVal = inputEl ? parseFloat(inputEl.value) || 0 : 0;
        if(pVal > 0) sizesObj[s] = { price: pVal, oldPrice: 0, available: true };
    });

    if(Object.keys(sizesObj).length === 0) sizesObj["M"] = { price: 500, oldPrice: 0, available: true };

    let finalColors = colorUploadsList.filter(c => c !== null && (c.name || c.image));
    if(finalColors.length === 0) finalColors = [{ name: "الأساسي", image: currentBase64Image }];

    let newProduct = {
        id: String(Date.now()),
        titleAr: title,
        titleEn: title,
        category: category,
        hasDiscount: false,
        image: currentBase64Image,
        description: description,
        outOfStock: false,
        colors: finalColors,
        sizes: sizesObj
    };

    products.unshift(newProduct);
    localStorage.setItem('jag_products', JSON.stringify(products));
    closeProductModal();
    renderProducts(products);
    alert('تم إضافة المنتج بكافة مقاساته وألوانه بنجاح!');
}

// 🌟 تفاصيل المنتج مع أزرار المقاسات التفاعلية وتغيير الصور عبر الألوان
function openProductDetails(productId) {
    const product = findProduct(productId);
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
                    style="background: ${isSelected ? '#4A040D' : '#f7f4ed'}; color: ${isSelected ? '#fff' : '#4A040D'}; border: 1px solid #D4AF37; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.2s;">
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

function updateCartCount() {
    let badge = document.getElementById('cartCountBadge');
    if(badge) badge.innerText = cart.length;
}

function renderReviews() {}
function renderCommunityChat() {}
function updateOwnerUI() {}
function openProfileModal() {}
