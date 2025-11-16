let allIcons = { static: {}, animated: [] }, filteredIcons = { static: {}, animated: [] }, currentFilter = 'all', searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/api/icons'), data = await res.json();
    for (const c in data.static) allIcons.static[c] = data.static[c].map(f => ({ name: f.replace('.png', ''), path: `/static/${c}/${f}`, category: c, type: 'static' }));
    allIcons.animated = data.animated.map(f => ({ name: f.replace('.gif', ''), path: `/animated/${f}`, category: 'animated', type: 'animated' }));
    filteredIcons = JSON.parse(JSON.stringify(allIcons));
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('iconsContainer').classList.remove('hidden');
    renderIcons(); setupEvents(); updateCategoriesNav();
});

function setupEvents() {
    document.getElementById('searchInput').oninput = e => { searchQuery = e.target.value.toLowerCase(); filterIcons(); }
    document.getElementById('filterStatic').onclick = () => { currentFilter = 'static'; filterIcons(); }
    document.getElementById('filterAnimated').onclick = () => { currentFilter = 'animated'; filterIcons(); }
    document.getElementById('filterAll').onclick = () => { currentFilter = 'all'; filterIcons(); }
    document.getElementById('closeModal').onclick = closeModal;
    document.getElementById('iconModal').onclick = e => { if (e.target.id === 'iconModal') closeModal(); }
    document.getElementById('copyPathBtn').onclick = () => copyToClipboard(document.getElementById('modalPath').value);
    document.getElementById('downloadIconBtn').onclick = () => downloadIcon(document.getElementById('modalPath').value, document.getElementById('modalTitle').textContent);
    document.onkeydown = e => { if (e.key === 'Escape') closeModal(); }
}

function filterIcons() {
    filteredIcons = { static: {}, animated: [] };
    for (const c in allIcons.static) filteredIcons.static[c] = allIcons.static[c].filter(i => (currentFilter === 'all' || currentFilter === 'static') && (!searchQuery || i.name.includes(searchQuery) || c.includes(searchQuery)));
    filteredIcons.animated = allIcons.animated.filter(i => (currentFilter === 'all' || currentFilter === 'animated') && (!searchQuery || i.name.includes(searchQuery)));
    renderIcons(); updateCategoriesNav();
}

function renderIcons() {
    const sG = document.getElementById('staticIconsGrid'), aG = document.getElementById('animatedIconsGrid');
    sG.innerHTML = ''; aG.innerHTML = '';
    for (const c in filteredIcons.static) filteredIcons.static[c].forEach(i => sG.appendChild(createCard(i)));
    filteredIcons.animated.forEach(i => aG.appendChild(createCard(i)));
    document.getElementById('staticIconsSection').classList.toggle('hidden', currentFilter === 'animated');
    document.getElementById('animatedIconsSection').classList.toggle('hidden', currentFilter === 'static');
    const total = Object.values(filteredIcons.static).flat().length + filteredIcons.animated.length;
    document.getElementById('emptyState').classList.toggle('hidden', total > 0);
    document.getElementById('staticCount').textContent = `(${Object.values(filteredIcons.static).flat().length})`;
    document.getElementById('animatedCount').textContent = `(${filteredIcons.animated.length})`;
    document.getElementById('iconCount').textContent = total;
}

function createCard(i) {
    const c = document.createElement('div'); c.className = 'icon-card bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20 cursor-pointer group';
    c.onclick = () => openModal(i);
    c.innerHTML = `<img src="${i.path}" alt="${i.name}" class="w-full h-16 object-contain mb-2 transition-transform group-hover:scale-110">
                 <div class="text-xs text-gray-400 truncate text-center group-hover:text-white transition-colors">${i.name}</div>
                 <div class="text-xs text-purple-400/70 text-center mt-1">${i.category}</div>`;
    return c;
}

function updateCategoriesNav() {
    const nav = document.getElementById('categoriesNav'); nav.innerHTML = '';
    Object.keys(filteredIcons.static).filter(c => filteredIcons.static[c].length > 0).forEach(c => {
        const b = document.createElement('button');
        b.className = 'category-badge px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded-full text-sm border border-purple-500/30';
        b.textContent = c; b.onclick = () => document.getElementById('staticIconsSection').scrollIntoView({ behavior: 'smooth' });
        nav.appendChild(b);
    });
}

function openModal(i) {
    document.getElementById('modalTitle').textContent = i.name;
    document.getElementById('modalImage').src = i.path;
    document.getElementById('modalPath').value = i.path;
    document.getElementById('modalCategory').textContent = i.category;
    const m = document.getElementById('iconModal'); m.classList.remove('hidden'); m.classList.add('flex'); document.body.style.overflow = 'hidden';
}

function closeModal() { const m = document.getElementById('iconModal'); m.classList.add('hidden'); m.classList.remove('flex'); document.body.style.overflow = ''; }

async function copyToClipboard(t) { try { await navigator.clipboard.writeText(t); showCopyNotification(); } catch { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showCopyNotification(); } }
function showCopyNotification() { const n = document.getElementById('copyNotification'); n.classList.remove('hidden'); setTimeout(() => n.classList.add('hidden'), 2000); }
function downloadIcon(url, name) { const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
