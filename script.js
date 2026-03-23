let currentData = null;
let activeStyle = 'grid';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Сонгогч идэвхжүүлэх
    document.querySelectorAll('.template-card').forEach(card => {
        card.onclick = function() {
            document.querySelector('.template-card.active').classList.remove('active');
            this.classList.add('active');
            activeStyle = this.dataset.style;
            
            const canvas = document.getElementById('catalog-canvas');
            const orientation = document.getElementById('orientation').value;
            canvas.className = `size-a4 ${orientation} ${activeStyle}`;
            
            if (currentData) renderCatalog(currentData);
        };
    });

    // 2. Generate
    document.getElementById('generateBtn').onclick = function() {
        const file = document.getElementById('excelFile').files[0];
        if (!file) return alert("Excel файлаа оруулна уу!");

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            currentData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            renderCatalog(currentData);
        };
        reader.readAsArrayBuffer(file);
    };

    function renderCatalog(data) {
        const canvas = document.getElementById('catalog-canvas');
        let itemsHtml = '';

        data.forEach((p, idx) => {
            // Бараа хооронд баннер хавчуулах (Lifestyle & Editorial-д)
            if (activeStyle === 'lifestyle' && (idx + 1) % 3 === 0) {
                itemsHtml += `
                    <div class="grid-banner" style="grid-column: span 2; height: 200px; background: #eee; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <p>+ Сурталчилгааны зураг (Banner)</p>
                    </div>
                `;
            }

            itemsHtml += `
                <div class="product-card">
                    <div class="img-container" onclick="triggerImgUpload(this)">
                        <img src="https://via.placeholder.com/400?text=Зураг+солих" alt="${p.name || 'Бараа'}" class="preview-img">
                    </div>
                    <div class="p-info">
                        <h3 contenteditable="true">${p.нэр || p.name || 'Барааны нэр'}</h3>
                        <p class="desc" contenteditable="true">${p.тайлбар || p.desc || 'Тайлбар...'}</p>
                        <div class="price-tag">₮ <span contenteditable="true">${p.үнэ || p.price || '0'}</span></div>
                    </div>
                </div>
            `;
        });

        canvas.innerHTML = `
            <div class="catalog-header">
                <h1 contenteditable="true">NEW COLLECTION</h1>
                <h2 contenteditable="true">2026 EDITION</h2>
            </div>
            <div class="product-grid">${itemsHtml}</div>
        `;
    }

    // 3. Зураг солих логик
    let targetImgContainer = null;
    window.triggerImgUpload = (el) => {
        targetImgContainer = el;
        document.getElementById('hiddenImgInput').click();
    };

    document.getElementById('hiddenImgInput').onchange = function(e) {
        if (this.files && this.files[0] && targetImgContainer) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                targetImgContainer.querySelector('img').src = ev.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    };

    // 4. PDF Татах
    document.getElementById('downloadBtn').onclick = function() {
        const element = document.getElementById('catalog-canvas');
        const orientation = document.getElementById('orientation').value;
    
        const opt = {
            margin: 0, // CSS-ийн padding-аар шийдсэн тул энд 0 байна
            filename: 'Dursamj_Catalogue.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: orientation 
            }
        };

        html2pdf().set(opt).from(element).save();
    };
});