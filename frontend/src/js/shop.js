import { escapeHtml } from './utils.js';

export const initSuplyShopActions = (options = {}) => {
    const mainBottomNav = document.getElementById('main-bottom-nav');
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


};

