import { escapeHtml } from './utils.js';

export const initAgendaActions = (options = {}) => {
    const mainBottomNav = document.getElementById('main-bottom-nav');
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


};

