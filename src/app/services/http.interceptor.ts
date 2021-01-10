import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, mergeMap, retry, filter, take, finalize } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { ITokenResponse } from '../clazz/validation/interfaze-common';
import { TranslateService } from '@ngx-translate/core';
import { getCookie } from '../clazz/utility';
/**
 * use refresh token if call failed
 */
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private _errorStatus: number[] = [500, 503, 502, 504];
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private router: Router, private _httpProxy: HttpProxyService, private _snackBar: MatSnackBar, private translate: TranslateService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this._httpProxy.currentUserAuthInfo && this._httpProxy.currentUserAuthInfo.access_token)
      if (
        req.url.indexOf('oauth/token') > -1 && req.method === 'POST'
      ) {
        /**
         * skip Bearer header for public urls
         */
      } else {
        if (req.method === 'GET' || req.method === 'HEAD') {
          req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.currentUserAuthInfo.access_token}` } });
        } else {
          req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.currentUserAuthInfo.access_token}`, 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') }, withCredentials: true });
        }
      }
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      if (error && error.status === 401) {
        if (this._httpProxy.currentUserAuthInfo === undefined || this._httpProxy.currentUserAuthInfo === null) {
          /** during log in call */
          this.openSnackbar('BAD_USERNAME_OR_PASSWORD');
          return throwError(error);
        }
        if (req.url.indexOf('oauth/token') > -1 && req.method === 'POST' && req.body && (req.body as FormData).get('grant_type') === 'refresh_token') {
          this.openSnackbar('SESSION_EXPIRED');
          this.router.navigate(['/login'], { queryParams: this.router.routerState.snapshot.root.queryParams })
          document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          return throwError(error);
        }
        if (this._httpProxy.refreshInprogress) {
          return this.refreshTokenSubject.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(() => next.handle(this.updateReqAuthToken(req)))
          );
        } else {
          this._httpProxy.refreshInprogress = true;
          this.refreshTokenSubject.next(null);
          return this._httpProxy.refreshToken().pipe(
            switchMap((newToken: ITokenResponse) => {
              this._httpProxy.currentUserAuthInfo = undefined;
              this._httpProxy.currentUserAuthInfo = newToken;
              this.refreshTokenSubject.next(newToken);
              return next.handle(this.updateReqAuthToken(req));
            }),
            finalize(() => this._httpProxy.refreshInprogress = false)
          );
        }
      }
      else if (this._errorStatus.indexOf(error.status) > -1) {
        this.openSnackbar('SERVER_RETURN_5XX');
      } else if (error.status === 404) {
        this.openSnackbar('URL_NOT_FOUND');
        return throwError(error);
      } else if (error.status === 405) {
        this.openSnackbar('METHOD_NOT_SUPPORTED');
        return throwError(error);
      } else if (error.status === 403) {
        this.openSnackbar('ACCESS_IS_NOT_ALLOWED');
        return throwError(error);
      } else if (error.status === 400) {
        this.openSnackbar('INVALID_REQUEST');
        return throwError(error);
      } else if (error.status === 0) {
        this.openSnackbar('NETWORK_CONNECTION_FAILED');
        return throwError(error);
      } else {
        return throwError(error);
      }

    })

    );
  }
  updateReqAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    return req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.currentUserAuthInfo.access_token}` } })
  }
  openSnackbar(message: string) {
    this.translate.get(message).subscribe(next => {
      this._snackBar.open(next, 'OK', {
        duration: 5000,
      });
    })
  }
}