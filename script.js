document.addEventListener('DOMContentLoaded', () => {
    /**
     * 1. Каталог загвар сонгох логик (index.html)
     * Сонгосон карт дээр идэвхтэй төлөв нэмж, 'check' тэмдэглэгээг шилжүүлнэ.
     */
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Бусад бүх картын идэвхтэй төлөвийг устгах
            cards.forEach(c => c.classList.remove('active'));
            // Сонгосон картыг идэвхжүүлэх
            card.classList.add('active');
            
            // Хэрэв 'check' дүрс байгаа бол түүнийг сонгосон карт руу зөөх
            const check = document.querySelector('.icon-check');
            const previewBox = card.querySelector('.preview-box');
            if (check && previewBox) {
                previewBox.appendChild(check);
            }
        });
    });

    /**
     * 2. Барааны загвар сонгох логик (catalog.html)
     * Баруун талын жагсаалтаас сонгоход зүүн талын урьдчилсан харагдах текст өөрчлөгдөнө.
     */
    const layouts = document.querySelectorAll('.layout-card');
    const previewText = document.querySelector('.page-content-placeholder span');

    layouts.forEach(layout => {
        layout.addEventListener('click', () => {
            // Идэвхтэй төлөвийг шилжүүлэх
            layouts.forEach(l => l.classList.remove('active'));
            layout.classList.add('active');
            
            // Зүүн талын цонхны текстийг шинэчлэх
            if (previewText) {
                const layoutName = layout.querySelector('span').innerText;
                previewText.innerText = `[Загвар: ${layoutName}]`;
            }
        });
    });

    /**
     * 3. Бүтэц ашиглах (Toggle Switch) логик
     * On/Off төлөвийг сольж, текстийг Монголоор харуулна.
     */
    const toggle = document.querySelector('.toggle-switch');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const isOn = toggle.classList.toggle('on');
            const label = toggle.querySelector('.off'); // Энэ нь текстийг харуулах элемент
            
            if (label) {
                label.innerText = isOn ? 'Нээлттэй' : 'Хаалттай';
                // Текст солигдоход өнгө болон байрлал хадгалахын тулд идэвхтэй класс нэмэх
                if (isOn) {
                    label.classList.remove('active');
                } else {
                    label.classList.add('active');
                }
            }
        });
    }

    /**
     * 4. Мобайл цэс (Hamburger) логик
     * Жижиг дэлгэц дээр хажуугийн цэсийг нээж хаах.
     */
    const burger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    if (burger && sidebar) {
        burger.addEventListener('click', () => {
            // Хажуугийн цэсийг харуулах эсвэл нуух класс (CSS дээр .sidebar.open-г нэмэх хэрэгтэй)
            sidebar.classList.toggle('mobile-visible');
            
            // Хэрэв CSS-гүй бол шууд alert өгөх (тестлэх зорилгоор)
            if (window.innerWidth < 1024 && !sidebar.classList.contains('mobile-visible')) {
                console.log("Sidebar нээгдлээ");
            }
        });
    }

    /**
     * 5. Grid хэмжээ сонгох (Сонголтыг идэвхжүүлэх)
     */
    const gridOptions = document.querySelectorAll('.grid-option');
    const selectedBox = document.querySelector('.selected-grid-box');

    gridOptions.forEach(option => {
        option.addEventListener('click', () => {
            gridOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            if (selectedBox) {
                selectedBox.innerText = option.innerText;
            }
        });
    });
});