let currentData = [];

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('catalog-canvas');
    const templateBtns = document.querySelectorAll('.template-card');

    // 1. Загвар солих товчлуурууд
    templateBtns.forEach(btn => {
        btn.onclick = () => {
            templateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const style = btn.dataset.style;
            
            canvas.className = `${style}`; // CSS-ийн зохион байгуулалт солигдоно
            if (currentData.length > 0) refreshCanvas(style);
        };
    });

    // 2. Excel унших
    document.getElementById('generateBtn').onclick = () => {
        const file = document.getElementById('excelFile').files[0];
        if (!file) return alert("Excel файлаа сонгоно уу!");

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            currentData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            const activeStyle = document.querySelector('.template-card.active').dataset.style;
            refreshCanvas(activeStyle);
        };
        reader.readAsArrayBuffer(file);
    };

    function refreshCanvas(style) {
        // LayoutEngine-ээс HTML-ээ авна
        const content = LayoutEngine[style] ? LayoutEngine[style](currentData) : "Удахгүй нэмэгдэнэ...";
        
        canvas.innerHTML = `
            <div class="catalog-header">
                <h1 contenteditable="true">CATALOGUE 2026</h1>
                <h2 contenteditable="true">DURSAMJ EDITION</h2>
            </div>
            ${content}
        `;
    }
});

// Зураг солих функц
let activeImgElement = null;
window.triggerImgUpload = (container) => {
    activeImgElement = container.querySelector('img');
    document.getElementById('hiddenImgInput').click();
};

document.getElementById('hiddenImgInput').onchange = function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => activeImgElement.src = ev.target.result;
        reader.readAsDataURL(this.files[0]);
    }
};