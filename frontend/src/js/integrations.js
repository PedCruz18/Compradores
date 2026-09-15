export const initIntegrationsActions = (options = {}) => {
    const mainBottomNav = document.getElementById('main-bottom-nav');
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


};

