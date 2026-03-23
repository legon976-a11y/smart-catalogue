/* script.js - v4.2 No Inline Styles Edition */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Логоноос өнгө сорох (CSS Variable-ийг өөрчилнө)
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
                
                // CSS Variable-ийг динамикаар солих (Inline style биш)
                document.documentElement.style.setProperty('--brand-color', hex);
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
            const pageSize = document.getElementById('pageSize').value;
            // Class-аар дамжуулж бүх стилийг удирдана
            canvas.className = `size-${pageSize} ${this.dataset.style}`;
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
            } catch (e) { 
                console.error("Word file error:", e); 
            }
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(firstSheet);
            
            if (json.length === 0) return alert("Excel файл хоосон байна!");

            const headers = Object.keys(json[0]);
            const findCol = (keys) => headers.find(h => keys.some(k => h.toString().toLowerCase().includes(k)));
            
            const map = {
                name: findCol(['нэр', 'name', 'title']),
                price: findCol(['үнэ', 'price', 'cost']),
                desc: findCol(['тайлбар', 'desc', 'мэдээлэл']),
                img: findCol(['зураг', 'img', 'url', 'image']),
                pkg: findCol(['савлагаа', 'size', 'package', 'хэмжээ'])
            };

            renderCatalog(json, intro, map);
        };
        reader.readAsArrayBuffer(excelFile);
    };

    function renderCatalog(products, intro, map) {
        const canvas = document.getElementById('catalog-canvas');
        const template = document.getElementById('templateSelect').value;
        const size = document.getElementById('pageSize').value;
        canvas.className = `size-${size} ${template}`;

        const items = products.map(p => `
            <div class="product-card">
                <div class="rating">★★★★★</div>
                <div class="img-container">
                    <img src="${p[map.img] || 'https://via.placeholder.com/150'}" crossorigin="anonymous" alt="Бараа">
                </div>
                <div class="p-info">
                    <h3 contenteditable="true">${p[map.name] || 'Барааны нэр'}</h3>
                    <p class="desc" contenteditable="true">${p[map.desc] || 'Тайлбар мэдээлэл энд орно...'}</p>
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
                <h1 contenteditable="true">КАТАЛОГ</h1>
                <h2 contenteditable="true">PREMIUM COLLECTION</h2>
                <div class="intro-text" contenteditable="true">${intro || 'Брэндийн танилцуулга текст энд харагдана. Та шууд засаж болно.'}</div>
            </div>
            <div class="product-grid">${items}</div>
        `;

        // Banner хуулах функц
        document.getElementById('bannerBtn').onclick = () => document.getElementById('hiddenBannerInput').click();
    }

    // Banner зураг сонгох үед
    document.getElementById('hiddenBannerInput').addEventListener('change', function(e) {
        if (!e.target.files[0]) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const btn = document.getElementById('bannerBtn');
            if (btn) btn.innerHTML = `<img src="${ev.target.result}" alt="Banner">`;
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // 4. PDF Татах
    document.getElementById('downloadBtn').onclick = function() {
        const element = document.getElementById('catalog-canvas');
        const pageSize = document.getElementById('pageSize').value;
        
        const opt = {
            margin: 0,
            filename: 'dursamj_catalog.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: pageSize, orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    };
});