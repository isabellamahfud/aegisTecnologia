import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.esm.js';

// Carrega configurações do arquivo config.js
// Se CONFIG não estiver disponível, usa valores padrão
const SUPABASE_URL = typeof CONFIG !== 'undefined' ? CONFIG.supabase.url : 'https://ahaefzkrjudhvhbltphl.supabase.co';
const SUPABASE_ANON_KEY = typeof CONFIG !== 'undefined' ? CONFIG.supabase.anonKey : 'sb_publishable_VXJrhRVQa3Qk0IDc9dfh1g_DXHRu2Gt';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabase = supabase;

const page = document.body.dataset.page || 'index';
const messageEl = document.getElementById('form-message');
const isPagesFolder = window.location.pathname.includes('/pages/');
const redirectTo = isPagesFolder ? '../index.html' : 'index.html';
const loginPage = isPagesFolder ? 'login.html' : 'pages/login.html';
const signupPage = isPagesFolder ? 'cadastro.html' : 'pages/cadastro.html';

function setMessage(message, type = 'info') {
    if (!messageEl) return;
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
}

function clearMessage() {
    if (!messageEl) return;
    messageEl.textContent = '';
    messageEl.className = 'message';
}

async function handleLogin(event) {
    event.preventDefault();
    clearMessage();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email || !password) {
        setMessage('Informe e-mail e senha para continuar.', 'error');
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        setMessage(error.message, 'error');
        return;
    }

    if (data?.session) {
        setMessage('Login realizado com sucesso. Redirecionando...', 'success');
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1200);
        return;
    }

    setMessage('Login concluído. Redirecionando...', 'success');
    setTimeout(() => {
        window.location.href = redirectTo;
    }, 1200);
}

async function handleSignup(event) {
    event.preventDefault();
    clearMessage();

    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const password = document.getElementById('signup-password')?.value;
    const passwordConfirm = document.getElementById('signup-password-confirm')?.value;

    if (!name || !email || !password || !passwordConfirm) {
        setMessage('Preencha todos os campos para se cadastrar.', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        setMessage('As senhas não conferem.', 'error');
        return;
    }

    const { data, error } = await supabase.auth.signUp(
        {
            email,
            password,
        },
        {
            data: { full_name: name },
        }
    );

    if (error) {
        setMessage(error.message, 'error');
        return;
    }

    if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
            {
                id: data.user.id,
                full_name: name,
                email: data.user.email,
            },
        ]);

        if (profileError) {
            console.error('Erro ao salvar perfil:', profileError.message);
        }

        setMessage('Conta criada com sucesso! Verifique seu e-mail ou faça login.', 'success');
        setTimeout(() => {
            window.location.href = loginPage;
        }, 1800);
        return;
    }

    setMessage('Registro concluído. Verifique seu e-mail e acesse a página de login.', 'success');
}

async function handleLogout(event) {
    event.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error.message);
        return;
    }
    window.location.href = redirectTo;
}

async function ensureAuthBar() {
    let authBar = document.getElementById('auth-bar');
    if (authBar) return authBar;

    authBar = document.createElement('div');
    authBar.id = 'auth-bar';
    authBar.className = 'auth-bar';

    const insertBefore = document.querySelector('header') || document.body.firstChild;
    if (insertBefore) {
        document.body.insertBefore(authBar, insertBefore);
    } else {
        document.body.appendChild(authBar);
    }

    return authBar;
}

async function updateAuthBar() {
    const authBar = await ensureAuthBar();
    const authButtons = document.querySelector('.auth-buttons');

    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;

    if (!user) {
        if (authButtons) {
            authButtons.classList.remove('hidden');
        }
        authBar.innerHTML = '';
        return;
    }

    if (authButtons) {
        authButtons.classList.add('hidden');
    }

    const fullName = user.user_metadata?.full_name || user.email;
    authBar.innerHTML = `
        <span class="user-badge">Olá, ${fullName}</span>
        <button id="logout-button">Sair</button>
    `;

    document.getElementById('logout-button')?.addEventListener('click', handleLogout);
}

async function requireAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
        window.location.href = loginPage;
        return false;
    }
    return true;
}

async function onLoad() {
    if (page === 'login') {
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        const { data } = await supabase.auth.getSession();

        if (data?.session) {
            window.location.href = redirectTo;
        }
        return;
    }

    if (page === 'signup') {
        document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
        const { data } = await supabase.auth.getSession();

        if (data?.session) {
            window.location.href = redirectTo;
        }
        return;
    }

    if (isPagesFolder) {
        await requireAuth();
        await updateAuthBar();
        return;
    }

    if (page === 'index') {
        await updateAuthBar();
    }
}

window.addEventListener('DOMContentLoaded', onLoad);
