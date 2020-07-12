import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, mergeMap, retry, filter, take, finalize } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { ITokenResponse } from '../interfaze/commom.interface';
/**
 * use refresh token if call failed
 */
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private _errorStatus: number[] = [500, 503, 502];
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private router: Router, private _httpProxy: HttpProxyService, private _snackBar: MatSnackBar) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this._httpProxy.netImpl.currentUserAuthInfo && this._httpProxy.netImpl.currentUserAuthInfo.access_token)
      if (
        req.url.indexOf('oauth/token') > -1 && req.method === 'POST'
      ) {
        /**
         * skip Bearer header for public urls
         */
      } else {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } });
      }
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      if (error && error.status === 401) {
        if (this._httpProxy.netImpl.currentUserAuthInfo === undefined || this._httpProxy.netImpl.currentUserAuthInfo === null) {
          /** during log in call */
          this.openSnackbar('Bad Username or password');
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
          return this._httpProxy.netImpl.refreshToken().pipe(
            switchMap((newToken: ITokenResponse) => {
              this._httpProxy.netImpl.currentUserAuthInfo = undefined;
              this._httpProxy.netImpl.currentUserAuthInfo = newToken;
              this.refreshTokenSubject.next(newToken);
              return next.handle(this.updateReqAuthToken(req));
            }),
            finalize(() => this._httpProxy.refreshInprogress = false)
          );
        }
      }
      else if (this._errorStatus.indexOf(error.status) > -1) {
        this.openSnackbar('Server return 5xx');
      } else if (error.status === 404) {
        this.openSnackbar('URL Not Found');
        return throwError(error);
      } else if (error.status === 403) {
        this.openSnackbar('Access is not allowed');
        return throwError(error);
      } else if (error.status === 400) {
        this.openSnackbar('Invalid request');
        return throwError(error);
      } else if (error.status === 0) {
        this.openSnackbar('Network connection failed');
        return throwError(error);
      } else {
        return throwError(error);
      }

    })

    );
  }
  updateReqAuthToken(req: HttpRequest<any>): HttpRequest<any> {
    return req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } })
  }
  openSnackbar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }
}