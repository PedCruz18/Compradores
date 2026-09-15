export const initAuthActions = ({ goToHome } = {}) => {
    const mainBottomNav = document.getElementById("main-bottom-nav");
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
};
