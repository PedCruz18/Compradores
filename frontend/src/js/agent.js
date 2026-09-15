export const initAgentActions = () => {
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
	let currentInputMode = 'voice';
	let animationFrameId = null;
	let grains = [];
	const GRAIN_COUNT = 220;

	const initGrains = (width, height) => {
		grains = [];
		const blueColors = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#38bdf8', '#93c5fd'];
		for (let i = 0; i < GRAIN_COUNT; i++) {
			grains.push({
				x: Math.random() * width,
				y: height * 0.25 + Math.random() * (height * 0.75),
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

		grains.forEach((grain) => {
			grain.x += grain.speedX * (isSpeaking ? 1.5 : 1.0);
			grain.phase += grain.waveSpeed * (isSpeaking ? 2.0 : 1.0);
			const oscillation = Math.sin(currentSeconds * 2.5 + grain.phase) * (grain.waveAmp * intensity);
			const drawY = grain.y + oscillation;
			grain.y += grain.speedY * intensity;

			if (grain.y < height * 0.15 || grain.x < -10 || grain.x > width + 10) {
				grain.x = Math.random() * width;
				grain.y = height + 5;
				grain.phase = Math.random() * Math.PI * 2;
			}

			ctx.save();
			ctx.globalAlpha = isSpeaking ? Math.min(1.0, grain.alpha * 1.3) : grain.alpha;
			ctx.fillStyle = grain.color;
			ctx.shadowColor = grain.color;
			ctx.shadowBlur = isSpeaking ? 8 : 4;
			ctx.beginPath();
			ctx.arc(grain.x, drawY, isSpeaking ? grain.radius * 1.2 : grain.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		});

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
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(dpr, dpr);
		}
		if (grains.length === 0) initGrains(width, height);
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

	const toggleSpeaking = (forceState) => {
		isSpeaking = typeof forceState === 'boolean' ? forceState : !isSpeaking;
		if (!agentSpeakBtn || !agentSpeakText || !agentSpeakSubtext) return;
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
	};

	const setInputMode = (mode) => {
		currentInputMode = mode;
		if (mode === 'text') {
			if (isSpeaking) toggleSpeaking(false);
			agentVoiceContainer?.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
			agentVoiceContainer?.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
			agentTextContainer?.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
			agentTextContainer?.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
			iconModeKeyboard?.classList.remove('opacity-100', 'scale-100');
			iconModeKeyboard?.classList.add('opacity-0', 'scale-75', 'pointer-events-none');
			iconModeMic?.classList.remove('opacity-0', 'scale-75', 'pointer-events-none');
			iconModeMic?.classList.add('opacity-100', 'scale-100');
			agentModeToggleBtn?.setAttribute('aria-label', 'Alternar para Voz');
			agentModeToggleBtn?.setAttribute('title', 'Alternar para Voz');
			if (agentCenterHint) {
				agentCenterHint.classList.add('opacity-0');
				setTimeout(() => {
					agentCenterHint.textContent = 'Digite sua instrução ou pergunta abaixo';
					agentCenterHint.classList.remove('opacity-0');
				}, 150);
			}
			setTimeout(() => {
				if (currentInputMode === 'text') stopGrainsAnimation();
			}, 350);
			setTimeout(() => agentTextInput?.focus(), 250);
			return;
		}

		startGrainsAnimation();
		agentTextContainer?.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
		agentTextContainer?.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
		agentVoiceContainer?.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
		agentVoiceContainer?.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
		iconModeMic?.classList.remove('opacity-100', 'scale-100');
		iconModeMic?.classList.add('opacity-0', 'scale-75', 'pointer-events-none');
		iconModeKeyboard?.classList.remove('opacity-0', 'scale-75', 'pointer-events-none');
		iconModeKeyboard?.classList.add('opacity-100', 'scale-100');
		agentModeToggleBtn?.setAttribute('aria-label', 'Alternar para Teclado');
		agentModeToggleBtn?.setAttribute('title', 'Alternar para Teclado');
		if (agentCenterHint) {
			agentCenterHint.classList.add('opacity-0');
			setTimeout(() => {
				agentCenterHint.textContent = 'Toque no botão abaixo e fale suas instruções diretamente';
				agentCenterHint.classList.remove('opacity-0');
			}, 150);
		}
	};

	const openAgentInstructions = () => {
		if (!viewAgentInstructions) return;
		isAgentViewOpen = true;
		viewAgentInstructions.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
		viewAgentInstructions.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
		mainBottomNav?.classList.add('translate-y-full', 'pointer-events-none');
		if (currentInputMode === 'voice') startGrainsAnimation();
		else setTimeout(() => agentTextInput?.focus(), 250);
	};

	const closeAgentInstructions = () => {
		if (!viewAgentInstructions) return;
		isAgentViewOpen = false;
		viewAgentInstructions.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
		viewAgentInstructions.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
		mainBottomNav?.classList.remove('translate-y-full', 'pointer-events-none');
		stopGrainsAnimation();
		if (isSpeaking) toggleSpeaking(false);
	};

	const resetTextInput = () => {
		if (agentTextInput) {
			agentTextInput.value = '';
			agentTextInput.style.height = 'auto';
		}
		if (agentSendBtn) {
			agentSendBtn.disabled = true;
			agentSendBtn.classList.remove('bg-[#181d36]', 'text-white', 'hover:bg-blue-600', 'cursor-pointer');
			agentSendBtn.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
		}
	};

	const sendTextMessage = () => {
		if (!agentTextInput?.value.trim()) return;
		resetTextInput();
	};

	agentTextInput?.addEventListener('input', () => {
		const hasText = agentTextInput.value.trim().length > 0;
		if (agentSendBtn) {
			agentSendBtn.disabled = !hasText;
			agentSendBtn.classList.toggle('bg-slate-200', !hasText);
			agentSendBtn.classList.toggle('text-slate-400', !hasText);
			agentSendBtn.classList.toggle('cursor-not-allowed', !hasText);
			agentSendBtn.classList.toggle('bg-[#181d36]', hasText);
			agentSendBtn.classList.toggle('text-white', hasText);
			agentSendBtn.classList.toggle('hover:bg-blue-600', hasText);
			agentSendBtn.classList.toggle('cursor-pointer', hasText);
		}
		agentTextInput.style.height = 'auto';
		agentTextInput.style.height = `${Math.min(agentTextInput.scrollHeight, 112)}px`;
	});
	agentTextInput?.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (!agentSendBtn?.disabled) sendTextMessage();
		}
	});
	agentSendBtn?.addEventListener('click', sendTextMessage);
	btnAgentInstructions?.addEventListener('click', openAgentInstructions);
	agentBackBtn?.addEventListener('click', closeAgentInstructions);
	agentNewChatBtn?.addEventListener('click', () => {
		if (isSpeaking) toggleSpeaking(false);
		resetTextInput();
	});
	agentModeToggleBtn?.addEventListener('click', () => setInputMode(currentInputMode === 'voice' ? 'text' : 'voice'));
	agentHistoryBtn?.addEventListener('click', () => {});
	agentSpeakBtn?.addEventListener('click', () => toggleSpeaking());
	window.addEventListener('resize', () => {
		if (isAgentViewOpen && currentInputMode === 'voice') resizeCanvas();
	});
};
