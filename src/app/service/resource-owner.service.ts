import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MsgBoxComponent } from '../components/msg-box/msg-box.component';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../page/summary-resource-owner/summary-resource-owner.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceOwnerService {
  cachedResourceOwners: IResourceOwner[];
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private router: Router, private _httpInterceptor: CustomHttpInterceptor) { }
  revokeResourceOwnerToken(resourceOwnerName: string): void {
    this.httpProxy.netImpl.revokeResourceOwnerToken(resourceOwnerName).subscribe(result => {
      this.notifyTokenRevocation(result);
    })
  }
  getResourceOwners(): Observable<IResourceOwner[]> {
    return this.httpProxy.netImpl.getResourceOwners();
  }
  getResourceOwner(id: number): Observable<IResourceOwner> {
    return this.cachedResourceOwners ? of(this.cachedResourceOwners.find(e => e.id === id)) : of(undefined)
  }
  updateResourceOwner(resourceOwner: IResourceOwner): void {
    this.httpProxy.netImpl.updateResourceOwner(resourceOwner).subscribe(result => {
      if (!result)
        this._httpInterceptor.openSnackbar('operation failed')
      this._httpInterceptor.openSnackbar('operation success')
    });
  }
  updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd): void {
    this.httpProxy.netImpl.updateResourceOwnerPwd(resourceOwner).subscribe(result => {
      if (!result)
        this._httpInterceptor.openSnackbar('operation failed')
      this._httpInterceptor.openSnackbar('operation success, please login again')
      /** clear authentication info */
      this.httpProxy.netImpl.authenticatedEmail = undefined;
      this.httpProxy.netImpl.currentUserAuthInfo = undefined;
      this.router.navigateByUrl('/login');
    });
  }
  deleteResourceOwner(resourceOwner: IResourceOwner): void {
    this.httpProxy.netImpl.deleteResourceOwner(resourceOwner).subscribe(result => {
      if (!result)
        this._httpInterceptor.openSnackbar('operation failed')
      this._httpInterceptor.openSnackbar('operation success')
      this.router.navigateByUrl('/dashboard/resource-owners');
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
}
