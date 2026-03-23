/* ===========================================================
   SMART CATALOG GENERATOR - COMPLETE SCRIPT (2026 Edition)
   ===========================================================
*/

// 1. Логоноос өнгө сорж, брэндийн үндсэн өнгө болгох
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
            
            // Логоны төв хэсгээс өнгө сорох
            const data = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
            const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
            
            // CSS Variable-д оноох
            document.documentElement.style.setProperty('--brand-color', hex);
            
            // Логог өөрийг нь харуулах (Preview)
            const logoPreview = document.getElementById('logoPreview');
            if(logoPreview) logoPreview.src = event.target.result;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

// 2. Banner нэмэх функц (Theme-fixes)
function triggerBannerUpload(element) {
    const input = document.getElementById('hiddenBannerInput');
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            element.innerHTML = `<img src="${event.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;" alt="Banner">`;
            element.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// 3. Word боловсруулах (Word Fix)
async function parseWord(file) {
    if (!file) return "";
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        // Шинэ мөрийг <br> болгож солих
        return result.value.split('\n').filter(line => line.trim().length > 0).join('<br>');
    } catch (e) {
        console.error("Word processing error:", e);
        return "";
    }
}

// 4. Ухаалаг багана танигч (AI logic)
function findColumn(headers, keywords) {
    return headers.find(h => {
        const cleanHeader = h.toString().toLowerCase().trim().replace(/\s/g, '');
        return keywords.some(k => cleanHeader.includes(k));
    });
}

// 5. Үндсэн Generate Логик
document.getElementById('generateBtn').onclick = async function() {
    const excelFile = document.getElementById('excelFile').files[0];
    const wordFile = document.getElementById('wordFile').files[0];
    const template = document.getElementById('templateSelect').value;
    
    if (!excelFile) return alert("Excel файлаа оруулна уу!");

    const introText = await parseWord(wordFile);
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rawData = XLSX.utils.sheet_to_json(sheet);

            if (rawData.length === 0) return alert("Excel файл хоосон байна!");

            const headers = Object.keys(rawData[0]);

            // Ухаалаг хайлт: Түлхүүр үгсээр баганыг таних (Таны Excel-д тохируулсан)
            const colMap = {
                name: findColumn(headers, ['нэр', 'name', 'бүтээгдэхүүн', 'бараа', 'title']),
                price: findColumn(headers, ['үнэ', 'price', 'өртөг', 'худалдах']),
                desc: findColumn(headers, ['танилцуулга', 'desc', 'тайлбар', 'мэдээлэл', 'detail']),
                img: findColumn(headers, ['зураг', 'img', 'url', 'photo', 'image']),
                packaging: findColumn(headers, ['савлагаа', 'хэмжээ', 'package', 'size', 'савлагааныхэмжээ']),
                barcode: findColumn(headers, ['баар', 'barcode', 'код', 'qr'])
            };

            // Өгөгдлийг стандартад шилжүүлж, цэвэрлэх
            const processedProducts = rawData.map(row => ({
                Name: row[colMap.name] || 'Нэргүй бараа',
                Price: row[colMap.price] || '0',
                Description: row[colMap.desc] || 'Тайлбар байхгүй',
                ImageURL: row[colMap.img] || '', 
                Packaging: row[colMap.packaging] || '',
                Barcode: row[colMap.barcode] || ''
            }));

            renderCatalog(processedProducts, introText, template);
        } catch (err) {
            console.error("Excel Error:", err);
            alert("Excel файлыг уншихад алдаа гарлаа.");
        }
    };
    reader.readAsArrayBuffer(excelFile);
};

// 6. Каталогийг зурах (Render Function)
function renderCatalog(products, intro, template) {
    const canvas = document.getElementById('catalog-canvas');
    canvas.className = `size-${document.getElementById('pageSize').value} ${template}`;
    
    const bannerPlaceholder = `
        <div class="banner-placeholder" onclick="triggerBannerUpload(this)">
            <span>+ Banner зураг энд дарж оруулна уу</span>
        </div>`;

    const productsHtml = products.map(p => {
        // Excel Fix: Зургийн URL шалгах
        const imgUrl = p.ImageURL ? p.ImageURL : 'https://via.placeholder.com/150?text=No+Image';
        
        return `
            <div class="product-card">
                <div class="img-container">
                    <img src="${imgUrl}" 
                         onerror="this.src='https://via.placeholder.com/150?text=Image+Error'" 
                         alt="${p.Name}">
                </div>
                <div class="p-info">
                    <div class="rating">★★★ <span style="color: #999; font-size:12px">(4.8)</span></div>
                    <h3 contenteditable="true">${p.Name}</h3>
                    <p class="desc" contenteditable="true">${p.Description}</p>
                    <div class="price-row">
                        <div class="meta-info">
                            <span class="packaging" contenteditable="true">${p.Packaging}</span>
                            ${p.Barcode ? `<br><span class="barcode" style="font-size:10px; color:#aaa;">Barcode: ${p.Barcode}</span>` : ''}
                        </div>
                        <div class="price-tag">
                            <span contenteditable="true">${p.Price}</span> ₮
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    canvas.innerHTML = `
        <div class="catalog-header">
            ${bannerPlaceholder}
            <h1 contenteditable="true">БРЭНДИЙН КАТАЛОГ</h1>
            <h2 contenteditable="true" style="font-weight: 800; font-size: 32px; margin-top: -10px;">PREMIUM QUALITY SELECTION</h2>
            <div class="intro-text" contenteditable="true">${intro || 'Компанийн уриа болон танилцуулга...'}</div>
        </div>
        <div class="product-grid">
            ${productsHtml}
        </div>
    `;

    // 7. Dynamic Style Apply (Брэндийн өнгөөр)
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim();
    canvas.querySelectorAll('h1, h2, .price-tag').forEach(el => {
        el.style.color = brandColor;
    });
}

// 8. PDF Татах функц
document.getElementById('downloadBtn').onclick = function() {
    const element = document.getElementById('catalog-canvas');
    const opt = {
        margin: 5,
        filename: 'Catalog_Export.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { 
            unit: 'mm', 
            format: document.getElementById('pageSize').value, 
            orientation: 'portrait' 
        }
    };
    html2pdf().set(opt).from(element).save();
};