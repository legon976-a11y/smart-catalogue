document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ШИЛЖИЛТҮҮД БОЛОН ТОВЧЛУУРУУД ---
    const selectById = (id, callback) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', callback);
    };

    selectById('logo-home', () => window.location.href = 'index.html');
    selectById('back-to-index', () => window.location.href = 'index.html');
    selectById('side-create-btn', () => window.location.href = 'catalog.html');
    selectById('logout-link', () => { if(confirm('Гарах уу?')) alert('Баяртай!'); });
    selectById('side-cancel-btn', () => location.reload());
    selectById('cancel-setup-link', () => { if(confirm('Цуцлах уу?')) location.reload(); });
    selectById('ai-build-btn', () => alert('AI ачаалж байна...'));
    selectById('save-catalog-btn', () => alert('Амжилттай хадгалагдлаа!'));
    selectById('new-template-btn', () => alert('Удахгүй нэмэгдэнэ.'));

    // Чат нээх/хаах
    selectById('chat-toggle-icon', () => {
        document.getElementById('chat-popover').classList.toggle('visible');
    });

    // --- 2. ДИНАМИК GRID ЛОГИК ---
    const updateGrid = () => {
        const hor = document.getElementById('hor-count')?.value || 1;
        const ver = document.getElementById('ver-count')?.value || 1;
        const gridViz = document.getElementById('grid-viz');
        const displayBox = document.getElementById('display-size');

        if (gridViz) {
            gridViz.style.gridTemplateColumns = `repeat(${hor}, 1fr)`;
            gridViz.innerHTML = '';
            for (let i = 0; i < (hor * ver); i++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                gridViz.appendChild(cell);
            }
        }
        if (displayBox) displayBox.innerText = `${hor} x ${ver}`;
    };

    // Grid сонголт өөрчлөгдөхөд
    ['hor-count', 'ver-count'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateGrid);
    });

    // Бэлэн хүснэгтүүд
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

    // --- 3. ИДЭВХТЭЙ ТӨЛӨВҮҮД ---
    const setupActiveToggle = (selector) => {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Хэрэв каталог хуудас бол нэрийг солих
                if (selector === '.layout-card') {
                    const nameSpan = document.getElementById('active-template-name');
                    if (nameSpan) nameSpan.innerText = `[Загвар: ${item.dataset.name}]`;
                }
            });
        });
    };

    // Settings хуудасны логик
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Энд хадгалах функц орно (жишээ нь API руу явуулах)
            alert('Системийн тохиргоо амжилттай хадгалагдлаа!');
        });
    }

    const backBtn = document.getElementById('back-to-index');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    setupActiveToggle('.template-card');
    setupActiveToggle('.layout-card');

    // Эхний ачаалалт
    if (document.getElementById('grid-viz')) updateGrid();
});