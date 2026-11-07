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

// =========================================================================
// 🛒 إدارة سلة الشراء والطلب
// =========================================================================
function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

// =========================================================================
// 💬 نظام مجتمع العملاء (مع الردود الفردية وإمكانية الحذف للمالكة)
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
                        <i class="fa-regular fa-comment-dots"></i> 💬 رد
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

    if (window.db && window.firestoreTools) {
        const { doc, setDoc } = window.firestoreTools;
        setDoc(doc(window.db, "community", newMsg.id), newMsg);
    }

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

        if (window.db && window.firestoreTools) {
            const { doc, setDoc } = window.firestoreTools;
            setDoc(doc(window.db, "community", msg.id), msg);
        }

        renderCommunityChat();
    }
}

function deleteCommunityMessage(msgId) {
    if (!ownerSession) return;
    if (!confirm('هل أنتِ متأكدة من حذف هذه الرسالة وكل الردود عليها؟')) return;

    communityMessages = communityMessages.filter(m => m.id != msgId);
    localStorage.setItem('jag_community', JSON.stringify(communityMessages));

    if (window.db && window.firestoreTools) {
        const { doc, deleteDoc } = window.firestoreTools;
        deleteDoc(doc(window.db, "community", msg.id.toString()));
    }

    renderCommunityChat();
}

function deleteCommunityReply(msgId, replyId) {
    if (!ownerSession) return;
    let msg = communityMessages.find(m => m.id == msgId);
    if (msg && msg.replies) {
        msg.replies = msg.replies.filter(r => r.id != replyId);
        localStorage.setItem('jag_community', JSON.stringify(communityMessages));

        if (window.db && window.firestoreTools) {
            const { doc, setDoc } = window.firestoreTools;
            setDoc(doc(window.db, "community", msg.id), msg);
        }

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

function openProfileModal() {
    let modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'flex';
}
