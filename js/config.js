// Arquivo de configuração carregado do .env
// Para ambientes frontend, use variáveis de ambiente do seu build tool (Vite, Webpack, etc.)
// ou configure manualmente aqui

const CONFIG = {
  supabase: {
    url: 'https://ahaefzkrjudhvhbltphl.supabase.co',
    anonKey: 'sb_publishable_VXJrhRVQa3Qk0IDc9dfh1g_DXHRu2Gt'
  },
  pages: {
    redirectLogin: 'index.html',
    redirectSignup: 'index.html',
    loginPage: 'pages/login.html',
    signupPage: 'pages/cadastro.html'
  },
  app: {
    name: 'Aegis Tecnologia',
    env: 'development'
  }
};

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
