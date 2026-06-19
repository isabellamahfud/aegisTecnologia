// Mobile header toggle injected script
(function(){
  const header = document.querySelector('header');
  const backHome = document.querySelector('.back-home');
  const headerLogo = document.querySelector('header .logo');
  const mobileLogoElements = [backHome, headerLogo].filter(Boolean);

  if (mobileLogoElements.length) {
    const style = document.createElement('style');
    style.textContent = `
      .back-home {
        display: block;
      }
      .back-home img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      @media (max-width: 900px) {
        .back-home {
          position: fixed !important;
          top: 12px;
          left: 12px;
          width: 44px;
          height: 44px;
          z-index: 9999;
          transition: opacity .25s ease, transform .25s ease, visibility .25s ease;
        }
        .back-home.hide-on-scroll,
        header .logo.hide-on-scroll {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          pointer-events: none;
        }
      }
    `;
    document.head.appendChild(style);

    const updateLogoHidden = () => {
      const hide = window.matchMedia('(max-width: 900px)').matches && window.scrollY > 10;
      mobileLogoElements.forEach((el) => el.classList.toggle('hide-on-scroll', hide));
    };

    updateLogoHidden();
    window.addEventListener('scroll', updateLogoHidden, { passive: true });
    window.addEventListener('resize', updateLogoHidden);
  }

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

// Injeta CSS para garantir que a imagem apareça apenas no topo e suma ao rolar
(function(){
  if (typeof document === 'undefined') return;
  if (document.getElementById('back-home-styles')) return;
  const css = `
    .back-home{
      position: fixed !important;
      top: calc(env(safe-area-inset-top, 10px)) !important;
      left: 10px !important;
      z-index: 10010 !important;
      opacity: 0.75 !important;
      transition: opacity 0.2s ease, transform 0.2s ease !important;
    }
    .back-home.hidden{
      opacity: 0 !important;
      transform: translateY(-10px) !important;
      pointer-events: none !important;
    }
    .back-home img{
      width: 80px !important;
      height: 80px !important;
      object-fit: contain !important;
      display: block !important;
    }
  `;
  const s = document.createElement('style');
  s.id = 'back-home-styles';
  s.appendChild(document.createTextNode(css));
  document.head.appendChild(s);
})();

(function(){
  if (typeof window === 'undefined') return;
  let lastScroll = window.scrollY;
  const back = document.querySelector('.back-home');
  const logo = document.querySelector('.logo-topo');
  window.addEventListener('scroll', () => {
    const sc = window.scrollY || 0;
    if (sc > 20) {
      if (back && !back.classList.contains('hidden')) back.classList.add('hidden');
      if (logo && !logo.classList.contains('hidden')) logo.classList.add('hidden');
    } else {
      if (back && back.classList.contains('hidden')) back.classList.remove('hidden');
      if (logo && logo.classList.contains('hidden')) logo.classList.remove('hidden');
    }
    lastScroll = sc;
  }, { passive: true });
})();
