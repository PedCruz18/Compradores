// Gerenciador de interação da interface SuplyFast
document.addEventListener('DOMContentLoaded', () => {
    // 1. Interação dos itens da barra de navegação inferior
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach((btn) => {
        btn.addEventListener('click', () => {
            navItems.forEach(item => {
                item.classList.remove('text-[#181d36]', 'font-bold');
                item.classList.add('text-slate-400', 'font-medium');
            });

            btn.classList.remove('text-slate-400', 'font-medium');
            btn.classList.add('text-[#181d36]', 'font-bold');
        });
    });

    // 2. Carrossel Hero Interativo (Slides e Dots)
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

        // Scroll listener para atualizar os dots
        carousel.addEventListener('scroll', () => {
            const slideWidth = carousel.clientWidth;
            if (slideWidth > 0) {
                const activeIndex = Math.round(carousel.scrollLeft / slideWidth);
                updateDots(activeIndex);
            }
        });

        // Clique nos dots para navegar entre os slides
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideWidth = carousel.clientWidth;
                carousel.scrollTo({
                    left: slideWidth * index,
                    behavior: 'smooth'
                });
            });
        });
    }
});
