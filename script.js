// 1. Логоноос өнгө сорж авах
document.getElementById('logoFile').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
            const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
            document.documentElement.style.setProperty('--brand-color', hex);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. Banner нэмэх функц
function triggerBannerUpload(element) {
    const input = document.getElementById('hiddenBannerInput');
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            element.innerHTML = `<img src="${event.target.result}" class="banner-image" alt="Banner">`;
            element.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// 3. Word боловсруулах
async function parseWord(file) {
    if (!file) return "";
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// 4. Үндсэн Generate логик
document.getElementById('generateBtn').onclick = async function() {
    const excelFile = document.getElementById('excelFile').files[0];
    const wordFile = document.getElementById('wordFile').files[0];
    const template = document.getElementById('templateSelect').value;
    
    if (!excelFile) return alert("Excel файлаа оруулна уу!");

    const introText = await parseWord(wordFile);
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const products = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        renderCatalog(products, introText, template);
    };
    reader.readAsArrayBuffer(excelFile);
};

function renderCatalog(products, intro, template) {
    const canvas = document.getElementById('catalog-canvas');
    canvas.className = `size-${document.getElementById('pageSize').value} ${template}`;
    
    const bannerPlaceholder = `
        <div class="banner-placeholder" onclick="triggerBannerUpload(this)">
            <span>+ Banner зураг энд дарж оруулна уу</span>
        </div>`;

    const productsHtml = products.map(p => `
        <div class="product-card">
            <img src="${p.ImageURL || 'https://via.placeholder.com/150'}" alt="${p.Name}">
            <div class="p-info">
                <h3 contenteditable="true">${p.Name || 'Нэргүй бараа'}</h3>
                <p class="desc" contenteditable="true">${p.Description || 'Тайлбар...'}</p>
                <div class="price" contenteditable="true">${p.Price || '0'} ₮</div>
            </div>
        </div>
    `).join('');

    canvas.innerHTML = `
        <div class="catalog-header">
            ${bannerPlaceholder}
            <h1 contenteditable="true">Брэндийн Каталог</h1>
            <div class="intro-text" contenteditable="true">${intro || 'Танилцуулгаа энд бичнэ үү...'}</div>
        </div>
        <div class="product-grid">${productsHtml}</div>
    `;

    // Dynamic өнгийг гарчигт оноох
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color');
    canvas.querySelector('h1').style.color = brandColor;
}

// 1. Түлхүүр үгсээр баганыг таних функц
function findColumn(headers, keywords) {
    return headers.find(h => {
        const header = h.toLowerCase().replace(/\s/g, '');
        return keywords.some(k => header.includes(k));
    });
}

// 2. Excel унших үндсэн хэсэг
document.getElementById('generateBtn').onclick = async function() {
    const excelFile = document.getElementById('excelFile').files[0];
    const wordFile = document.getElementById('wordFile').files[0];
    const template = document.getElementById('templateSelect').value;
    
    if (!excelFile) return alert("Excel файлаа оруулна уу!");

    const introText = await parseWord(wordFile);
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Excel-ийн бүх өгөгдлийг JSON болгох
        const rawData = XLSX.utils.sheet_to_json(sheet);
        if (rawData.length === 0) return alert("Excel файл хоосон байна!");

        // Багануудын толгой нэрсийг авах
        const headers = Object.keys(rawData[0]);

        // Ухаалаг хайлт: Түлхүүр үгсээр баганыг таних
        const colMap = {
            name: findColumn(headers, ['нэр', 'name', 'бүтээгдэхүүн', 'бараа', 'title']),
            price: findColumn(headers, ['үнэ', 'price', 'өртөг', 'худалдах']),
            desc: findColumn(headers, ['танилцуулга', 'desc', 'тайлбар', 'мэдээлэл', 'detail']),
            img: findColumn(headers, ['зураг', 'img', 'url', 'photo', 'image'])
        };

        // Өгөгдлийг цэвэрлэж, стандартад шилжүүлэх
        const processedProducts = rawData.map(row => ({
            Name: row[colMap.name] || 'Нэргүй бараа',
            Price: row[colMap.price] || '0',
            Description: row[colMap.desc] || '',
            ImageURL: row[colMap.img] || '' 
        }));

        renderCatalog(processedProducts, introText, template);
    };
    reader.readAsArrayBuffer(excelFile);
};

// 3. Каталогийг зурах (Render)
function renderCatalog(products, intro, template) {
    const canvas = document.getElementById('catalog-canvas');
    canvas.className = `size-${document.getElementById('pageSize').value} ${template}`;
    
    const bannerPlaceholder = `
        <div class="banner-placeholder" onclick="triggerBannerUpload(this)">
            <span>+ Banner зураг энд дарж оруулна уу</span>
        </div>`;

    const productsHtml = products.map(p => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.ImageURL || 'https://via.placeholder.com/150?text=No+Image'}" 
                     onerror="this.src='https://via.placeholder.com/150?text=No+Image'" 
                     alt="${p.Name}">
            </div>
            <div class="p-info">
                <h3 contenteditable="true">${p.Name}</h3>
                <p class="desc" contenteditable="true">${p.Description}</p>
                <div class="price-tag">
                    <span contenteditable="true">${p.Price}</span> ₮
                </div>
            </div>
        </div>
    `).join('');

    canvas.innerHTML = `
        <div class="catalog-header">
            ${bannerPlaceholder}
            <h1 contenteditable="true">БРЭНДИЙН КАТАЛОГ</h1>
            <div class="intro-text" contenteditable="true">${intro || 'Компанийн уриа болон танилцуулга...'}</div>
        </div>
        <div class="product-grid">
            ${productsHtml}
        </div>
    `;

    // Логоны өнгийг гарчигт болон үнэд оноох
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color');
    canvas.querySelectorAll('h1, .price-tag').forEach(el => el.style.color = brandColor);
}