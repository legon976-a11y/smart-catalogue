/* script.js - v4.5 "No Deviations" Edition */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Логоноос өнгө сорох
    document.getElementById('logoFile').addEventListener('change', function(e) {
        if (!e.target.files[0]) return;
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
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // 2. Цаасны хэмжээ ба Өрөлтийг синхрончлох
    const updateCanvasClass = () => {
        const canvas = document.getElementById('catalog-canvas');
        const size = document.getElementById('pageSize').value; // a4/a5
        const orientation = document.getElementById('orientation').value; // portrait/landscape
        const template = document.getElementById('templateSelect').value;
        
        // CSS-ийн .landscape, .size-a4 гэх мэт класс руу яг таг зааж өгнө
        canvas.className = `size-${size} ${orientation} ${template}`;
    };

    // Сонголт өөрчлөгдөх бүрт preview-г шинэчилнэ
    ['pageSize', 'orientation', 'templateSelect'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('change', updateCanvasClass);
    });

    document.querySelectorAll('.template-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelector('.template-option.active').classList.remove('active');
            this.classList.add('active');
            document.getElementById('templateSelect').value = this.dataset.style;
            updateCanvasClass();
        });
    });

    // 3. Үндсэн Generate
    document.getElementById('generateBtn').onclick = async function() {
        const excelFile = document.getElementById('excelFile').files[0];
        const wordFile = document.getElementById('wordFile').files[0];
        if (!excelFile) return alert("Excel файлаа оруулна уу!");

        let intro = "";
        if (wordFile) {
            try {
                const buffer = await wordFile.arrayBuffer();
                const res = await mammoth.extractRawText({ arrayBuffer: buffer });
                intro = res.value.split('\n').filter(l => l.trim()).join('<br>');
            } catch (e) { console.error(e); }
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            const headers = Object.keys(json[0]);
            const findCol = (keys) => headers.find(h => keys.some(k => h.toString().toLowerCase().includes(k)));
            const map = {
                name: findCol(['нэр', 'name', 'title']),
                price: findCol(['үнэ', 'price']),
                desc: findCol(['тайлбар', 'desc']),
                img: findCol(['зураг', 'img']),
                pkg: findCol(['савлагаа', 'size'])
            };

            renderCatalog(json, intro, map);
        };
        reader.readAsArrayBuffer(excelFile);
    };

    function renderCatalog(products, intro, map) {
        const canvas = document.getElementById('catalog-canvas');
        updateCanvasClass(); // Өрөлтийг эхэлж тохируулна

        const orientation = document.getElementById('orientation').value;
        
        // Цаас хэвтээ (landscape) үед 4 багана, босоо үед 3 багана
        const columnCount = orientation === 'landscape' ? 4 : 3;

        const items = products.map(p => `
            <div class="product-card">
                <div class="rating">★★★★★</div>
                <div class="img-container">
                    <img src="${p[map.img] || 'https://via.placeholder.com/150'}" crossorigin="anonymous">
                </div>
                <div class="p-info">
                    <h3 contenteditable="true">${p[map.name] || 'Бараа'}</h3>
                    <p class="desc" contenteditable="true">${p[map.desc] || 'Тайлбар...'}</p>
                    <div class="price-row">
                        <span class="packaging" contenteditable="true">${p[map.pkg] || ''}</span>
                        <div class="price-tag">₮ <span contenteditable="true">${p[map.price] || '0'}</span></div>
                    </div>
                </div>
            </div>
        `).join('');

        canvas.innerHTML = `
            <div class="catalog-header">
                <div class="banner-placeholder" id="bannerBtn">+ Banner зураг</div>
                <h1 contenteditable="true">КАТАЛОГ</h1>
                <h2 contenteditable="true">PREMIUM COLLECTION</h2>
                <div class="intro-text" contenteditable="true">${intro || 'Танилцуулга...'}</div>
            </div>
            <div class="product-grid" style="display:grid; gap:25px; grid-template-columns: repeat(${columnCount}, 1fr);">
                ${items}
            </div>
            <div class="deco-shape shape-1"></div>
            <div class="deco-shape shape-2"></div>
            <div class="deco-shape shape-3"></div>
        `;

        document.getElementById('bannerBtn').onclick = () => document.getElementById('hiddenBannerInput').click();
    }

    // 4. PDF Татах
    document.getElementById('downloadBtn').onclick = function() {
        const element = document.getElementById('catalog-canvas');
        const pageSize = document.getElementById('pageSize').value;
        const orientation = document.getElementById('orientation').value;

        html2pdf().set({
            margin: 0,
            filename: 'catalog.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: pageSize, orientation: orientation }
        }).from(element).save();
    };

    // Баннер зураг оруулах
    document.getElementById('hiddenBannerInput').onchange = function(e) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('bannerBtn').innerHTML = `<img src="${ev.target.result}">`;
        };
        reader.readAsDataURL(e.target.files[0]);
    };
});