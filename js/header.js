// Mobile header toggle injected script
(function(){
  const header = document.querySelector('header');
  if (!header) return;

  // Create toggle button
  const btn = document.createElement('button');
  btn.className = 'mobile-toggle';
  btn.setAttribute('aria-label', 'Abrir menu');
  btn.innerHTML = '<span class="hamburger"></span>';

  // Insert button before nav
  const nav = header.querySelector('nav');
  header.insertBefore(btn, nav);

  function closeMenu() { header.classList.remove('mobile-open'); }
  function openMenu() { header.classList.add('mobile-open'); }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    header.classList.toggle('mobile-open');
  });

  // Close when clicking a link
  header.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && a.getAttribute('href') && !a.classList.contains('dropbtn')) {
      // allow navigation but close mobile menu
      closeMenu();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) closeMenu();
  });
})();

// Garantir que o link de volta (`.back-home`) esteja como filho direto do body
// assim `position: fixed` na imagem funciona corretamente mesmo se houver
// ancestrais com transform/overflow que afetem o posicionamento.
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const back = document.querySelector('.back-home');
      if (!back) return;
      if (back.parentElement !== document.body) {
        document.body.appendChild(back);
      }
      // Acessibilidade mínima
      back.setAttribute('aria-label', back.getAttribute('aria-label') || 'Voltar para a página inicial');
      back.title = back.title || 'Voltar para a página inicial';
      // Garantir z-index alto para ficar acima de outros elementos
      back.style.zIndex = back.style.zIndex || '10010';
    } catch (err) {
      console.warn('Erro ao mover .back-home para body', err);
    }
  });
})();

// Injeta CSS para garantir que a imagem fique fixa em todas as páginas
(function(){
  if (typeof document === 'undefined') return;
  if (document.getElementById('back-home-styles')) return;
  const css = `
    .back-home{ position: static !important; }
    .back-home img{
      position: fixed !important;
      top: calc(env(safe-area-inset-top, 0px) + 10px) !important;
      left: 10px !important;
      width: 48px !important;
      height: 48px !important;
      border-radius: 8px !important;
      background: rgba(5,8,22,0.95) !important;
      padding: 6px !important;
      box-shadow: 0 6px 18px rgba(2,6,23,0.6) !important;
      transition: none !important;
      opacity: 1 !important;
      z-index: 10010 !important;
      -webkit-tap-highlight-color: transparent !important;
      object-fit: contain !important;
      display: block !important;
      pointer-events: auto !important;
    }
  `;
  const s = document.createElement('style');
  s.id = 'back-home-styles';
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
})();
