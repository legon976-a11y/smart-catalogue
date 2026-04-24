document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. ИНИЦАЛИЗАЦИ (Initialization)
    // -----------------------------------------------------
    const canvas = new fabric.Canvas('main-canvas', {
        preserveObjectStacking: true, // Always keep selected object on top while moving
        selectionColor: 'rgba(107, 33, 168, 0.1)',
        selectionBorderColor: '#6b21a8',
        selectionLineWidth: 1
    });

    // Handle responsive sizing visually via zoom
    const canvasWrapper = document.getElementById('canvas-wrapper');
    let currentZoom = 1;

    // Undo/Redo logic simple implementation
    let history = [];
    let historyIndex = -1;
    let isHistoryAction = false;

    function saveHistory() {
        if (isHistoryAction) return;
        history = history.slice(0, historyIndex + 1);
        history.push(JSON.stringify(canvas));
        historyIndex++;
    }

    canvas.on('object:modified', saveHistory);
    canvas.on('object:added', saveHistory);
    canvas.on('object:removed', saveHistory);

    document.getElementById('btn-undo').addEventListener('click', () => {
        if (historyIndex > 0) {
            isHistoryAction = true;
            historyIndex--;
            canvas.loadFromJSON(history[historyIndex], () => {
                canvas.renderAll();
                isHistoryAction = false;
            });
        }
    });

    document.getElementById('btn-redo').addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            isHistoryAction = true;
            historyIndex++;
            canvas.loadFromJSON(history[historyIndex], () => {
                canvas.renderAll();
                isHistoryAction = false;
            });
        }
    });

    // -----------------------------------------------------
    // 2. ДЭЛГЭЦ / ХАРАГДАЦ (View & Zoom)
    // -----------------------------------------------------
    const zoomLevelText = document.getElementById('zoom-level');
    
    function applyZoom() {
        canvasWrapper.style.transform = `scale(${currentZoom})`;
        zoomLevelText.innerText = `${Math.round(currentZoom * 100)}%`;
    }

    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.1, 3);
        applyZoom();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.1, 0.3);
        applyZoom();
    });
    
    // Zoom by scroll
    document.getElementById('canvas-container-wrapper').addEventListener('wheel', function(opt) {
        if(opt.ctrlKey || opt.metaKey) {
            opt.preventDefault();
            opt.stopPropagation();
            let delta = opt.deltaY;
            if(delta < 0) {
                currentZoom = Math.min(currentZoom + 0.05, 3);
            } else {
                currentZoom = Math.max(currentZoom - 0.05, 0.3);
            }
            applyZoom();
        }
    });

    // -----------------------------------------------------
    // 3. TOOL СОНГОХ СИСТЕМ (Tool Selection)
    // -----------------------------------------------------
    let currentTool = 'select'; // select, text, image, shape, eraser
    const toolBtns = document.querySelectorAll('.tool-btn');
    const shapeSubpanel = document.getElementById('shape-subpanel');

    toolBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.currentTarget.dataset.tool;
            if(!tool) return; // Image generic block bypass

            // UI Update
            toolBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Subpanels hide
            shapeSubpanel.classList.add('hidden');

            currentTool = tool;

            // Eraser logic
            if (tool === 'eraser') {
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                canvas.freeDrawingBrush.width = 25;
                // Note: Real eraser requires destination-out composite. Standard fabric pencil draws paths.
                // We fake eraser by drawing with background color
                const bgColor = document.getElementById('doc-bg-color').value;
                canvas.freeDrawingBrush.color = bgColor || '#ffffff';
                canvas.selection = false;
            } else {
                canvas.isDrawingMode = false;
                canvas.selection = true;
            }

            if (tool === 'shape') {
                shapeSubpanel.classList.remove('hidden');
            }
        });
    });

    // -----------------------------------------------------
    // 4. ТЕКСТ & ДҮРС (Text & Shape Placement)
    // -----------------------------------------------------
    canvas.on('mouse:down', function(options) {
        if (currentTool === 'text' && !options.target) {
            const pointer = canvas.getPointer(options.e);
            const text = new fabric.IText('Текст энд бичнэ үү', {
                left: pointer.x,
                top: pointer.y,
                fontFamily: 'Inter',
                fontSize: 40,
                fill: '#2f3640',
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            text.enterEditing();
            text.selectAll();
            
            // Reset to select tool
            document.querySelector('.tool-btn[data-tool="select"]').click();
        }
    });

    document.querySelectorAll('.shape-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const shapeType = e.currentTarget.dataset.shape;
            let shape;
            const center = canvas.getCenter();
            
            const shapeOptions = {
                left: center.left,
                top: center.top,
                fill: '#e9d5ff',
                stroke: '#a855f7',
                strokeWidth: 2,
                originX: 'center',
                originY: 'center'
            };

            if (shapeType === 'rect') {
                shape = new fabric.Rect({ ...shapeOptions, width: 100, height: 100 });
            } else if (shapeType === 'circle') {
                shape = new fabric.Circle({ ...shapeOptions, radius: 50 });
            } else if (shapeType === 'line') {
                shape = new fabric.Line([center.left - 50, center.top, center.left + 50, center.top], {
                    stroke: '#a855f7',
                    strokeWidth: 4
                });
            }

            if (shape) {
                canvas.add(shape);
                canvas.setActiveObject(shape);
                document.querySelector('.tool-btn[data-tool="select"]').click();
            }
        });
    });

    // -----------------------------------------------------
    // 5. ЗУРАГ ОРУУЛАХ (Image Upload)
    // -----------------------------------------------------
    const imageUpload = document.getElementById('image-upload');
    document.getElementById('tool-image-trigger').addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(f) {
            fabric.Image.fromURL(f.target.result, function(img) {
                // Scale down if too large
                if(img.width > canvas.width) {
                    img.scaleToWidth(canvas.width - 100);
                }
                const center = canvas.getCenter();
                img.set({
                    left: center.left,
                    top: center.top,
                    originX: 'center',
                    originY: 'center',
                    cornerStyle: 'circle',
                    cornerColor: '#ec4899',
                    borderColor: '#ec4899',
                    transparentCorners: false
                });
                canvas.add(img);
                canvas.setActiveObject(img);
                document.querySelector('.tool-btn[data-tool="select"]').click();
            });
        };
        reader.readAsDataURL(file);
    });

    // -----------------------------------------------------
    // 6. ХУУДАСНЫ & ОБЬЕКТЫН ШИНЖ ЧАНАР (Properties Panel)
    // -----------------------------------------------------
    const docSizeSelect = document.getElementById('doc-size');
    const docBgColor = document.getElementById('doc-bg-color');
    const docBgHex = document.getElementById('doc-bg-hex');
    const propDocument = document.getElementById('prop-document');
    const propObject = document.getElementById('prop-object');
    const propText = document.getElementById('prop-text');

    // Document settings
    docBgColor.addEventListener('input', (e) => {
        const c = e.target.value;
        docBgHex.innerText = c.toUpperCase();
        canvas.setBackgroundColor(c, canvas.renderAll.bind(canvas));
        
        // Update eraser brush color if active
        if(currentTool === 'eraser') {
            canvas.freeDrawingBrush.color = c;
        }
    });

    docSizeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if(val === 'a4') {
            canvas.setWidth(794); canvas.setHeight(1123);
        } else if(val === 'square') {
            canvas.setWidth(1080); canvas.setHeight(1080);
        } else if(val === 'story') {
            canvas.setWidth(1080); canvas.setHeight(1920);
        }
        applyZoom(); // Reset visual scale fit
        if(history.length === 0) saveHistory();
    });

    // Object specific properties mapping
    const objFill = document.getElementById('obj-fill');
    const objStroke = document.getElementById('obj-stroke');
    const objStrokeWidth = document.getElementById('obj-stroke-width');
    const objStrokeWidthVal = document.getElementById('obj-stroke-width-val');
    const objOpacity = document.getElementById('obj-opacity');
    const objOpacityVal = document.getElementById('obj-opacity-val');

    // Text specific properties
    const textFont = document.getElementById('text-font');
    const textSize = document.getElementById('text-size');
    const textBold = document.getElementById('text-bold');
    const textItalic = document.getElementById('text-italic');

    function updatePropsPanel() {
        const obj = canvas.getActiveObject();
        if (obj) {
            propDocument.classList.add('hidden');
            propObject.classList.remove('hidden');
            propObject.classList.add('flex');

            // Fill & Stroke
            if(obj.fill && typeof obj.fill === 'string') objFill.value = obj.fill;
            if(obj.stroke && typeof obj.stroke === 'string') objStroke.value = obj.stroke;
            objStrokeWidth.value = obj.strokeWidth || 0;
            objStrokeWidthVal.innerText = obj.strokeWidth || 0;
            const op = Math.round((obj.opacity !== undefined ? obj.opacity : 1) * 100);
            objOpacity.value = op;
            objOpacityVal.innerText = `${op}%`;

            // Text
            if (obj.type === 'i-text' || obj.type === 'text') {
                propText.classList.remove('hidden');
                textFont.value = obj.fontFamily;
                textSize.value = obj.fontSize;
                textBold.classList.toggle('active', obj.fontWeight === 'bold');
                textItalic.classList.toggle('active', obj.fontStyle === 'italic');
            } else {
                propText.classList.add('hidden');
            }
        } else {
            propDocument.classList.remove('hidden');
            propObject.classList.add('hidden');
            propObject.classList.remove('flex');
        }
    }

    canvas.on('selection:created', updatePropsPanel);
    canvas.on('selection:updated', updatePropsPanel);
    canvas.on('selection:cleared', updatePropsPanel);

    // Apply Object Properties
    objFill.addEventListener('input', (e) => {
        const obj = canvas.getActiveObject();
        if(obj) { obj.set('fill', e.target.value); canvas.renderAll(); }
    });
    objStroke.addEventListener('input', (e) => {
        const obj = canvas.getActiveObject();
        if(obj) { obj.set('stroke', e.target.value); canvas.renderAll(); }
    });
    objStrokeWidth.addEventListener('input', (e) => {
        const obj = canvas.getActiveObject();
        if(obj) { 
            obj.set('strokeWidth', parseInt(e.target.value)); 
            objStrokeWidthVal.innerText = e.target.value;
            canvas.renderAll(); 
        }
    });
    objOpacity.addEventListener('input', (e) => {
        const obj = canvas.getActiveObject();
        if(obj) { 
            obj.set('opacity', parseInt(e.target.value)/100); 
            objOpacityVal.innerText = `${e.target.value}%`;
            canvas.renderAll(); 
        }
    });

    // Apply Text Properties
    textFont.addEventListener('change', (e) => {
        const obj = canvas.getActiveObject();
        if(obj && obj.set) { obj.set('fontFamily', e.target.value); canvas.renderAll(); }
    });
    textSize.addEventListener('input', (e) => {
        const obj = canvas.getActiveObject();
        if(obj && obj.set) { obj.set('fontSize', parseInt(e.target.value)); canvas.renderAll(); }
    });
    textBold.addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if(obj && obj.set) { 
            const isBold = obj.fontWeight === 'bold';
            obj.set('fontWeight', isBold ? 'normal' : 'bold'); 
            textBold.classList.toggle('active', !isBold);
            canvas.renderAll(); 
        }
    });
    textItalic.addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if(obj && obj.set) { 
            const isItalic = obj.fontStyle === 'italic';
            obj.set('fontStyle', isItalic ? 'normal' : 'italic'); 
            textItalic.classList.toggle('active', !isItalic);
            canvas.renderAll(); 
        }
    });

    // -----------------------------------------------------
    // 7. ЗЭРЭГЦҮҮЛЭХ БОЛОН ДАВХАРГА (Align & Layers)
    // -----------------------------------------------------
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const alignAction = e.currentTarget.dataset.align;
            const obj = canvas.getActiveObject();
            if(obj) {
                if(obj.type === 'i-text' || obj.type === 'text') {
                    obj.set('textAlign', alignAction);
                } else {
                    // Center generic object relative to canvas
                    if(alignAction === 'center') obj.centerH();
                    // Custom left/right logic relative to canvas
                    if(alignAction === 'left') obj.set('left', 0);
                    if(alignAction === 'right') obj.set('left', canvas.width - obj.width * obj.scaleX);
                }
                canvas.renderAll();
            }
        });
    });

    document.getElementById('layer-forward').addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if(obj) { canvas.bringForward(obj); canvas.renderAll(); }
    });

    document.getElementById('layer-backward').addEventListener('click', () => {
        const obj = canvas.getActiveObject();
        if(obj) { canvas.sendBackwards(obj); canvas.renderAll(); }
    });

    document.getElementById('obj-delete').addEventListener('click', () => {
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach(obj => canvas.remove(obj));
        canvas.discardActiveObject();
    });

    // Delete by pressing Delete key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            // Ignore if editing text
            if(canvas.getActiveObject() && canvas.getActiveObject().isEditing) return;
            const activeObjects = canvas.getActiveObjects();
            if(activeObjects.length > 0) {
                activeObjects.forEach(obj => canvas.remove(obj));
                canvas.discardActiveObject();
            }
        }
    });

    // -----------------------------------------------------
    // 8. БАРААНЫ КАРТ ҮҮСГЭГЧ (Product Card Generator)
    // -----------------------------------------------------
    const productModal = document.getElementById('product-modal');
    const mockProducts = [
        { id: 'p1', name: 'Premium Puffer Jacket', price: '89,900₮', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
        { id: 'p2', name: 'Classic White Tee', price: '29,900₮', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
        { id: 'p3', name: 'Black Hoodie', price: '129,900₮', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400' },
        { id: 'p4', name: 'Training Pants', price: '49,900₮', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
        { id: 'p5', name: 'New Season Bag', price: '150,000₮', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400' }
    ];

    document.getElementById('open-products-btn').addEventListener('click', () => {
        const listContainer = document.getElementById('mock-product-list');
        listContainer.innerHTML = mockProducts.map(p => `
            <div class="product-picker-card bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-violet-300 transition group" data-id="${p.id}">
                <div class="h-32 mb-3 rounded-xl overflow-hidden relative">
                    <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span class="text-white font-bold text-[10px] bg-violet-600 px-3 py-1 rounded-full uppercase tracking-widest"><i class="fa-solid fa-plus"></i> Оруулах</span>
                    </div>
                </div>
                <h4 class="font-bold text-xs text-slate-800 truncate">${p.name}</h4>
                <p class="text-[11px] font-bold text-pink-500 mt-1">${p.price}</p>
            </div>
        `).join('');
        productModal.classList.remove('hidden');

        // Add events
        document.querySelectorAll('.product-picker-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const pId = e.currentTarget.dataset.id;
                const prod = mockProducts.find(p => p.id === pId);
                insertProductCard(prod);
                productModal.classList.add('hidden');
                document.querySelector('.tool-btn[data-tool="select"]').click();
            });
        });
    });

    document.getElementById('close-product-modal').addEventListener('click', () => {
        productModal.classList.add('hidden');
    });

    function insertProductCard(prod) {
        // Create an elegant product card layout dynamically using Fabric.Group
        fabric.Image.fromURL(prod.img, function(img) {
            const cardWidth = 240;
            const imgHeight = 280;

            // Image clipping for rounded corners
            const clipPath = new fabric.Rect({
                left: 0, top: 0, width: cardWidth, height: imgHeight, rx: 16, ry: 16, originX: 'center', originY: 'center'
            });

            // Scale image to fill
            const scale = Math.max(cardWidth / img.width, imgHeight / img.height);
            img.set({
                scaleX: scale,
                scaleY: scale,
                originX: 'center',
                originY: 'center',
                clipPath: clipPath
            });

            // Name
            const nameText = new fabric.IText(prod.name.toUpperCase(), {
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: 'bold',
                fill: '#2f3640',
                top: imgHeight / 2 + 20,
                originX: 'center',
                originY: 'top',
                textAlign: 'center'
            });

            // Price
            const priceText = new fabric.IText(prod.price, {
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 'bold',
                fill: '#ec4899', // Pink
                top: imgHeight / 2 + 45,
                originX: 'center',
                originY: 'top',
                textAlign: 'center'
            });

            const group = new fabric.Group([img, nameText, priceText], {
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center'
            });

            canvas.add(group);
            canvas.setActiveObject(group);
        });
    }

    // -----------------------------------------------------
    // 9. AI ТУСЛАХ (AI Assistant - Magic Button)
    // -----------------------------------------------------
    document.getElementById('ai-magic-btn').addEventListener('click', () => {
        const overlay = document.getElementById('ai-overlay');
        overlay.classList.remove('hidden');

        setTimeout(() => {
            // "AI" magic: Add beautiful drop shadows to all objects and set a classy gradient/color background
            canvas.setBackgroundColor('#f8f4f9', canvas.renderAll.bind(canvas));
            
            canvas.getObjects().forEach(obj => {
                // If it's an image or shape, apply premium soft shadow
                if(obj.type === 'image' || obj.type === 'group' || obj.type === 'rect') {
                    obj.set('shadow', new fabric.Shadow({
                        color: 'rgba(107, 33, 168, 0.15)',
                        blur: 20,
                        offsetX: 0,
                        offsetY: 10
                    }));
                }
                
                // If it's text, make sure fonts are classy Playfair or Inter and properly aligned
                if(obj.type === 'i-text' || obj.type === 'text') {
                    if (obj.fontSize > 30) {
                        obj.set('fontFamily', 'Playfair Display');
                        obj.set('fill', '#4a2d42'); // Theme deep color
                    }
                }
            });

            canvas.renderAll();
            overlay.classList.add('hidden');
        }, 1500); // Fake processing time
    });

    // -----------------------------------------------------
    // 10. ТАТАХ (Download Image)
    // -----------------------------------------------------
    document.getElementById('download-btn').addEventListener('click', () => {
        // Discard selection so borders don't appear in export
        canvas.discardActiveObject();
        canvas.renderAll();

        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // High resolution export
        });

        const link = document.createElement('a');
        link.download = 'catalog-export.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Init Save History
    saveHistory();

});
