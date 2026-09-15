export const initNotificationsActions = (options = {}) => {
    const mainBottomNav = document.getElementById('main-bottom-nav');
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


};

