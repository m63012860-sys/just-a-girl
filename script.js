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

/*📌    دليل إضافة منتج جديد في مصفوفة products (احفظي هذا القالب كمرجع لكِ):
   =========================================================================
    { 
        id: "3", // غيري رقم الـ ID لكل منتج جديد (مثلاً: 3، 4، 5...)
        titleAr: "اكتبي اسم المنتج بالعربي هنا", 
        titleEn: "Product Name in English", 
        category: "hoodies", // الأقسام المتاحة: hoodies, pants, kids, pajamas, sets, dresses, suits, jackets, bundles, offers  mens  
        hasDiscount: false,
        image: "رابط_الصورة_الرئيسية_للمنتج.jpg", 
        description: "اكتبي هنا وصف الخامات وتفاصيل التلبيس والنوع...",
        outOfStock: false, // false لو متاح، و true لو خلصان
        colors: [
            { name: "أسود", image: "رابط_صورة_اللون_الأسود.jpg" },
            { name: "برجندي", image: "رابط_صورة_اللون_البرجندي.jpg" }
        ],
        sizes: { 
            "S": { price: 600, available: true },
            "M": { price: 650, available: true },
            "L": { price: 0, available: false },
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
        description: "بيلبس لحد 95 كيلو 🫶 أبعاد 💖 الخامة ميلتون         لايت",
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
        description: "  جينة صافي فائقة النعومة والجودة ❤️❤️❤️📐 المقاس: فري سايز بنى اسود برجندى  لبنى  (Free Size) لحد 95 كيلو مرتاح جداً ❤️",
        outOfStock: false,
        colors: [
            // ⚠️ الرابط ده كان ناقص ومكسور، حطي هنا رابط صورة اللون "بنى" الصحيح من postimages
            { name: "بنى", image: "" },
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
            { name: "مجمع اشكال  ", image: "https://i.postimg.cc/Xqg1jnXH/IMG-20261108-004306-171.jpg" },
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
            { name: "اشكال ", image: "https://i.postimg.cc/4yrvRMQD/IMG-20261107-131930-120.jpg" },
            { name: "اشكال ", image: "https://i.postimg.cc/44KFjTJv/IMG-20261108-010416-978.jpg" }
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
            { name: " تفاصيل", image: "https://i.postimg.cc/W3Bj1FPq/IMG-20261108-004244-801.jpg" }
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
        id: "6",
        titleAr: "سويت شيرت هاف زيب رجالي (Running Club)", 
        titleEn: "Men's Half Zip Sweatshirt - Running Club", 
        category: "mens", 
        hasDiscount: false,
        image: "https://i.postimg.cc/mkT0pQYm/IMG-20261108-005603-856.jpg", 
        description: "سويت شيرت رجالي بتصميم عصري (هاف زيب) مع سحاب وياقة مرتفعة، مكتوب عليه عبارات مميزة في الصدر والخلف (Running Club)، الخامات ميلتون لايت مريحة وممتازة للأجواء المعتدلة، تلبيس فري سايز مريح لحد 95 كجم.الوان  ابيض   اسود   بنى ", 
        outOfStock: false, 
        colors: [
            { name: "تفاصيل", image: "https://i.postimg.cc/sDDkp4Df/IMG-20261108-005604-608.jpg" },
           
        ],
        sizes: { 
            "S": { price: 0, available: false },
            "M": { price: 0, available: false },
            "L": { price: 0, available: false },
            "Free": { price: 300, available: true }
        }
    },
     { 
        id: "7", 
        titleAr: "سويت شيرت فراشة", 
        titleEn: "Butterfly Sweatshirt", 
        category: "kids", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/VLTFYp4n/IMG-20261108-004802-099.jpg", 
        description: "الخامه ميلتون لايت مبطن من جوه تقيل 🫶❤️مقاس 4 ❤️ بيلبس من 3 سنوات الى 5   مقاس 8 ❤️ بيلبس من 6 سنوات الى 8   مقاس 12 ❤️ من 8 سنوات الى 12   الالوان احمر / ابيض / بيج / بينك بيبي بلو / كحليل   ",
        outOfStock: false,
        colors: [
           
            { name: "بينك", image: "https://i.postimg.cc/k4nQ1mX3/IMG-20261108-004802-678.jpg" },
          
        ],
        sizes: { 
            "1y": { price: 0, available: false },
            "2y": { price: 0, available: false },
            "3y": { price: 0, available: false },
            "4y": { price: 250, available: true },
            "6y": { price: 0, available: false },
            "8y": { price: 250, available: true },
            "10y": { price: 0, available: false },
            "12y": { price: 250, available: true },
            "XS": { price: 0, available: false },
            "S": { price: 0, available: false },
            "M": { price: 0, available: false },
            "L": { price: 0, available: false },
            "XL": { price: 0, available: false },
            "2XL": { price: 0, available: false },
            "3XL": { price: 0, available: false },
            "Free": { price: 0, available: false }
        }
    },
    { 
        id: "8", 
        titleAr: "وايت ليج ميلتون", 
        titleEn: "Milton Wide Leg Pants", 
        category: "pants", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/4NT9BG8L/IMG-20261108-005130-979.jpg", 
        description: "مقاس فري سايز بيلبس لحد 95 كيلو 🫶💕 الخامة ميلتون لايت 🫶❤️ابيض اسود بيج بني",
        outOfStock: false,
        colors: [
            { name: "بيج", image: "https://i.postimg.cc/mgLFWwWh/IMG-20261108-005131-022.jpg" },
            { name: "بني", image: "https://i.postimg.cc/P5SvXwtT/IMG-20261108-005131-259.jpg" }
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
            "Free": { price:300, available: true }
        }
    },
{ 
        id: "9", 
        titleAr: "جواندا وتر بروف منقط", 
        titleEn: "Polka Dot Waterproof Jacket", 
        category: "jackets", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/85QpNpf2/IMG-20261108-004933-390.jpg", 
        description: "فري سايز لحد 95 ❤️ الخامة وتر بروف مستورد ❤️",
        outOfStock: false,
        colors: [
            { name: "اسود منقط بأبيض", image: "https://i.postimg.cc/RhvvJgRX/IMG-20261108-004937-138.jpg" },
             { name: "ابيض  منقط باسود ", image: "https://i.postimg.cc/L5v2tjQH/IMG-20261108-004943-042.jpg" }
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
            "Free": { price: 400, available: true }
        }
    },
{ 
        id: "10", 
        titleAr: "بيجامة ميني ماوس فرو", 
        titleEn: "Minnie Mouse Fur Pyjama", 
        category: "pajamas", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/7YTKTq53/IMG-20261108-004256-603.jpg", 
        description: "فري سايز لحد 85 🫶❤️ الخامة مستورده 🫶❤️",
        outOfStock: false,
        colors: [
            { name: "بني ليوبرد مع ميني ماوس", image: "https://i.postimg.cc/zDQdByGR/IMG-20261108-004252-517.jpg" }
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
            "Free": { price: 380, available: true }
        }
    },
{ 
        id: "11", 
        titleAr: "سويت شيرت جينز مطرز", 
        titleEn: "Embroidered Denim Sweatshirt", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/28B0BCqR/IMG-20261108-004342-395.jpg", 
        description: "فري سايز لحد 90كيلوا مرتاح ❤️",
        outOfStock: false,
        colors: [
            { name: "أشكال", image: "https://i.postimg.cc/7Z8m3j7r/IMG-20261108-004342-697.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/CxTmG9D8/IMG-20261108-004342-972.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/Nj6bpb76/IMG-20261108-004343-010.jpg" },
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
            "Free": { price: 320, available: true }
        }
    },
{ 
        id: "12", 
        titleAr: "هودي جينز مطرز برسومات متنوعة", 
        titleEn: "Printed & Embroidered Denim Hoodie", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/4x6wBwbF/IMG-20261108-004349-656.jpg", 
        description: "فري سايز لحد 90كيلوا مرتاح ❤️",
        outOfStock: false,
        colors: [
            { name: "أشكال", image: "https://i.postimg.cc/LsmD7fxs/IMG-20261108-004349-753.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/0NZnqQ42/IMG-20261108-004349-945.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/TPQ0Xwsn/IMG-20261108-004350-046.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/QttbNDLb/IMG-20261108-004350-239.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/ydbTkGsV/IMG-20261108-004350-296.jpg" },
            { name: "أشكال", image: "https://i.postimg.cc/pr5J8BL5/IMG-20261108-004350-379.jpg" },
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
            "Free": { price: 330, available: true }
        }
    },
{ 
        id: "13", 
        titleAr: "سويت شيرت بولو ميلتون", 
        titleEn: "Milton Polo Sweatshirt", 
        category: "hoodies", 
        hasDiscount: false, 
        image: "https://i.postimg.cc/tCPLG3NF/IMG-20261108-005144-586.jpg", 
        description: "فري سايز لحد 95 ❤️❤️ الخامة ميلتون لايت ❤️ ابيض اسود بني",
        outOfStock: false,
        colors: [
            { name: "تفاصيل", image: "https://i.postimg.cc/MpmNvzL3/IMG-20261108-005145-505.jpg" },
          
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
            "Free": { price: 350, available: true }
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
    const product = findProduct(productId);
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

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
}

function openCartModal() {
    let modal = document.getElementById('cartModal');
    const list = document.getElementById('cartItemsList');
    if(!modal || !list) return;
    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#666;">السلة فارغة.</p>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div><strong>${item.titleAr}</strong> ${item.size ? `(مقاس: ${item.size})` : ''} - <strong>${item.price} ج.م</strong></div>
                    <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer;">حذف</button>
                </div>
            `;
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
    localStorage.setItem('jag_cart', JSON.stringify(cart));
    updateCartCount(); 
    openCartModal(); 
}

// =========================================================================
// 👤 إعدادات الحساب والإدارة
// =========================================================================
function openProfileModal() { 
    const modal = document.getElementById('profileModal');
    if(modal) {
        updateOwnerUI();
        modal.style.display = 'flex';
    }
}

function closeProfileModal() { 
    const modal = document.getElementById('profileModal');
    if(modal) modal.style.display = 'none'; 
}

function loginAdmin() {
    const emailInput = document.getElementById('adminEmailInput');
    const passInput = document.getElementById('adminPasswordInput');
    if (!emailInput || !passInput) return;

    let enteredEmail = emailInput.value.trim();
    let enteredPass = passInput.value.trim();

    if ((enteredEmail === adminEmail || enteredEmail === "m63012860@gmail.com") && (enteredPass === adminPass || enteredPass === "123456")) {
        ownerSession = true;
        localStorage.setItem('jag_owner_session', 'true');
        alert('تم تسجيل الدخول بنجاح كمسؤول!');
        closeProfileModal();
        updateOwnerUI();
        renderProducts(products);
    } else {
        alert('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
}

function logoutOwner() {
    ownerSession = false;
    localStorage.setItem('jag_owner_session', 'false');
    closeProfileModal();
    updateOwnerUI();
    renderProducts(products);
    alert('تم تسجيل الخروج من الإدارة بنجاح.');
}

// الزر الموجود في لوحة التحكم الرئيسية بيستدعي logoutAdmin
function logoutAdmin() { logoutOwner(); }

// الزر الموجود في لوحة التحكم الرئيسية بيستدعي openAccountSettings
function openAccountSettings() { openProfileModal(); }

function updateAdminAccount() {
    const newEmailInput = document.getElementById('newAdminEmail');
    const newPassInput = document.getElementById('newAdminPassword');
    if (!newEmailInput || !newPassInput) return;

    let newE = newEmailInput.value.trim();
    let newP = newPassInput.value.trim();

    if (newE) {
        adminEmail = newE;
        localStorage.setItem('jag_admin_email', adminEmail);
    }
    if (newP) {
        if (newP.length < 6) { alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل.'); return; }
        adminPass = newP;
        localStorage.setItem('jag_admin_pass', adminPass);
    }
    alert('تم تحديث بيانات حساب الإدارة بنجاح!');
    newEmailInput.value = '';
    newPassInput.value = '';
    closeProfileModal();
}

function updateOwnerUI() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminSettingsSection = document.getElementById('adminSettingsSection');
    const ownerReviewForm = document.getElementById('ownerReviewForm');
    const adminPanelContainer = document.getElementById('adminPanelContainer');

    if (ownerSession) {
        if (adminLoginForm) adminLoginForm.style.display = 'none';
        if (adminSettingsSection) adminSettingsSection.style.display = 'block';
        if (ownerReviewForm) ownerReviewForm.style.display = 'block';
        if (adminPanelContainer) adminPanelContainer.style.display = 'block';
    } else {
        if (adminLoginForm) adminLoginForm.style.display = 'block';
        if (adminSettingsSection) adminSettingsSection.style.display = 'none';
        if (ownerReviewForm) ownerReviewForm.style.display = 'none';
        if (adminPanelContainer) adminPanelContainer.style.display = 'none';
    }
    renderReviews();
}

function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    if(!grid) return;
    grid.innerHTML = '';
    customerReviews.forEach(rev => {
        const card = document.createElement('div');
        card.style.cssText = "background: white; padding: 15px; border-radius: 8px; border-top: 3px solid #D4AF37; box-shadow: 0 2px 5px rgba(0,0,0,0.05);";
        card.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 5px;">⭐⭐⭐⭐⭐</div>
            <p style="font-size: 13px; color: #444; margin-bottom: 8px;">"${rev.comment}"</p>
            <strong style="color: #4A040D;">- ${rev.name}</strong>
        `;
        grid.appendChild(card);
    });
}

// =========================================================================
// 💬 مجتمع العملاء (محدث بخاصية الردود وزر حذف الرد)
// =========================================================================
function renderCommunityChat() {
    const chatBox = document.getElementById('chatMessages');
    if (!chatBox) return;
    chatBox.innerHTML = '';

    communityMessages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `margin-bottom:12px; padding:14px; border-radius:8px; background:${msg.isOwner ? '#fff5f5' : '#ffffff'}; border:1px solid ${msg.isOwner ? '#ffcccc' : '#eee'}; position:relative;`;
        
        let ownerBadge = msg.isOwner ? `<span style="background:#4A040D; color:#D4AF37; font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; margin-right:8px;">👑 Just a Girl (المالك) ✨</span>` : '';
        let deleteBtnHtml = `<button onclick="deleteCommunityMsg(${msg.id})" style="position:absolute; top:12px; left:12px; background:none; border:none; color:#cc0000; font-size:12px; cursor:pointer;" title="حذف الرسالة">حذف</button>`;

        let repliesHtml = '';
        if (msg.replies && msg.replies.length > 0) {
            msg.replies.forEach(rep => {
                let repOwnerBadge = rep.isOwner ? `<span style="background:#4A040D; color:#D4AF37; font-size:10px; padding:2px 6px; border-radius:3px; margin-right:5px;">👑 المالك</span>` : '';
                repliesHtml += `
                    <div style="margin-top:8px; margin-right:20px; padding:8px 12px; background:#fdfbf7; border-right:3px solid #D4AF37; border-radius:4px; font-size:13px; position:relative;">
                        <div><strong>${escapeHtml(rep.sender)}</strong> ${repOwnerBadge}: ${escapeHtml(rep.text)}</div>
                        <button onclick="deleteReply(${msg.id}, ${rep.id})" style="position:absolute; top:8px; left:8px; background:none; border:none; color:#cc0000; font-size:11px; cursor:pointer;" title="حذف الرد">حذف</button>
                    </div>
                `;
            });
        }

        msgDiv.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                <div style="font-size:15px; font-weight:bold; color:${msg.isOwner ? '#4A040D' : '#333'};">
                    ${escapeHtml(msg.sender)} ${ownerBadge}
                </div>
                ${deleteBtnHtml}
            </div>
            <div style="font-size:14px; color:#444; line-height:1.5; white-space:pre-wrap; margin-bottom:8px;">${escapeHtml(msg.text)}</div>
            
            <div style="margin-top:5px;">
                <button onclick="toggleReplyBox(${msg.id})" style="background:none; border:none; color:#D4AF37; font-size:12px; cursor:pointer; font-weight:bold;">💬 رد</button>
            </div>

            <div id="repliesContainer_${msg.id}" style="margin-top:6px;">
                ${repliesHtml}
            </div>

            <div id="replyBox_${msg.id}" style="display:none; margin-top:8px; gap:6px;">
                <input type="text" id="replyName_${msg.id}" placeholder="اكتبي اسمك..." style="padding:5px; font-size:12px; border:1px solid #ccc; border-radius:4px; width:100px;">
                <input type="text" id="replyText_${msg.id}" placeholder="اكتبي ردك هنا..." style="padding:5px; font-size:12px; border:1px solid #ccc; border-radius:4px; flex:1;">
                <button onclick="sendReplyToMessage(${msg.id})" style="background:#4A040D; color:#fff; border:none; padding:5px 10px; border-radius:4px; font-size:12px; cursor:pointer;">إرسال الرد</button>
            </div>
        `;
        chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function deleteReply(msgId, replyId) {
    let msg = communityMessages.find(m => m.id === msgId);
    if (!msg || !msg.replies) return;

    let rep = msg.replies.find(r => r.id === replyId);
    if (!rep) return;

    if (ownerSession) {
        if (confirm('هل أنتِ متأكدة من حذف هذا الرد بصفتك مالكة؟')) {
            msg.replies = msg.replies.filter(r => r.id !== replyId);
            localStorage.setItem('jag_community', JSON.stringify(communityMessages));
            renderCommunityChat();
        }
    } else {
        let enterName = prompt('لحذف ردك، اكتبي نفس الاسم الذي استخدمتيه عند كتابة الرد:');
        if (enterName && enterName.trim().toLowerCase() === rep.sender.toLowerCase()) {
            msg.replies = msg.replies.filter(r => r.id !== replyId);
            localStorage.setItem('jag_community', JSON.stringify(communityMessages));
            renderCommunityChat();
        } else {
            alert('الاسم غير صحيح، لا يمكنك حذف رد شخص آخر.');
        }
    }
}

function toggleReplyBox(msgId) {
    let box = document.getElementById(`replyBox_${msgId}`);
    if (box) {
        box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'flex' : 'none';
    }
}

function sendReplyToMessage(msgId) {
    let nameInput = document.getElementById(`replyName_${msgId}`);
    let textInput = document.getElementById(`replyText_${msgId}`);
    if (!textInput || !textInput.value.trim()) {
        alert('يرجى كتابة نص الرد.');
        return;
    }

    let senderName = nameInput ? nameInput.value.trim() : "";
    let isOwnerFlag = false;

    if (ownerSession) {
        senderName = 'Just a Girl (المالك)';
        isOwnerFlag = true;
    } else {
        if (!senderName) {
            alert('يرجى إدخال اسمك قبل الرد.');
            return;
        }
    }

    let msg = communityMessages.find(m => m.id === msgId);
    if (msg) {
        if (!msg.replies) msg.replies = [];
        msg.replies.push({
            id: Date.now(),
            sender: senderName,
            text: textInput.value.trim(),
            isOwner: isOwnerFlag
        });

        localStorage.setItem('jag_community', JSON.stringify(communityMessages));
        renderCommunityChat();
    }
}

function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
}

function deleteCommunityMsg(id) {
    const msg = communityMessages.find(m => m.id === id);
    if (!msg) return;

    if (ownerSession) {
        if (confirm('هل أنتِ متأكدة من حذف هذه الرسالة بصفتك مالكة؟')) {
            communityMessages = communityMessages.filter(m => m.id !== id);
            localStorage.setItem('jag_community', JSON.stringify(communityMessages));
            renderCommunityChat();
        }
    } else {
        let enterName = prompt('لحذف رسالتك، اكتبي نفس الاسم الذي استخدمتيه عند النشر:');
        if (enterName && enterName.trim().toLowerCase() === msg.sender.toLowerCase()) {
            communityMessages = communityMessages.filter(m => m.id !== id);
            localStorage.setItem('jag_community', JSON.stringify(communityMessages));
            renderCommunityChat();
        } else {
            alert('الاسم غير صحيح.');
        }
    }
}

function sendCommunityMessage() {
    const nameInput = document.getElementById('chatSenderName');
    const textInput = document.getElementById('chatInputText');
    if (!textInput || !textInput.value.trim()) { alert('يرجى كتابة رسالة.'); return; }

    let senderName = nameInput ? nameInput.value.trim() : "";
    let isOwnerFlag = false;

    if (ownerSession) {
        senderName = 'Just a Girl (المالك)';
        isOwnerFlag = true;
    } else {
        if (!senderName) { alert('يرجى إدخال اسمك.'); return; }
    }

    communityMessages.push({ id: Date.now(), sender: senderName, text: textInput.value.trim(), isOwner: isOwnerFlag });
    localStorage.setItem('jag_community', JSON.stringify(communityMessages));
    textInput.value = '';
    if(nameInput && !ownerSession) nameInput.value = '';
    renderCommunityChat();
}

function filterCategory(category) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    if(window.event && window.event.target) window.event.target.classList.add('active');
    if (category === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.category === category));
}

// إغلاق النوافذ عند النقر خارج المحتوى
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const profileModal = document.getElementById('profileModal');
    
    if (event.target === productModal) closeProductModal();
    if (event.target === cartModal) closeCartModal();
    if (event.target === profileModal) closeProfileModal();
};
