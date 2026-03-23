// Global хувьсагчууд
let currentProducts = []; 
let currentIntro = "Dursamj Collection 2026";

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('catalog-canvas');
    const templateBtns = document.querySelectorAll('.template-card');
    const excelInput = document.getElementById('excelFile');
    const generateBtn = document.getElementById('generateBtn');

    // 1. Загвар солих логик
    templateBtns.forEach(btn => {
        btn.onclick = () => {
            templateBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const style = btn.dataset.style;
            // Canvas-ийн классыг сольж, 2см margin-аа барина
            canvas.className = `size-a4 portrait ${style}`;
            
            // Хэрэв дата байгаа бол дахин зурах
            if (currentProducts.length > 0) {
                renderWithStyle(style);
            }
        };
    });

    // 2. Excel файл унших (Үндсэн хэсэг)
    generateBtn.onclick = () => {
        if (!excelInput.files[0]) {
            alert("Excel файлаа сонгоно уу!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Excel-ийг JSON болгож хөрвүүлэх
                currentProducts = XLSX.utils.sheet_to_json(worksheet);

                if (currentProducts.length === 0) {
                    alert("Excel файл хоосон байна!");
                    return;
                }

                console.log("Уншсан дата:", currentProducts); // Шалгах зориулалттай

                // Одоо идэвхтэй байгаа загвараар зурах
                const activeStyle = document.querySelector('.template-card.active').dataset.style;
                renderWithStyle(activeStyle);

            } catch (err) {
                console.error("Excel уншихад алдаа гарлаа:", err);
                alert("Файл уншихад алдаа гарлаа. Зөв Excel файл эсэхийг шалгана уу.");
            }
        };
        reader.readAsArrayBuffer(excelInput.files[0]);
    };

    // 3. Render хийх туслах функц
    function renderWithStyle(style) {
        // LayoutEngine дотор тухайн style-ийн функц байгаа эсэхийг шалгана
        if (LayoutEngine[style]) {
            const htmlContent = LayoutEngine[style](currentProducts, currentIntro);
            
            // Толгой хэсэг (Header)-ийг тогтмол байлгах уу, эсвэл layout дотор багтах уу?
            // Энд тогтмол байхаар тохируулав:
            canvas.innerHTML = `
                <div class="catalog-header">
                    <h1 contenteditable="true">CATALOGUE</h1>
                    <h2 contenteditable="true">2026 EDITION</h2>
                </div>
                ${htmlContent}
                <div class="page-footer">DURSAMJ • PAGE 1</div>
            `;
        } else {
            canvas.innerHTML = `<div class="error">Загвар олдсонгүй: ${style}</div>`;
        }
    }
});

// Зураг солих (Интерактив)
let targetImg = null;
window.triggerImgUpload = (container) => {
    targetImg = container.querySelector('img');
    document.getElementById('hiddenImgInput').click();
};

document.getElementById('hiddenImgInput').onchange = function(e) {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (targetImg) targetImg.src = ev.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    }
};