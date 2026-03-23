const LayoutEngine = {
    // 📘 3-Column Grid (Standard)
    grid: (data) => {
        const items = data.map(p => createCard(p)).join('');
        return `<div class="product-grid" style="grid-template-columns: repeat(3, 1fr);">${items}</div>`;
    },

    // 📓 Hero Layout (1-Column Feature)
    single: (data) => {
        const p = data[0] || {};
        return `
            <div class="hero-layout">
                <div class="img-wrapper large" onclick="triggerImgUpload(this)" style="aspect-ratio: 16/9;">
                    <img src="placeholder.jpg">
                </div>
                <div class="hero-detail" style="text-align: center; padding: var(--s-4) 0;">
                    <span class="meta">${p.Брэнд || 'FEATURED'}</span>
                    <h1 style="font-size: 42px;">${p['Бүтээгдэхүүний нэр'] || ''}</h1>
                    <p class="description" style="max-width: 500px; margin: 0 auto var(--s-3);">${p['Бүтээгдэхүүний танилцуулга'] || ''}</p>
                    <div class="price" style="font-size: 24px;">₮ ${p['Худалдах үнэ'] || '0'}</div>
                </div>
            </div>
        `;
    }
};

// Reusable Card Component
function createCard(p) {
    return `
        <div class="product-card">
            <div class="img-wrapper" onclick="triggerImgUpload(this)">
                <img src="placeholder.jpg" alt="${p['Бүтээгдэхүүний нэр']}">
            </div>
            <div class="product-info">
                <div class="meta">${p['насны хязгаар'] || ''} ${p['Савлагааны хэмжээ'] || ''}</div>
                <h3 contenteditable="true">${p['Бүтээгдэхүүний нэр'] || 'Нэр байхгүй'}</h3>
                <p class="description" contenteditable="true">${p['Бүтээгдэхүүний танилцуулга']?.substring(0, 80) || ''}...</p>
                <div class="price">₮ ${p['Худалдах үнэ'] || '0'}</div>
            </div>
        </div>
    `;
}