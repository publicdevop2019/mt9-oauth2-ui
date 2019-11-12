// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mode: 'online' as 'online' | 'offline',
  home: 'https://github.com/publicdevop2019/oauth2service',
  apiVersion: '/api',
  serverUri: 'https://www.ngform.com',
  tokenUrl: 'https://www.ngform.com/oauth/token',
  // serverUri: 'http://localhost:8111',
  // tokenUrl: 'http://localhost:8111/oauth/token',
  // serverUri: 'http://ec2-18-188-105-82.us-east-2.compute.amazonaws.com',
  // tokenUrl: 'http://ec2-18-188-105-82.us-east-2.compute.amazonaws.com/oauth/token',
  loginClientId: 'login-id',
  registerClientId: 'register-id',
  clientSecret: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.