document.addEventListener('DOMContentLoaded', () => {
    // 1. Template Selection logic
    const cards = document.querySelectorAll('.template-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // If the card has a checkmark, move it to the clicked card
            const check = document.querySelector('.icon-check');
            if (check) {
                card.querySelector('.preview-box').appendChild(check);
            }
        });
    });

    // 2. Layout Selection logic (Page 2)
    const layouts = document.querySelectorAll('.layout-card');
    layouts.forEach(layout => {
        layout.addEventListener('click', () => {
            layouts.forEach(l => l.classList.remove('active'));
            layout.classList.add('active');
            
            // Update preview text dynamically
            const previewText = document.querySelector('.page-content-placeholder span');
            if (previewText) {
                const name = layout.querySelector('span').innerText;
                previewText.innerText = `[Template: ${name}]`;
            }
        });
    });

    // 3. Grid Toggle
    const toggle = document.querySelector('.toggle-switch');
    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('on');
            const offLabel = toggle.querySelector('.off');
            offLabel.innerText = toggle.classList.contains('on') ? 'On' : 'Off';
        });
    }

    // 4. Sidebar Hamburger (Mobile)
    const burger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    if (burger) {
        burger.addEventListener('click', () => {
            // Simple toggle for mobile view if implemented
            alert("Navigation menu would open here on mobile.");
        });
    }
});