export const initCommunityActions = (options = {}) => {
    const mainBottomNav = document.getElementById('main-bottom-nav');
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


};

