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
