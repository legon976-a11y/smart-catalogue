const LayoutEngine = {
    // 📘 1. Grid-based (Цэгцтэй 3 багана)
    grid: (data) => {
        const items = data.map(p => `
            <div class="product-card">
                <div class="img-container" onclick="triggerImgUpload(this)">
                    <img src="https://via.placeholder.com/400x400?text=Зураг+солих" alt="Product">
                </div>
                <div class="p-info">
                    <h3 contenteditable="true">${p.нэр || p.name || 'Барааны нэр'}</h3>
                    <p class="desc" contenteditable="true">${p.тайлбар || p.desc || 'Тайлбар...'}</p>
                    <div class="price-row">
                        <div class="price-tag">₮ <span contenteditable="true">${p.үнэ || p.price || '0'}</span></div>
                    </div>
                </div>
            </div>
        `).join('');
        return `<div class="product-grid">${items}</div>`;
    },

    // 📗 2. Lifestyle (Том зурагтай, Storytelling)
    lifestyle: (data) => {
        const items = data.map((p, idx) => `
            <div class="product-card ${idx % 3 === 0 ? 'featured' : ''}">
                <div class="img-container" onclick="triggerImgUpload(this)">
                    <img src="https://via.placeholder.com/600x400?text=Lifestyle+Зураг" alt="Lifestyle">
                </div>
                <div class="p-info">
                    <h3 contenteditable="true">${p.нэр || p.name || 'Бараа'}</h3>
                    <p class="desc" contenteditable="true">${p.тайлбар || p.desc || 'Энэ хэсэгт бүтээгдэхүүний хэрэглээг харуулсан текст байвал тохиромжтой.'}</p>
                    <div class="price-tag">₮ <span contenteditable="true">${p.үнэ || p.price || '0'}</span></div>
                </div>
            </div>
        `).join('');
        return `<div class="product-grid">${items}</div>`;
    },

    // 📙 3. Minimal / Premium (Luxury, Whitespace ихтэй)
    premium: (data) => {
        const items = data.map(p => `
            <div class="product-card premium-focus">
                <div class="img-container" onclick="triggerImgUpload(this)">
                    <img src="https://via.placeholder.com/800x800?text=Premium+Product" alt="Premium">
                </div>
                <h3 contenteditable="true">${p.нэр || p.name || 'HERO PRODUCT'}</h3>
                <p class="desc" contenteditable="true">${p.тайлбар || p.desc || 'Минимал тайлбар...'}</p>
                <div class="price-tag">₮ <span contenteditable="true">${p.үнэ || p.price || '0'}</span></div>
            </div>
        `).join('');
        return `<div class="product-grid">${items}</div>`;
    },
    // 📕 4. Editorial Style (Сэтгүүл маяг)
    editorial: (data) => {
        const items = data.map((p, idx) => {
            // 3 дахь бараа бүрийг "Spread" буюу бүтэн мөр эзэлсэн том зурагтай болгоно
            const isWide = (idx + 1) % 3 === 0;
            return `
                <div class="product-card ${isWide ? 'wide-layout' : 'standard-layout'}">
                    <div class="img-container" onclick="triggerImgUpload(this)">
                        <img src="https://via.placeholder.com/600x600?text=Editorial+Shot" alt="Editorial">
                    </div>
                    <div class="p-info">
                        <span class="cat-tag">COLLECTION 2026</span>
                        <h3 contenteditable="true">${p.нэр || p.name || 'БҮТЭЭГДЭХҮҮН'}</h3>
                        <p class="desc" contenteditable="true">${p.тайлбар || p.desc || 'Сэтгүүлийн нийтлэл шиг урт тайлбар энд байршихад тохиромжтой.'}</p>
                        <div class="price-tag">₮ ${p.үнэ || p.price || '0'}</div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="editorial-grid">
                ${items}
            </div>
        `;
    },
};