export const initHomeActions = () => {
    // Navegação Horizontal entre Telas (Home <-> Perfil <-> Mais com transição suave)
    const viewsViewport = document.getElementById('views-viewport');
    const viewsSlider = document.getElementById('views-slider');
    const navHome = document.getElementById('nav-home');
    const navProfile = document.getElementById('nav-profile');
    const navMore = document.getElementById('nav-more');
    const headerProfileBtn = document.getElementById('header-profile-btn');
    const profileBackBtn = document.getElementById('profile-back-btn');
    const moreBackBtn = document.getElementById('more-back-btn');

    let currentViewIndex = 0;
    const views = [
        { index: 0, translate: '0%', navBtn: navHome },
        { index: 1, translate: '-33.3333%', navBtn: navProfile },
        { index: 2, translate: '-66.6666%', navBtn: navMore }
    ];

    const setActiveNav = (activeBtn) => {
        [navHome, navProfile, navMore].forEach(item => {
            if (item) {
                item.classList.remove('text-[#181b34]', 'text-[#181d36]', 'font-bold');
                item.classList.add('text-slate-400', 'font-medium');
            }
        });
        if (activeBtn) {
            activeBtn.classList.remove('text-slate-400', 'font-medium');
            activeBtn.classList.add('text-[#181b34]', 'font-bold');
        }
    };

    const goToView = (index) => {
        if (index < 0 || index >= views.length) return;
        currentViewIndex = index;
        if (viewsSlider) {
            viewsSlider.style.transform = `translateX(${views[index].translate})`;
        }
        setActiveNav(views[index].navBtn);
    };

    const goToHome = () => goToView(0);
    const goToProfile = () => goToView(1);
    const goToMore = () => goToView(2);

    navHome?.addEventListener('click', goToHome);
    profileBackBtn?.addEventListener('click', goToHome);
    navProfile?.addEventListener('click', goToProfile);
    headerProfileBtn?.addEventListener('click', goToProfile);
    navMore?.addEventListener('click', goToMore);
    moreBackBtn?.addEventListener('click', goToHome);

    // Reconhecimento de Gesto de Arraste/Deslize (Touch Swipe e Mouse Drag)
    if (viewsViewport) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isSwipeIgnored = false;

        viewsViewport.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;

            const target = e.target;
            isSwipeIgnored = Boolean(target?.closest?.('#hero-carousel, .overflow-x-auto'));
        }, { passive: true });

        viewsViewport.addEventListener('touchmove', (e) => {
            if (isSwipeIgnored || e.touches.length !== 1) return;
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
        }, { passive: true });

        viewsViewport.addEventListener('touchend', () => {
            if (isSwipeIgnored) return;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;
            const minSwipeDistance = 40;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
                if (diffX < 0 && currentViewIndex < views.length - 1) {
                    goToView(currentViewIndex + 1);
                } else if (diffX > 0 && currentViewIndex > 0) {
                    goToView(currentViewIndex - 1);
                }
            }
        });

        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseStartY = 0;
        let mouseEndX = 0;
        let mouseEndY = 0;

        viewsViewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target?.closest?.('#hero-carousel, .overflow-x-auto, button, input, select, textarea, label')) return;
            isMouseDown = true;
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            mouseEndX = e.clientX;
            mouseEndY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            mouseEndX = e.clientX;
            mouseEndY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            const diffX = mouseEndX - mouseStartX;
            const diffY = mouseEndY - mouseStartY;
            const minDragDistance = 40;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minDragDistance) {
                if (diffX < 0 && currentViewIndex < views.length - 1) {
                    goToView(currentViewIndex + 1);
                } else if (diffX > 0 && currentViewIndex > 0) {
                    goToView(currentViewIndex - 1);
                }
            }
        });
    }

    // Seletor Interativo de Tema (Claro / Escuro / Sistema)
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            themeOptions.forEach(opt => {
                opt.classList.remove('border-blue-600', 'bg-blue-50/50', 'text-blue-700');
                opt.classList.add('border-slate-200/80', 'bg-white', 'text-slate-600');
            });
            btn.classList.remove('border-slate-200/80', 'bg-white', 'text-slate-600');
            btn.classList.add('border-blue-600', 'bg-blue-50/50', 'text-blue-700');
        });
    });

    // Carrossel Hero Interativo (Slides e Dots)
    const carousel = document.getElementById('hero-carousel');
    const dots = document.querySelectorAll('.carousel-dot');

    if (carousel && dots.length > 0) {
        const updateDots = (activeIndex) => {
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.remove('w-2', 'bg-slate-300');
                    dot.classList.add('w-6', 'bg-slate-500');
                } else {
                    dot.classList.remove('w-6', 'bg-slate-500');
                    dot.classList.add('w-2', 'bg-slate-300');
                }
            });
        };

        carousel.addEventListener('scroll', () => {
            const slideWidth = carousel.clientWidth;
            if (slideWidth > 0) {
                updateDots(Math.round(carousel.scrollLeft / slideWidth));
            }
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                carousel.scrollTo({
                    left: carousel.clientWidth * index,
                    behavior: 'smooth'
                });
            });
        });
    }

    return { goToHome };
};