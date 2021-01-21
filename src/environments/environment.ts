// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mode: 'online' as 'online' | 'offline',
  validation: 'on' as 'on' | 'off', //make payload validation always return true, note this will not disable all validations, only validator-helper is bypassed
  serverUri: 'http://localhost:8111',
  // serverUri: 'http://localhost:8083/v1',
  // tokenUrl: 'http://localhost:8111/oauth/token',
  // serverUri: 'http://ec2-18-191-132-78.us-east-2.compute.amazonaws.com',
  // tokenUrl: 'http://ec2-18-191-132-78.us-east-2.compute.amazonaws.com/oauth/token',
  loginClientId: '0C8AZZ16LZB4',
  registerClientId: '0C8B00098WLD',
  clientSecret: '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
