// ==========================================
// CONFIGURAÇÃO E INTEGRAÇÃO DE AUTENTICAÇÃO E PERFIL
// ==========================================

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (window.location.port === '5173' ? '/api' : 'http://localhost:3000/api')
  : '/api';

export const initAuthActions = ({ goToHome } = {}) => {
  const mainBottomNav = document.getElementById("main-bottom-nav");

  // Elementos de View e Tabs
  const viewAuth = document.getElementById('view-auth');
  const tabBtnLogin = document.getElementById('tab-btn-login');
  const tabBtnRegister = document.getElementById('tab-btn-register');
  const formAuthLogin = document.getElementById('form-auth-login');
  const formAuthRegister = document.getElementById('form-auth-register');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const btnLoginSubmitText = document.getElementById('btn-login-submit-text');
  const btnRegisterSubmit = document.getElementById('btn-register-submit');
  const btnRegisterSubmitText = document.getElementById('btn-register-submit-text');
  const btnQuickAccess = document.getElementById('btn-quick-access');
  const btnProfileLogout = document.getElementById('btn-profile-logout');
  const btnToggleLoginPwd = document.getElementById('btn-toggle-login-pwd');
  const btnToggleRegPwd = document.getElementById('btn-toggle-reg-pwd');
  const loginEmailInput = document.getElementById('login-email');
  const loginPasswordInput = document.getElementById('login-password');
  const regNameInput = document.getElementById('reg-name');
  const regEmailInput = document.getElementById('reg-email');
  const regCompanyInput = document.getElementById('reg-company');
  const regPasswordInput = document.getElementById('reg-password');
  const btnForgotPassword = document.getElementById('btn-forgot-password');
  const authToast = document.getElementById('auth-toast');
  const authToastMessage = document.getElementById('auth-toast-message');
  const authSwitchText = document.getElementById('auth-switch-text');

  // Elementos do Perfil
  const profileUserName = document.getElementById('profile-user-name');
  const profileUserRole = document.getElementById('profile-user-role');
  const profileUserEmail = document.getElementById('profile-user-email');
  const profileUserPhone = document.getElementById('profile-user-phone');
  const profileUserCompany = document.getElementById('profile-user-company');
  const btnEditProfileHeader = document.getElementById('btn-edit-profile-header');
  const btnEditProfileLink = document.getElementById('btn-edit-profile-link');

  let authToastTimeout = null;

  // Feedback visual via Toast
  const showAuthToast = (msg, duration = 3500) => {
    if (!authToast || !authToastMessage) return;
    authToastMessage.textContent = msg;
    authToast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
    authToast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    if (authToastTimeout) clearTimeout(authToastTimeout);
    authToastTimeout = setTimeout(() => {
      authToast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      authToast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
    }, duration);
  };

  // Gerenciamento de Sessão Local
  const getStoredUser = () => {
    try {
      const data = localStorage.getItem('compradores_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const setStoredUser = (user, token) => {
    try {
      localStorage.setItem('compradores_user', JSON.stringify(user));
      if (token) localStorage.setItem('compradores_token', token);
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  };

  const clearStoredUser = () => {
    try {
      localStorage.removeItem('compradores_user');
      localStorage.removeItem('compradores_token');
    } catch (e) {
      console.error('Erro ao limpar localStorage:', e);
    }
  };

  // Atualiza as informações exibidas na tela de Perfil
  const updateProfileUI = (user) => {
    if (!user) return;
    if (profileUserName && user.name) profileUserName.textContent = user.name;
    if (profileUserRole) profileUserRole.textContent = user.role || 'Comprador Master & Suprimentos';
    if (profileUserEmail && user.email) profileUserEmail.textContent = user.email;
    if (profileUserPhone) profileUserPhone.textContent = user.phone || '+55 (11) 98765-4321';
    if (profileUserCompany) {
      profileUserCompany.textContent = user.company
        ? `${user.company}`
        : 'Empresa Corporativa';
    }
  };

  // Sincronizar dados do perfil com o backend
  const refreshUserProfile = async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me?id=${userId}`);
      if (res.ok) {
        const freshUser = await res.json();
        setStoredUser(freshUser);
        updateProfileUI(freshUser);
      }
    } catch (err) {
      console.warn('Não foi possível sincronizar o perfil com o servidor:', err);
    }
  };

  // Alternar texto do rodapé entre login e cadastro
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

  // Alternar entre abas Login e Cadastro
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
      const emailVal = loginEmailInput ? loginEmailInput.value.trim() : '';
      if (emailVal) {
        showAuthToast(`Link de redefinição enviado para: ${emailVal}`);
      } else {
        showAuthToast('Informe seu e-mail corporativo para redefinir sua senha.');
        loginEmailInput?.focus();
      }
    });
  }

  // Transição suave para entrar na aplicação
  const enterApp = () => {
    if (!viewAuth) return;

    viewAuth.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
    viewAuth.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');

    if (mainBottomNav) {
      mainBottomNav.classList.remove('translate-y-full', 'pointer-events-none');
    }

    if (typeof goToHome === 'function') {
      goToHome();
    }
  };

  // Logout da aplicação
  const logoutApp = () => {
    clearStoredUser();

    if (!viewAuth) return;

    if (mainBottomNav) {
      mainBottomNav.classList.add('translate-y-full', 'pointer-events-none');
    }

    if (typeof goToHome === 'function') {
      goToHome();
    }

    viewAuth.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
    viewAuth.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

    showAuthToast('Você saiu da conta corporativa com sucesso.');
  };

  // ==========================================
  // INTEGRAÇÃO: LOGIN COM BACKEND
  // ==========================================
  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    const email = loginEmailInput?.value.trim();
    const password = loginPasswordInput?.value;

    if (!email || !password) {
      showAuthToast('Por favor, preencha o e-mail e a senha.');
      return;
    }

    // Estado visual de carregamento
    if (btnLoginSubmit) btnLoginSubmit.disabled = true;
    if (btnLoginSubmitText) btnLoginSubmitText.textContent = 'Autenticando...';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthToast(data.error || 'Credenciais inválidas.');
        return;
      }

      // Sucesso na autenticação
      setStoredUser(data.user, data.token);
      updateProfileUI(data.user);
      showAuthToast(`Bem-vindo de volta, ${data.user.name}!`);
      enterApp();
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      showAuthToast('Não foi possível conectar ao servidor backend (porta 3000).');
    } finally {
      if (btnLoginSubmit) btnLoginSubmit.disabled = false;
      if (btnLoginSubmitText) btnLoginSubmitText.textContent = 'Acessar Plataforma';
    }
  };

  if (formAuthLogin) {
    formAuthLogin.addEventListener('submit', handleLogin);
  }

  // ==========================================
  // INTEGRAÇÃO: CADASTRO COM BACKEND
  // ==========================================
  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    const name = regNameInput?.value.trim();
    const email = regEmailInput?.value.trim();
    const company = regCompanyInput?.value.trim();
    const password = regPasswordInput?.value;

    if (!name || !email || !password) {
      showAuthToast('Nome completo, e-mail e senha são obrigatórios.');
      return;
    }

    if (password.length < 4) {
      showAuthToast('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    // Estado visual de carregamento
    if (btnRegisterSubmit) btnRegisterSubmit.disabled = true;
    if (btnRegisterSubmitText) btnRegisterSubmitText.textContent = 'Criando conta...';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          password,
          role: 'Comprador Master',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthToast(data.error || 'Falha ao cadastrar usuário.');
        return;
      }

      // Sucesso no cadastro
      setStoredUser(data.user, data.token);
      updateProfileUI(data.user);
      showAuthToast(`Conta criada com sucesso! Bem-vindo, ${data.user.name}!`);
      enterApp();
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
      showAuthToast('Não foi possível conectar ao servidor backend (porta 3000).');
    } finally {
      if (btnRegisterSubmit) btnRegisterSubmit.disabled = false;
      if (btnRegisterSubmitText) btnRegisterSubmitText.textContent = 'Criar Conta e Acessar';
    }
  };

  if (formAuthRegister) {
    formAuthRegister.addEventListener('submit', handleRegister);
  }

  // ==========================================
  // INTEGRAÇÃO: EDIÇÃO DO PERFIL COM BACKEND
  // ==========================================
  const handleEditProfile = async () => {
    const user = getStoredUser();
    if (!user || !user.id) {
      showAuthToast('Faça login para editar seu perfil.');
      return;
    }

    const newName = prompt('Atualizar seu Nome Completo:', user.name || '');
    if (newName === null) return;

    const newCompany = prompt('Atualizar Empresa ou CNPJ:', user.company || '');
    if (newCompany === null) return;

    const newPhone = prompt('Atualizar Telefone / WhatsApp:', user.phone || '');
    if (newPhone === null) return;

    try {
      showAuthToast('Salvando alterações no perfil...');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: newName.trim() || user.name,
          company: newCompany.trim(),
          phone: newPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAuthToast(data.error || 'Erro ao atualizar perfil.');
        return;
      }

      setStoredUser(data.user);
      updateProfileUI(data.user);
      showAuthToast('Perfil corporativo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      showAuthToast('Erro de comunicação com o servidor.');
    }
  };

  if (btnEditProfileHeader) {
    btnEditProfileHeader.addEventListener('click', handleEditProfile);
  }
  if (btnEditProfileLink) {
    btnEditProfileLink.addEventListener('click', handleEditProfile);
  }

  // Acesso Rápido de Demonstração
  if (btnQuickAccess) {
    btnQuickAccess.addEventListener('click', () => {
      enterApp();
    });
  }

  // SSO buttons
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

  // ==========================================
  // INICIALIZAÇÃO: RESTAURAR DADOS DA CONTA
  // ==========================================
  const storedUser = getStoredUser();
  if (storedUser) {
    updateProfileUI(storedUser);
    if (loginEmailInput && storedUser.email) {
      loginEmailInput.value = storedUser.email;
    }
    // Sincronizar em segundo plano caso haja alterações no banco
    refreshUserProfile(storedUser.id);
  }
};
