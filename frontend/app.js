//arquivo prototipo inicial para contar todos os sistemas de frontend(interfaces)

// Gerenciador de interação da interface SuplyFast
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navegação Horizontal entre Telas (Home <-> Perfil <-> Mais com transição suave)
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

    if (navHome) {
        navHome.addEventListener('click', goToHome);
    }

    if (profileBackBtn) {
        profileBackBtn.addEventListener('click', goToHome);
    }

    if (navProfile) {
        navProfile.addEventListener('click', goToProfile);
    }

    if (headerProfileBtn) {
        headerProfileBtn.addEventListener('click', goToProfile);
    }

    if (navMore) {
        navMore.addEventListener('click', goToMore);
    }

    if (moreBackBtn) {
        moreBackBtn.addEventListener('click', goToHome);
    }

    // 2. Reconhecimento de Gesto de Arraste/Deslize (Touch Swipe e Mouse Drag)
    if (viewsViewport) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isSwipeIgnored = false;

        // Suporte a Toque (Dispositivos Móveis)
        viewsViewport.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;

            // Ignorar swipe da tela se o gesto começar dentro de um carrossel horizontal interno
            const target = e.target;
            if (target && target.closest && (target.closest('#hero-carousel') || target.closest('.overflow-x-auto'))) {
                isSwipeIgnored = true;
            } else {
                isSwipeIgnored = false;
            }
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
            const minSwipeDistance = 40; // Limiar mínimo em pixels

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
                if (diffX < 0) {
                    // Arrastou para a esquerda -> Avança para a próxima sessão
                    if (currentViewIndex < views.length - 1) {
                        goToView(currentViewIndex + 1);
                    }
                } else {
                    // Arrastou para a direita -> Retorna para a sessão anterior
                    if (currentViewIndex > 0) {
                        goToView(currentViewIndex - 1);
                    }
                }
            }
        });

        // Suporte a Arraste com Mouse (Desktop)
        let isMouseDown = false;
        let mouseStartX = 0;
        let mouseStartY = 0;
        let mouseEndX = 0;
        let mouseEndY = 0;

        viewsViewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target && e.target.closest && e.target.closest('#hero-carousel, .overflow-x-auto, button, input, select, textarea, label')) {
                return;
            }
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
                if (diffX < 0) {
                    if (currentViewIndex < views.length - 1) {
                        goToView(currentViewIndex + 1);
                    }
                } else {
                    if (currentViewIndex > 0) {
                        goToView(currentViewIndex - 1);
                    }
                }
            }
        });
    }

    // 2. Seletor Interativo de Tema (Claro / Escuro / Sistema)
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

    // 3. Tela de Instruções ao Agente & Animação de Grãos Azuis
    const btnAgentInstructions = document.getElementById('btn-agent-instructions');
    const viewAgentInstructions = document.getElementById('view-agent-instructions');
    const agentBackBtn = document.getElementById('agent-back-btn');
    const agentNewChatBtn = document.getElementById('agent-new-chat-btn');
    const agentModeToggleBtn = document.getElementById('agent-mode-toggle-btn');
    const iconModeKeyboard = document.getElementById('icon-mode-keyboard');
    const iconModeMic = document.getElementById('icon-mode-mic');
    const agentHistoryBtn = document.getElementById('agent-history-btn');
    const mainBottomNav = document.getElementById('main-bottom-nav');
    const agentCenterHint = document.getElementById('agent-center-hint');

    // Containers de Modo (Voz vs Teclado)
    const agentFooter = document.getElementById('agent-footer');
    const agentVoiceContainer = document.getElementById('agent-voice-container');
    const agentTextContainer = document.getElementById('agent-text-container');
    const agentTextInput = document.getElementById('agent-text-input');
    const agentSendBtn = document.getElementById('agent-send-btn');
    const agentSpeakBtn = document.getElementById('agent-speak-btn');
    const agentSpeakText = document.getElementById('agent-speak-text');
    const agentSpeakSubtext = document.getElementById('agent-speak-subtext');
    const grainsCanvas = document.getElementById('blue-grains-canvas');

    let isAgentViewOpen = false;
    let isSpeaking = false;
    let currentInputMode = 'voice'; // 'voice' | 'text'
    let animationFrameId = null;
    let grains = [];
    const GRAIN_COUNT = 220;

    // Inicialização do Canvas de Grãos Azuis
    const initGrains = (width, height) => {
        grains = [];
        const blueColors = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#38bdf8', '#93c5fd'];

        for (let i = 0; i < GRAIN_COUNT; i++) {
            grains.push({
                x: Math.random() * width,
                y: height * 0.25 + Math.random() * (height * 0.75),
                baseY: height * 0.4 + Math.random() * (height * 0.6),
                radius: 0.8 + Math.random() * 2.2,
                color: blueColors[Math.floor(Math.random() * blueColors.length)],
                alpha: 0.25 + Math.random() * 0.7,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: -0.2 - Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2,
                waveSpeed: 0.02 + Math.random() * 0.03,
                waveAmp: 4 + Math.random() * 12
            });
        }
    };

    const renderGrains = (time) => {
        if (!isAgentViewOpen || !grainsCanvas) return;

        const ctx = grainsCanvas.getContext('2d');
        if (!ctx) return;

        const width = grainsCanvas.clientWidth;
        const height = grainsCanvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const intensity = isSpeaking ? 2.6 : 1.0;
        const currentSeconds = time * 0.001;

        // Desenho e física de cada grão azul
        for (let i = 0; i < grains.length; i++) {
            const g = grains[i];

            // Atualização horizontal e vertical com onda suave
            g.x += g.speedX * (isSpeaking ? 1.5 : 1.0);
            g.phase += g.waveSpeed * (isSpeaking ? 2.0 : 1.0);
            
            const oscillation = Math.sin(currentSeconds * 2.5 + g.phase) * (g.waveAmp * intensity);
            const drawY = g.y + oscillation;

            // Flutuação ascendente contínua dos grãos
            g.y += g.speedY * intensity;

            // Reset do grão quando sai do campo visível superior
            if (g.y < height * 0.15 || g.x < -10 || g.x > width + 10) {
                g.x = Math.random() * width;
                g.y = height + 5;
                g.phase = Math.random() * Math.PI * 2;
            }

            // Renderização do grão com gradiente e brilho azul
            ctx.save();
            ctx.globalAlpha = isSpeaking ? Math.min(1.0, g.alpha * 1.3) : g.alpha;
            ctx.fillStyle = g.color;
            ctx.shadowColor = g.color;
            ctx.shadowBlur = isSpeaking ? 8 : 4;

            ctx.beginPath();
            ctx.arc(g.x, drawY, isSpeaking ? g.radius * 1.2 : g.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        animationFrameId = requestAnimationFrame(renderGrains);
    };

    const resizeCanvas = () => {
        if (!grainsCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        const width = grainsCanvas.clientWidth || 375;
        const height = grainsCanvas.clientHeight || 224;
        if (width === 0 || height === 0) return;

        grainsCanvas.width = Math.round(width * dpr);
        grainsCanvas.height = Math.round(height * dpr);

        const ctx = grainsCanvas.getContext('2d');
        if (ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reseta escala para evitar distorção acumulada
            ctx.scale(dpr, dpr);
        }

        if (grains.length === 0) {
            initGrains(width, height);
        }
    };

    const startGrainsAnimation = () => {
        resizeCanvas();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(renderGrains);
    };

    const stopGrainsAnimation = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    // Alternância de Modo (Voz <-> Teclado) com Transição Fluida sem Deformação
    const setInputMode = (mode) => {
        currentInputMode = mode;

        if (mode === 'text') {
            // Interrompe gravação de voz se estiver ativa
            if (isSpeaking) toggleSpeaking(false);

            // 1. Transição suave de saída do Modo Voz (fade out + descida suave)
            if (agentVoiceContainer) {
                agentVoiceContainer.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                agentVoiceContainer.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
            }

            // 2. Transição suave de entrada do Modo Teclado (subida suave + fade in)
            if (agentTextContainer) {
                agentTextContainer.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
                agentTextContainer.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }

            // 3. Transição fluida dos ícones no botão do header
            if (iconModeKeyboard) {
                iconModeKeyboard.classList.remove('opacity-100', 'scale-100');
                iconModeKeyboard.classList.add('opacity-0', 'scale-75', 'pointer-events-none');
            }
            if (iconModeMic) {
                iconModeMic.classList.remove('opacity-0', 'scale-75', 'pointer-events-none');
                iconModeMic.classList.add('opacity-100', 'scale-100');
            }
            if (agentModeToggleBtn) {
                agentModeToggleBtn.setAttribute('aria-label', 'Alternar para Voz');
                agentModeToggleBtn.setAttribute('title', 'Alternar para Voz');
            }

            // 4. Fade suave da dica central
            if (agentCenterHint) {
                agentCenterHint.classList.add('opacity-0');
                setTimeout(() => {
                    agentCenterHint.textContent = 'Digite sua instrução ou pergunta abaixo';
                    agentCenterHint.classList.remove('opacity-0');
                }, 150);
            }

            // Foca o campo de texto
            if (agentTextInput) {
                setTimeout(() => agentTextInput.focus(), 250);
            }

            // Pausa animação dos grãos após a transição terminar para economizar recursos
            setTimeout(() => {
                if (currentInputMode === 'text') stopGrainsAnimation();
            }, 350);

        } else {
            // Modo Voz
            // 1. Garante redimensionamento 1:1 e inicia renderização sem deformação
            resizeCanvas();
            startGrainsAnimation();

            // 2. Transição de saída do Modo Teclado
            if (agentTextContainer) {
                agentTextContainer.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                agentTextContainer.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
            }

            // 3. Transição de entrada do Modo Voz
            if (agentVoiceContainer) {
                agentVoiceContainer.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
                agentVoiceContainer.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            }

            // 4. Transição fluida dos ícones no botão do header
            if (iconModeMic) {
                iconModeMic.classList.remove('opacity-100', 'scale-100');
                iconModeMic.classList.add('opacity-0', 'scale-75', 'pointer-events-none');
            }
            if (iconModeKeyboard) {
                iconModeKeyboard.classList.remove('opacity-0', 'scale-75', 'pointer-events-none');
                iconModeKeyboard.classList.add('opacity-100', 'scale-100');
            }
            if (agentModeToggleBtn) {
                agentModeToggleBtn.setAttribute('aria-label', 'Alternar para Teclado');
                agentModeToggleBtn.setAttribute('title', 'Alternar para Teclado');
            }

            // 5. Fade suave da dica central
            if (agentCenterHint) {
                agentCenterHint.classList.add('opacity-0');
                setTimeout(() => {
                    agentCenterHint.textContent = 'Toque no botão abaixo e fale suas instruções diretamente';
                    agentCenterHint.classList.remove('opacity-0');
                }, 150);
            }
        }
    };

    // Controle da Tela de Instruções ao Agente
    const openAgentInstructions = () => {
        if (!viewAgentInstructions) return;
        isAgentViewOpen = true;

        // Exibe a tela branca de instruções
        viewAgentInstructions.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewAgentInstructions.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        // Oculta o bottom navigation original com animação de descida
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }

        // Inicia conforme o modo ativo
        if (currentInputMode === 'voice') {
            startGrainsAnimation();
        } else if (agentTextInput) {
            setTimeout(() => agentTextInput.focus(), 250);
        }
    };

    const closeAgentInstructions = () => {
        if (!viewAgentInstructions) return;
        isAgentViewOpen = false;

        // Fecha a tela de instruções com animação suave
        viewAgentInstructions.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewAgentInstructions.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');

        // Restaura a visibilidade do bottom navigation inicial
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }

        // Para a animação do canvas para poupar recursos
        stopGrainsAnimation();

        // Reseta estado de fala se estiver ativo
        if (isSpeaking) {
            toggleSpeaking(false);
        }
    };

    const toggleSpeaking = (forceState) => {
        isSpeaking = typeof forceState === 'boolean' ? forceState : !isSpeaking;

        if (agentSpeakBtn && agentSpeakText && agentSpeakSubtext) {
            if (isSpeaking) {
                agentSpeakBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'ring-blue-500/20');
                agentSpeakBtn.classList.add('bg-blue-700', 'ring-blue-400/50', 'scale-[1.02]');
                agentSpeakText.textContent = 'Ouvindo... Toque para Parar';
                agentSpeakSubtext.textContent = 'Fale suas instruções em tempo real';
            } else {
                agentSpeakBtn.classList.remove('bg-blue-700', 'ring-blue-400/50', 'scale-[1.02]');
                agentSpeakBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'ring-blue-500/20');
                agentSpeakText.textContent = 'Aperte Para Falar';
                agentSpeakSubtext.textContent = 'Toque para iniciar gravação por voz';
            }
        }
    };

    // Gerenciamento de Digitação no Modo Teclado
    if (agentTextInput && agentSendBtn) {
        agentTextInput.addEventListener('input', () => {
            const hasText = agentTextInput.value.trim().length > 0;
            agentSendBtn.disabled = !hasText;
            if (hasText) {
                agentSendBtn.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
                agentSendBtn.classList.add('bg-[#181d36]', 'text-white', 'hover:bg-blue-600', 'cursor-pointer');
            } else {
                agentSendBtn.classList.remove('bg-[#181d36]', 'text-white', 'hover:bg-blue-600', 'cursor-pointer');
                agentSendBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            }

            // Auto-ajuste de altura
            agentTextInput.style.height = 'auto';
            agentTextInput.style.height = `${Math.min(agentTextInput.scrollHeight, 112)}px`;
        });

        agentTextInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!agentSendBtn.disabled) {
                    sendTextMessage();
                }
            }
        });

        const sendTextMessage = () => {
            const text = agentTextInput.value.trim();
            if (!text) return;

            // Limpa o campo e restaura estado desabilitado
            agentTextInput.value = '';
            agentTextInput.style.height = 'auto';
            agentSendBtn.disabled = true;
            agentSendBtn.classList.remove('bg-[#181d36]', 'text-white', 'hover:bg-blue-600', 'cursor-pointer');
            agentSendBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        };

        agentSendBtn.addEventListener('click', () => {
            if (!agentSendBtn.disabled) {
                sendTextMessage();
            }
        });
    }

    if (btnAgentInstructions) {
        btnAgentInstructions.addEventListener('click', openAgentInstructions);
    }

    if (agentBackBtn) {
        agentBackBtn.addEventListener('click', closeAgentInstructions);
    }

    if (agentNewChatBtn) {
        agentNewChatBtn.addEventListener('click', () => {
            if (isSpeaking) toggleSpeaking(false);
            if (agentTextInput) {
                agentTextInput.value = '';
                agentTextInput.style.height = 'auto';
            }
            if (agentSendBtn) {
                agentSendBtn.disabled = true;
                agentSendBtn.classList.remove('bg-[#181d36]', 'text-white', 'hover:bg-blue-600', 'cursor-pointer');
                agentSendBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
            }
        });
    }

    if (agentModeToggleBtn) {
        agentModeToggleBtn.addEventListener('click', () => {
            const nextMode = currentInputMode === 'voice' ? 'text' : 'voice';
            setInputMode(nextMode);
        });
    }

    if (agentHistoryBtn) {
        agentHistoryBtn.addEventListener('click', () => {
            // Pronto para futura exibição do histórico de conversas do agente
        });
    }

    if (agentSpeakBtn) {
        agentSpeakBtn.addEventListener('click', () => toggleSpeaking());
    }

    window.addEventListener('resize', () => {
        if (isAgentViewOpen && currentInputMode === 'voice') {
            resizeCanvas();
        }
    });

    // 4. Tela de Integrações (WhatsApp, Google, Outlook)
    const btnIntegrations = document.getElementById('btn-integrations');
    const viewIntegrations = document.getElementById('view-integrations');
    const integrationsBackBtn = document.getElementById('integrations-back-btn');
    const integrationsToast = document.getElementById('integrations-toast');
    const integrationsToastText = document.getElementById('integrations-toast-text');

    const btnToggleWhatsapp = document.getElementById('btn-toggle-whatsapp');
    const statusBadgeWhatsapp = document.getElementById('status-badge-whatsapp');
    const whatsappDetails = document.getElementById('whatsapp-details');

    const btnToggleGoogle = document.getElementById('btn-toggle-google');
    const statusBadgeGoogle = document.getElementById('status-badge-google');
    const googleDetails = document.getElementById('google-details');

    const btnToggleOutlook = document.getElementById('btn-toggle-outlook');
    const statusBadgeOutlook = document.getElementById('status-badge-outlook');
    const outlookDetails = document.getElementById('outlook-details');

    let toastTimer = null;
    const showToast = (message) => {
        if (!integrationsToast || !integrationsToastText) return;
        if (toastTimer) clearTimeout(toastTimer);
        integrationsToastText.textContent = message;
        integrationsToast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
        integrationsToast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        toastTimer = setTimeout(() => {
            integrationsToast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            integrationsToast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
        }, 2800);
    };

    const openIntegrations = () => {
        if (!viewIntegrations) return;
        viewIntegrations.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewIntegrations.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }
    };

    const closeIntegrations = () => {
        if (!viewIntegrations) return;
        viewIntegrations.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewIntegrations.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }
    };

    if (btnIntegrations) {
        btnIntegrations.addEventListener('click', openIntegrations);
    }

    if (integrationsBackBtn) {
        integrationsBackBtn.addEventListener('click', closeIntegrations);
    }

    // Estado das integrações
    let isWhatsappConnected = false;
    let isGoogleConnected = false;
    let isOutlookConnected = false;

    // Toggle WhatsApp
    if (btnToggleWhatsapp && statusBadgeWhatsapp) {
        btnToggleWhatsapp.addEventListener('click', () => {
            isWhatsappConnected = !isWhatsappConnected;
            const btnText = btnToggleWhatsapp.querySelector('.btn-text');

            if (isWhatsappConnected) {
                statusBadgeWhatsapp.textContent = 'Conectado';
                statusBadgeWhatsapp.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 transition-colors';
                
                if (whatsappDetails) whatsappDetails.classList.remove('hidden');

                btnToggleWhatsapp.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'text-white');
                btnToggleWhatsapp.classList.add('bg-slate-100', 'hover:bg-rose-50', 'text-slate-700', 'hover:text-rose-600', 'border', 'border-slate-200');
                if (btnText) btnText.textContent = 'Desativar Integração';

                showToast('Integração com WhatsApp ativada com sucesso!');
            } else {
                statusBadgeWhatsapp.textContent = 'Desconectado';
                statusBadgeWhatsapp.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/80 transition-colors';

                if (whatsappDetails) whatsappDetails.classList.add('hidden');

                btnToggleWhatsapp.classList.remove('bg-slate-100', 'hover:bg-rose-50', 'text-slate-700', 'hover:text-rose-600', 'border', 'border-slate-200');
                btnToggleWhatsapp.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white');
                if (btnText) btnText.textContent = 'Ativar Integração com WhatsApp';

                showToast('Integração com WhatsApp desativada.');
            }
        });
    }

    // Toggle Google
    if (btnToggleGoogle && statusBadgeGoogle) {
        btnToggleGoogle.addEventListener('click', () => {
            isGoogleConnected = !isGoogleConnected;
            const btnText = btnToggleGoogle.querySelector('.btn-text');

            if (isGoogleConnected) {
                statusBadgeGoogle.textContent = 'Conectado';
                statusBadgeGoogle.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 transition-colors';

                if (googleDetails) googleDetails.classList.remove('hidden');

                btnToggleGoogle.classList.remove('bg-white', 'text-slate-700');
                btnToggleGoogle.classList.add('bg-slate-100', 'hover:bg-rose-50', 'text-slate-700', 'hover:text-rose-600');
                if (btnText) btnText.textContent = 'Desativar Integração';

                showToast('Integração com Google (Gmail) ativada!');
            } else {
                statusBadgeGoogle.textContent = 'Desconectado';
                statusBadgeGoogle.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/80 transition-colors';

                if (googleDetails) googleDetails.classList.add('hidden');

                btnToggleGoogle.classList.remove('bg-slate-100', 'hover:bg-rose-50', 'hover:text-rose-600');
                btnToggleGoogle.classList.add('bg-white', 'text-slate-700');
                if (btnText) btnText.textContent = 'Ativar Integração com Google';

                showToast('Integração com Google desativada.');
            }
        });
    }

    // Toggle Outlook
    if (btnToggleOutlook && statusBadgeOutlook) {
        btnToggleOutlook.addEventListener('click', () => {
            isOutlookConnected = !isOutlookConnected;
            const btnText = btnToggleOutlook.querySelector('.btn-text');

            if (isOutlookConnected) {
                statusBadgeOutlook.textContent = 'Conectado';
                statusBadgeOutlook.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 transition-colors';

                if (outlookDetails) outlookDetails.classList.remove('hidden');

                btnToggleOutlook.classList.remove('bg-[#0078D4]', 'hover:bg-[#006cbd]', 'text-white');
                btnToggleOutlook.classList.add('bg-slate-100', 'hover:bg-rose-50', 'text-slate-700', 'hover:text-rose-600', 'border', 'border-slate-200');
                if (btnText) btnText.textContent = 'Desativar Integração';

                showToast('Integração com Microsoft Outlook ativada!');
            } else {
                statusBadgeOutlook.textContent = 'Desconectado';
                statusBadgeOutlook.className = 'text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/80 transition-colors';

                if (outlookDetails) outlookDetails.classList.add('hidden');

                btnToggleOutlook.classList.remove('bg-slate-100', 'hover:bg-rose-50', 'text-slate-700', 'hover:text-rose-600', 'border', 'border-slate-200');
                btnToggleOutlook.classList.add('bg-[#0078D4]', 'hover:bg-[#006cbd]', 'text-white');
                if (btnText) btnText.textContent = 'Ativar Integração com Outlook';

                showToast('Integração com Outlook desativada.');
            }
        });
    }

    // 5. Tela de Comunidade (Rede Social de Fornecedores / Vitrine B2B)
    const btnCommunity = document.getElementById('btn-community');
    const viewCommunity = document.getElementById('view-community');
    const communityBackBtn = document.getElementById('community-back-btn');
    const communityToast = document.getElementById('community-toast');
    const communityToastText = document.getElementById('community-toast-text');

    let communityToastTimer = null;
    const showCommunityToast = (message) => {
        if (!communityToast || !communityToastText) return;
        if (communityToastTimer) clearTimeout(communityToastTimer);
        communityToastText.textContent = message;
        communityToast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
        communityToast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        communityToastTimer = setTimeout(() => {
            communityToast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            communityToast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
        }, 2800);
    };

    const openCommunity = () => {
        if (!viewCommunity) return;
        viewCommunity.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewCommunity.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }
    };

    const closeCommunity = () => {
        if (!viewCommunity) return;
        viewCommunity.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewCommunity.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }
    };

    if (btnCommunity) {
        btnCommunity.addEventListener('click', openCommunity);
    }

    if (communityBackBtn) {
        communityBackBtn.addEventListener('click', closeCommunity);
    }

    // Filtros de Categorias
    const categoryPills = document.querySelectorAll('.community-category-pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => {
                p.classList.remove('active', 'bg-[#181d36]', 'text-white');
                p.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            pill.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            pill.classList.add('active', 'bg-[#181d36]', 'text-white');
        });
    });

    // Função utilitária para sanitizar comentários
    const escapeHtml = (str) => {
        return str.replace(/[&<>"']/g, (m) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m]));
    };

    // Sistema de Interações nos Posts (Likes, Comentários, Salvar, Cotação)
    const setupPostInteractions = (postElement) => {
        const likeBtn = postElement.querySelector('.post-like-btn');
        const likeIcon = postElement.querySelector('.like-icon');
        const likesCountEl = postElement.querySelector('.post-likes-count');

        if (likeBtn && likeIcon && likesCountEl) {
            let isLiked = false;
            let currentLikes = parseInt(likesCountEl.getAttribute('data-count') || '0', 10);

            likeBtn.addEventListener('click', () => {
                isLiked = !isLiked;
                if (isLiked) {
                    currentLikes++;
                    likeIcon.classList.remove('fill-none', 'stroke-current');
                    likeIcon.classList.add('fill-rose-600', 'text-rose-600', 'stroke-rose-600', 'scale-125');
                    setTimeout(() => likeIcon.classList.remove('scale-125'), 200);
                    showCommunityToast('Curtida registrada!');
                } else {
                    currentLikes--;
                    likeIcon.classList.remove('fill-rose-600', 'text-rose-600', 'stroke-rose-600');
                    likeIcon.classList.add('fill-none', 'stroke-current');
                }
                likesCountEl.setAttribute('data-count', currentLikes);
                likesCountEl.textContent = `${currentLikes} curtidas`;
            });
        }

        // Salvar / Favoritar
        const saveBtn = postElement.querySelector('.post-save-btn');
        const saveIcon = postElement.querySelector('.save-icon');
        if (saveBtn && saveIcon) {
            let isSaved = false;
            saveBtn.addEventListener('click', () => {
                isSaved = !isSaved;
                if (isSaved) {
                    saveIcon.classList.remove('fill-none');
                    saveIcon.classList.add('fill-slate-900', 'text-slate-900');
                    showCommunityToast('Item salvo em seus favoritos!');
                } else {
                    saveIcon.classList.remove('fill-slate-900', 'text-slate-900');
                    saveIcon.classList.add('fill-none');
                    showCommunityToast('Item removido dos favoritos.');
                }
            });
        }

        // Foco no comentário ao clicar no ícone de chat
        const commentBtn = postElement.querySelector('.post-comment-btn');
        const commentInput = postElement.querySelector('.post-comment-input');
        if (commentBtn && commentInput) {
            commentBtn.addEventListener('click', () => {
                commentInput.focus();
            });
        }

        // Enviar Comentário
        const commentForm = postElement.querySelector('.post-comment-form');
        const commentsList = postElement.querySelector('.post-comments-list');
        const commentsCountEl = postElement.querySelector('.post-comments-count');

        if (commentForm && commentInput && commentsList) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = commentInput.value.trim();
                if (!text) return;

                const newComment = document.createElement('div');
                newComment.className = 'text-xs text-slate-700 flex items-start gap-1.5';
                newComment.innerHTML = `
                    <span class="font-bold text-slate-900 shrink-0">Você (Comprador):</span>
                    <span class="text-slate-600">${escapeHtml(text)}</span>
                `;
                commentsList.appendChild(newComment);
                commentInput.value = '';

                if (commentsCountEl) {
                    const currentCount = commentsList.children.length;
                    commentsCountEl.textContent = `${currentCount} comentários`;
                }

                showCommunityToast('Comentário publicado com sucesso!');
            });
        }

        // Solicitar Cotação
        const requestQuoteBtn = postElement.querySelector('.btn-request-quote');
        if (requestQuoteBtn) {
            requestQuoteBtn.addEventListener('click', () => {
                const supplier = requestQuoteBtn.getAttribute('data-supplier') || 'Fornecedor';
                const item = requestQuoteBtn.getAttribute('data-item') || 'Item';
                showCommunityToast(`Cotação para ${item} enviada para ${supplier}!`);
            });
        }
    };

    // Inicializar posts existentes
    const existingPosts = document.querySelectorAll('#community-posts-container article');
    existingPosts.forEach(post => setupPostInteractions(post));

    // Modal de Criação de Post
    const btnOpenNewPostModal = document.getElementById('btn-open-new-post-modal');
    const storyAddPostBtn = document.getElementById('story-add-post-btn');
    const btnCloseNewPostModal = document.getElementById('btn-close-new-post-modal');
    const modalNewPost = document.getElementById('modal-new-post');
    const formCreatePost = document.getElementById('form-create-post');
    const postsContainer = document.getElementById('community-posts-container');

    const openNewPostModal = () => {
        if (!modalNewPost) return;
        modalNewPost.classList.remove('opacity-0', 'pointer-events-none');
        modalNewPost.classList.add('opacity-100', 'pointer-events-auto');
        const modalContent = modalNewPost.querySelector('div');
        if (modalContent) modalContent.classList.remove('translate-y-6');
    };

    const closeNewPostModal = () => {
        if (!modalNewPost) return;
        modalNewPost.classList.remove('opacity-100', 'pointer-events-auto');
        modalNewPost.classList.add('opacity-0', 'pointer-events-none');
        const modalContent = modalNewPost.querySelector('div');
        if (modalContent) modalContent.classList.add('translate-y-6');
    };

    if (btnOpenNewPostModal) btnOpenNewPostModal.addEventListener('click', openNewPostModal);
    if (storyAddPostBtn) storyAddPostBtn.addEventListener('click', openNewPostModal);
    if (btnCloseNewPostModal) btnCloseNewPostModal.addEventListener('click', closeNewPostModal);
    if (modalNewPost) {
        modalNewPost.addEventListener('click', (e) => {
            if (e.target === modalNewPost) closeNewPostModal();
        });
    }

    if (formCreatePost && postsContainer) {
        formCreatePost.addEventListener('submit', (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('new-post-title');
            const categorySelect = document.getElementById('new-post-category');
            const descInput = document.getElementById('new-post-description');

            const title = titleInput ? titleInput.value.trim() : '';
            const category = categorySelect ? categorySelect.value : '';
            const desc = descInput ? descInput.value.trim() : '';

            if (!title || !desc) return;

            const newPostArticle = document.createElement('article');
            newPostArticle.className = 'bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden';
            newPostArticle.innerHTML = `
                <div class="p-3.5 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-full ring-2 ring-blue-600/20 overflow-hidden bg-blue-50 shrink-0 flex items-center justify-center font-bold text-blue-700 text-xs">
                            VOCÊ
                        </div>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <h4 class="text-xs font-bold text-slate-900 leading-tight">Sua Empresa Fornecedora</h4>
                                <svg class="w-3.5 h-3.5 text-blue-600 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <p class="text-[10px] text-slate-400 font-medium">São Paulo, SP • ${escapeHtml(category)} • Agora mesmo</p>
                        </div>
                    </div>
                </div>

                <div class="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-6 text-center text-white">
                    <div class="space-y-2">
                        <div class="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center border border-white/20 text-xl">
                            📦
                        </div>
                        <h3 class="text-sm font-bold text-white">${escapeHtml(title)}</h3>
                        <p class="text-xs text-slate-300 max-w-[280px] line-clamp-2">${escapeHtml(desc)}</p>
                    </div>
                    <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>Item Recém Publicado</span>
                    </div>
                </div>

                <div class="p-3.5 space-y-2.5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <button type="button" class="post-like-btn flex items-center gap-1.5 text-slate-700 hover:text-rose-600 transition-colors focus:outline-none cursor-pointer">
                                <svg class="like-icon w-5 h-5 stroke-current fill-none stroke-2 transition-transform active:scale-125" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                            </button>
                            <button type="button" class="post-comment-btn flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer">
                                <svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                </svg>
                            </button>
                            <button type="button" class="post-share-btn text-slate-700 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer">
                                <svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                        <button type="button" class="post-save-btn text-slate-700 hover:text-slate-900 transition-colors focus:outline-none cursor-pointer">
                            <svg class="save-icon w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <span class="post-likes-count text-xs font-bold text-slate-900" data-count="1">1 curtida</span>
                    </div>

                    <div class="space-y-1">
                        <p class="text-xs text-slate-700 leading-relaxed">
                            <span class="font-bold text-slate-900 mr-1.5">Sua Empresa</span>
                            <strong>${escapeHtml(title)}:</strong> ${escapeHtml(desc)}
                        </p>
                    </div>

                    <div class="pt-2 border-t border-slate-100 space-y-2">
                        <div class="post-comments-list space-y-2 pt-1"></div>
                        <form class="post-comment-form pt-2 flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80" alt="Você" class="w-full h-full object-cover">
                            </div>
                            <input 
                                type="text" 
                                placeholder="Adicione um comentário ao fornecedor..." 
                                class="post-comment-input flex-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all"
                                required
                            >
                            <button type="submit" class="text-xs font-bold text-blue-600 hover:text-blue-700 px-2 py-1 cursor-pointer transition-colors">
                                Publicar
                            </button>
                        </form>
                    </div>
                </div>
            `;

            postsContainer.prepend(newPostArticle);
            setupPostInteractions(newPostArticle);

            formCreatePost.reset();
            closeNewPostModal();
            showCommunityToast('Item publicado com sucesso na vitrine da comunidade!');
        });
    }

    // 6. Tela SuplyShop (Vitrine Comercial B2B com Preços, Parcelamento e Carrinho)
    const btnSuplyShop = document.getElementById('btn-suplyshop');
    const viewSuplyShop = document.getElementById('view-suplyshop');
    const suplyShopBackBtn = document.getElementById('suplyshop-back-btn');
    const suplyShopToast = document.getElementById('suplyshop-toast');
    const suplyShopToastText = document.getElementById('suplyshop-toast-text');

    let suplyShopToastTimer = null;
    const showSuplyShopToast = (message) => {
        if (!suplyShopToast || !suplyShopToastText) return;
        if (suplyShopToastTimer) clearTimeout(suplyShopToastTimer);
        suplyShopToastText.textContent = message;
        suplyShopToast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
        suplyShopToast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        suplyShopToastTimer = setTimeout(() => {
            suplyShopToast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            suplyShopToast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
        }, 2800);
    };

    const openSuplyShop = () => {
        if (!viewSuplyShop) return;
        viewSuplyShop.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewSuplyShop.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }
    };

    const closeSuplyShop = () => {
        if (!viewSuplyShop) return;
        viewSuplyShop.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewSuplyShop.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }
    };

    if (btnSuplyShop) {
        btnSuplyShop.addEventListener('click', openSuplyShop);
    }

    if (suplyShopBackBtn) {
        suplyShopBackBtn.addEventListener('click', closeSuplyShop);
    }

    // Filtros de Categoria da Loja
    const suplyshopCategoryPills = document.querySelectorAll('.suplyshop-category-pill');
    suplyshopCategoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            suplyshopCategoryPills.forEach(p => {
                p.classList.remove('active', 'bg-[#181d36]', 'text-white');
                p.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200/80');
            });
            pill.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200/80');
            pill.classList.add('active', 'bg-[#181d36]', 'text-white');
        });
    });

    // Filtro de Busca de Produtos
    const suplyshopSearchInput = document.getElementById('suplyshop-search-input');
    const productCards = document.querySelectorAll('#suplyshop-products-grid > div');
    if (suplyshopSearchInput) {
        suplyshopSearchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            productCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(term)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }

    // Estado do Carrinho de Compras
    const btnOpenCart = document.getElementById('btn-open-cart');
    const btnCloseCart = document.getElementById('btn-close-cart');
    const modalCartDrawer = document.getElementById('modal-cart-drawer');
    const cartBadge = document.getElementById('cart-badge');
    const cartDrawerCount = document.getElementById('cart-drawer-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cartInstallmentSummary = document.getElementById('cart-installment-summary');
    const btnCheckoutCart = document.getElementById('btn-checkout-cart');

    let cart = [
        {
            id: '1',
            name: 'Flange Cego Aço Inox 316L',
            supplier: 'Metalúrgica Alfa',
            price: 245.00,
            quantity: 2,
            img: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80'
        },
        {
            id: '2',
            name: 'Resina Poliamida 6.6 25kg',
            supplier: 'Polímeros Brasil',
            price: 680.00,
            quantity: 1,
            img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'
        }
    ];

    let currentPaymentMethod = 'boleto'; // 'boleto' | 'cartao' | 'pix'

    // Formatação de Moeda
    const formatCurrency = (val) => {
        return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Renderização do Carrinho
    const renderCart = () => {
        const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        let subtotalVal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        let totalVal = subtotalVal;

        // Desconto PIX se selecionado
        if (currentPaymentMethod === 'pix' && subtotalVal > 0) {
            totalVal = subtotalVal * 0.97;
        }

        // Atualiza Badges e Contadores
        if (cartBadge) {
            cartBadge.textContent = totalItemsCount;
            if (totalItemsCount === 0) {
                cartBadge.classList.add('hidden');
            } else {
                cartBadge.classList.remove('hidden');
            }
        }

        if (cartDrawerCount) {
            cartDrawerCount.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item selecionado' : 'itens selecionados'}`;
        }

        if (cartSubtotal) cartSubtotal.textContent = formatCurrency(subtotalVal);
        if (cartTotal) cartTotal.textContent = formatCurrency(totalVal);

        if (cartInstallmentSummary) {
            if (currentPaymentMethod === 'pix') {
                cartInstallmentSummary.textContent = '3% de desconto à vista via PIX';
                cartInstallmentSummary.className = 'text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md';
            } else if (currentPaymentMethod === 'cartao') {
                const installment = (totalVal / 12);
                cartInstallmentSummary.textContent = `ou 12x de ${formatCurrency(installment)} s/ juros`;
                cartInstallmentSummary.className = 'text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md';
            } else {
                cartInstallmentSummary.textContent = 'Boleto faturado em 28/56 dias';
                cartInstallmentSummary.className = 'text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md';
            }
        }

        // Renderiza itens dentro do container
        if (cartItemsContainer) {
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="py-8 text-center space-y-2">
                        <div class="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                            <svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </div>
                        <p class="text-xs font-semibold text-slate-600">Seu carrinho está vazio</p>
                        <p class="text-[10px] text-slate-400">Navegue pela SuplyShop e adicione itens para compra.</p>
                    </div>
                `;
            } else {
                cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2.5 flex-1 min-w-0">
                            <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                                <img src="${item.img}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover">
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="text-[9.5px] font-semibold text-blue-600 truncate block">${escapeHtml(item.supplier)}</span>
                                <h4 class="text-xs font-bold text-slate-800 truncate leading-tight">${escapeHtml(item.name)}</h4>
                                <span class="text-[11px] font-extrabold text-slate-900 mt-0.5 block">${formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        </div>

                        <!-- Controles de Quantidade -->
                        <div class="flex items-center gap-1.5 shrink-0 bg-slate-100/90 rounded-xl p-1 border border-slate-200/60">
                            <button type="button" class="cart-btn-qty-minus w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-xs font-bold transition-all cursor-pointer" data-id="${item.id}">
                                -
                            </button>
                            <span class="text-xs font-bold text-slate-800 w-5 text-center">${item.quantity}</span>
                            <button type="button" class="cart-btn-qty-plus w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-xs font-bold transition-all cursor-pointer" data-id="${item.id}">
                                +
                            </button>
                        </div>
                    </div>
                `).join('');

                // Adiciona listeners para os botões de quantidade
                const minusBtns = cartItemsContainer.querySelectorAll('.cart-btn-qty-minus');
                const plusBtns = cartItemsContainer.querySelectorAll('.cart-btn-qty-plus');

                minusBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        changeItemQuantity(id, -1);
                    });
                });

                plusBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        changeItemQuantity(id, 1);
                    });
                });
            }
        }
    };

    const changeItemQuantity = (id, delta) => {
        const itemIndex = cart.findIndex(it => it.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += delta;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
                showSuplyShopToast('Item removido do carrinho.');
            }
            renderCart();
        }
    };

    // Adicionar item pela vitrine
    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-product-name');
            const supplier = btn.getAttribute('data-product-supplier');
            const price = parseFloat(btn.getAttribute('data-product-price') || '0');
            const img = btn.getAttribute('data-product-img');

            const existingIndex = cart.findIndex(it => it.id === id);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    supplier,
                    price,
                    quantity: 1,
                    img
                });
            }

            renderCart();
            showSuplyShopToast(`"${name}" adicionado ao carrinho!`);
        });
    });

    // Abertura e Fechamento do Drawer do Carrinho
    const openCartDrawer = () => {
        if (!modalCartDrawer) return;
        renderCart();
        modalCartDrawer.classList.remove('opacity-0', 'pointer-events-none');
        modalCartDrawer.classList.add('opacity-100', 'pointer-events-auto');
        const modalContent = modalCartDrawer.querySelector('div');
        if (modalContent) modalContent.classList.remove('translate-y-6');
    };

    const closeCartDrawer = () => {
        if (!modalCartDrawer) return;
        modalCartDrawer.classList.remove('opacity-100', 'pointer-events-auto');
        modalCartDrawer.classList.add('opacity-0', 'pointer-events-none');
        const modalContent = modalCartDrawer.querySelector('div');
        if (modalContent) modalContent.classList.add('translate-y-6');
    };

    if (btnOpenCart) btnOpenCart.addEventListener('click', openCartDrawer);
    if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);
    if (modalCartDrawer) {
        modalCartDrawer.addEventListener('click', (e) => {
            if (e.target === modalCartDrawer) closeCartDrawer();
        });
    }

    // Alternar Opções de Pagamento no Carrinho
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentOptions.forEach(opt => {
                opt.classList.remove('active', 'border-blue-600', 'bg-blue-50/50', 'text-blue-700');
                opt.classList.add('border-slate-200/80', 'bg-white', 'text-slate-600');
            });
            btn.classList.remove('border-slate-200/80', 'bg-white', 'text-slate-600');
            btn.classList.add('active', 'border-blue-600', 'bg-blue-50/50', 'text-blue-700');

            currentPaymentMethod = btn.getAttribute('data-payment') || 'boleto';
            renderCart();
        });
    });

    // Finalizar Pedido de Compra
    if (btnCheckoutCart) {
        btnCheckoutCart.addEventListener('click', () => {
            if (cart.length === 0) {
                showSuplyShopToast('Seu carrinho está vazio.');
                return;
            }

            const poNumber = Math.floor(100000 + Math.random() * 900000);
            cart = [];
            renderCart();
            closeCartDrawer();
            showSuplyShopToast(`Ordem de Compra #PO-${poNumber} emitida com sucesso!`);
        });
    }

    // Inicializa estado visual do carrinho
    renderCart();

    // 7. Tela Agenda (Estilo Google Agenda: Entregas, Cotações, Notas e Reuniões)
    const btnAgenda = document.getElementById('btn-agenda');
    const viewAgenda = document.getElementById('view-agenda');
    const agendaBackBtn = document.getElementById('agenda-back-btn');
    const agendaToast = document.getElementById('agenda-toast');
    const agendaToastText = document.getElementById('agenda-toast-text');

    let agendaToastTimer = null;
    const showAgendaToast = (message) => {
        if (!agendaToast || !agendaToastText) return;
        if (agendaToastTimer) clearTimeout(agendaToastTimer);
        agendaToastText.textContent = message;
        agendaToast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
        agendaToast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        agendaToastTimer = setTimeout(() => {
            agendaToast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            agendaToast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
        }, 2800);
    };

    const openAgenda = () => {
        if (!viewAgenda) return;
        viewAgenda.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewAgenda.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }
    };

    const closeAgenda = () => {
        if (!viewAgenda) return;
        viewAgenda.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewAgenda.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }
    };

    if (btnAgenda) {
        btnAgenda.addEventListener('click', openAgenda);
    }

    if (agendaBackBtn) {
        agendaBackBtn.addEventListener('click', closeAgenda);
    }

    // Navegação, Expansão e Seleção de Dias na Agenda (Google Calendar)
    const agendaDayBtns = document.querySelectorAll('.agenda-day-btn');
    const agendaMonthDayBtns = document.querySelectorAll('.agenda-month-day-btn');
    const agendaSelectedDayLabel = document.getElementById('agenda-selected-day-label');
    const agendaTodayBtn = document.getElementById('agenda-today-btn');
    const agendaJumpTomorrowBtn = document.getElementById('agenda-jump-tomorrow-btn');
    const agendaPrevWeek = document.getElementById('agenda-prev-week');
    const agendaNextWeek = document.getElementById('agenda-next-week');

    const btnToggleCalendarExpand = document.getElementById('btn-toggle-calendar-expand');
    const btnExpandBadge = document.getElementById('btn-expand-badge');
    const btnCollapseCalendar = document.getElementById('btn-collapse-calendar');
    const agendaWeekStrip = document.getElementById('agenda-week-strip');
    const agendaMonthExpanded = document.getElementById('agenda-month-expanded');
    const calendarExpandChevron = document.getElementById('calendar-expand-chevron');

    const setCalendarExpandedState = (expanded) => {
        if (!agendaMonthExpanded) return;
        if (expanded) {
            agendaMonthExpanded.classList.remove('hidden');
            if (agendaWeekStrip) agendaWeekStrip.classList.add('hidden');
            if (calendarExpandChevron) calendarExpandChevron.classList.add('rotate-180');
            if (btnExpandBadge) {
                btnExpandBadge.textContent = 'Ver Semana';
                btnExpandBadge.classList.add('bg-blue-50', 'text-blue-600', 'border-blue-200');
                btnExpandBadge.classList.remove('bg-slate-100', 'text-slate-600');
            }
        } else {
            agendaMonthExpanded.classList.add('hidden');
            if (agendaWeekStrip) agendaWeekStrip.classList.remove('hidden');
            if (calendarExpandChevron) calendarExpandChevron.classList.remove('rotate-180');
            if (btnExpandBadge) {
                btnExpandBadge.textContent = 'Ver Mês';
                btnExpandBadge.classList.remove('bg-blue-50', 'text-blue-600', 'border-blue-200');
                btnExpandBadge.classList.add('bg-slate-100', 'text-slate-600');
            }
        }
    };

    const toggleCalendarExpanded = () => {
        if (!agendaMonthExpanded) return;
        const isExpanded = !agendaMonthExpanded.classList.contains('hidden');
        setCalendarExpandedState(!isExpanded);
    };

    if (btnToggleCalendarExpand) {
        btnToggleCalendarExpand.addEventListener('click', toggleCalendarExpanded);
    }
    if (btnExpandBadge) {
        btnExpandBadge.addEventListener('click', toggleCalendarExpanded);
    }
    if (btnCollapseCalendar) {
        btnCollapseCalendar.addEventListener('click', () => setCalendarExpandedState(false));
    }

    if (agendaPrevWeek) {
        agendaPrevWeek.addEventListener('click', () => {
            showAgendaToast('Navegando: semana anterior (31/08 a 06/09)');
        });
    }
    if (agendaNextWeek) {
        agendaNextWeek.addEventListener('click', () => {
            showAgendaToast('Navegando: próxima semana (14/09 a 20/09)');
        });
    }

    const daysMap = {
        '7': 'Segunda-feira, 07 de Setembro',
        '8': 'Terça-feira, 08 de Setembro',
        '9': 'Quarta-feira, 09 de Setembro',
        '10': 'Quinta-feira, 10 de Setembro (Hoje)',
        '11': 'Sexta-feira, 11 de Setembro (Amanhã)',
        '12': 'Sábado, 12 de Setembro',
        '13': 'Domingo, 13 de Setembro'
    };

    const getAgendaDateLabel = (dayStr) => {
        if (daysMap[dayStr]) return daysMap[dayStr];
        const num = parseInt(dayStr, 10);
        if (isNaN(num)) return `Dia ${dayStr} de Setembro`;
        const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const date = new Date(2026, 8, num);
        const weekday = weekdays[date.getDay()];
        const padDay = num.toString().padStart(2, '0');
        return `${weekday}, ${padDay} de Setembro`;
    };

    let currentSelectedDay = '10';
    let currentActiveFilter = 'all';

    const agendaEventsByDay = {
        '10': [
            {
                id: 'evt-10-1',
                type: 'delivery',
                time: '09:30 - 11:00',
                title: 'Recebimento: 500x Flanges Cegas Inox 316L',
                supplier: 'Metalúrgica Alfa',
                details: 'Doca 02 (Almoxarifado Central). Conferir laudo dimensional e certificado de corrida da liga.',
                metaText: '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> NF-e #44892 Autorizada',
                metaClass: 'font-semibold text-emerald-700 flex items-center gap-1',
                actionText: 'Confirmar Recebimento',
                actionColor: 'text-blue-600'
            },
            {
                id: 'evt-10-2',
                type: 'quotation',
                time: '14:00 (Prazo Final)',
                title: 'Prazo de Retorno: RFQ #1042 (Resinas PA 6.6 com Fibra)',
                supplier: 'Polímeros Brasil / Braskem',
                details: 'Cobrar envio da proposta comercial final dos fornecedores com frete CIF incluso.',
                metaText: '2 de 3 fornecedores já responderam',
                metaClass: 'font-medium text-slate-400',
                actionText: 'Abrir Comparativo',
                actionColor: 'text-blue-600'
            },
            {
                id: 'evt-10-3',
                type: 'meeting',
                time: '15:30 - 16:15',
                title: 'Alinhamento Técnico: Painéis CLP IP66 e Diagrama Unifilar',
                supplier: 'EletroShield Automação',
                details: 'Com engenharia via Google Meet. Validação de conformidade com a NR-10 antes do fechamento do pedido.',
                metaText: '<svg class="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Google Meet',
                metaClass: 'font-medium text-indigo-700 flex items-center gap-1',
                actionText: 'Acessar Chamada',
                actionColor: 'text-indigo-600'
            },
            {
                id: 'evt-10-4',
                type: 'note',
                time: 'O dia todo',
                title: 'Negociar prazo faturado de 28/56 dias com a FixaPro',
                supplier: 'FixaPro Parafusos',
                details: 'Lembrar de anexar a ficha cadastral do CNPJ atualizada e o balanço do último trimestre para liberação do limite de crédito corporativo.',
                metaText: 'Prioridade Alta',
                metaClass: 'font-medium text-slate-400',
                actionText: 'Concluir Nota',
                actionColor: 'text-amber-600'
            }
        ],
        '11': [
            {
                id: 'evt-11-1',
                type: 'delivery',
                time: '08:30 - 10:00',
                title: 'Recebimento: 200x Bobinas Filme Stretch 500mm',
                supplier: 'PackLog Soluções',
                details: 'Doca 01 (Almoxarifado de Expedição). Entrega programada com caminhão baú e paletes padrão PBR.',
                metaText: '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Agendamento Confirmado',
                metaClass: 'font-semibold text-emerald-700 flex items-center gap-1',
                actionText: 'Confirmar Recebimento',
                actionColor: 'text-emerald-600'
            }
        ],
        '8': [
            {
                id: 'evt-8-1',
                type: 'quotation',
                time: '11:00',
                title: 'Prazo de Retorno: RFQ #1038 Parafusos Inox 304',
                supplier: 'Fixadores Ciser',
                details: 'Aguardando proposta técnica e tabela de descontos por volume.',
                metaText: 'Pendente 1 proposta',
                metaClass: 'font-medium text-slate-400',
                actionText: 'Abrir Comparativo',
                actionColor: 'text-blue-600'
            }
        ],
        '9': [
            {
                id: 'evt-9-1',
                type: 'delivery',
                time: '14:30',
                title: 'Recebimento: Lote de Resinas Termoplásticas (PEAD)',
                supplier: 'Braskem Distribuição',
                details: '12 paletes entregues no Galpão 03 com conferência de nota concluída.',
                metaText: '✓ Recebido com sucesso',
                metaClass: 'font-semibold text-emerald-700',
                actionText: '✓ Concluído',
                actionColor: 'text-emerald-600 font-bold'
            }
        ],
        '15': [
            {
                id: 'evt-15-1',
                type: 'quotation',
                time: '16:00',
                title: 'Fechamento de Cotação: Válvulas Esfera e Gaveta',
                supplier: 'Deca Industrial / Mipel',
                details: 'Validação final de preços e prazo de pagamento para liberação do pedido de compras.',
                metaText: '3 fornecedores cotados',
                metaClass: 'font-medium text-slate-400',
                actionText: 'Abrir Comparativo',
                actionColor: 'text-blue-600'
            }
        ],
        '22': [
            {
                id: 'evt-22-1',
                type: 'delivery',
                time: '10:00',
                title: 'Recebimento: 15 Toneladas Chapas Galvanizadas 2mm',
                supplier: 'Gerdau Aços Especiais',
                details: 'Doca Pesada 04 com ponte rolante. Conferência de certificado de qualidade do lote.',
                metaText: 'Programação de Carga',
                metaClass: 'font-semibold text-emerald-700',
                actionText: 'Confirmar Recebimento',
                actionColor: 'text-emerald-600'
            }
        ],
        '29': [
            {
                id: 'evt-29-1',
                type: 'meeting',
                time: '11:00 - 12:00',
                title: 'Renovação Contratual: Frete Fracionado Nacional',
                supplier: 'Atlas Transportes',
                details: 'Reunião executiva de alinhamento de SLA e tabela de fretes CIF/FOB.',
                metaText: 'Google Meet',
                metaClass: 'font-medium text-indigo-700',
                actionText: 'Acessar Chamada',
                actionColor: 'text-indigo-600'
            }
        ]
    };

    const getAgendaTypeConfig = (type) => {
        const configs = {
            delivery: {
                border: 'border-l-emerald-500',
                badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
                badgeText: '📦 Chegada de Itens',
                actionText: 'Confirmar Recebimento',
                actionColor: 'text-emerald-600'
            },
            quotation: {
                border: 'border-l-blue-500',
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
                badgeText: '📋 Resposta de Cotação',
                actionText: 'Abrir Comparativo',
                actionColor: 'text-blue-600'
            },
            note: {
                border: 'border-l-amber-500',
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
                badgeText: '📌 Nota do Comprador',
                actionText: 'Concluir Nota',
                actionColor: 'text-amber-600'
            },
            meeting: {
                border: 'border-l-indigo-500',
                badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
                badgeText: '🤝 Reunião com Fornecedor',
                actionText: 'Acessar Chamada',
                actionColor: 'text-indigo-600'
            }
        };
        return configs[type] || {
            border: 'border-l-blue-500',
            badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
            badgeText: '📌 Registro',
            actionText: 'Concluir',
            actionColor: 'text-blue-600'
        };
    };

    const setupAgendaCardActions = (container) => {
        const checkBtns = container.querySelectorAll('.btn-check-agenda');
        checkBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.agenda-card');
                const title = card ? card.querySelector('h4')?.textContent.trim() : 'Item';
                btn.textContent = '✓ Concluído';
                btn.classList.remove('text-blue-600', 'text-indigo-600', 'text-amber-600');
                btn.classList.add('text-emerald-600', 'font-bold');
                showAgendaToast(`"${title}" marcado como concluído!`);
            });
        });
    };

    const agendaItemsList = document.getElementById('agenda-items-list');

    const renderAgendaEvents = () => {
        if (!agendaItemsList) return;
        const events = agendaEventsByDay[currentSelectedDay] || [];
        const filteredEvents = currentActiveFilter === 'all' 
            ? events 
            : events.filter(e => e.type === currentActiveFilter);

        // Atualiza contadores nas pílulas de filtro
        const countAll = events.length;
        const pillAll = document.querySelector('.agenda-filter-pill[data-filter="all"]');
        if (pillAll) {
            pillAll.textContent = `Todos (${countAll})`;
        }

        if (filteredEvents.length === 0) {
            agendaItemsList.innerHTML = `
                <div class="text-center py-8 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div class="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                        📅
                    </div>
                    <h4 class="text-xs font-bold text-slate-800">Nenhum compromisso agendado</h4>
                    <p class="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
                        ${currentActiveFilter === 'all' ? 'Não há chegadas de itens, prazos de cotação ou reuniões para este dia.' : 'Não há compromissos nesta categoria para este dia.'}
                    </p>
                    <button type="button" class="btn-quick-add-agenda mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer">
                        + Adicionar Item Neste Dia
                    </button>
                </div>
            `;
            const btnQuick = agendaItemsList.querySelector('.btn-quick-add-agenda');
            if (btnQuick) {
                btnQuick.addEventListener('click', openAgendaModal);
            }
            return;
        }

        agendaItemsList.innerHTML = filteredEvents.map(evt => {
            const typeConfig = getAgendaTypeConfig(evt.type);
            return `
                <div class="agenda-card bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs border-l-[5px] ${typeConfig.border} flex flex-col justify-between space-y-2 hover:shadow-sm transition-all" data-type="${evt.type}">
                    <div class="flex items-start justify-between gap-2">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${typeConfig.badgeBg} border">
                                    ${typeConfig.badgeText}
                                </span>
                                <span class="text-[11px] font-bold text-slate-800">${escapeHtml(evt.time)}</span>
                            </div>
                            <h4 class="text-xs font-bold text-slate-900 leading-snug">
                                ${escapeHtml(evt.title)}
                            </h4>
                            <p class="text-[11px] text-slate-500 leading-relaxed">
                                ${evt.supplier ? `<strong class="text-slate-700">${escapeHtml(evt.supplier)}:</strong> ` : ''}${escapeHtml(evt.details)}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10.5px]">
                        <span class="${evt.metaClass || 'font-medium text-slate-400'}">
                            ${evt.metaText || 'Agendado'}
                        </span>
                        <button type="button" class="btn-check-agenda font-bold ${evt.actionColor || typeConfig.actionColor} hover:opacity-80 cursor-pointer">
                            ${evt.actionText || typeConfig.actionText}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        setupAgendaCardActions(agendaItemsList);
    };

    const selectAgendaDay = (dayStr) => {
        currentSelectedDay = dayStr;

        // Atualiza botões da barra semanal
        agendaDayBtns.forEach(btn => {
            const day = btn.getAttribute('data-day');
            const dayNumberEl = btn.querySelector('span:nth-child(2)');
            const dayNameEl = btn.querySelector('span:first-child');

            if (day === dayStr) {
                btn.classList.add('active', 'bg-blue-50/70', 'border', 'border-blue-200/80');
                if (dayNumberEl) {
                    dayNumberEl.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold bg-blue-600 text-white shadow-xs';
                }
                if (dayNameEl) {
                    dayNameEl.classList.add('text-blue-700');
                    dayNameEl.classList.remove('text-slate-400');
                }
            } else {
                btn.classList.remove('active', 'bg-blue-50/70', 'border', 'border-blue-200/80');
                if (dayNumberEl) {
                    dayNumberEl.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ' + (['12', '13'].includes(day) ? 'text-slate-400' : 'text-slate-700');
                }
                if (dayNameEl) {
                    dayNameEl.classList.remove('text-blue-700');
                    dayNameEl.classList.add('text-slate-400');
                }
            }
        });

        // Atualiza botões da grade mensal expandida
        agendaMonthDayBtns.forEach(btn => {
            if (btn.hasAttribute('data-month')) return;
            const day = btn.getAttribute('data-day');
            const num = parseInt(day, 10);
            const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(num);

            if (day === dayStr) {
                btn.classList.add('bg-blue-600', 'text-white', 'font-extrabold', 'shadow-xs');
                btn.classList.remove('text-slate-700', 'text-slate-400', 'hover:bg-slate-100');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white', 'font-extrabold', 'shadow-xs');
                btn.classList.add('hover:bg-slate-100');
                if (isWeekend) {
                    btn.classList.add('text-slate-400');
                    btn.classList.remove('text-slate-700');
                } else {
                    btn.classList.add('text-slate-700');
                    btn.classList.remove('text-slate-400');
                }
            }
        });

        if (agendaSelectedDayLabel) {
            agendaSelectedDayLabel.textContent = getAgendaDateLabel(dayStr);
        }

        renderAgendaEvents();
    };

    agendaDayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.getAttribute('data-day');
            selectAgendaDay(day);
        });
    });

    agendaMonthDayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const monthType = btn.getAttribute('data-month');
            if (monthType === 'prev' || monthType === 'next') {
                showAgendaToast('Navegue pelo seletor de mês');
                return;
            }
            const day = btn.getAttribute('data-day');
            if (day) {
                selectAgendaDay(day);
                showAgendaToast(`Selecionado: ${getAgendaDateLabel(day)}`);
            }
        });
    });

    if (agendaTodayBtn) {
        agendaTodayBtn.addEventListener('click', () => {
            selectAgendaDay('10');
            showAgendaToast('Visualizando compromissos de hoje (10/09)');
        });
    }

    if (agendaJumpTomorrowBtn) {
        agendaJumpTomorrowBtn.addEventListener('click', () => {
            selectAgendaDay('11');
            showAgendaToast('Visualizando previsões para amanhã (11/09)');
        });
    }

    // Filtros de Tipo de Compromisso (Todos, Entregas, Cotações, Notas, Reuniões)
    const agendaFilterPills = document.querySelectorAll('.agenda-filter-pill');

    agendaFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const filterType = pill.getAttribute('data-filter');
            currentActiveFilter = filterType || 'all';

            agendaFilterPills.forEach(p => {
                p.classList.remove('active', 'bg-[#181d36]', 'text-white');
                p.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            pill.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            pill.classList.add('active', 'bg-[#181d36]', 'text-white');

            renderAgendaEvents();
        });
    });

    // Modal de Criação de Item na Agenda
    const btnOpenAgendaModal = document.getElementById('btn-open-agenda-modal');
    const btnCloseAgendaModal = document.getElementById('btn-close-agenda-modal');
    const modalAgendaItem = document.getElementById('modal-agenda-item');
    const formCreateAgendaItem = document.getElementById('form-create-agenda-item');

    const openAgendaModal = () => {
        if (!modalAgendaItem) return;
        modalAgendaItem.classList.remove('opacity-0', 'pointer-events-none');
        modalAgendaItem.classList.add('opacity-100', 'pointer-events-auto');
        const content = modalAgendaItem.querySelector('div');
        if (content) content.classList.remove('translate-y-6');
    };

    const closeAgendaModal = () => {
        if (!modalAgendaItem) return;
        modalAgendaItem.classList.remove('opacity-100', 'pointer-events-auto');
        modalAgendaItem.classList.add('opacity-0', 'pointer-events-none');
        const content = modalAgendaItem.querySelector('div');
        if (content) content.classList.add('translate-y-6');
    };

    if (btnOpenAgendaModal) btnOpenAgendaModal.addEventListener('click', openAgendaModal);
    if (btnCloseAgendaModal) btnCloseAgendaModal.addEventListener('click', closeAgendaModal);
    if (modalAgendaItem) {
        modalAgendaItem.addEventListener('click', (e) => {
            if (e.target === modalAgendaItem) closeAgendaModal();
        });
    }

    if (formCreateAgendaItem) {
        formCreateAgendaItem.addEventListener('submit', (e) => {
            e.preventDefault();
            const typeSelect = document.getElementById('agenda-item-type');
            const titleInput = document.getElementById('agenda-item-title');
            const timeInput = document.getElementById('agenda-item-time');
            const supplierInput = document.getElementById('agenda-item-supplier');
            const detailsInput = document.getElementById('agenda-item-details');

            const type = typeSelect ? typeSelect.value : 'note';
            const title = titleInput ? titleInput.value.trim() : '';
            const time = timeInput ? timeInput.value.trim() : 'O dia todo';
            const supplier = supplierInput ? supplierInput.value.trim() : '';
            const details = detailsInput ? detailsInput.value.trim() : '';

            if (!title || !details) return;

            const newItem = {
                id: `evt-${currentSelectedDay}-${Date.now()}`,
                type: type,
                time: time,
                title: title,
                supplier: supplier,
                details: details,
                metaText: 'Novo agendamento',
                metaClass: 'font-medium text-slate-400'
            };

            if (!agendaEventsByDay[currentSelectedDay]) {
                agendaEventsByDay[currentSelectedDay] = [];
            }
            agendaEventsByDay[currentSelectedDay].unshift(newItem);

            renderAgendaEvents();

            formCreateAgendaItem.reset();
            closeAgendaModal();
            showAgendaToast(`"${title}" adicionado à sua agenda!`);
        });
    }

    // Inicializa os cards da agenda no dia 10
    renderAgendaEvents();

    // 8. Tela de Notificações (Central de Alertas e Cotações Limpa e Fácil)
    const btnNotifications = document.getElementById('btn-notifications');
    const viewNotifications = document.getElementById('view-notifications');
    const notifBackBtn = document.getElementById('notif-back-btn');
    const notifToast = document.getElementById('notif-toast');
    const notifToastText = document.getElementById('notif-toast-text');
    const notifBadge = document.getElementById('notif-badge');
    const notifUnreadCountPill = document.getElementById('notif-unread-count-pill');
    const btnMarkAllRead = document.getElementById('btn-mark-all-read');
    const btnClearReadNotifs = document.getElementById('btn-clear-read-notifs');
    const notifFilterPills = document.querySelectorAll('.notif-filter-pill');
    const notifItemsList = document.getElementById('notif-items-list');
    const notifEmptyState = document.getElementById('notif-empty-state');
    const btnNotifEmptyHome = document.getElementById('btn-notif-empty-home');

    let notifToastTimer = null;
    const showNotifToast = (message) => {
        if (!notifToast || !notifToastText) return;
        if (notifToastTimer) clearTimeout(notifToastTimer);
        notifToastText.textContent = message;
        notifToast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
        notifToast.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        notifToastTimer = setTimeout(() => {
            notifToast.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
            notifToast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
        }, 2600);
    };

    const openNotifications = () => {
        if (!viewNotifications) return;
        viewNotifications.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
        viewNotifications.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }
    };

    const closeNotifications = () => {
        if (!viewNotifications) return;
        viewNotifications.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        viewNotifications.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }
    };

    if (btnNotifications) {
        btnNotifications.addEventListener('click', openNotifications);
    }
    if (notifBackBtn) {
        notifBackBtn.addEventListener('click', closeNotifications);
    }
    if (btnNotifEmptyHome) {
        btnNotifEmptyHome.addEventListener('click', closeNotifications);
    }

    // Filtros de Notificações
    let currentNotifFilter = 'all';

    const applyNotifFilter = () => {
        const cards = document.querySelectorAll('.notif-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const type = card.getAttribute('data-type');
            const isRead = card.getAttribute('data-read') === 'true';

            let show = false;
            if (currentNotifFilter === 'all') {
                show = true;
            } else if (currentNotifFilter === 'unread') {
                show = !isRead;
            } else if (currentNotifFilter === type) {
                show = true;
            }

            if (show) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Mostra ou esconde estado vazio
        if (notifEmptyState) {
            if (visibleCount === 0) {
                notifEmptyState.classList.remove('hidden');
            } else {
                notifEmptyState.classList.add('hidden');
            }
        }
    };

    // Atualização dos Contadores de Notificações Não Lidas e Totais
    const updateNotifCounters = () => {
        const cards = document.querySelectorAll('.notif-card');
        const unreadCards = Array.from(cards).filter(card => card.getAttribute('data-read') === 'false');
        const unreadCount = unreadCards.length;
        const totalCount = cards.length;

        // Atualiza badge no header da Home
        if (notifBadge) {
            if (unreadCount > 0) {
                notifBadge.textContent = unreadCount.toString();
                notifBadge.classList.remove('hidden');
            } else {
                notifBadge.classList.add('hidden');
            }
        }

        // Atualiza pílula no header de Notificações
        if (notifUnreadCountPill) {
            notifUnreadCountPill.textContent = unreadCount > 0 ? `${unreadCount} novas` : '0 novas';
            if (unreadCount === 0) {
                notifUnreadCountPill.className = 'px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold';
            } else {
                notifUnreadCountPill.className = 'px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold';
            }
        }

        // Atualiza contadores nas pílulas de filtro
        const pillCountAll = document.getElementById('notif-pill-count-all');
        const pillCountUnread = document.getElementById('notif-pill-count-unread');
        if (pillCountAll) pillCountAll.textContent = totalCount.toString();
        if (pillCountUnread) pillCountUnread.textContent = unreadCount.toString();

        // Aplica o filtro ativo
        applyNotifFilter();
    };

    // Marcar Notificação Individual como Lida
    const markCardAsRead = (card) => {
        if (!card) return;
        card.setAttribute('data-read', 'true');
        card.classList.remove('border-blue-200/90', 'border-emerald-200/90', 'border-amber-200/90', 'ring-1', 'ring-blue-500/10', 'ring-emerald-500/10', 'ring-amber-500/10');
        card.classList.add('bg-white/70', 'border-slate-200/80', 'opacity-90');
        
        const dot = card.querySelector('.notif-unread-dot');
        if (dot) dot.classList.add('hidden');

        const readToggleBtn = card.querySelector('.btn-toggle-notif-read');
        if (readToggleBtn) {
            readToggleBtn.innerHTML = '<span class="text-slate-400 font-medium text-[10px]">✓ Lida</span>';
            readToggleBtn.classList.remove('cursor-pointer', 'hover:text-slate-700');
            readToggleBtn.disabled = true;
        }

        updateNotifCounters();
    };

    // Marcar Todas como Lidas
    if (btnMarkAllRead) {
        btnMarkAllRead.addEventListener('click', () => {
            const cards = document.querySelectorAll('.notif-card[data-read="false"]');
            cards.forEach(card => markCardAsRead(card));
            showNotifToast('Todas as notificações foram marcadas como lidas!');
        });
    }

    // Limpar Notificações Lidas
    if (btnClearReadNotifs) {
        btnClearReadNotifs.addEventListener('click', () => {
            const readCards = document.querySelectorAll('.notif-card[data-read="true"]');
            if (readCards.length === 0) {
                showNotifToast('Não há notificações lidas para limpar.');
                return;
            }
            readCards.forEach(card => card.remove());
            updateNotifCounters();
            showNotifToast('Notificações lidas removidas.');
        });
    }

    notifFilterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const filter = pill.getAttribute('data-filter') || 'all';
            currentNotifFilter = filter;

            notifFilterPills.forEach(p => {
                p.classList.remove('active', 'bg-[#181d36]', 'text-white');
                p.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            });
            pill.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
            pill.classList.add('active', 'bg-[#181d36]', 'text-white');

            applyNotifFilter();
        });
    });

    // Ações dos Cards de Notificação
    const setupNotifCardActions = () => {
        if (!notifItemsList) return;

        // Botão de marcar individual como lida
        notifItemsList.querySelectorAll('.btn-toggle-notif-read').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.notif-card');
                markCardAsRead(card);
                showNotifToast('Notificação marcada como lida.');
            });
        });

        // Botão de descartar/remover (X)
        notifItemsList.querySelectorAll('.btn-dismiss-notif').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.notif-card');
                if (card) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.remove();
                        updateNotifCounters();
                        showNotifToast('Notificação descartada.');
                    }, 200);
                }
            });
        });

        // Botão de ação: Ver na Agenda
        notifItemsList.querySelectorAll('.btn-notif-open-agenda').forEach(btn => {
            btn.addEventListener('click', () => {
                closeNotifications();
                const btnAgenda = document.getElementById('btn-agenda');
                if (btnAgenda) btnAgenda.click();
            });
        });

        // Botão de ação: Comprar no SuplyShop
        notifItemsList.querySelectorAll('.btn-notif-open-suplyshop').forEach(btn => {
            btn.addEventListener('click', () => {
                closeNotifications();
                const btnSuplyShop = document.getElementById('btn-suplyshop');
                if (btnSuplyShop) btnSuplyShop.click();
            });
        });

        // Botão de ação: Ver na Comunidade
        notifItemsList.querySelectorAll('.btn-notif-open-community').forEach(btn => {
            btn.addEventListener('click', () => {
                closeNotifications();
                const btnCommunity = document.getElementById('btn-community');
                if (btnCommunity) btnCommunity.click();
            });
        });

        // Botão de ação: Ver Integrações
        notifItemsList.querySelectorAll('.btn-notif-open-integrations').forEach(btn => {
            btn.addEventListener('click', () => {
                closeNotifications();
                const btnIntegrations = document.getElementById('btn-integrations');
                if (btnIntegrations) btnIntegrations.click();
            });
        });

        // Botão de ação: Comparar Proposta
        notifItemsList.querySelectorAll('.btn-notif-quote-compare').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.notif-card');
                markCardAsRead(card);
                showNotifToast('Proposta RFQ #1042: R$ 142.500,00 enviada para comparativo.');
            });
        });
    };

    setupNotifCardActions();
    updateNotifCounters();

    // ==========================================
    // 10. TELA DE ABERTURA & AUTENTICAÇÃO (LOGIN / CADASTRO)
    // ==========================================
    const viewAuth = document.getElementById('view-auth');
    const tabBtnLogin = document.getElementById('tab-btn-login');
    const tabBtnRegister = document.getElementById('tab-btn-register');
    const formAuthLogin = document.getElementById('form-auth-login');
    const formAuthRegister = document.getElementById('form-auth-register');
    const btnQuickAccess = document.getElementById('btn-quick-access');
    const btnProfileLogout = document.getElementById('btn-profile-logout');
    const btnSwitchToLogin = document.getElementById('btn-switch-to-login');
    const btnToggleLoginPwd = document.getElementById('btn-toggle-login-pwd');
    const btnToggleRegPwd = document.getElementById('btn-toggle-reg-pwd');
    const loginPasswordInput = document.getElementById('login-password');
    const regPasswordInput = document.getElementById('reg-password');
    const btnForgotPassword = document.getElementById('btn-forgot-password');
    const authToast = document.getElementById('auth-toast');
    const authToastMessage = document.getElementById('auth-toast-message');

    let isAuthScreenVisible = true;
    let authToastTimeout = null;

    const showAuthToast = (msg) => {
        if (!authToast || !authToastMessage) return;
        authToastMessage.textContent = msg;
        authToast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
        authToast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        if (authToastTimeout) clearTimeout(authToastTimeout);
        authToastTimeout = setTimeout(() => {
            authToast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            authToast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
        }, 3200);
    };

    const authSwitchText = document.getElementById('auth-switch-text');

    const updateFooterSwitch = (tab) => {
        if (!authSwitchText) return;
        if (tab === 'login') {
            authSwitchText.innerHTML = `Não tem uma conta corporativa? <button type="button" id="btn-switch-to-register" class="text-blue-400 font-semibold hover:underline cursor-pointer ml-1">Cadastre-se</button>`;
            document.getElementById('btn-switch-to-register')?.addEventListener('click', () => switchAuthTab('register'));
        } else {
            authSwitchText.innerHTML = `Já possui conta corporativa? <button type="button" id="btn-switch-to-login" class="text-blue-400 font-semibold hover:underline cursor-pointer ml-1">Entrar agora</button>`;
            document.getElementById('btn-switch-to-login')?.addEventListener('click', () => switchAuthTab('login'));
        }
    };

    const switchAuthTab = (tab) => {
        if (tab === 'login') {
            tabBtnLogin?.classList.add('text-white', 'border-blue-500', 'font-bold');
            tabBtnLogin?.classList.remove('text-slate-400', 'border-transparent', 'font-semibold');
            tabBtnRegister?.classList.remove('text-white', 'border-blue-500', 'font-bold');
            tabBtnRegister?.classList.add('text-slate-400', 'border-transparent', 'font-semibold');

            formAuthLogin?.classList.remove('hidden');
            formAuthRegister?.classList.add('hidden');
            updateFooterSwitch('login');
        } else {
            tabBtnRegister?.classList.add('text-white', 'border-blue-500', 'font-bold');
            tabBtnRegister?.classList.remove('text-slate-400', 'border-transparent', 'font-semibold');
            tabBtnLogin?.classList.remove('text-white', 'border-blue-500', 'font-bold');
            tabBtnLogin?.classList.add('text-slate-400', 'border-transparent', 'font-semibold');

            formAuthRegister?.classList.remove('hidden');
            formAuthLogin?.classList.add('hidden');
            updateFooterSwitch('register');
        }
    };

    if (tabBtnLogin) tabBtnLogin.addEventListener('click', () => switchAuthTab('login'));
    if (tabBtnRegister) tabBtnRegister.addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('btn-switch-to-register')?.addEventListener('click', () => switchAuthTab('register'));

    // Alternar visibilidade de senha
    const togglePasswordVisibility = (input, button) => {
        if (!input || !button) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const eyeOpen = button.querySelector('.icon-eye-open');
        const eyeClosed = button.querySelector('.icon-eye-closed');
        if (eyeOpen && eyeClosed) {
            if (isPassword) {
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        }
    };

    if (btnToggleLoginPwd) {
        btnToggleLoginPwd.addEventListener('click', () => togglePasswordVisibility(loginPasswordInput, btnToggleLoginPwd));
    }
    if (btnToggleRegPwd) {
        btnToggleRegPwd.addEventListener('click', () => togglePasswordVisibility(regPasswordInput, btnToggleRegPwd));
    }

    // Esqueci a senha
    if (btnForgotPassword) {
        btnForgotPassword.addEventListener('click', () => {
            const emailInput = document.getElementById('login-email');
            const emailVal = emailInput ? emailInput.value.trim() : '';
            if (emailVal) {
                showAuthToast(`Link de redefinição enviado para: ${emailVal}`);
            } else {
                showAuthToast('Informe seu e-mail corporativo para redefinir sua senha.');
                emailInput?.focus();
            }
        });
    }

    // Entrar na aplicação (Transição suave)
    const enterApp = () => {
        if (!viewAuth) return;
        isAuthScreenVisible = false;

        // Animação de saída da tela de abertura
        viewAuth.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
        viewAuth.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');

        // Exibe o bottom navigation
        if (mainBottomNav) {
            mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
        }

        // Garante que está na Home
        goToHome();
    };

    // Logout da aplicação
    const logoutApp = () => {
        if (!viewAuth) return;
        isAuthScreenVisible = true;

        // Oculta o bottom navigation
        if (mainBottomNav) {
            mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
        }

        // Volta para a Home
        goToHome();

        // Animação de entrada da tela de abertura
        viewAuth.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
        viewAuth.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        showAuthToast('Você saiu da conta corporativa com sucesso.');
    };

    // Submissão Login (temporariamente desativada)
    if (formAuthLogin) {
        formAuthLogin.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    // Submissão Cadastro
    if (formAuthRegister) {
        formAuthRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const regSubmitBtn = document.getElementById('btn-register-submit');
            const regSubmitBtnText = document.getElementById('btn-register-submit-text');
            if (regSubmitBtn) regSubmitBtn.disabled = true;
            if (regSubmitBtnText) regSubmitBtnText.textContent = 'Criando conta...';

            setTimeout(() => {
                if (regSubmitBtn) regSubmitBtn.disabled = false;
                if (regSubmitBtnText) regSubmitBtnText.textContent = 'Criar Conta e Acessar';
                enterApp();
            }, 600);
        });
    }

    // Acesso Rápido de Demonstração
    if (btnQuickAccess) {
        btnQuickAccess.addEventListener('click', () => {
            enterApp();
        });
    }

    // SSO buttons (Google, Corporativo)
    const btnSsoGoogle = document.getElementById('btn-sso-google');
    const btnSsoCorp = document.getElementById('btn-sso-corp');

    if (btnSsoGoogle) {
        btnSsoGoogle.addEventListener('click', () => {
            enterApp();
        });
    }

    if (btnSsoCorp) {
        btnSsoCorp.addEventListener('click', () => {
            enterApp();
        });
    }

    // Botão de Logout no Perfil
    if (btnProfileLogout) {
        btnProfileLogout.addEventListener('click', logoutApp);
    }
});
