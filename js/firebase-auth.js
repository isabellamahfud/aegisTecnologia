import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { app } from './firebase-config.js';

const auth = getAuth(app);

function createMessageElement(form) {
  let msgEl = form.querySelector('#form-message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'message';
    msgEl.id = 'form-message';
    msgEl.setAttribute('aria-live', 'polite');
    form.insertBefore(msgEl, form.firstChild);
  }
  return msgEl;
}

function showMessage(el, msg, success = true) {
  if (!el) return;
  el.textContent = msg;
  el.style.color = success ? 'green' : 'red';
}

function redirectToIndex() {
  try {
    // Prefer origin-based absolute path when served over http(s)
    if (window.location.origin && window.location.origin !== 'null') {
      window.location.href = window.location.origin + '/index.html';
      return;
    }
  } catch (e) {
    // ignore
  }
  // Fallback: resolve by stripping /pages/... from current path
  const href = window.location.href;
  const base = href.replace(/\/pages\/.*$/, '');
  window.location.href = (base.endsWith('/') ? base : base + '/') + 'index.html';
}

// Signup
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-password-confirm').value;
    const msgEl = createMessageElement(signupForm);

    if (password !== confirm) {
      showMessage(msgEl, 'As senhas não conferem.', false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      showMessage(msgEl, 'Cadastro realizado com sucesso. Redirecionando...', true);
      setTimeout(() => { redirectToIndex(); }, 1200);
    } catch (err) {
      showMessage(msgEl, err.message || 'Erro no cadastro', false);
    }
  });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const msgEl = createMessageElement(loginForm);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage(msgEl, 'Login efetuado. Redirecionando...', true);
      setTimeout(() => { redirectToIndex(); }, 800);
    } catch (err) {
      showMessage(msgEl, err.message || 'Erro no login', false);
    }
  });
}

// Auth state observer to update header
const authBar = document.getElementById('auth-bar');
let currentUser = null;

function protectDownloadsLink() {
  const downloadsLink = document.querySelector('a[href="pages/downloads.html"]');
  if (!downloadsLink) return;

  downloadsLink.addEventListener('click', (e) => {
    if (!currentUser) {
      e.preventDefault();
      alert('Você precisa fazer login para acessar a página de downloads.');
      window.location.href = 'pages/login.html';
    }
  });
}

protectDownloadsLink();

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!authBar) return;
  if (user) {
    authBar.innerHTML = `
      <span class="auth-user">${user.displayName || user.email}</span>
      <button id="logout-btn">Sair</button>
    `;
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));
  } else {
    authBar.innerHTML = `
      <a href="pages/login.html" class="btn-login">Login</a>
      <a href="pages/cadastro.html" class="btn-cadastro">Cadastro</a>
    `;
  }
});
