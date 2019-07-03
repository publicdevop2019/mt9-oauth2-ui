import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { MsgBoxComponent } from '../msg-box/msg-box.component';
/**
 * use refresh token if call failed
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private _errorStatus: number[] = [500, 503, 502];
  constructor(private router: Router, private _httpProxy: HttpProxyService, public dialog: MatDialog) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this._httpProxy.netImpl.currentUserAuthInfo && this._httpProxy.netImpl.currentUserAuthInfo.access_token && !this._httpProxy.expireRefresh)
      req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } });
    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        let httpError = error as HttpErrorResponse;
        if (httpError.status === 401) {
          if (this._httpProxy.netImpl.currentUserAuthInfo.access_token
            && this._httpProxy.netImpl.currentUserAuthInfo.refresh_token
            && !this._httpProxy.expireRefresh) {
            this._httpProxy.expireRefresh = true;
            return this._httpProxy.netImpl.refreshToken().pipe(switchMap(result => {
              this._httpProxy.expireRefresh = false;
              if (result) {
                req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } });
                return next.handle(req)
              } else {
                this.openDialog('SESSION_EXPIRED');
                this.router.navigate(['/login'])
                return throwError(error);
              }
            }
            ))
          } else {
            /** throw error to trigger error call back in refresh token */
            return throwError(error);
          }
        } else if (this._errorStatus.indexOf(httpError.status) > -1) {
          this.router.navigate(['/error'])
        } else if (httpError.status === 404) {
          this.openDialog('URL Not Found');
          return throwError(error);
        } else if (httpError.status === 403) {
          this.openDialog('Access is not allowed');
          return throwError(error);
        } else if (httpError.status === 400) {
          this.openDialog('Invalid request');
          return throwError(error);
        } else {
          return throwError(error);
        }

      }
    })

    );
  }
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
}