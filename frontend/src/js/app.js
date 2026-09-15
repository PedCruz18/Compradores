import { initHomeActions } from './home.js';
import { initAgentActions } from './agent.js';
import { initIntegrationsActions } from './integrations.js';
import { initCommunityActions } from './community.js';
import { initSuplyShopActions } from './shop.js';
import { initAgendaActions } from './agenda.js';
import { initNotificationsActions } from './notifications.js';
import { initAuthActions } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const { goToHome } = initHomeActions();
    initAgentActions();
    initIntegrationsActions();
    initCommunityActions();
    initSuplyShopActions();
    initAgendaActions();
    initNotificationsActions();
    initAuthActions({ goToHome });
});
