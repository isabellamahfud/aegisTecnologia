# 📋 Configuração de Ambiente - Login e Cadastro

## 📚 Arquivos de Configuração

- **`.env`** - Arquivo de variáveis de ambiente com suas credenciais reais (não deve ser commitado)
- **`.env.example`** - Template de exemplo para referência
- **`js/config.js`** - Arquivo que carrega as variáveis de ambiente

## 🔧 Como Usar

### 1. Crie o arquivo `.env`
Crie na raiz do projeto (mesmo nível do `index.html`):

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_chave_publica_aqui
REDIRECT_LOGIN=index.html
REDIRECT_SIGNUP=index.html
LOGIN_PAGE=pages/login.html
SIGNUP_PAGE=pages/cadastro.html
APP_NAME=Aegis Tecnologia
APP_ENV=development
```

### 2. Configure suas credenciais Supabase
- Acesse seu painel do Supabase
- Copie sua `SUPABASE_URL`
- Copie sua `SUPABASE_ANON_KEY`
- Cole no arquivo `.env`

### 3. Arquivos Modificados
- `index.html` - Adicionado carregamento de `config.js`
- `js/supabase-auth.js` - Atualizado para ler configurações do `config.js`
- `js/config.js` - Novo arquivo de configuração

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca commit o arquivo `.env` com suas credenciais reais!

O arquivo `.gitignore` foi configurado para ignorar:
- `.env`
- `.env.local`
- `node_modules/`

## 📝 Variáveis Disponíveis

Acesse as configurações em qualquer arquivo JavaScript:

```javascript
console.log(CONFIG.supabase.url);      // URL do Supabase
console.log(CONFIG.supabase.anonKey);  // Chave anônima
console.log(CONFIG.pages.loginPage);   // Página de login
console.log(CONFIG.pages.signupPage);  // Página de cadastro
console.log(CONFIG.app.name);          // Nome da app
console.log(CONFIG.app.env);           // Ambiente
```

## 🚀 Fluxo de Login e Cadastro

1. **Página de Login** (`pages/login.html`)
   - Campos: email e senha
   - Autentica via Supabase
   - Redireciona para `index.html` após sucesso

2. **Página de Cadastro** (`pages/cadastro.html`)
   - Campos: nome, email, senha, confirmar senha
   - Cria conta no Supabase
   - Salva perfil na tabela `profiles`
   - Redireciona para página de login

3. **Barra de Autenticação**
   - Exibe nome do usuário quando logado
   - Botão "Sair" para logout
   - Oculta botões de login/cadastro quando autenticado

## ✅ Próximos Passos

1. Copie suas credenciais do Supabase para `.env`
2. Teste o login em `pages/login.html`
3. Teste o cadastro em `pages/cadastro.html`
4. Verifique se a barra de autenticação funciona
