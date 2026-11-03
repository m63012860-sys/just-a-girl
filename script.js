
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    collection,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

/* =========================================================
   إعدادات الموقع
========================================================= */

const WHATSAPP_NUMBER = "201283332160";

const STORAGE_KEYS = {
    products: "jag_products",
    reviews: "jag_reviews",
    community: "jag_community",
    cart: "jag_cart"
};

let products = [];
let reviews = [];
let communityMessages = [];
let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]");

let currentUser = null;
let selectedCategory = "all";
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let selectedReviewImage = "";
let currentLanguage = "ar";
let sliderInterval = null;

/* =========================================================
   أدوات مساعدة
========================================================= */

const $ = id => document.getElementById(id);

function showMessage(message) {
    alert(message);
}

function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function saveCart() {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    updateCartCount();
}

function isOwner() {
    return currentUser !== null;
}

function formatPrice(price) {
    return `${Number(price || 0).toLocaleString("ar-EG")} ج.م`;
}

function safeImage(url) {
    if (!url) return "";
    try {
        const parsed = new URL(url);
        return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "";
    } catch {
        return "";
    }
}

/* =========================================================
   الاتصال بـ Firestore
========================================================= */

function listenToCollection(name, callback, sortField = null) {
    const ref = collection(db, name);
    const q = sortField
        ? query(ref, orderBy(sortField, "desc"))
        : ref;

    return onSnapshot(q, snapshot => {
        callback(snapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        })));
    }, error => {
        console.error(`Firestore ${name}:`, error);
        showMessage("حدثت مشكلة في تحميل البيانات. تأكدي من اتصال الإنترنت وقواعد Firestore.");
    });
}

listenToCollection("products", data => {
    products = data;
    renderProducts();
});

listenToCollection("reviews", data => {
    reviews = data;
    renderReviews();
});

listenToCollection("community", data => {
    communityMessages = data;
    renderCommunityChat();
}, "createdAt");

/* =========================================================
   تسجيل الدخول وحالة الإدارة
========================================================= */

onAuthStateChanged(auth, user => {
    currentUser = user;
    updateOwnerUI();
    ensureAdminButton();
});

async function loginAdmin() {
    const email = $("adminEmailInput")?.value.trim();
    const password = $("adminPasswordInput")?.value;

    if (!email || !password) {
        showMessage("اكتبي البريد الإلكتروني وكلمة المرور.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        closeProfileModal();
        showMessage("تم تسجيل الدخول بنجاح.");
    } catch (error) {
        console.error(error);
        showMessage("تعذر تسجيل الدخول. راجعي البريد وكلمة المرور.");
    }
}

async function logoutOwner() {
    try {
        await signOut(auth);
        showMessage("تم تسجيل الخروج.");
    } catch (error) {
        console.error(error);
        showMessage("تعذر تسجيل الخروج.");
    }
}

async function logoutAdmin() {
    await logoutOwner();
}

async function updateAdminAccount() {
    if (!currentUser) {
        showMessage("يجب تسجيل الدخول أولًا.");
        return;
    }

    const newEmail = $("newAdminEmail")?.value.trim();
    const newPassword = $("newAdminPassword")?.value;

    try {
        if (newEmail && newEmail !== currentUser.email) {
            await updateEmail(currentUser, newEmail);
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
                return;
            }
            await updatePassword(currentUser, newPassword);
        }

        $("newAdminEmail").value = "";
        $("newAdminPassword").value = "";

        showMessage("تم تحديث الحساب.");
    } catch (error) {
        console.error(error);

        if (error.code === "auth/requires-recent-login") {
            showMessage("لأسباب أمنية، سجّلي الخروج ثم الدخول مرة أخرى قبل تغيير بيانات الحساب.");
        } else {
            showMessage("تعذر تحديث الحساب. راجعي البيانات وحاولي مرة أخرى.");
        }
    }
}

function updateOwnerUI() {
    const panel = $("adminPanelContainer");
    const reviewForm = $("ownerReviewForm");
    const loginForm = $("adminLoginForm");
    const settings = $("adminSettingsSection");

    if (panel) panel.style.display = isOwner() ? "block" : "none";
    if (reviewForm) reviewForm.style.display = isOwner() ? "block" : "none";
    if (loginForm) loginForm.style.display = isOwner() ? "none" : "block";
    if (settings) settings.style.display = isOwner() ? "block" : "none";
}

function ensureAdminButton() {
    if ($("floatingAdminBtn")) return;

    const button = document.createElement("button");
    button.id = "floatingAdminBtn";
    button.innerHTML = '<i class="fa-solid fa-user-shield"></i> الإدارة';
    button.onclick = openProfileModal;
    document.body.appendChild(button);
}

/* =========================================================
   النوافذ
========================================================= */

function openProfileModal() {
    $("profileModal").style.display = "flex";
    updateOwnerUI();

    const visits = Number(localStorage.getItem("jag_visits") || 0) + 1;
    localStorage.setItem("jag_visits", visits);

    if ($("visitCountDisplay")) {
        $("visitCountDisplay").textContent = visits;
    }

    if ($("orderCountDisplay")) {
        $("orderCountDisplay").textContent =
            localStorage.getItem("jag_orders_count") || "0";
    }
}

function closeProfileModal() {
    $("profileModal").style.display = "none";
}

function openAccountSettings() {
    if (!isOwner()) {
        showMessage("هذه الخاصية للمالكة فقط.");
        return;
    }

    $("profileModal").style.display = "flex";
    updateOwnerUI();
}

function closeCartModal() {
    $("cartModal").style.display = "none";
}

function openCartModal() {
    renderCart();
    $("cartModal").style.display = "flex";
}

/* =========================================================
   السلايدر
========================================================= */

function initSlider() {
    const slider = $("heroSlider");
    if (!slider) return;

    const slides = [
        {
            title: "Just a Girl",
            text: "Your Style, Your Story",
            image: ""
        },
        {
            title: "Elegance in Every Detail",
            text: "اختاري إطلالتك المميزة",
            image: ""
        },
        {
            title: "Made for Your Style",
            text: "أناقتك تبدأ من هنا",
            image: ""
        }
    ];

    slider.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? "active" : ""}"
             ${slide.image ? `style="background-image:url('${safeImage(slide.image)}')"` : ""}>
            <div class="hero-content">
                <h2>${slide.title}</h2>
                <p>${slide.text}</p>
            </div>
        </div>
    `).join("");

    let active = 0;

    if (sliderInterval) clearInterval(sliderInterval);

    sliderInterval = setInterval(() => {
        const items = slider.querySelectorAll(".hero-slide");
        if (!items.length) return;

        items[active].classList.remove("active");
        active = (active + 1) % items.length;
        items[active].classList.add("active");
    }, 4000);
}

/* =========================================================
   عرض المنتجات والبحث والأقسام
========================================================= */

function renderProducts() {
    const grid = $("productsGrid");
    if (!grid) return;

    const search = ($("searchInput")?.value || "").trim().toLowerCase();

    const filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            `${product.name || ""} ${product.description || ""}`
                .toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (!filtered.length) {
        grid.innerHTML = "<p style='text-align:center;grid-column:1/-1'>لا توجد منتجات حاليًا في هذا القسم.</p>";
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const image = safeImage(product.image);
        const sizes = product.sizes || [];
        const prices = sizes.map(s => Number(s.price || 0)).filter(Boolean);
        const minPrice = prices.length ? Math.min(...prices) : Number(product.price || 0);

        return `
            <div class="product-card">
                ${product.outOfStock ? `
                    <span style="position:absolute;top:10px;right:10px;background:#c00;color:white;padding:5px 9px;border-radius:5px;z-index:2">
                        غير متوفر
                    </span>` : ""}
                <img class="product-img"
                     src="${image || "https://placehold.co/500x600/fdfbf7/4A040D?text=Just+a+Girl"}"
                     alt="${escapeHtml(product.name)}"
                     onerror="this.src='https://placehold.co/500x600/fdfbf7/4A040D?text=Just+a+Girl'">
                <div class="product-info">
                    <h3 class="product-title">${escapeHtml(product.name)}</h3>
                    <p class="product-desc">${escapeHtml(product.description || "")}</p>
                    <div class="price-box">
                        ${minPrice ? `يبدأ من ${formatPrice(minPrice)}` : "السعر حسب الاختيار"}
                        ${product.oldPrice ? `<del style="color:#999;font-size:12px">${formatPrice(product.oldPrice)}</del>` : ""}
                    </div>
                    <button class="view-details-btn" onclick="openProductDetails('${product.id}')">
                        عرض التفاصيل
                    </button>
                    ${isOwner() ? `
                        <div style="display:flex;gap:6px;margin-top:8px">
                            <button onclick="openEditProductModal('${product.id}')" style="flex:1;padding:7px;background:#D4AF37;color:white;border:0;border-radius:5px;cursor:pointer">تعديل</button>
                            <button onclick="toggleOutOfStock('${product.id}')" style="flex:1;padding:7px;background:#555;color:white;border:0;border-radius:5px;cursor:pointer">${product.outOfStock ? "متوفر" : "نفد"}</button>
                            <button onclick="deleteProduct('${product.id}')" style="padding:7px;background:#c00;color:white;border:0;border-radius:5px;cursor:pointer">حذف</button>
                        </div>` : ""}
                </div>
            </div>
        `;
    }).join("");
}

function filterProducts() {
    renderProducts();
}

function filterCategory(category) {
    selectedCategory = category;

    document.querySelectorAll("#categoryNav button").forEach(button => {
        button.classList.toggle(
            "active",
            button.getAttribute("onclick")?.includes(`'${category}'`)
        );
    });

    renderProducts();
}

function toggleLang() {
    currentLanguage = currentLanguage === "ar" ? "en" : "ar";
    if ($("langText")) {
        $("langText").textContent = currentLanguage === "ar" ? "EN" : "AR";
    }
    showMessage(
        currentLanguage === "en"
            ? "English mode is being prepared. Product information remains as entered."
            : "تم الرجوع للوضع العربي."
    );
}

/* =========================================================
   تفاصيل المنتج واختيار المقاس واللون
========================================================= */

function openProductDetails(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    currentProduct = product;
    selectedSize = null;
    selectedColor = null;

    const sizes = product.sizes || [];
    const colors = product.colors || [];

    const content = $("productModalContent");

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color:#4A040D;margin-bottom:12px">${escapeHtml(product.name)}</h2>

        <img id="detailProductImage"
             src="${safeImage(product.image) || "https://placehold.co/500x600"}"
             style="width:100%;max-height:300px;object-fit:contain;border-radius:8px">

        <p style="margin:12px 0">${escapeHtml(product.description || "")}</p>

        ${sizes.length ? `
            <h4 style="margin:12px 0 8px;color:#4A040D">اختاري المقاس:</h4>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
                ${sizes.map((size, index) => `
                    <button class="size-choice"
                        onclick="selectProductSize(${index})"
                        id="sizeChoice${index}"
                        style="padding:9px 14px;border:1px solid #D4AF37;background:#fff;border-radius:6px;cursor:pointer">
                        ${escapeHtml(size.name)} - ${formatPrice(size.price)}
                    </button>
                `).join("")}
            </div>
        ` : `
            <p style="margin:10px 0">السعر: ${formatPrice(product.price)}</p>
        `}

        ${colors.length ? `
            <h4 style="margin:15px 0 8px;color:#4A040D">اختاري اللون:</h4>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
                ${colors.map((color, index) => `
                    <button onclick="selectProductColor(${index})"
                        id="colorChoice${index}"
                        style="padding:7px;border:1px solid #ddd;background:white;border-radius:7px;cursor:pointer">
                        ${color.image ? `<img src="${safeImage(color.image)}" style="width:55px;height:55px;object-fit:cover;display:block">` : ""}
                        ${escapeHtml(color.name)}
                    </button>
                `).join("")}
            </div>
        ` : ""}

        <p id="selectedProductPrice" style="font-weight:bold;color:#4A040D;margin:15px 0">
            ${sizes.length ? "اختاري المقاس لمعرفة السعر" : formatPrice(product.price)}
        </p>

        <button onclick="addToCartWithOptions()"
            ${product.outOfStock ? "disabled" : ""}
            style="width:100%;padding:12px;background:${product.outOfStock ? "#999" : "#4A040D"};color:white;border:0;border-radius:6px;font-weight:bold;cursor:pointer">
            ${product.outOfStock ? "المنتج غير متوفر حاليًا" : "إضافة إلى السلة"}
        </button>
    `;

    $("productModal").style.display = "flex";
}

function closeProductModal() {
    $("productModal").style.display = "none";
}

function selectProductSize(index) {
    if (!currentProduct) return;

    const size = currentProduct.sizes?.[index];
    if (!size) return;

    selectedSize = size;

    document.querySelectorAll(".size-choice").forEach(button => {
        button.style.background = "#fff";
        button.style.color = "#333";
    });

    const chosen = $(`sizeChoice${index}`);
    if (chosen) {
        chosen.style.background = "#4A040D";
        chosen.style.color = "#fff";
    }

    $("selectedProductPrice").textContent = formatPrice(size.price);
}

function selectProductColor(index) {
    if (!currentProduct) return;

    const color = currentProduct.colors?.[index];
    if (!color) return;

    selectedColor = color;

    document.querySelectorAll('[id^="colorChoice"]').forEach(button => {
        button.style.border = "1px solid #ddd";
    });

    const chosen = $(`colorChoice${index}`);
    if (chosen) chosen.style.border = "2px solid #4A040D";

    if (color.image && $("detailProductImage")) {
        $("detailProductImage").src = safeImage(color.image);
    }
}

function addToCartWithOptions() {
    if (!currentProduct) return;

    if (currentProduct.outOfStock) {
        showMessage("هذا المنتج غير متوفر حاليًا.");
        return;
    }

    const sizes = currentProduct.sizes || [];

    if (sizes.length && !selectedSize) {
        showMessage("اختاري المقاس أولًا.");
        return;
    }

    const price = Number(selectedSize?.price ?? currentProduct.price ?? 0);

    if (!price || price < 0) {
        showMessage("السعر غير محدد لهذا الاختيار.");
        return;
    }

    const item = {
        cartId: `${currentProduct.id}_${selectedSize?.name || "default"}_${selectedColor?.name || "default"}`,
        productId: currentProduct.id,
        name: currentProduct.name,
        image: selectedColor?.image || currentProduct.image || "",
        size: selectedSize?.name || "غير محدد",
        color: selectedColor?.name || "غير محدد",
        price,
        quantity: 1
    };

    const existing = cart.find(entry => entry.cartId === item.cartId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(item);
    }

    saveCart();
    closeProductModal();
    showMessage("تمت إضافة المنتج إلى السلة.");
}

/* =========================================================
   السلة
========================================================= */

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    if ($("cartCount")) $("cartCount").textContent = count;
}

function renderCart() {
    const list = $("cartItemsList");
    if (!list) return;

    if (!cart.length) {
        list.innerHTML = "<p style='text-align:center;padding:20px'>السلة فارغة حاليًا.</p>";
        $("cartTotalPrice").textContent = "0";
        return;
    }

    list.innerHTML = cart.map(item => `
        <div style="display:flex;gap:12px;align-items:center;border-bottom:1px solid #eee;padding:12px 0">
            <img src="${safeImage(item.image) || "https://placehold.co/80x90"}"
                 style="width:65px;height:75px;object-fit:cover;border-radius:6px">
            <div style="flex:1">
                <strong>${escapeHtml(item.name)}</strong>
                <p>المقاس: ${escapeHtml(item.size)}</p>
                <p>اللون: ${escapeHtml(item.color)}</p>
                <p>${formatPrice(item.price)} × ${item.quantity}</p>
                <div style="display:flex;gap:8px;margin-top:5px">
                    <button onclick="changeCartQuantity('${item.cartId}',-1)">−</button>
                    <button onclick="changeCartQuantity('${item.cartId}',1)">+</button>
                    <button onclick="removeFromCart('${item.cartId}')" style="color:#c00">حذف</button>
                </div>
            </div>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) =>
        sum + Number(item.price) * Number(item.quantity), 0);

    $("cartTotalPrice").textContent = total.toLocaleString("ar-EG");
}

function changeCartQuantity(cartId, amount) {
    const item = cart.find(entry => entry.cartId === cartId);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.cartId !== cartId);
    }

    saveCart();
    renderCart();
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    saveCart();
    renderCart();
}

/* =========================================================
   تأكيد الطلب عبر واتساب
========================================================= */

function sendToWhatsApp() {
    if (!cart.length) {
        showMessage("السلة فارغة.");
        return;
    }

    const name = $("clientName")?.value.trim();
    const phone = $("clientPhone")?.value.trim();
    const address = $("clientAddress")?.value.trim();
    const accepted = $("legalCheck")?.checked;

    if (!name || !phone || !address) {
        showMessage("من فضلك املئي الاسم ورقم الهاتف والعنوان.");
        return;
    }

    if (!accepted) {
        showMessage("يجب الموافقة على الشروط قبل إرسال الطلب.");
        return;
    }

    const total = cart.reduce((sum, item) =>
        sum + Number(item.price) * Number(item.quantity), 0);

    let message = `طلب جديد من Just a Girl\n\n`;
    message += `الاسم: ${name}\n`;
    message += `الهاتف: ${phone}\n`;
    message += `العنوان: ${address}\n\n`;
    message += `تفاصيل الطلب:\n`;

    cart.forEach((item, index) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `المقاس: ${item.size}\n`;
        message += `اللون: ${item.color}\n`;
        message += `السعر: ${item.price} جنيه\n`;
        message += `الكمية: ${item.quantity}\n`;
        message += `الإجمالي: ${item.price * item.quantity} جنيه\n`;
    });

    message += `\nالإجمالي الكلي: ${total} جنيه`;
    message += `\nالديبوزيت المطلوب: 100 جنيه`;
    message += `\nأوافق على شروط الحجز والشحن.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    const count = Number(localStorage.getItem("jag_orders_count") || 0) + 1;
    localStorage.setItem("jag_orders_count", count);

    cart = [];
    saveCart();
    renderCart();

    $("clientName").value = "";
    $("clientPhone").value = "";
    $("clientAddress").value = "";
    $("legalCheck").checked = false;

    showMessage("تم فتح واتساب برسالة الطلب. راجعي الرسالة واضغطي إرسال لإتمام الطلب.");
}

/* =========================================================
   إضافة وتعديل وحذف المنتجات - للإدارة فقط
========================================================= */

function openAddProductModal() {
    if (!isOwner()) return showMessage("هذه الخاصية للمالكة فقط.");

    showProductEditor();
}

function openEditProductModal(id) {
    if (!isOwner()) return showMessage("هذه الخاصية للمالكة فقط.");

    const product = products.find(item => item.id === id);
    if (!product) return showMessage("المنتج غير موجود.");

    showProductEditor(product);
}

function showProductEditor(product = null) {
    const editing = Boolean(product);
    const content = $("productModalContent");

    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <h2 style="color:#4A040D;margin-bottom:15px">
            ${editing ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h2>

        <div class="form-group">
            <label>اسم المنتج</label>
            <input id="productNameInput" value="${escapeHtml(product?.name || "")}">
        </div>

        <div class="form-group">
            <label>القسم</label>
            <select id="productCategoryInput">
                ${[
                    ["hoodies", "هوديات"],
                    ["pants", "بناطيل"],
                    ["kids", "أطفال"],
                    ["pajamas", "بيجامات"],
                    ["sets", "طقمة"],
                    ["dresses", "فساتين"],
                    ["suits", "بدل"],
                    ["jackets", "جواكت"],
                    ["bundles", "باكدج"],
                    ["offers", "عروض"]
                ].map(([value, label]) => `
                    <option value="${value}" ${product?.category === value ? "selected" : ""}>${label}</option>
                `).join("")}
            </select>
        </div>

        <div class="form-group">
            <label>وصف المنتج</label>
            <textarea id="productDescriptionInput" rows="3">${escapeHtml(product?.description || "")}</textarea>
        </div>

        <div class="form-group">
            <label>رابط الصورة الرئيسية</label>
            <input id="productImageInput" type="url" placeholder="https://..." value="${escapeHtml(product?.image || "")}">
        </div>

        <div class="form-group">
            <label>السعر الأساسي (لو مفيش مقاسات بأسعار مختلفة)</label>
            <input id="productPriceInput" type="number" min="0" value="${Number(product?.price || 0)}">
        </div>

        <div class="form-group">
            <label>السعر القديم (اختياري)</label>
            <input id="productOldPriceInput" type="number" min="0" value="${Number(product?.oldPrice || 0)}">
        </div>

        <div class="form-group">
            <label>المقاسات والأسعار (كل سطر: المقاس,السعر)</label>
            <textarea id="productSizesInput" rows="4" placeholder="S,450&#10;M,500&#10;L,550">${(product?.sizes || []).map(s => `${s.name},${s.price}`).join("\n")}</textarea>
        </div>

        <div class="form-group">
            <label>الألوان (كل سطر: اسم اللون,رابط الصورة اختياري)</label>
            <textarea id="productColorsInput" rows="4" placeholder="أسود,https://...&#10;أوف وايت,https://...">${(product?.colors || []).map(c => `${c.name},${c.image || ""}`).join("\n")}</textarea>
        </div>

        <button onclick="saveProduct('${product?.id || ""}')"
            style="width:100%;padding:12px;background:#4A040D;color:white;border:0;border-radius:6px;font-weight:bold;cursor:pointer">
            ${editing ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
    `;

    $("productModal").style.display = "flex";
}

function parseLines(text, type) {
    return text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
        const parts = line.split(",");
        if (type === "size") {
            return {
                name: (parts[0] || "").trim(),
                price: Number((parts[1] || "").trim())
            };
        }

        return {
            name: (parts[0] || "").trim(),
            image: safeImage((parts[1] || "").trim())
        };
    });
}

async function saveProduct(id) {
    if (!isOwner()) return showMessage("يجب تسجيل الدخول.");

    const name = $("productNameInput").value.trim();
    const category = $("productCategoryInput").value;
    const description = $("productDescriptionInput").value.trim();
    const image = safeImage($("productImageInput").value.trim());
    const price = Number($("productPriceInput").value || 0);
    const oldPrice = Number($("productOldPriceInput").value || 0);

    const sizes = parseLines($("productSizesInput").value, "size");
    const colors = parseLines($("productColorsInput").value, "color");

    if (!name) return showMessage("اكتبي اسم المنتج.");
    if (!image) return showMessage("أضيفي رابط صورة صحيح.");
    if (!sizes.length && price <= 0) return showMessage("أضيفي سعرًا صحيحًا أو مقاسات بأسعارها.");

    if (sizes.some(size => !size.name || !Number.isFinite(size.price) || size.price <= 0)) {
        return showMessage("راجعي المقاسات والأسعار. اكتبي كل مقاس وسعره في سطر.");
    }

    const productData = {
        name,
        category,
        description,
        image,
        price,
        oldPrice,
        sizes,
        colors,
        updatedAt: serverTimestamp()
    };

    try {
        if (id) {
            await updateDoc(doc(db, "products", id), productData);
            showMessage("تم تعديل المنتج.");
        } else {
            await addDoc(collection(db, "products"), {
                ...productData,
                outOfStock: false,
                createdAt: serverTimestamp()
            });
            showMessage("تمت إضافة المنتج.");
        }

        closeProductModal();
    } catch (error) {
        console.error(error);
        showMessage("تعذر حفظ المنتج. تأكدي من تسجيل الدخول وقواعد Firestore.");
    }
}

async function deleteProduct(id) {
    if (!isOwner()) return showMessage("هذه الخاصية للمالكة فقط.");
    if (!confirm("هل أنتِ متأكدة من حذف المنتج؟")) return;

    try {
        await deleteDoc(doc(db, "products", id));
        showMessage("تم حذف المنتج.");
    } catch (error) {
        console.error(error);
        showMessage("تعذر حذف المنتج.");
    }
}

async function toggleOutOfStock(id) {
    if (!isOwner()) return;

    const product = products.find(item => item.id === id);
    if (!product) return;

    try {
        await updateDoc(doc(db, "products", id), {
            outOfStock: !product.outOfStock,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error(error);
        showMessage("تعذر تحديث حالة المنتج.");
    }
}

/* =========================================================
   التقييمات
========================================================= */

function renderReviews() {
    const grid = $("reviewsGrid");
    if (!grid) return;

    if (!reviews.length) {
        grid.innerHTML = "<p style='text-align:center;grid-column:1/-1'>لا توجد تقييمات منشورة حتى الآن.</p>";
        return;
    }

    grid.innerHTML = reviews.map(review => `
        <div style="background:#fff;padding:18px;border:1px solid #eee5d3;border-radius:10px">
            <strong style="color:#4A040D">${escapeHtml(review.name || "عميلة")}</strong>
            <p style="color:#D4AF37;margin:7px 0">${"⭐".repeat(Math.min(5, Math.max(1, Number(review.stars || 5)))}</p>
            <p>${escapeHtml(review.text || "")}</p>
            ${review.image ? `
                <img src="${safeImage(review.image)}"
                     style="width:100%;max-height:280px;object-fit:contain;margin-top:10px;border-radius:7px">
            ` : ""}
            ${isOwner() ? `
                <button onclick="deleteReview('${review.id}')"
                    style="margin-top:10px;color:white;background:#c00;border:0;padding:7px 12px;border-radius:5px;cursor:pointer">
                    حذف التقييم
                </button>` : ""}
        </div>
    `).join("");
}

function previewReviewImage(input) {
    const file = input.files?.[0];

    if (!file) return;

    showMessage("رفع الصور من الجهاز غير متاح حاليًا. استخدمي رابط صورة منشورًا على خدمة استضافة صور، ثم أضيفيه في حقل رابط الصورة.");

    input.value = "";
}

function clearReviewImage() {
    selectedReviewImage = "";
    if ($("reviewImageInput")) $("reviewImageInput").value = "";
    if ($("reviewImagePreview")) $("reviewImagePreview").innerHTML = "";
    if ($("removeReviewImageBtn")) $("removeReviewImageBtn").style.display = "none";
}

async function addReview() {
    if (!isOwner()) return showMessage("إضافة التقييمات متاحة للمالكة فقط.");

    const name = $("reviewCustomerName").value.trim();
    const text = $("reviewMessageText").value.trim();
    const stars = Number($("reviewStars").value);

    if (!name) return showMessage("اكتبي اسم العميلة.");
    if (!text && !selectedReviewImage) return showMessage("أضيفي نص التقييم.");

    try {
        await addDoc(collection(db, "reviews"), {
            name,
            text,
            stars,
            image: selectedReviewImage,
            createdAt: serverTimestamp()
        });

        $("reviewCustomerName").value = "";
        $("reviewMessageText").value = "";
        clearReviewImage();

        showMessage("تم نشر التقييم.");
    } catch (error) {
        console.error(error);
        showMessage("تعذر نشر التقييم.");
    }
}

async function deleteReview(id) {
    if (!isOwner()) return;
    if (!confirm("هل تريدين حذف هذا التقييم؟")) return;

    try {
        await deleteDoc(doc(db, "reviews", id));
    } catch (error) {
        console.error(error);
        showMessage("تعذر حذف التقييم.");
    }
}

/* =========================================================
   مجتمع العملاء
========================================================= */

function renderCommunityChat() {
    const container = $("chatMessages");
    if (!container) return;

    const sorted = [...communityMessages].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
    });

    container.innerHTML = sorted.map(message => `
        <div style="background:white;border:1px solid #eee;padding:12px;border-radius:8px;margin-bottom:10px">
            <strong style="color:#4A040D">${escapeHtml(message.sender || "عميلة")}</strong>
            ${message.isOwner ? "<span style='color:#D4AF37;font-size:12px'> الإدارة</span>" : ""}
            <p style="margin-top:5px;overflow-wrap:anywhere">${escapeHtml(message.text || "")}</p>
            ${isOwner() ? `
                <button onclick="deleteCommunityMsg('${message.id}')"
                    style="margin-top:7px;color:#c00;background:none;border:0;cursor:pointer">
                    حذف الرسالة
                </button>` : ""}
        </div>
    `).join("");

    container.scrollTop = container.scrollHeight;
}

async function sendCommunityMessage() {
    const sender = $("chatSenderName").value.trim();
    const text = $("chatInputText").value.trim();

    if (!sender || !text) {
        showMessage("اكتبي اسمك والرسالة.");
        return;
    }

    if (sender.length > 60 || text.length > 1000) {
        showMessage("الاسم بحد أقصى 60 حرفًا والرسالة بحد أقصى 1000 حرف.");
        return;
    }

    try {
        await addDoc(collection(db, "community"), {
            sender,
            text,
            isOwner: false,
            replies: [],
            createdAt: serverTimestamp()
        });

        $("chatInputText").value = "";
    } catch (error) {
        console.error(error);
        showMessage("تعذر إرسال الرسالة. تأكدي من قواعد Firestore.");
    }
}

async function deleteCommunityMsg(id) {
    if (!isOwner()) return;
    if (!confirm("هل تريدين حذف الرسالة؟")) return;

    try {
        await deleteDoc(doc(db, "community", id));
    } catch (error) {
        console.error(error);
        showMessage("تعذر حذف الرسالة.");
    }
}

/* =========================================================
   ربط الدوال بأزرار HTML
   مهم لأن script.js يعمل بنظام module
========================================================= */

Object.assign(window, {
    toggleLang,
    filterProducts,
    filterCategory,

    openProfileModal,
    closeProfileModal,
    openAccountSettings,
    loginAdmin,
    logoutAdmin,
    logoutOwner,
    updateAdminAccount,

    openCartModal,
    closeCartModal,
    removeFromCart,
    changeCartQuantity,
    sendToWhatsApp,

    openProductDetails,
    closeProductModal,
    selectProductSize,
    selectProductColor,
    addToCartWithOptions,

    openAddProductModal,
    openEditProductModal,
    saveProduct,
    deleteProduct,
    toggleOutOfStock,

    addReview,
    previewReviewImage,
    clearReviewImage,
    deleteReview,

    sendCommunityMessage,
    deleteCommunityMsg
});

/* =========================================================
   تشغيل الموقع
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initSlider();
    updateCartCount();
    renderCart();
    ensureAdminButton();
    updateOwnerUI();
});

window.addEventListener("click", event => {
    if (event.target === $("cartModal")) closeCartModal();
    if (event.target === $("profileModal")) closeProfileModal();
    if (event.target === $("productModal")) closeProductModal();
});
