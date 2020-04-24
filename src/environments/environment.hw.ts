
export const environment = {
  production: true,
  mode: 'online' as 'online' | 'offline',
  home: 'https://github.com/publicdevop2019/oauth2service',
  serverUri: 'http://localhost:8111',
  tokenUrl: 'http://localhost:8111/auth-svc/oauth/token',
  loginClientId: 'login-id',
  registerClientId: 'register-id',
  clientSecret: ''
};
