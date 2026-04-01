document.addEventListener('DOMContentLoaded', () => {
    
    // --- ГУРВАН ТУСЛАХ ФУНКЦ (Utility Functions) ---
    
    // 1. ID-аар элемент барьж event нэмэх (Алдаанаас сэргийлнэ)
    const addClickEvent = (id, callback) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', callback);
    };

    // 2. Классаар олон элемент дээр идэвхтэй төлөв (active class) солих
    const setupActiveToggle = (selector, callback) => {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (callback) callback(item);
            });
        });
    };

    // 3. Grid-ийн харагдацыг шинэчлэх (Catalog хуудас)
    const updateGrid = () => {
        const horInput = document.getElementById('hor-count');
        const verInput = document.getElementById('ver-count');
        const gridViz = document.getElementById('grid-viz');
        const displayBox = document.getElementById('display-size');

        if (!gridViz) return; // Хэрэв энэ хуудсанд grid байхгүй бол зогсоно

        const hor = horInput?.value || 1;
        const ver = verInput?.value || 1;

        // CSS Grid-ийн баганыг тохируулах
        gridViz.style.gridTemplateColumns = `repeat(${hor}, 1fr)`;
        gridViz.innerHTML = '';

        // Нүднүүдийг үүсгэх
        for (let i = 0; i < (hor * ver); i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            gridViz.appendChild(cell);
        }

        if (displayBox) displayBox.innerText = `${hor} x ${ver}`;
    };

    // --- ЛОГИК ХЭРЭГЖҮҮЛЭЛТ ---

    // 1. Ерөнхий шилжилтүүд
    addClickEvent('logo-home', () => window.location.href = 'index.html');
    addClickEvent('logo-link', () => window.location.href = 'index.html');
    addClickEvent('back-to-index', () => window.location.href = 'index.html');
    addClickEvent('side-create-btn', () => window.location.href = 'catalog.html');
    
    // 2. Үйлдэл болон Мэдэгдлүүд
    addClickEvent('logout-link', () => { if(confirm('Системээс гарах уу?')) alert('Баяртай!'); });
    addClickEvent('side-cancel-btn', () => { if(confirm('Цуцлах уу?')) location.reload(); });
    addClickEvent('cancel-setup-link', () => { if(confirm('Цуцлах уу?')) location.reload(); });
    
    addClickEvent('ai-build-btn', () => alert('✨ AI ачаалж байна... Түр хүлээнэ үү.'));
    addClickEvent('save-catalog-btn', () => alert('✅ Каталог амжилттай хадгалагдлаа!'));
    addClickEvent('save-settings-btn', () => alert('✅ Системийн тохиргоо хадгалагдлаа!'));
    addClickEvent('new-template-btn', () => alert('ℹ️ Шинэ загвар үүсгэх хэсэг удахгүй нэмэгдэнэ.'));
    addClickEvent('add-product-btn', () => alert('📦 Бараа нэмэх цонх нээгдэж байна...'));

    // 3. Чат болон Хажуугийн цэс
    addClickEvent('chat-toggle-icon', () => {
        const popover = document.getElementById('chat-popover');
        if (popover) popover.classList.toggle('visible');
    });

    addClickEvent('mobile-burger', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.toggle('mobile-visible');
    });

    // 4. Grid удирдлага (Select өөрчлөгдөхөд)
    ['hor-count', 'ver-count'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateGrid);
    });

    // 5. Бэлэн Grid сонголтууд (1x1, 2x2 гэх мэт)
    document.querySelectorAll('.grid-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const [h, v] = opt.dataset.size.split('x');
            const hInput = document.getElementById('hor-count');
            const vInput = document.getElementById('ver-count');
            if (hInput && vInput) {
                hInput.value = h;
                vInput.value = v;
                updateGrid();
            }
        });
    });

    // 6. Идэвхтэй төлөв солих (Card-ууд дээр)
    setupActiveToggle('.template-card');
    setupActiveToggle('.layout-card', (item) => {
        const nameSpan = document.getElementById('active-template-name');
        if (nameSpan) nameSpan.innerText = `[Загвар: ${item.dataset.name}]`;
    });

    // --- ЭХНИЙ АЧААЛАЛТ ---
    if (document.getElementById('grid-viz')) {
        updateGrid();
    }
});