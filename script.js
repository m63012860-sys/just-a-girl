
/* =========================================================================
   JUST A GIRL — Complete Store JavaScript
   ========================================================================= */
'use strict';

const WHATSAPP_NUMBER = '201283332160';

const STORAGE_KEYS = {
  products: 'jag_products',
  cart: 'jag_cart',
  reviews: 'jag_reviews',
  community: 'jag_community'
};

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    titleAr: 'سوت ميلتون',
    titleEn: 'Milton Suit',
    category: 'sets',
    image: 'https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg',
    description: 'بيلبس لحد 95 كيلو 🫶 الخامة ميلتون لايت',
    outOfStock: false,
    colors: [
      {name:'بني',image:'https://i.postimg.cc/mgqbfLYq/IMG-20261107-131942-088.jpg'},
      {name:'برجندي',image:'https://i.postimg.cc/Jzt12Dk2/IMG-20261107-131936-540.jpg'},
      {name:'بيج',image:'https://i.postimg.cc/vmJH9YDJ/IMG-20261107-131936-134.jpg'},
      {name:'جرين',image:'https://i.postimg.cc/TYtd0qpc/IMG-20261107-131936-307.jpg'},
      {name:'بينك',image:'https://i.postimg.cc/K84ZHkMD/IMG-20261107-131936-360.jpg'}
    ],
    sizes: {
      '1y':{price:0,available:false},
      '2y':{price:0,available:false},
      '3y':{price:0,available:false},
      '4y':{price:0,available:false},
      '6y':{price:0,available:false},
      '8y':{price:0,available:false},
      '10y':{price:0,available:false},
      '12y':{price:0,available:false},
      XS:{price:0,available:false},
      S:{price:0,available:false},
      M:{price:0,available:false},
      L:{price:0,available:false},
      XL:{price:0,available:false},
      '2XL':{price:0,available:false},
      '3XL':{price:0,available:false},
      Free:{price:470,available:true}
    }
  },
  {
    id:'2',
    titleAr:'سويت شيرت كاجوال',
    titleEn:'College Sweatshirt',
    category:'blouses',
    image:'https://i.postimg.cc/dVqkx8PP/IMG-20261107-131821-682.jpg',
    description:'جينة صافي فائقة النعومة والجودة ❤️ المقاس فري سايز',
    outOfStock:false,
    colors:[
      {name:'بني',image:'https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg'},
      {name:'برجندي',image:'https://i.postimg.cc/139njpxj/IMG-20261107-131821-409.jpg'},
      {name:'أسود',image:'https://i.postimg.cc/ZnpB1HK1/IMG-20261107-131820-991.jpg'}
    ],
    sizes:{
      '1y':{price:0,available:false},
      '2y':{price:0,available:false},
      '3y':{price:0,available:false},
      '4y':{price:0,available:false},
      '6y':{price:0,available:false},
      '8y':{price:0,available:false},
      '10y':{price:0,available:false},
      '12y':{price:0,available:false},
      XS:{price:0,available:false},
      S:{price:0,available:false},
      M:{price:0,available:false},
      L:{price:0,available:false},
      XL:{price:0,available:false},
      '2XL':{price:0,available:false},
      '3XL':{price:0,available:false},
      Free:{price:440,available:true}
    }
  }
];

const HERO_BANNERS = [
  {
    image:'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    titleAr:'أناقة شتوية وصيفية متكاملة'
  },
  {
    image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
    titleAr:"تشكيلة Just a Girl الجديدة"
  }
];

function readJSON(key,fallback){
  try{
    const raw=localStorage.getItem(key);
    return raw?JSON.parse(raw):fallback;
  }catch(error){
    console.warn('Storage read error:',error);
    return fallback;
  }
}

function saveLocal(key,value){
  try{
    localStorage.setItem(key,JSON.stringify(value));
    return true;
  }catch(error){
    console.error('Storage error:',error);
    alert('تعذر الحفظ. قد تكون مساحة التخزين ممتلئة.');
    return false;
  }
}

function escapeHTML(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[ch]));
}

function safeImage(url){
  const value=String(url||'').trim();
  return /^https?:\/\//i.test(value)?value:'';
}

function normalizeProduct(p){
  return {
    ...p,
    id:String(p.id??Date.now()),
    titleAr:String(p.titleAr||p.title||'منتج جديد'),
    titleEn:String(p.titleEn||p.titleAr||''),
    category:String(p.category||'sets'),
    image:safeImage(p.image),
    description:String(p.description||''),
    outOfStock:Boolean(p.outOfStock),
    colors:Array.isArray(p.colors)?p.colors:[],
    sizes:p.sizes&&typeof p.sizes==='object'?p.sizes:{}
  };
}

let products=readJSON(STORAGE_KEYS.products,null);
if(!Array.isArray(products)||!products.length){
  products=DEFAULT_PRODUCTS.map(p=>({...p}));
}
products=products.map(normalizeProduct);

let cart=readJSON(STORAGE_KEYS.cart,[]);
if(!Array.isArray(cart))cart=[];

let customerReviews=readJSON(STORAGE_KEYS.reviews,[
  {
    id:'review-1',
    name:'سارة محمد',
    comment:'الخامات تحفة والمعاينة كانت ممتازة جداً، شكراً Just a Girl!',
    rating:5
  }
]);

let communityMessages=readJSON(STORAGE_KEYS.community,[
  {
    id:'msg-1',
    sender:'نوران أحمد',
    text:'يا جماعة، هل مقاسات الهوديات مضبوطة بالظبط؟',
    isOwner:false,
    replies:[]
  },
  {
    id:'msg-2',
    sender:'Just a Girl',
    text:'أهلاً يا نوران! المقاسات مضبوطة حسب الجدول ✨',
    isOwner:true,
    replies:[]
  }
]);

let ownerSession=false;
let selectedSizeForCart=null;
let selectedPriceForCart=null;
let selectedColorForCart='';
let currentSlide=0;
let sliderTimer=null;

function firebaseAPI(){
  return window.JAG_FIREBASE&&window.JAG_FIREBASE.enabled
    ?window.JAG_FIREBASE:null;
}

async function cloudSave(collectionName,id,data){
  const api=firebaseAPI();
  if(!api)return false;
  try{
    await api.save(collectionName,String(id),data);
    return true;
  }catch(error){
    console.error('Firebase save error:',error);
    alert('لم يتم الحفظ على الخادم. راجعي إعدادات Firebase.');
    return false;
  }
}

async function cloudDelete(collectionName,id){
  const api=firebaseAPI();
  if(!api)return false;
  try{
    await api.remove(collectionName,String(id));
    return true;
  }catch(error){
    console.error('Firebase delete error:',error);
    alert('تعذر الحذف من قاعدة البيانات.');
    return false;
  }
}

async function loadCloudData(){
  const api=firebaseAPI();
  if(!api)return;
  try{
    const [cloudProducts,cloudCommunity]=await Promise.all([
      api.read('products'),
      api.read('community')
    ]);

    if(cloudProducts.length){
      products=cloudProducts.map(normalizeProduct);
      saveLocal(STORAGE_KEYS.products,products);
      renderProducts(products);
    }

    if(cloudCommunity.length){
      communityMessages=cloudCommunity.map(m=>({
        ...m,
        replies:Array.isArray(m.replies)?m.replies:[]
      }));
      saveLocal(STORAGE_KEYS.community,communityMessages);
      renderCommunityChat();
    }
  }catch(error){
    console.error('Firebase loading error:',error);
  }
}

document.addEventListener('DOMContentLoaded',initStore);

window.addEventListener('jag-firebase-ready',()=>{
  syncAuthState();
  loadCloudData();
});

function initStore(){
  initSlider();
  renderProducts(products);
  updateCartCount();
  renderReviews();
  renderCommunityChat();
  updateOwnerUI();
  ensureAdminButton();
  syncAuthState();
  loadCloudData();

  const search=document.getElementById('searchInput');
  if(search)search.addEventListener('input',filterProducts);

  document.addEventListener('click',event=>{
    if(event.target===document.getElementById('productModal'))closeProductModal();
    if(event.target===document.getElementById('cartModal'))closeCartModal();
    if(event.target===document.getElementById('profileModal'))closeProfileModal();
  });
}

function initSlider(){
  const slider=document.getElementById('heroSlider');
  if(!slider)return;

  slider.innerHTML='';

  HERO_BANNERS.forEach((banner,index)=>{
    const slide=document.createElement('div');
    slide.className=`hero-slide ${index===0?'active':''}`;
    slide.style.backgroundImage=
      `linear-gradient(rgba(0,0,0,.28),rgba(0,0,0,.28)),url("${banner.image}")`;
    slide.innerHTML=`
      <div class="hero-content">
        <h2>${escapeHTML(banner.titleAr)}</h2>
        <p>Just a Girl - Luxury Fashion</p>
      </div>`;
    slider.appendChild(slide);
  });

  if(sliderTimer)clearInterval(sliderTimer);

  sliderTimer=setInterval(()=>{
    const slides=slider.querySelectorAll('.hero-slide');
    if(!slides.length)return;
    slides[currentSlide].classList.remove('active');
    currentSlide=(currentSlide+1)%slides.length;
    slides[currentSlide].classList.add('active');
  },4500);
}

function ensureAdminButton(){
  if(document.getElementById('floatingAdminBtn'))return;

  const button=document.createElement('button');
  button.id='floatingAdminBtn';
  button.type='button';
  button.textContent='⚙️ دخول المالكة';
  button.style.cssText=
    'position:fixed;bottom:18px;left:18px;z-index:999;background:#4A040D;color:#fff;border:1px solid #D4AF37;border-radius:25px;padding:11px 16px;cursor:pointer;font-weight:bold;';

  button.addEventListener('click',openProfileModal);
  document.body.appendChild(button);
}

function minProductPrice(product){
  const prices=Object.values(product.sizes||{})
    .filter(s=>s&&s.available&&Number(s.price)>0)
    .map(s=>Number(s.price));

  return prices.length?Math.min(...prices):0;
}

function renderProducts(itemsToRender=products){
  const grid=document.getElementById('productsGrid');
  if(!grid)return;

  grid.innerHTML='';

  if(!itemsToRender.length){
    grid.innerHTML=`
      <p style="grid-column:1/-1;text-align:center;padding:40px;color:#666">
        لا توجد منتجات في هذا القسم حالياً.
      </p>`;
    return;
  }

  itemsToRender.forEach(product=>{
    const card=document.createElement('article');
    card.className='product-card';

    const price=minProductPrice(product);

    const adminButtons=ownerSession?`
      <div style="display:flex;gap:6px;margin-top:10px">
        <button type="button" onclick="openEditProductModal('${escapeHTML(product.id)}')">تعديل</button>
        <button type="button" onclick="deleteProduct('${escapeHTML(product.id)}')">حذف</button>
        <button type="button" onclick="toggleOutOfStock('${escapeHTML(product.id)}')">
          ${product.outOfStock?'إتاحة':'نفد'}
        </button>
      </div>`:'';

    card.innerHTML=`
      ${product.outOfStock?'<span class="stock-badge">نفد</span>':''}
      <img class="product-img"
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.titleAr)}"
        loading="lazy">
      <div class="product-info">
        <h3 class="product-title">${escapeHTML(product.titleAr)}</h3>
        <p class="product-desc">${escapeHTML(product.description)}</p>
        <div class="price-box">
          ${price?`يبدأ من ${price} ج.م`:'السعر حسب المقاس'}
        </div>
        <button type="button" onclick="openProductDetails('${escapeHTML(product.id)}')">
          عرض التفاصيل
        </button>
        ${adminButtons}
      </div>`;

    grid.appendChild(card);
  });
}

function filterCategory(category,clickedButton){
  document.querySelectorAll('#categoryNav button')
    .forEach(button=>button.classList.remove('active'));

  if(clickedButton)clickedButton.classList.add('active');

  const title=document.getElementById('catalogTitle');

  if(category==='all'){
    if(title)title.textContent='تجميعة المنتجات';
    renderProducts(products);
  }else{
    if(title&&clickedButton)title.textContent=clickedButton.textContent.trim();
    renderProducts(products.filter(p=>p.category===category));
  }
}

function filterProducts(){
  const input=document.getElementById('searchInput');
  if(!input)return;

  const query=input.value.trim().toLocaleLowerCase('ar');

  renderProducts(products.filter(p=>
    `${p.titleAr} ${p.titleEn} ${p.description} ${p.category}`
      .toLocaleLowerCase('ar').includes(query)
  ));
}

function openAddProductModal(){
  if(!ownerSession)return alert('تسجيل دخول المالكة مطلوب.');

  const modal=document.getElementById('productModal');
  const content=document.getElementById('productModalContent');

  if(!modal||!content)return alert('عناصر نافذة المنتجات غير موجودة في HTML.');

  content.innerHTML=productFormHTML();
  modal.style.display='flex';
}

function productFormHTML(product=null){
  const editing=Boolean(product);

  const p=product||{
    titleAr:'',
    titleEn:'',
    category:'sets',
    image:'',
    description:'',
    outOfStock:false,
    colors:[],
    sizes:{Free:{price:0,available:false}}
  };

  const sizeRows=Object.entries(p.sizes||{}).map(([size,data])=>`
    <label style="display:flex;gap:6px;align-items:center;margin:5px 0">
      <input type="checkbox" class="size-available"
        data-size="${escapeHTML(size)}" ${data.available?'checked':''}>
      <span>${escapeHTML(size)}</span>
      <input type="number" min="0" class="size-price"
        data-size="${escapeHTML(size)}"
        value="${Number(data.price)||0}" placeholder="السعر"
        style="width:95px">
    </label>
  `).join('');

  const colorsText=(p.colors||[])
    .map(c=>`${c.name}|${c.image}`).join('\n');

  return `
    <button type="button" onclick="closeProductModal()">×</button>
    <h2>${editing?'تعديل المنتج':'إضافة منتج جديد'}</h2>

    <label>اسم المنتج بالعربي</label>
    <input id="jagTitleAr" value="${escapeHTML(p.titleAr)}">

    <label>اسم المنتج بالإنجليزي</label>
    <input id="jagTitleEn" value="${escapeHTML(p.titleEn||'')}">

    <label>القسم</label>
    <select id="jagCategory">
      ${['hoodies','pants','kids','pajamas','sets','dresses','suits','jackets','bundles','offers','blouses']
        .map(c=>`<option value="${c}" ${p.category===c?'selected':''}>${c}</option>`).join('')}
    </select>

    <label>رابط الصورة الرئيسية</label>
    <input id="jagImage" value="${escapeHTML(p.image)}" placeholder="https://...">

    <label>الوصف</label>
    <textarea id="jagDescription">${escapeHTML(p.description)}</textarea>

    <label>الألوان — كل سطر: الاسم|رابط الصورة</label>
    <textarea id="jagColors" rows="4">${escapeHTML(colorsText)}</textarea>

    <label>المقاسات والأسعار</label>
    <div>${sizeRows}</div>

    <label>
      <input type="checkbox" id="jagOutOfStock" ${p.outOfStock?'checked':''}>
      المنتج غير متاح حالياً
    </label>

    <button type="button"
      onclick="${editing?`saveEditedProduct('${escapeHTML(p.id)}')`:'saveNewProduct()'}">
      حفظ المنتج
    </button>`;
}

function collectProductForm(existing={}){
  const titleAr=document.getElementById('jagTitleAr')?.value.trim();
  const image=safeImage(document.getElementById('jagImage')?.value);

  if(!titleAr)throw new Error('اكتبي اسم المنتج.');
  if(!image)throw new Error('أدخلي رابط صورة صحيح.');

  const sizes={};

  document.querySelectorAll('.size-available').forEach(check=>{
    const size=check.dataset.size;
    const priceInput=document.querySelector(
      `.size-price[data-size="${CSS.escape(size)}"]`
    );
    const price=Number(priceInput?.value||0);

    sizes[size]={
      available:check.checked&&price>0,
      price:price>0?price:0
    };
  });

  if(!Object.values(sizes).some(s=>s.available)){
    throw new Error('حددي مقاساً واحداً على الأقل واكتبي سعره.');
  }

  const colors=(document.getElementById('jagColors')?.value||'')
    .split('\n')
    .map(line=>line.trim())
    .filter(Boolean)
    .map(line=>{
      const [name,...urlParts]=line.split('|');
      return {
        name:name.trim(),
        image:safeImage(urlParts.join('|').trim())
      };
    })
    .filter(c=>c.name&&c.image);

  return normalizeProduct({
    ...existing,
    id:existing.id||String(Date.now()),
    titleAr,
    titleEn:document.getElementById('jagTitleEn')?.value.trim()||titleAr,
    category:document.getElementById('jagCategory')?.value||'sets',
    image,
    description:document.getElementById('jagDescription')?.value.trim()||'',
    colors,
    sizes,
    outOfStock:Boolean(document.getElementById('jagOutOfStock')?.checked)
  });
}

async function saveNewProduct(){
  if(!ownerSession)return alert('غير مسموح.');

  try{
    const product=collectProductForm();

    products.unshift(product);
    saveLocal(STORAGE_KEYS.products,products);
    renderProducts(products);
    closeProductModal();

    if(firebaseAPI()){
      const saved=await cloudSave('products',product.id,product);
      if(!saved)alert('تمت الإضافة محلياً لكن تعذر تأكيد الحفظ السحابي.');
    }else{
      alert('تم الحفظ على هذا المتصفح فقط. فعّلي Firebase ليظهر المنتج للعملاء الآخرين.');
    }
  }catch(error){
    alert(error.message||'حدث خطأ أثناء إضافة المنتج.');
  }
}

function openEditProductModal(productId){
  if(!ownerSession)return;

  const product=products.find(p=>String(p.id)===String(productId));
  const modal=document.getElementById('productModal');
  const content=document.getElementById('productModalContent');

  if(!product||!modal||!content)return;

  content.innerHTML=productFormHTML(product);
  modal.style.display='flex';
}

async function saveEditedProduct(productId){
  if(!ownerSession)return;

  try{
    const index=products.findIndex(p=>String(p.id)===String(productId));
    if(index<0)throw new Error('المنتج غير موجود.');

    const updated=collectProductForm(products[index]);
    products[index]=updated;

    saveLocal(STORAGE_KEYS.products,products);
    renderProducts(products);
    closeProductModal();

    if(firebaseAPI())await cloudSave('products',updated.id,updated);
  }catch(error){
    alert(error.message||'تعذر حفظ التعديلات.');
  }
}

async function deleteProduct(productId){
  if(!ownerSession)return;
  if(!confirm('هل أنتِ متأكدة من حذف هذا المنتج؟'))return;

  products=products.filter(p=>String(p.id)!==String(productId));

  saveLocal(STORAGE_KEYS.products,products);
  renderProducts(products);

  if(firebaseAPI())await cloudDelete('products',productId);
}

async function toggleOutOfStock(productId){
  if(!ownerSession)return;

  const product=products.find(p=>String(p.id)===String(productId));
  if(!product)return;

  product.outOfStock=!product.outOfStock;

  saveLocal(STORAGE_KEYS.products,products);
  renderProducts(products);

  if(firebaseAPI())await cloudSave('products',product.id,product);
}

function openProductDetails(productId){
  const product=products.find(p=>String(p.id)===String(productId));
  const modal=document.getElementById('productModal');
  const content=document.getElementById('productModalContent');

  if(!product||!modal||!content)return;

  selectedSizeForCart=null;
  selectedPriceForCart=null;
  selectedColorForCart='';

  const availableSizes=Object.entries(product.sizes||{})
    .filter(([,v])=>v&&v.available&&Number(v.price)>0);

  const sizeHTML=availableSizes.map(([size,data])=>`
    <button type="button" class="jag-size-choice"
      onclick="selectSizeForCart('${escapeHTML(size)}',${Number(data.price)})">
      ${escapeHTML(size)} — ${Number(data.price)} ج.م
    </button>
  `).join('');

  const colorsHTML=(product.colors||[]).map(color=>`
    <button type="button"
      onclick="selectProductColor('${escapeHTML(color.name)}','${escapeHTML(color.image)}')">
      ${escapeHTML(color.name)}
    </button>
  `).join('');

  content.innerHTML=`
    <button type="button" onclick="closeProductModal()">×</button>

    <div style="text-align:center">
      <img id="jagDetailImage" src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.titleAr)}"
        style="max-height:280px;width:100%;object-fit:contain">

      <h2>${escapeHTML(product.titleAr)}</h2>
      <p>${escapeHTML(product.description)}</p>

      ${colorsHTML?`<strong>اختاري اللون:</strong><div>${colorsHTML}</div>`:''}

      <strong>اختاري المقاس والسعر:</strong>
      <div>${sizeHTML||'لا توجد مقاسات متاحة حالياً'}</div>

      <p id="jagSelectionNotice">لم يتم اختيار المقاس بعد.</p>

      <button type="button"
        onclick="addToCart('${escapeHTML(product.id)}')"
        ${product.outOfStock||!availableSizes.length?'disabled':''}>
        ${product.outOfStock?'نفد المنتج':'إضافة إلى السلة 🛍️'}
      </button>
    </div>`;

  modal.style.display='flex';
}

function selectSizeForCart(size,price){
  selectedSizeForCart=String(size);
  selectedPriceForCart=Number(price);

  document.querySelectorAll('.jag-size-choice').forEach(btn=>{
    btn.style.background=btn.textContent.startsWith(selectedSizeForCart+' ')
      ?'#f5e8e8':'#fff';
  });

  const notice=document.getElementById('jagSelectionNotice');
  if(notice)notice.textContent=`المقاس المختار: ${size} — ${price} ج.م`;
}

function selectProductColor(name,image){
  selectedColorForCart=String(name);

  const img=document.getElementById('jagDetailImage');
  if(img&&safeImage(image))img.src=image;
}

function closeProductModal(){
  const modal=document.getElementById('productModal');
  if(modal)modal.style.display='none';
}

function addToCart(productId){
  const product=products.find(p=>String(p.id)===String(productId));

  if(!product||product.outOfStock)return alert('المنتج غير متاح حالياً.');
  if(!selectedSizeForCart||!selectedPriceForCart)return alert('اختاري المقاس أولاً.');

  const existing=cart.find(item=>
    String(item.id)===String(productId)&&
    item.size===selectedSizeForCart&&
    item.color===selectedColorForCart
  );

  if(existing)existing.qty+=1;
  else cart.push({
    id:String(product.id),
    title:product.titleAr,
    price:selectedPriceForCart,
    qty:1,
    size:selectedSizeForCart,
    color:selectedColorForCart
  });

  saveLocal(STORAGE_KEYS.cart,cart);
  updateCartCount();
  closeProductModal();

  alert('تمت إضافة المنتج إلى السلة 🛍️');
}

function updateCartCount(){
  const badge=document.getElementById('cartCount');
  if(badge){
    badge.textContent=cart.reduce(
      (sum,item)=>sum+(Number(item.qty)||0),0
    );
  }
}

function openCartModal(){
  const modal=document.getElementById('cartModal');
  const list=document.getElementById('cartItemsList');
  const totalEl=document.getElementById('cartTotalPrice');

  if(!modal||!list)return;

  list.innerHTML='';
  let total=0;

  if(!cart.length){
    list.innerHTML='<p>سلة التسوق فارغة حالياً.</p>';
  }

  cart.forEach((item,index)=>{
    const lineTotal=Number(item.price)*Number(item.qty);
    total+=lineTotal;

    const row=document.createElement('div');
    row.style.cssText=
      'display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;border-bottom:1px solid #eee;padding:10px 0';

    row.innerHTML=`
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <div>اللون: ${escapeHTML(item.color||'—')} | المقاس: ${escapeHTML(item.size)}</div>
        <small>${Number(item.price)} ج.م × ${Number(item.qty)}</small>
      </div>
      <div>
        <button type="button" onclick="changeCartQty(${index},-1)">−</button>
        <button type="button" onclick="changeCartQty(${index},1)">+</button>
        <button type="button" onclick="removeFromCart(${index})">حذف</button>
      </div>`;

    list.appendChild(row);
  });

  if(totalEl)totalEl.textContent=total;
  modal.style.display='flex';
}

function changeCartQty(index,delta){
  if(!cart[index])return;

  cart[index].qty=Number(cart[index].qty)+delta;
  if(cart[index].qty<=0)cart.splice(index,1);

  saveLocal(STORAGE_KEYS.cart,cart);
  updateCartCount();
  openCartModal();
}

function removeFromCart(index){
  cart.splice(index,1);
  saveLocal(STORAGE_KEYS.cart,cart);
  updateCartCount();
  openCartModal();
}

function closeCartModal(){
  const modal=document.getElementById('cartModal');
  if(modal)modal.style.display='none';
}

function sendToWhatsApp(){
  const name=document.getElementById('clientName')?.value.trim();
  const phone=document.getElementById('clientPhone')?.value.trim();
  const address=document.getElementById('clientAddress')?.value.trim();
  const legalCheck=document.getElementById('legalCheck')?.checked;

  if(!name||!phone||!address){
    return alert('اكتبي الاسم ورقم الهاتف والعنوان بالتفصيل.');
  }

  if(!legalCheck)return alert('يرجى الموافقة على شروط الطلب أولاً.');
  if(!cart.length)return alert('سلة التسوق فارغة.');

  let total=0;

  let message=
    `✨ طلب جديد من موقع Just a Girl ✨\n\n`+
    `👤 الاسم: ${name}\n`+
    `📞 الهاتف: ${phone}\n`+
    `📍 العنوان: ${address}\n\n🛍️ المنتجات:\n`;

  cart.forEach(item=>{
    const line=Number(item.price)*Number(item.qty);
    total+=line;

    message+=
      `- ${item.title} | اللون: ${item.color||'—'} | `+
      `المقاس: ${item.size} × ${item.qty} = ${line} ج.م\n`;
  });

  message+=`\n💰 الإجمالي: ${total} ج.م\n`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer'
  );
}

function renderCommunityChat(){
  const box=document.getElementById('communityChatBox');
  if(!box)return;

  box.innerHTML='';

  if(!communityMessages.length){
    box.innerHTML='<p>لا توجد رسائل حالياً.</p>';
    return;
  }

  communityMessages.forEach(msg=>{
    const replies=(msg.replies||[]).map(reply=>`
      <div style="margin:8px 18px;background:#faf5f5;padding:8px">
        <strong>${escapeHTML(reply.sender)}</strong>
        <p>${escapeHTML(reply.text)}</p>
        ${ownerSession?`
          <button type="button"
            onclick="deleteCommunityReply('${escapeHTML(msg.id)}','${escapeHTML(reply.id)}')">
            حذف الرد
          </button>`:''}
      </div>
    `).join('');

    const item=document.createElement('article');

    item.innerHTML=`
      <strong>${escapeHTML(msg.sender)}</strong>
      <p>${escapeHTML(msg.text)}</p>

      ${ownerSession?`
        <button type="button" onclick="deleteCommunityMessage('${escapeHTML(msg.id)}')">
          حذف
        </button>`:''}

      <button type="button" onclick="toggleReplyBox('${escapeHTML(msg.id)}')">
        💬 رد
      </button>

      <div id="replyBox_${escapeHTML(msg.id)}" style="display:none;margin-top:10px">
        <input id="replyName_${escapeHTML(msg.id)}" placeholder="اسمك (اختياري)">
        <input id="replyText_${escapeHTML(msg.id)}" placeholder="اكتبي ردك">
        <button type="button" onclick="sendCommunityReply('${escapeHTML(msg.id)}')">
          إرسال الرد
        </button>
      </div>

      ${replies}`;

    box.appendChild(item);
  });
}

async function sendCommunityMessage(){
  const input=document.getElementById('communityInput');
  const nameInput=document.getElementById('chatSenderName');

  if(!input||!input.value.trim())return alert('اكتبي الرسالة أولاً.');

  const message={
    id:String(Date.now()),
    sender:nameInput?.value.trim()||(ownerSession?'Just a Girl':'زائرة'),
    text:input.value.trim(),
    isOwner:ownerSession,
    replies:[]
  };

  communityMessages.push(message);
  saveLocal(STORAGE_KEYS.community,communityMessages);

  input.value='';
  renderCommunityChat();

  if(firebaseAPI())await cloudSave('community',message.id,message);
}

function toggleReplyBox(messageId){
  const box=document.getElementById(`replyBox_${messageId}`);
  if(box)box.style.display=box.style.display==='none'?'block':'none';
}

async function sendCommunityReply(messageId){
  const name=document.getElementById(`replyName_${messageId}`)?.value.trim();
  const input=document.getElementById(`replyText_${messageId}`);

  if(!input||!input.value.trim())return alert('اكتبي الرد أولاً.');

  const msg=communityMessages.find(m=>String(m.id)===String(messageId));
  if(!msg)return;

  msg.replies=Array.isArray(msg.replies)?msg.replies:[];

  msg.replies.push({
    id:String(Date.now()),
    sender:name||(ownerSession?'Just a Girl':'عميلة'),
    text:input.value.trim(),
    isOwner:ownerSession
  });

  saveLocal(STORAGE_KEYS.community,communityMessages);
  renderCommunityChat();

  if(firebaseAPI())await cloudSave('community',msg.id,msg);
}

async function deleteCommunityMessage(messageId){
  if(!ownerSession)return;
  if(!confirm('حذف الرسالة وكل الردود عليها؟'))return;

  communityMessages=communityMessages.filter(
    m=>String(m.id)!==String(messageId)
  );

  saveLocal(STORAGE_KEYS.community,communityMessages);
  renderCommunityChat();

  if(firebaseAPI())await cloudDelete('community',messageId);
}

async function deleteCommunityReply(messageId,replyId){
  if(!ownerSession)return;

  const msg=communityMessages.find(
    m=>String(m.id)===String(messageId)
  );

  if(!msg)return;

  msg.replies=(msg.replies||[]).filter(
    r=>String(r.id)!==String(replyId)
  );

  saveLocal(STORAGE_KEYS.community,communityMessages);
  renderCommunityChat();

  if(firebaseAPI())await cloudSave('community',msg.id,msg);
}

function renderReviews(){
  const container=document.getElementById('reviewsContainer');
  if(!container)return;

  container.innerHTML='';

  customerReviews.forEach(review=>{
    const card=document.createElement('div');
    card.className='review-card';

    card.innerHTML=`
      <div style="color:#D4AF37">
        ${'★'.repeat(Math.max(1,Math.min(5,Number(review.rating)||5)))}
      </div>
      <p>${escapeHTML(review.comment)}</p>
      <strong>${escapeHTML(review.name)}</strong>`;

    container.appendChild(card);
  });
}

function addCustomerReview(){
  const name=document.getElementById('reviewName')?.value.trim();
  const comment=document.getElementById('reviewComment')?.value.trim();
  const rating=Number(document.getElementById('reviewRating')?.value||5);

  if(!name||!comment)return alert('اكتبي الاسم والتقييم.');

  customerReviews.unshift({
    id:String(Date.now()),
    name,
    comment,
    rating:Math.max(1,Math.min(5,rating))
  });

  saveLocal(STORAGE_KEYS.reviews,customerReviews);
  renderReviews();

  if(firebaseAPI()){
    cloudSave('reviews',customerReviews[0].id,customerReviews[0]);
  }

  const nameEl=document.getElementById('reviewName');
  const commentEl=document.getElementById('reviewComment');

  if(nameEl)nameEl.value='';
  if(commentEl)commentEl.value='';
}

function syncAuthState(){
  const api=firebaseAPI();

  if(!api||typeof api.onAuthStateChanged!=='function')return;

  api.onAuthStateChanged(user=>{
    ownerSession=Boolean(user);
    updateOwnerUI();
    renderProducts(products);
    renderCommunityChat();
  });
}

async function loginAdmin(){
  const email=document.getElementById('adminEmailInput')?.value.trim();
  const password=document.getElementById('adminPasswordInput')?.value;

  if(!email||!password)return alert('اكتبي البريد الإلكتروني وكلمة المرور.');

  const api=firebaseAPI();

  if(!api){
    return alert('تسجيل الدخول يحتاج إعداد Firebase Authentication.');
  }

  try{
    await api.login(email,password);

    ownerSession=true;
    closeProfileModal();
    updateOwnerUI();
    renderProducts(products);
    renderCommunityChat();

    alert('تم تسجيل الدخول بنجاح.');
  }catch(error){
    console.error(error);
    alert('تعذر تسجيل الدخول. راجعي البريد وكلمة المرور وإعدادات Firebase.');
  }
}

async function logoutAdmin(){
  const api=firebaseAPI();

  try{
    if(api)await api.logout();
  }catch(error){
    console.error(error);
  }

  ownerSession=false;
  updateOwnerUI();
  renderProducts(products);
  renderCommunityChat();
  closeProfileModal();
}

function updateOwnerUI(){
  const panel=document.getElementById('adminPanelContainer');

  if(panel)panel.style.display=ownerSession?'block':'none';

  const button=document.getElementById('floatingAdminBtn');

  if(button){
    button.textContent=ownerSession
      ?'⚙️ لوحة تحكم المالكة'
      :'⚙️ دخول المالكة';
  }
}

function openProfileModal(){
  const modal=document.getElementById('profileModal');
  if(modal)modal.style.display='flex';
}

function closeProfileModal(){
  const modal=document.getElementById('profileModal');
  if(modal)modal.style.display='none';
}

function openReviewsModal(){
  const el=document.getElementById('reviewsModal');
  if(el)el.style.display='flex';
}

function closeReviewsModal(){
  const el=document.getElementById('reviewsModal');
  if(el)el.style.display='none';
}

Object.assign(window,{
  filterCategory,
  filterProducts,
  openAddProductModal,
  saveNewProduct,
  openEditProductModal,
  saveEditedProduct,
  deleteProduct,
  toggleOutOfStock,
  openProductDetails,
  selectSizeForCart,
  selectProductColor,
  closeProductModal,
  addToCart,
  updateCartCount,
  openCartModal,
  changeCartQty,
  removeFromCart,
  closeCartModal,
  sendToWhatsApp,
  sendCommunityMessage,
  toggleReplyBox,
  sendCommunityReply,
  deleteCommunityMessage,
  deleteCommunityReply,
  renderReviews,
  addCustomerReview,
  loginAdmin,
  logoutAdmin,
  updateOwnerUI,
  openProfileModal,
  closeProfileModal,
  openReviewsModal,
  closeReviewsModal,
  loadCloudData
});
