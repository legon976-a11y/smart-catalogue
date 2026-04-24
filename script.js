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
            const fontId = `font-${font.replace(/\s+/g, '-')}`;
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link');
                link.id = fontId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
                document.head.appendChild(link);
            }
        });
        
        console.log(`Theme shifted to: ${currentTheme.styleName}`);
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
        </div>
    `).join('');

    const modal = document.getElementById('product-modal');
    const modalInner = document.getElementById('product-modal-card');
    
    document.getElementById('add-product-btn').addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalInner.classList.remove('scale-95');
        }, 10);
    });

    document.getElementById('close-modal-btn').addEventListener('click', () => {
        modal.classList.add('opacity-0');
        modalInner.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    });

    const catalogContainer = document.getElementById('catalog-sections');
    const emptyState = document.getElementById('empty-state');
    let layoutIndex = 0;

    document.querySelectorAll('.product-picker-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const pId = e.currentTarget.dataset.id;
            const prod = mockProducts.find(p => p.id === pId);
            insertProductToCatalog(prod);
            document.getElementById('close-modal-btn').click();
            if (emptyState) emptyState.remove();
        });
    });

    function getQRCodeUrl(text) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff00`;
    }

    function getBarcodeUrl(text) {
        return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(text)}&scale=2&height=10&includetext=true`;
    }

    function insertProductToCatalog(prod) {
        const layouts = ['center', 'right', 'left'];
        const type = layouts[layoutIndex % layouts.length];
        layoutIndex++;

        let sectionHtml = '';
        const qrCode = getQRCodeUrl(prod.id);
        const barcode = getBarcodeUrl(prod.id);

        // Theme props
        const t = currentTheme;
        const fontSerif = `font-family: '${t.fontSerif}', serif;`;
        const fontSans = `font-family: '${t.fontSans}', sans-serif;`;
        const textColor = t.textColor || 'text-gray-500';
        const titleColor = t.titleColor || 'text-gray-800';

        if (type === 'center') {
            sectionHtml = `
            <section class="catalog-section pr-[300px] min-h-[90vh] flex flex-col justify-center py-20 ${t.bgColor} relative overflow-hidden">
                <div class="absolute inset-0 pointer-events-none" style="${t.pattern}"></div>
                ${t.decoration}
                <div class="max-w-7xl mx-auto w-full px-12 relative flex items-center">
                    <div class="w-1/3 z-20">
                        <h2 class="text-6xl font-bold tracking-tight ${titleColor} mb-2" style="${fontSerif}">${prod.name}</h2>
                        <p class="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-6 border-b ${t.borderColor} pb-2 inline-block" style="${fontSans}">By ${prod.author}</p>
                        <p class="text-3xl font-bold ${t.accentColor}" style="${fontSans}">${prod.price}</p>
                    </div>

                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] z-10 pointer-events-none">
                        <img src="${prod.transparentImg}" class="w-full ${t.shadow} ${t.roundness} opacity-95 animate-in-view mix-blend-multiply">
                    </div>

                    <div class="w-1/3 ml-auto z-20 text-right">
                        <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 flex justify-end gap-4 items-center" style="${fontSans}">
                            PRODUCT DETAILS <span class="w-6 h-px bg-gray-300"></span>
                        </h4>
                        <p class="text-[11px] leading-relaxed ${textColor} mb-8 max-w-[280px] ml-auto block" style="${fontSans}">
                            ${prod.desc}
                        </p>
                        
                        <div class="flex items-center justify-end gap-6 border-t ${t.borderColor} pt-8 opacity-70 mix-blend-multiply">
                            <img src="${barcode}" class="h-10 mix-blend-multiply opacity-80" alt="Barcode">
                            <img src="${qrCode}" class="h-16 mix-blend-multiply" alt="QR Code">
                        </div>
                    </div>
                </div>
            </section>
            `;
        } else if (type === 'right') {
            sectionHtml = `
            <section class="catalog-section pr-[300px] min-h-[90vh] flex items-center py-20 ${t.bgColor} relative overflow-hidden">
                <div class="absolute inset-0 pointer-events-none" style="${t.pattern}"></div>
                ${t.decoration}
                <div class="w-1/2 pl-24 z-20">
                    <h4 class="text-[9px] uppercase font-bold tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-4" style="${fontSans}">
                        <span class="w-8 h-px bg-gray-300"></span> PREMIUM SELECTION
                    </h4>
                    <h2 class="text-5xl font-bold tracking-tight ${titleColor} mb-2" style="${fontSerif}">${prod.name}</h2>
                    <p class="text-2xl font-bold ${t.accentColor} mb-10" style="${fontSans}">${prod.price}</p>
                    
                    <p class="text-xs leading-loose ${textColor} mb-8 max-w-sm" style="${fontSans}">
                        ${prod.desc}
                    </p>

                    <div class="flex items-center gap-6 mt-12 bg-white/40 p-6 ${t.roundness} w-max backdrop-blur-sm border border-white/50 shadow-sm relative overflow-hidden">
                        <img src="${qrCode}" class="h-20 mix-blend-multiply" alt="QR Code">
                        <div>
                            <p class="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-2" style="${fontSans}">Scan & Buy</p>
                            <img src="${barcode}" class="h-8 mix-blend-multiply opacity-80" alt="Barcode">
                        </div>
                    </div>
                </div>
                <div class="absolute right-[200px] top-1/2 -translate-y-1/2 w-[800px] z-10 pointer-events-none">
                    <img src="${prod.transparentImg}" class="w-full ${t.shadow} ${t.roundness} animate-in-view mix-blend-multiply">
                </div>
            </section>
            `;
        } else {
            sectionHtml = `
            <section class="catalog-section pr-[300px] min-h-[90vh] flex items-center justify-end py-20 ${t.bgColor} relative overflow-hidden">
                <div class="absolute inset-0 pointer-events-none" style="${t.pattern}"></div>
                ${t.decoration}
                <div class="absolute -left-20 top-1/2 -translate-y-1/2 w-[700px] z-10 pointer-events-none">
                    <img src="${prod.transparentImg}" class="w-full ${t.shadow} ${t.roundness} animate-in-view mix-blend-multiply">
                </div>

                <div class="w-1/2 pr-24 z-20 text-left pl-32 relative">
                    <div class="absolute left-16 top-0 bottom-0 w-px ${t.borderColor} border-l border-dashed"></div>
                    
                    <h2 class="text-6xl font-bold tracking-tight ${titleColor} mb-1" style="${fontSerif}">${prod.name}</h2>
                    <p class="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 pb-2 inline-block" style="${fontSans}">By ${prod.author}</p>
                    <p class="text-3xl font-bold ${t.accentColor} mb-10" style="${fontSans}">${prod.price}</p>
                    
                    <div class="mb-10 text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-3" style="${fontSans}">
                        <span class="w-4 h-px bg-gray-400"></span> OVERVIEW <span class="w-4 h-px bg-gray-400"></span>
                    </div>

                    <p class="text-sm leading-loose ${textColor} mb-12 max-w-md italic" style="${fontSerif}">
                        "${prod.desc}"
                    </p>

                    <div class="flex items-end gap-8 bg-black/5 p-8 ${t.roundness} w-max relative overflow-hidden">
                        <div class="text-center">
                            <img src="${qrCode}" class="h-20 mix-blend-multiply mb-3" alt="QR Code">
                            <p class="text-[9px] uppercase tracking-widest font-bold text-gray-500" style="${fontSans}">Scan Me</p>
                        </div>
                        <img src="${barcode}" class="h-10 mix-blend-multiply opacity-80" alt="Barcode">
                    </div>
                </div>
            </section>
            `;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(sectionHtml, 'text/html');
        catalogContainer.appendChild(doc.body.firstChild);
        
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    }

    document.getElementById('print-catalog-btn').addEventListener('click', () => {
        window.print();
    });

    // Initial style update
    updateGlobalStyles();

});