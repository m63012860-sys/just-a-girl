// =========================================================================
// الكود المعدل لموقع Just a Girl
// =========================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

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
const db = getFirestore(app);

const WHATSAPP_NUMBER = "201283332160";

let adminPin = localStorage.getItem("jag_admin_pin") || null;
let ownerSession = false;
let failedPinAttempts = 0;
let pinLockedUntil = 0;
let mainProductImageBase64 = "";

const heroBanners = [
    {
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
        titleAr: "أناقة شتوية وصيفية متكاملة",
        titleEn: "Complete Seasonal Elegance"
    },
    {
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
        titleAr: "تشكيلة Just a Girl الجديدة",
        titleEn: "The New Just a Girl Collection"
    }
];

let products = [];

let customerReviews =
    JSON.parse(localStorage.getItem("jag_reviews")) || [
        {
            id: 1,
            name: "سارة محمد",
            comment: "الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!",
            rating: 5,
            image: ""
        }
    ];

let pendingReviewImage = "";

let communityMessages =
    JSON.parse(localStorage.getItem("jag_community")) || [
        {
            id: 1,
            sender: "نوران أحمد",
            text: "يا جماعة، هل مقاسات الفساتين مضبوطة بالظبط ولا واسعة؟",
            isOwner: false,
            replies: []
        },
        {
            id: 2,
            sender: "Just a Girl (المالك)",
            text: "أهلاً يا نوران! المقاسات مضبوطة تماماً حسب جدول المقاسات لكل منتج ✨",
            isOwner: true,
            replies: []
        }
    ];

let currentLang = "ar";
let cart = JSON.parse(localStorage.getItem("just_girl_cart")) || [];
let replyingToId = null;
let colorUploadsList = [];

// تشغيل الأساسيات بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    try { trackUserActivity(); } catch (e) {
        console.error(e);
    }

    try { initSlider(); } catch (e) {
        console.error(e);
    }

    try { initProductsListener(); } catch (e) {
        console.error(e);
    }

    try { renderReviews(); } catch (e) {
        console.error(e);
    }

    try { renderCommunityChat(); } catch (e) {
        console.error(e);
    }

    try { updateCartCount(); } catch (e) {
        console.error(e);
    }

    try { addAdminPanelButton(); } catch (e) {
        console.error(e);
    }
});

// ضغط الصور
function compressImage(base64Str, maxWidth, quality, callback) {
    const img = new Image();

    img.onload = () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.error("تعذر معالجة الصورة.");
            return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        callback(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
        console.error("تعذر تحميل الصورة.");
    };

    img.src = base64Str;
}

// جلب المنتجات مباشرة من Firestore
function initProductsListener() {
    onSnapshot(
        collection(db, "products"),
        (snapshot) => {
            products = [];

            snapshot.forEach((docSnap) => {
                products.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });

            renderProducts();
            renderAdminProductsList();
        },
        (error) => {
            console.error("خطأ في جلب المنتجات:", error);
        }
    );
}

// إحصائيات الزيارات والطلبات
function trackUserActivity() {
    let visits = Number(localStorage.getItem("jag_visits") || 0);
    visits++;

    localStorage.setItem("jag_visits", String(visits));

    const visitDisplay = document.getElementById("visitCountDisplay");
    const orderDisplay = document.getElementById("orderCountDisplay");

    if (visitDisplay) {
        visitDisplay.innerText = visits;
    }

    if (orderDisplay) {
        orderDisplay.innerText = localStorage.getItem("jag_orders") || 0;
    }
}

// السلايدر الرئيسي
function initSlider() {
    const slider = document.getElementById("heroSlider");

    if (!slider) return;

    slider.innerHTML = "";

    heroBanners.forEach((banner, index) => {
        const div = document.createElement("div");

        div.className = `hero-slide ${index === 0 ? "active" : ""}`;

        div.style.backgroundImage =
            `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner.image}')`;

        const title =
            currentLang === "ar" ? banner.titleAr : banner.titleEn;

        div.innerHTML = `
            <div class="hero-content">
                <h2>${title}</h2>
                <p>Just a Girl - Luxury Fashion</p>
            </div>
        `;

        slider.appendChild(div);
    });

    let currentSlide = 0;

    setInterval(() => {
        const slides = document.querySelectorAll(".hero-slide");

        if (slides.length === 0) return;

        slides[currentSlide].classList.remove("active");

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add("active");
    }, 4000);
}
