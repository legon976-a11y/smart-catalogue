document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Theme Engine Configuration ---
    const themes = {
        luxury: {
            fontSerif: 'Playfair Display',
            fontSans: 'Inter',
            bgColor: 'bg-[#FCFAF6]',
            accentColor: 'text-[#4A4A4A]',
            borderColor: 'border-[#D4AF37]', // Gold accent
            roundness: 'rounded-none',
            shadow: 'shadow-[0_10px_50px_rgba(0,0,0,0.05)]',
            pattern: 'background-image: radial-gradient(#d4af37 0.5px, transparent 0.5px); background-size: 30px 30px; opacity: 0.1;',
            decoration: '<div class="absolute top-0 right-0 w-32 h-64 border-r border-[#D4AF37] opacity-20"></div>',
            styleName: 'Luxurious'
        },
        kids: {
            fontSerif: 'Fredoka',
            fontSans: 'Quicksand',
            bgColor: 'bg-[#FFF9F2]',
            accentColor: 'text-[#F472B6]',
            borderColor: 'border-[#F9A8D4]',
            roundness: 'rounded-[100px]',
            shadow: 'shadow-[0_20px_40px_rgba(244,114,182,0.1)]',
            pattern: 'background-image: radial-gradient(#f9a8d4 2px, transparent 2px); background-size: 40px 40px; opacity: 0.2;',
            decoration: '<div class="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-40 blur-xl"></div><div class="absolute bottom-10 right-20 w-32 h-32 bg-yellow-100 rounded-full opacity-40 blur-2xl"></div>',
            styleName: 'Kids & Playful'
        },
        food: {
            fontSerif: 'Playfair Display',
            fontSans: 'Inter',
            bgColor: 'bg-[#F4F9F4]',
            accentColor: 'text-[#15803D]',
            borderColor: 'border-[#86EFAC]',
            roundness: 'rounded-[40px]',
            shadow: 'shadow-md',
            pattern: 'background-image: repeating-linear-gradient(45deg, #86efac 0, #86efac 1px, transparent 0, transparent 50%); background-size: 20px 20px; opacity: 0.1;',
            decoration: '<div class="absolute -top-10 -left-10 w-40 h-40 border-[20px] border-green-50 rounded-full opacity-50"></div>',
            styleName: 'Fresh & Organic'
        },
        electronics: {
            fontSerif: 'Orbitron',
            fontSans: 'Roboto',
            bgColor: 'bg-[#050505]',
            accentColor: 'text-[#3B82F6]',
            borderColor: 'border-[#1E3A8A]',
            textColor: 'text-gray-400',
            titleColor: 'text-white',
            roundness: 'rounded-none',
            shadow: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
            pattern: 'background-image: linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px); background-size: 50px 50px; opacity: 0.15;',
            decoration: '<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>',
            styleName: 'Cyber & Tech'
        },
        sport: {
            fontSerif: 'Oswald',
            fontSans: 'Inter',
            bgColor: 'bg-white',
            accentColor: 'text-black',
            borderColor: 'border-black',
            roundness: 'rounded-none',
            shadow: 'shadow-2xl',
            pattern: 'background-image: linear-gradient(135deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent 100%); background-size: 4px 4px; opacity: 0.05;',
            decoration: '<div class="absolute top-0 right-0 w-1/2 h-full bg-black/5 -skew-x-12 transform translate-x-20"></div>',
            styleName: 'Bold Athletic'
        },
        health: {
            fontSerif: 'Inter',
            fontSans: 'Inter',
            bgColor: 'bg-white',
            accentColor: 'text-[#0891B2]',
            borderColor: 'border-[#CFFAFE]',
            roundness: 'rounded-3xl',
            shadow: 'shadow-sm',
            pattern: 'background-image: radial-gradient(#cffafe 1px, transparent 1px); background-size: 20px 20px; opacity: 0.5;',
            decoration: '<div class="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-100 opacity-50"></div>',
            styleName: 'Healthy & Pure'
        }
    };

    // Mapping 18 categories to theme presets
    const categoryToTheme = {
        luxury: 'luxury',
        kids: 'kids',
        food: 'food',
        fashion: 'fashion',
        shoes: 'fashion',
        bags: 'luxury',
        toys: 'kids',
        beauty: 'luxury',
        household: 'food',
        electronics: 'electronics',
        sport: 'sport',
        auto: 'electronics',
        pets: 'kids',
        books: 'luxury', // Classic feel
        gifts: 'kids',
        travel: 'luxury',
        tools: 'electronics',
        health: 'health'
    };

    let currentThemeKey = 'luxury';
    let currentTheme = themes[currentThemeKey];

    const themeSelect = document.getElementById('category-theme-select');
    themeSelect.addEventListener('change', (e) => {
        currentThemeKey = categoryToTheme[e.target.value] || 'luxury';
        currentTheme = themes[currentThemeKey];
        updateGlobalStyles();
    });

    function updateGlobalStyles() {
        // Dynamically load fonts
        const fonts = [currentTheme.fontSerif, currentTheme.fontSans];
        fonts.forEach(font => {
            const fontId = `font-${font.replace(/\\s+/g, '-')}`;
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link');
                link.id = fontId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\\s+/g, '+')}:wght@400;700&display=swap`;
                document.head.appendChild(link);
            }
        });
        
        console.log(`Theme shifted to: ${currentTheme.styleName}`);
        if (typeof renderCatalogPages === 'function') {
            renderCatalogPages();
        }
    }

    // --- Product Data ---
    const mockProducts = [
        { id: '864209', name: 'Lumber', author: 'Jane Doe', price: '$90', desc: 'Чанартай модоор хийгдсэн минимал загвар.' , transparentImg: 'https://cdn.pixabay.com/photo/2017/09/27/02/47/chair-2790933_1280.png'},
        { id: '394811', name: 'Floating Table', author: 'Legon', price: '$400', desc: 'Хөвж буй мэт харагдах өвөрмөц хийцтэй ширээ.', transparentImg: 'https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.png'},
        { id: '502394', name: 'Elke Stool', author: 'Sven Pipes', price: '$400', desc: 'Байгалийн модон хийцтэй Elke сандал.', transparentImg: 'https://cdn.pixabay.com/photo/2018/06/11/21/50/stool-3469443_1280.png'},
        { id: '719330', name: 'Sandwich TV Set', author: 'Klim & Rowler', price: '$400', desc: 'Орчин үеийн хэв маягийг хослуулсан зурагтны тавиур.', transparentImg: 'https://cdn.pixabay.com/photo/2013/07/13/11/31/television-158356_1280.png'},
        { id: '129845', name: 'Hemper Sofa', author: 'Vasel', price: '$1200', desc: 'Илүү зөөлөн, илүү тав тухтай буйдан.', transparentImg: 'https://cdn.pixabay.com/photo/2016/11/19/15/50/chair-1840011_1280.png'}
    ];

    // Initialize Picker
    const listContainer = document.getElementById('mock-product-list');
    
    function renderProductCards() {
        listContainer.innerHTML = mockProducts.map(p => `
            <div class="product-picker-card bg-white p-4 rounded-3xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300 group" data-id="${p.id}">
                <div class="h-32 mb-4 rounded-xl overflow-hidden relative flex items-center justify-center p-2 bg-gray-50/50">
                    <img src="${p.transparentImg}" class="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-500 drop-shadow-md">
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span class="text-white font-bold text-[10px] bg-black/70 px-4 py-2 rounded-full uppercase tracking-widest"><i class="fa-solid fa-plus mr-1"></i> НЭМЭХ</span>
                    </div>
                </div>
                <h4 class="font-bold text-sm text-gray-800 font-serif">${p.name}</h4>
                <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">${p.price}</p>
                <button class="add-to-cart-btn mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold py-2 px-2 rounded transition" data-product-id="${p.id}">
                    <i class="fa-solid fa-shopping-cart mr-1"></i> Add to Cart
                </button>
            </div>
        `).join('');

        // Attach event listeners to product cards
        document.querySelectorAll('.product-picker-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart-btn')) {
                    const pId = e.currentTarget.dataset.id;
                    const prod = mockProducts.find(p => p.id === pId);
                    insertProductToCatalog(prod);
                    document.getElementById('close-modal-btn').click();
                    if (emptyState) emptyState.remove();
                }
            });
        });

        // Attach event listeners to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.productId;
                const prod = mockProducts.find(p => p.id === productId);
                addToCart(prod);
            });
        });
    }
    
    renderProductCards();

    const modal = document.getElementById('product-modal');
    const modalInner = document.getElementById('product-modal-card');
    const catalogContainer = document.getElementById('catalog-sections');
    const emptyState = document.getElementById('empty-state');
    let layoutIndex = 0;
    
    document.getElementById('add-product-btn').addEventListener('click', () => {
        try {
            modal.classList.remove('hidden');
            setTimeout(() => {
                if (modal) {
                    modal.classList.remove('opacity-0');
                    if (modalInner) modalInner.classList.remove('scale-95');
                }
            }, 10);
        } catch (e) {
            console.error('Error opening product modal:', e);
        }
    });

    document.getElementById('close-modal-btn').addEventListener('click', () => {
        try {
            if (modal) {
                modal.classList.add('opacity-0');
                if (modalInner) modalInner.classList.add('scale-95');
                setTimeout(() => {
                    if (modal) modal.classList.add('hidden');
                }, 300);
            }
        } catch (e) {
            console.error('Error closing product modal:', e);
        }
    });

    function getQRCodeUrl(text) {
        if (!text) return '';
        try {
            return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(String(text))}&color=000000&bgcolor=ffffff00`;
        } catch (e) {
            console.warn('QR Code generation error:', e);
            return '';
        }
    }

    function getBarcodeUrl(text) {
        if (!text) return '';
        try {
            return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(String(text))}&scale=2&height=10&includetext=true`;
        } catch (e) {
            console.warn('Barcode generation error:', e);
            return '';
        }
    }

    // ===== PAPER SIZE & LAYOUT SELECTOR =====
    
    const paperSizeSelect = document.getElementById('paper-size-select');
    const customSizeInputs = document.getElementById('custom-size-inputs');
    const paperWidthInput = document.getElementById('paper-width');
    const paperHeightInput = document.getElementById('paper-height');
    
    let currentPaperWidth = '210mm';
    let currentPaperHeight = '297mm';

    function updatePaperSize() {
        const val = paperSizeSelect.value;
        if(val === 'Custom') {
            customSizeInputs.classList.remove('hidden');
            customSizeInputs.classList.add('flex');
            const w = paperWidthInput.value || 210;
            const h = paperHeightInput.value || 297;
            currentPaperWidth = w + 'mm';
            currentPaperHeight = h + 'mm';
        } else {
            customSizeInputs.classList.add('hidden');
            customSizeInputs.classList.remove('flex');
            if(val === 'A4') { currentPaperWidth = '210mm'; currentPaperHeight = '297mm'; }
            if(val === 'A3') { currentPaperWidth = '297mm'; currentPaperHeight = '420mm'; }
            if(val === 'A5') { currentPaperWidth = '148mm'; currentPaperHeight = '210mm'; }
            if(val === 'Square') { currentPaperWidth = '210mm'; currentPaperHeight = '210mm'; }
        }
        renderCatalogPages();
    }

    paperSizeSelect.addEventListener('change', updatePaperSize);
    paperWidthInput.addEventListener('input', updatePaperSize);
    paperHeightInput.addEventListener('input', updatePaperSize);

    // Layout Modal
    const layoutModal = document.getElementById('layout-modal');
    const layoutModalCard = document.getElementById('layout-modal-card');
    const applyLayoutBtn = document.getElementById('apply-layout-btn');
    let selectedLayoutType = 'hero-grid'; // Default layout

    document.querySelectorAll('.layout-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.layout-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedLayoutType = opt.dataset.layout;
            applyLayoutBtn.disabled = false;
        });
    });

    applyLayoutBtn.addEventListener('click', () => {
        closeLayoutModal();
        renderCatalogPages();
    });

    document.getElementById('close-layout-modal-btn').addEventListener('click', closeLayoutModal);

    function openLayoutModal() {
        layoutModal.classList.remove('hidden');
        setTimeout(() => {
            layoutModal.classList.remove('opacity-0');
            layoutModalCard.classList.remove('scale-95');
        }, 10);
    }

    function closeLayoutModal() {
        layoutModal.classList.add('opacity-0');
        layoutModalCard.classList.add('scale-95');
        setTimeout(() => layoutModal.classList.add('hidden'), 300);
    }

    // ===== SMART GRID ENGINE =====

    let placedProducts = [];

    // Replace old insertProductToCatalog
    function insertProductToCatalog(prod) {
        placedProducts.push(prod);
        
        // If this is the first product, ask for layout
        if(placedProducts.length === 1) {
            openLayoutModal();
        } else {
            renderCatalogPages();
        }
    }

    document.getElementById('smart-arrange-btn').addEventListener('click', () => {
        if(placedProducts.length === 0) {
            alert('Эхлээд бараа оруулна уу!');
            return;
        }
        // Smart Arrange: Sort by price descending to put most expensive items in "Big" slots
        placedProducts.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
            return priceB - priceA;
        });
        
        openLayoutModal(); // Let user pick layout, then it will render
    });

    function getProductSlotHTML(prod, slotClass, isBig) {
        if(!prod) return `<div class="product-slot ${slotClass} border-2 border-dashed border-gray-300 opacity-50 flex items-center justify-center text-gray-400 font-bold uppercase text-xs" contenteditable="true">Empty Slot</div>`;
        
        const t = currentTheme;
        const titleSize = isBig ? 'text-4xl' : 'text-lg';
        const priceSize = isBig ? 'text-2xl' : 'text-md';

        return `
            <div class="product-slot ${slotClass} group bg-white border ${t.borderColor} shadow-sm">
                <img src="${prod.transparentImg}" alt="Product" class="mix-blend-multiply" onclick="swapImage(this, '${prod.id}')">
                <div class="product-info-box ${t.bgColor}">
                    <h3 class="${titleSize} font-bold ${t.titleColor} mb-1" style="font-family: '${t.fontSerif}', serif;" contenteditable="true">${prod.name}</h3>
                    <p class="text-[9px] uppercase tracking-widest text-gray-400 mb-2" contenteditable="true">${prod.author}</p>
                    <p class="${priceSize} font-bold ${t.accentColor}" contenteditable="true">${prod.price}</p>
                </div>
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <img src="${getQRCodeUrl(prod.id)}" class="w-10 h-10 mix-blend-multiply">
                </div>
            </div>
        `;
    }

    // Swapping image on click
    window.swapImage = function(imgEl, prodId) {
        if (!imgEl || !prodId) return;
        const newUrl = prompt('Шинэ зургийн URL холбоосыг оруулна уу:');
        if (newUrl && newUrl.trim()) {
            try {
                // Validate URL format
                new URL(newUrl);
                const img = new Image();
                img.onerror = function() {
                    alert('Зургийн холбоос буруу байна. Дахин оруулна уу.');
                };
                img.onload = function() {
                    imgEl.src = newUrl;
                    // Update in data
                    const p = placedProducts.find(x => x.id === prodId);
                    if (p) p.transparentImg = newUrl;
                };
                img.src = newUrl;
            } catch (e) {
                alert('Буруу URL формат байна.');
            }
        }
    };

    function renderCatalogPages() {
        try {
            if (placedProducts.length === 0) return;
            if (emptyState) emptyState.remove();
            catalogContainer.innerHTML = '';

            const capacityMap = {
                'hero-grid': 5,
                'magazine-left': 4,
                'bento-box': 4,
                'classic-3x3': 9,
                'feature-row': 3
            };
            const cap = capacityMap[selectedLayoutType] || 5;

            for (let i = 0; i < placedProducts.length; i += cap) {
                const pageItems = placedProducts.slice(i, i + cap);
                const pageEl = document.createElement('div');
                pageEl.className = `catalog-page ${currentTheme.bgColor}`;
                pageEl.style.width = currentPaperWidth;
                pageEl.style.height = currentPaperHeight;

                // Add Theme Pattern
                const patternEl = document.createElement('div');
                patternEl.className = 'absolute inset-0 pointer-events-none';
                patternEl.style = currentTheme.pattern || '';
                pageEl.appendChild(patternEl);
                pageEl.insertAdjacentHTML('beforeend', currentTheme.decoration || '');

                const gridContainer = document.createElement('div');
                gridContainer.className = `strict-grid layout-${selectedLayoutType} relative z-10`;

                let innerHtml = '';

                if (selectedLayoutType === 'hero-grid') {
                    innerHtml += getProductSlotHTML(pageItems[0], 'slot-big', true);
                    innerHtml += `<div class="sub-grid">`;
                    for (let j = 1; j < 5; j++) innerHtml += getProductSlotHTML(pageItems[j], '', false);
                    innerHtml += `</div>`;
                }
                else if (selectedLayoutType === 'magazine-left') {
                    innerHtml += getProductSlotHTML(pageItems[0], 'slot-big', true);
                    innerHtml += `<div class="sub-grid">`;
                    for (let j = 1; j < 4; j++) innerHtml += getProductSlotHTML(pageItems[j], '', false);
                    innerHtml += `</div>`;
                }
                else if (selectedLayoutType === 'bento-box') {
                    innerHtml += getProductSlotHTML(pageItems[0], 'slot-big', true);
                    innerHtml += getProductSlotHTML(pageItems[1], 'slot-med-1', false);
                    innerHtml += getProductSlotHTML(pageItems[2], 'slot-med-2', false);
                    innerHtml += getProductSlotHTML(pageItems[3], 'slot-long', false);
                }
                else if (selectedLayoutType === 'classic-3x3') {
                    for (let j = 0; j < 9; j++) innerHtml += getProductSlotHTML(pageItems[j], '', false);
                }
                else if (selectedLayoutType === 'feature-row') {
                    for (let j = 0; j < 3; j++) innerHtml += getProductSlotHTML(pageItems[j], '', false);
                }

                gridContainer.innerHTML = innerHtml;
                pageEl.appendChild(gridContainer);

                // Add Page Number
                const pageNum = document.createElement('div');
                pageNum.className = `absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-widest font-bold ${currentTheme.textColor}`;
                pageNum.innerHTML = `<span contenteditable="true">Page ${Math.floor(i / cap) + 1}</span>`;
                pageEl.appendChild(pageNum);

                catalogContainer.appendChild(pageEl);
            }
        } catch (e) {
            console.error('Error rendering catalog pages:', e);
            alert('Каталог үүсгэхэд алдаа гарлаа.');
        }
    }

    document.getElementById('print-catalog-btn').addEventListener('click', () => {
        window.print();
    });

    // Initial style update
    updateGlobalStyles();

    // ===== NAVIGATION & CART SYSTEM =====
    
    // Product categories mapping
    const productCategories = {
        'Tables': ['Floating Table'],
        'Chairs': ['Lumber', 'Elke Stool'],
        'TV Sets': ['Sandwich TV Set'],
        'Sofas': ['Hemper Sofa']
    };

    // Cart management
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    function updateCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const cartCount = cartItems.length;
            cartBadge.textContent = cartCount > 0 ? cartCount : '3';
            cartBadge.style.display = cartCount > 0 ? 'flex' : 'flex'; // Always show for now
        }
    }

    function addToCart(product) {
        try {
            if (!product || !product.id) {
                alert('Бараа олдсонгүй');
                return;
            }
            cartItems.push(product);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartBadge();
            alert(`${product.name || 'Бараа'} сагсанд нэмэгдлээ!`);
        } catch (e) {
            console.error('Error adding to cart:', e);
            alert('Сагсанд нэмэхэд алдаа гарлаа.');
        }
    }

    function openCart() {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        let cartHtml = '<h2>Shopping Cart</h2>\n';
        let total = 0;
        
        cartItems.forEach((item, index) => {
            const price = parseInt(item.price.replace(/[$,]/g, '')) || 0;
            total += price;
            cartHtml += `<p>${index + 1}. ${item.name} - ${item.price}</p>\n`;
        });
        
        cartHtml += `\n<p><strong>Total: $${total}</strong></p>\n`;
        cartHtml += '<button onclick="clearCart()">Clear Cart</button>';
        
        // Could open in modal or new page - for now showing alert with items
        const cartWindow = window.open();
        cartWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shopping Cart | Legon</title>
                <style>
                    body { font-family: Arial; padding: 20px; background: #f0f0f0; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
                    button { padding: 10px 20px; background: #fbbf24; border: none; border-radius: 4px; cursor: pointer; }
                    button:hover { background: #f59e0b; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🛒 Shopping Cart</h1>
                    <hr>
                    ${cartItems.map((item, idx) => `<p><strong>${idx + 1}.</strong> ${item.name} - ${item.price}</p>`).join('')}
                    <hr>
                    <h2>Total: $${total}</h2>
                    <button onclick="alert('Thank you for your order!'); window.close();">Checkout</button>
                    <button onclick="window.close();">Close</button>
                </div>
            </body>
            </html>
        `);
    }

    function clearCart() {
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartBadge();
        alert('Cart cleared!');
    }

    function filterProductsByCategory(category) {
        const matching = mockProducts.filter(p => 
            productCategories[category]?.includes(p.name)
        );
        
        if (matching.length === 0) {
            alert(`No products found in ${category} category`);
            return;
        }

        // Clear current catalog
        catalogContainer.innerHTML = '';
        emptyState?.remove();

        // Insert matching products
        layoutIndex = 0;
        matching.forEach(prod => {
            insertProductToCatalog(prod);
        });

        // Scroll to catalog
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    function openContact() {
        const contactWindow = window.open();
        contactWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Contact Us | Legon</title>
                <style>
                    body { 
                        font-family: 'Inter', Arial; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .container { 
                        max-width: 500px; 
                        margin: 0 auto; 
                        background: white; 
                        padding: 40px; 
                        border-radius: 12px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    }
                    h1 { color: #333; margin-bottom: 20px; }
                    .form-group { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; color: #555; font-weight: 600; }
                    input, textarea { 
                        width: 100%; 
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        border-radius: 4px;
                        font-family: inherit;
                        box-sizing: border-box;
                    }
                    textarea { resize: vertical; min-height: 120px; }
                    button { 
                        width: 100%; 
                        padding: 12px; 
                        background: #667eea; 
                        color: white; 
                        border: none; 
                        border-radius: 4px; 
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    button:hover { background: #5568d3; }
                    .contact-info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
                    .contact-info p { margin: 10px 0; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📞 Contact Us</h1>
                    <form onsubmit="handleContactSubmit(event)">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit">Send Message</button>
                    </form>
                    
                    <div class="contact-info">
                        <h3>Other Ways to Reach Us</h3>
                        <p>📧 Email: info@legon.mn</p>
                        <p>📞 Phone: +976 (0) 123-4567</p>
                        <p>📍 Address: Ulaanbaatar, Mongolia</p>
                        <p>⏰ Hours: 9 AM - 6 PM (Mon-Fri)</p>
                    </div>
                </div>
                <script>
                    function handleContactSubmit(e) {
                        e.preventDefault();
                        const name = document.getElementById('name').value;
                        const email = document.getElementById('email').value;
                        const message = document.getElementById('message').value;
                        alert('Thank you for contacting us, ' + name + '!\\nWe will get back to you at ' + email + ' soon.');
                        window.close();
                    }
                </script>
            </body>
            </html>
        `);
    }

    // Add navigation click handlers
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            if (action === 'cart') {
                openCart();
            } else if (action === 'contact') {
                openContact();
            } else if (action === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (action === 'shop') {
                document.getElementById('catalog-sections').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('Энэ цэс одоогоор хөгжүүлэгдэж байна.');
            }
        });

        // Add hover effect
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', function() {
            this.style.opacity = '1';
        });
        item.addEventListener('mouseleave', function() {
            this.style.opacity = '0.8';
        });
    });

    // Update cart badge on page load
    updateCartBadge();

    // ===== EXCEL IMPORT SYSTEM =====
    
    let excelData = [];
    const excelModal = document.getElementById('excel-modal');
    const excelModalCard = document.getElementById('excel-modal-card');
    const excelFileInput = document.getElementById('excel-file-input');
    const excelDropZone = document.getElementById('excel-drop-zone');
    const excelPreview = document.getElementById('excel-preview');
    const excelPreviewTable = document.getElementById('excel-preview-table');
    const importExcelConfirmBtn = document.getElementById('import-excel-btn-confirm');

    // Open Excel modal
    document.getElementById('import-excel-btn').addEventListener('click', () => {
        excelModal.classList.remove('hidden');
        setTimeout(() => {
            excelModal.classList.remove('opacity-0');
            excelModalCard.classList.remove('scale-95');
        }, 10);
    });

    // Close Excel modal
    document.getElementById('close-excel-modal-btn').addEventListener('click', () => {
        excelModal.classList.add('opacity-0');
        excelModalCard.classList.add('scale-95');
        setTimeout(() => excelModal.classList.add('hidden'), 300);
        excelPreview.classList.add('hidden');
        excelData = [];
        importExcelConfirmBtn.disabled = true;
    });

    // Excel file upload
    excelDropZone.addEventListener('click', () => excelFileInput.click());

    excelFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processExcelFile(file);
    });

    // Drag and drop
    excelDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        excelDropZone.style.borderColor = '#3b82f6';
        excelDropZone.style.backgroundColor = '#eff6ff';
    });

    excelDropZone.addEventListener('dragleave', () => {
        excelDropZone.style.borderColor = '#d1d5db';
        excelDropZone.style.backgroundColor = 'transparent';
    });

    excelDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        excelDropZone.style.borderColor = '#d1d5db';
        excelDropZone.style.backgroundColor = 'transparent';
        const file = e.dataTransfer.files[0];
        if (file) processExcelFile(file);
    });

    function processExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                if (jsonData.length === 0) {
                    alert('Excel файл хоосон байна!');
                    return;
                }

                // Validate columns
                const requiredColumns = ['Нэр', 'Үнэ', 'Зүйл'];
                const headers = Object.keys(jsonData[0]);
                const hasRequiredColumns = requiredColumns.every(col => 
                    headers.some(h => h.toLowerCase().includes(col.toLowerCase()))
                );

                if (!hasRequiredColumns) {
                    alert(`Excel файлд дараах баганууд байх ёстой:\n${requiredColumns.join(', ')}`);
                    return;
                }

                excelData = jsonData.map(row => {
                    // Normalize column names (case-insensitive)
                    const normalized = {};
                    Object.keys(row).forEach(key => {
                        const lowerKey = key.toLowerCase().trim();
                        if (lowerKey.includes('нэр')) normalized.name = row[key];
                        else if (lowerKey.includes('үнэ')) normalized.price = row[key];
                        else if (lowerKey.includes('зүйл')) normalized.category = row[key];
                        else if (lowerKey.includes('хангагч')) normalized.author = row[key];
                        else if (lowerKey.includes('зураг')) normalized.imageUrl = row[key];
                        else if (lowerKey.includes('тайлбар')) normalized.description = row[key];
                    });
                    return normalized;
                });

                displayExcelPreview();
                importExcelConfirmBtn.disabled = false;
            } catch (error) {
                alert('Excel файлыг уншихад алдаа гарлаа: ' + error.message);
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function displayExcelPreview() {
        excelPreview.classList.remove('hidden');
        const thead = excelPreviewTable.querySelector('thead');
        const tbody = excelPreviewTable.querySelector('tbody');

        // Clear existing content
        thead.innerHTML = '';
        tbody.innerHTML = '';

        if (excelData.length === 0) return;

        // Create headers
        const headerRow = document.createElement('tr');
        ['Нэр', 'Үнэ', 'Зүйл', 'Хангагч'].forEach(col => {
            const th = document.createElement('th');
            th.className = 'px-4 py-2 text-left font-bold text-gray-700 bg-gray-100 border-b';
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Display first 5 rows
        excelData.slice(0, 5).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-4 py-2 border-b">${row.name || '-'}</td>
                <td class="px-4 py-2 border-b">${row.price || '-'}</td>
                <td class="px-4 py-2 border-b text-sm">${row.category || '-'}</td>
                <td class="px-4 py-2 border-b text-sm">${row.author || '-'}</td>
            `;
            tbody.appendChild(tr);
        });

        if (excelData.length > 5) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" class="px-4 py-2 text-center text-gray-500 text-sm">+ ${excelData.length - 5} бусад мөр</td>`;
            tbody.appendChild(tr);
        }
    }

    importExcelConfirmBtn.addEventListener('click', () => {
        if (excelData.length === 0) return;

        // Check if we need to update mock products or add to existing
        const importedProducts = excelData.map((row, index) => ({
            id: `excel-${Date.now()}-${index}`,
            name: row.name || 'Нэргүй',
            price: row.price || '$0',
            desc: row.description || row.category || 'Импортолсон бараа',
            author: row.author || 'Импорт',
            category: row.category || 'Ерөнхий',
            transparentImg: row.imageUrl || 'https://cdn.pixabay.com/photo/2016/11/19/15/50/chair-1840011_1280.png'
        }));

        // Add imported products to mockProducts
        mockProducts.push(...importedProducts);

        // Re-render product cards
        renderProductCards();

        // Show success message
        alert(`${importedProducts.length} бараа амжилттай импортлогдлоо!`);

        // Close modal
        document.getElementById('close-excel-modal-btn').click();
    });

    // Download sample Excel template
    window.downloadSampleExcel = function() {
        const sampleData = [
            {
                'Нэр': 'Сайн ширээ',
                'Үнэ': '$250',
                'Зүйл': 'Тавилга',
                'Хангагч': 'Легон',
                'Тайлбар': 'Орчин үеийн загвартай чанартай ширээ'
            },
            {
                'Нэр': 'Эргүүлэх сандал',
                'Үнэ': '$180',
                'Зүйл': 'Сандалс',
                'Хангагч': 'Дизайн Студио',
                'Тайлбар': 'Ажлын орчны хэрэгцээнд үндэслэлтэй сандал'
            },
            {
                'Нэр': '4K Интернет ТВ',
                'Үнэ': '$600',
                'Зүйл': 'Электроник',
                'Хангагч': 'Техно',
                'Тайлбар': 'Үндсэн техникийн параметр бүхий цахилгаан болт'
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Бараа');
        
        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 },
            { wch: 12 },
            { wch: 15 },
            { wch: 20 },
            { wch: 40 }
        ];

        XLSX.writeFile(workbook, 'baraa_template.xlsx');
    };

});
