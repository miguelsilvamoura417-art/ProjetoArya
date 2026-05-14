// ============================================
// SEÇÃO 1: MAPA INTERATIVO
// ============================================

const mapCanvas = document.getElementById('cv');

if (mapCanvas) {
    const ctx = mapCanvas.getContext('2d');
    const W = 680;
    const H = 680;
    let displayWidth = W;
    let displayHeight = H;

    const LOCS = [
        {n:1,x:315,y:160,name:"Torre Arcana",cat:"Sede do poder",desc:"Centro de reuniões da academia. Os mestres das especializações conduzem o seus eventos nesse ressinto."},
        {n:2,x:485,y:110,name:"Arena de Insurgência",cat:"Combate",desc:"Arena circular para duelos oficiais, provas de ascensão e exibições de magia de combate em festivais."},
        {n:3,x:552,y:207,name:"Biblioteca Proibida",cat:"Conhecimento",desc:"Acervo semi-infinito. A meia-noite, trancada a sete selos, guarda segredos e algo sombrio."},
        {n:4,x:520,y:315,name:"Salas de Aula",cat:"Ensino",desc:"Bloco principal de ensino com mais salas do que aparenta por fora, incluindo câmaras de invocação e laboratórios de runas."},
        {n:5,x:470,y:425,name:"Dormitório Masculino",cat:"Habitação",desc:"Alojamento da ala leste. Cada quarto possui uma lareira e um espaço especial para os familiares."},
        {n:6,x:305,y:350,name:"Refeitório",cat:"Espaço comum",desc:"Grande salão de refeições com teto de vidro que reflete o céu de uma forma especial. Aberto do amanhecer à 22:00."},
        {n:7,x:280,y:460,name:"Dormitório Feminino",cat:"Habitação",desc:"Alojamento da ala oeste. Jardim interno com plantas luminescentes cultivadas pelas próprias alunas de herbologia."},
        {n:8,x:425,y:505,name:"Estábulo",cat:"Criaturas",desc:"Abriga os familiares como grifos domesticos e criaturas de transporte usadas em missões externas da academia."},
        {n:9,x:160,y:425,name:"Jardim Astral",cat:"Área arcana",desc:"Jardim de dos apotecarios usados para cultivo especial de plantas e afins, com uma magia intrisica que torna possivel plantar todo tipo de planta."},
        {n:10,x:55,y:345,name:"Oficina de Artefatos",cat:"Criação",desc:"Forja e ateliê para construção de artefatos mágicos. Alunos avançados podem fabricar e vender criações próprias."},
        {n:11,x:90,y:195,name:"Portão Principal",cat:"Entrada",desc:"Única entrada oficial da academia. Protegido por selos de identificação que rejeitam visitantes sem convocação."},
        {n:12,x:260,y:625,name:"Cidade Externa",cat:"Fora dos muros",desc:"Vilarejo de Windhornque orbita a academia. Abriga comerciantes, famílias de alunos e tavernas que servem a comunidade arcana."},
    ];

    const mapImage = new Image();
    mapImage.addEventListener('load', resizeCanvas);
    mapImage.addEventListener('error', () => {
        console.warn('Imagem do mapa não encontrada em imagens/MapaInterativo.png');
        resizeCanvas();
    });
    mapImage.src = 'imagens/MapaInterativo.png';

    function drawBackground() {
        if (mapImage.complete && mapImage.naturalWidth > 0) {
            ctx.drawImage(mapImage, 0, 0, displayWidth, displayHeight);
        } else {
            ctx.fillStyle = '#0c0a06';
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.fillStyle = '#b48c50';
            ctx.font = 'bold 18px Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillText('Imagem do mapa não encontrada', displayWidth / 2, displayHeight / 2 - 10);
            ctx.font = '14px Georgia, serif';
            ctx.fillText('Adicione imagens/MapaInterativo.png para usar a imagem como base.', displayWidth / 2, displayHeight / 2 + 20);
        }
    }

    function drawHotspots() {
        // Hotspots são invisíveis por design.
    }

    function draw() {
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        drawBackground();
        drawHotspots();
    }

    function resizeCanvas() {
        const rect = mapCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        displayWidth = rect.width || W;
        displayHeight = rect.height || H;

        mapCanvas.width = Math.round(displayWidth * dpr);
        mapCanvas.height = Math.round(displayHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        draw();
    }

    const panel = document.getElementById('panel');
    const pNum = document.getElementById('panel-num');
    const pCat = document.getElementById('panel-cat');
    const pName = document.getElementById('panel-name');
    const pDesc = document.getElementById('panel-desc');
    const panelClose = document.getElementById('panel-close');

    function updatePanel(hit) {
        if (!panel || !pNum || !pCat || !pName || !pDesc) {
            return;
        }

        if (!hit) {
            panel.classList.remove('show');
            return;
        }

        pNum.textContent = hit.n;
        pCat.textContent = hit.cat.toUpperCase();
        pName.textContent = hit.name;
        pDesc.textContent = hit.desc;
        panel.classList.add('show');
    }

    function getMapCoordinates(event) {
        const rect = mapCanvas.getBoundingClientRect();
        const sx = W / rect.width;
        const sy = H / rect.height;

        return {
            x: (event.clientX - rect.left) * sx,
            y: (event.clientY - rect.top) * sy,
        };
    }

    function findHit(mx, my) {
        return LOCS.find(loc => Math.hypot(mx - loc.x, my - loc.y) < 16) || null;
    }

    mapCanvas.addEventListener('click', (event) => {
        const coords = getMapCoordinates(event);
        updatePanel(findHit(coords.x, coords.y));
    });

    mapCanvas.addEventListener('mousemove', (event) => {
        const coords = getMapCoordinates(event);
        mapCanvas.style.cursor = findHit(coords.x, coords.y) ? 'pointer' : 'default';
    });

    if (panelClose) {
        panelClose.addEventListener('click', () => panel?.classList.remove('show'));
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

// ============================================
// SEÇÃO 2: CARROSSEL DE IMAGENS
// ============================================

const carousel = document.querySelector('.carrossel');

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.slides img'));
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');

    if (slides.length > 0) {
        let activeIndex = slides.findIndex(slide => slide.classList.contains('active'));
        if (activeIndex === -1) activeIndex = 0;

        function updateSlides() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === activeIndex);
            });

            const activeSlide = slides[activeIndex];
            if (activeSlide && activeSlide.naturalWidth && activeSlide.naturalHeight) {
                const container = carousel.querySelector('.slides');
                const aspectRatio = activeSlide.naturalHeight / activeSlide.naturalWidth;
                const newHeight = container.offsetWidth * aspectRatio;
                container.style.height = `${newHeight}px`;
            }
        }

        function showNext() {
            activeIndex = (activeIndex + 1) % slides.length;
            updateSlides();
        }

        function showPrev() {
            activeIndex = (activeIndex - 1 + slides.length) % slides.length;
            updateSlides();
        }

        nextButton?.addEventListener('click', showNext);
        prevButton?.addEventListener('click', showPrev);

        updateSlides();
        if (slides.length > 1) {
            setInterval(showNext, 5000);
        }
    }
}
