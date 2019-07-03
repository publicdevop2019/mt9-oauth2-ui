export const environment = {
  production: true,
  mode: 'offline' as 'online' | 'offline',
  home: 'https://github.com/publicdevop2019/oauth2service',
  serverUri: 'http://localhost',
  serverPort: ':8080',
  apiVersion: '/api/v1',
  tokenUrl: 'http://localhost:8080/oauth/token',
  loginClientId: 'login-id',
  registerClientId: 'register-id',
  clientSecret: ''
};