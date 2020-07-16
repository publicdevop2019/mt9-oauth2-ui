import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { MsgBoxComponent } from '../components/msg-box/msg-box.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { switchMap } from 'rxjs/operators';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../modules/my-users/interface/resource-owner.interface';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceOwnerService {
  currentPageIndex: number;
  refreshSummary:Subject<void>=new Subject();
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private router: Router, private _httpInterceptor: CustomHttpInterceptor) { }
  revokeResourceOwnerToken(resourceOwnerName: string): void {
    this.httpProxy.revokeResourceOwnerToken(resourceOwnerName).subscribe(result => {
      this.notifyTokenRevocation(result);
    })
  }
  getResourceOwners(): Observable<IResourceOwner[]> {
    return this.httpProxy.getResourceOwners();
  }
  getResourceOwner(id: number): Observable<IResourceOwner> {
    return this.httpProxy.getResourceOwners().pipe(switchMap(next=>of(next.find(e=>e.id === id))))
  }
  updateResourceOwner(resourceOwner: IResourceOwner): void {
    this.httpProxy.updateResourceOwner(resourceOwner).subscribe(result => {
      this.notify(result)
    });
  }
  updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd): void {
    this.httpProxy.updateResourceOwnerPwd(resourceOwner).subscribe(result => {
      this.notify(result)
      /** clear authentication info */
      this.httpProxy.currentUserAuthInfo = undefined;
      this.router.navigateByUrl('/login');
    });
  }
  delete(id: number): void {
    this.httpProxy.deleteResourceOwner(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    });
  }
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
  notifyTokenRevocation(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success, old token has been revoked') : this._httpInterceptor.openSnackbar('operation failed');
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
