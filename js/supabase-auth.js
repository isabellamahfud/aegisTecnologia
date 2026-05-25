import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.esm.js';

// Substitua estes valores pelos dados do seu projeto Supabase.
const SUPABASE_URL = 'https://ahaefzkrjudhvhbltphl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VXJrhRVQa3Qk0IDc9dfh1g_DXHRu2Gt';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const page = document.body.dataset.page || 'index';
const messageEl = document.getElementById('form-message');
const redirectTo = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';

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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    }, {
        data: { full_name: name }
    });

    if (error) {
        setMessage(error.message, 'error');
        return;
    }

    if (data?.user) {
        setMessage('Conta criada com sucesso! Verifique seu e-mail ou faça login.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
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

async function updateAuthBar() {
    const authBar = document.getElementById('auth-bar');
    const authButtons = document.querySelector('.auth-buttons');

    if (!authBar) return;

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

    if (page === 'index') {
        await updateAuthBar();
    }
}

window.addEventListener('DOMContentLoaded', onLoad);
