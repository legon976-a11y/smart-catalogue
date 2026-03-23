/* script.js - v4.0 Full Version */

// 1. Логоноос өнгө сорох
document.getElementById('logoFile').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            tempCanvas.width = img.width; tempCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
            const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
            document.documentElement.style.setProperty('--brand-color', hex);
            applyLiveStyles();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. Загвар сонгогч
document.querySelectorAll('.template-option').forEach(opt => {
    opt.addEventListener('click', function() {
        document.querySelector('.template-option.active').classList.remove('active');
        this.classList.add('active');
        document.getElementById('templateSelect').value = this.dataset.style;
        
        const canvas = document.getElementById('catalog-canvas');
        if(canvas.querySelector('.product-grid')) {
            canvas.className = `size-${document.getElementById('pageSize').value} ${this.dataset.style}`;
            applyLiveStyles();
        }
    });
});

// 3. Word parse (Mammoth)
async function parseWord(file) {
    if (!file) return "";
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value.split('\n').filter(l => l.trim()).join('<br>');
    } catch (e) { return ""; }
}

// 4. Ухаалаг багана танигч
const findColumn = (headers, keywords) => 
    headers.find(h => keywords.some(k => h.toString().toLowerCase().includes(k)));

// 5. Generate Logic
document.getElementById('generateBtn').onclick = async function() {
    const excelFile = document.getElementById('excelFile').files[0];
    const wordFile = document.getElementById('wordFile').files[0];
    if (!excelFile) return alert("Excel файлаа оруулна уу!");

    const introText = await parseWord(wordFile);
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        
        const headers = Object.keys(rawData[0]);
        const colMap = {
            name: findColumn(headers, ['нэр', 'name', 'title']),
            price: findColumn(headers, ['үнэ', 'price']),
            desc: findColumn(headers, ['тайлбар', 'desc', 'мэдээлэл']),
            img: findColumn(headers, ['зураг', 'img', 'url']),
            pkg: findColumn(headers, ['савлагаа', 'size', 'package'])
        };

        renderCatalog(rawData, introText, colMap);
    };
    reader.readAsArrayBuffer(excelFile);
};

function renderCatalog(products, intro, map) {
    const canvas = document.getElementById('catalog-canvas');
    const template = document.getElementById('templateSelect').value;
    canvas.className = `size-${document.getElementById('pageSize').value} ${template}`;

    const items = products.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p[map.img] || 'https://via.placeholder.com/150'}" crossorigin="anonymous">
            </div>
            <div class="p-info">
                <div class="rating">★★★★★ <span style="color:#999; font-size:10px;">(4.9)</span></div>
                <h3 contenteditable="true">${p[map.name] || 'Бараа'}</h3>
                <p class="desc" contenteditable="true">${p[map.desc] || 'Тайлбар байхгүй...'}</p>
                <div class="price-row">
                    <span class="packaging" contenteditable="true">${p[map.pkg] || ''}</span>
                    <div class="price-tag">₮ <span contenteditable="true">${p[map.price] || '0'}</span></div>
                </div>
            </div>
        </div>
    `).join('');

    canvas.innerHTML = `
        <div class="catalog-header">
            <div class="banner-placeholder" id="bannerBtn">+ Banner зураг оруулах</div>
            <h1 contenteditable="true">БРЭНДИЙН КАТАЛОГ</h1>
            <h2 contenteditable="true">PREMIUM SELECTION</h2>
            <div class="intro-text" contenteditable="true">${intro || 'Танилцуулга текст энд байна...'}</div>
        </div>
        <div class="product-grid">${items}</div>
    `;

    document.getElementById('bannerBtn').onclick = () => document.getElementById('hiddenBannerInput').click();
    applyLiveStyles();
}

// 6. Баннер солих
document.getElementById('hiddenBannerInput').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = ev => {
        document.getElementById('bannerBtn').innerHTML = `<img src="${ev.target.result}" class="banner-img" style="width:100%; height:100%; object-fit:cover; border-radius:20px;">`;
    };
    reader.readAsDataURL(e.target.files[0]);
};

function applyLiveStyles() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim();
    document.querySelectorAll('.catalog-header h1, .price-tag').forEach(el => el.style.color = color);
}

// 7. PDF Татах
document.getElementById('downloadBtn').onclick = function() {
    const element = document.getElementById('catalog-canvas');
    const opt = {
        margin: 5,
        filename: 'Catalog_2026.pdf',
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: document.getElementById('pageSize').value, orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};