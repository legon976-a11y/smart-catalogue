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
    const grid = document.createElement('div');
    grid.className = 'product-grid';

    let htmlContent = '';
    
    products.forEach((p, index) => {
        // 1. Аシンメトリー (Тэгш бус) өрөлт: 5 дахь бараа бүрийг томруулна
        const isFeatured = (index + 1) % 5 === 0 ? 'featured' : '';
        
        // 2. Барааны карт үүсгэх
        htmlContent += `
            <div class="product-card ${isFeatured}">
                <div class="img-container">
                    <label class="img-upload-label">
                        <input type="file" class="visually-hidden card-img-input" accept="image/*">
                        <img src="https://via.placeholder.com/400x400?text=Зураг+сонгох" class="preview-img">
                    </label>
                </div>
                <div class="p-info">
                    <h3 contenteditable="true">${p[map.name] || 'Шинэ бараа'}</h3>
                    <p class="desc" contenteditable="true">${p[map.desc] || 'Тайлбар...'}</p>
                    <div class="price-tag">₮ <span contenteditable="true">${p[map.price] || '0'}</span></div>
                </div>
            </div>
        `;

        // 3. БАННЕР хавчуулах: 8 бараа тутамд нэг гоё баннер оруулна
        if ((index + 1) % 8 === 0) {
            htmlContent += `
                <div class="grid-banner">
                    <label class="img-upload-label" style="background: var(--brand-color); color:white; border:none;">
                        <input type="file" class="visually-hidden card-img-input" accept="image/*">
                        <span>+ Энд сурталчилгааны баннер оруулна уу</span>
                    </label>
                </div>
            `;
        }
    });

    canvas.innerHTML = `
        <div class="catalog-header">
            <h1 contenteditable="true">NEW COLLECTION</h1>
            <h2 contenteditable="true">HANDMADE WITH LOVE</h2>
        </div>
        <div class="product-grid">${htmlContent}</div>
    `;

    // Зураг солих функцийг идэвхжүүлэх
    attachImageListeners();
}

function attachImageListeners() {
    document.querySelectorAll('.card-img-input').forEach(input => {
        input.onchange = function(e) {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                const preview = this.parentElement.querySelector('.preview-img') || this.parentElement;
                reader.onload = (ev) => {
                    if (preview.tagName === 'IMG') {
                        preview.src = ev.target.result;
                    } else {
                        preview.innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
                    }
                };
                reader.readAsDataURL(this.files[0]);
            }
        };
    });
}
});