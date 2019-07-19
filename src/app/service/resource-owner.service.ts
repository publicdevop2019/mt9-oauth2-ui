import { Injectable } from '@angular/core';
import { IResourceOwner } from '../page/summary-resource-owner/summary-resource-owner.component';
import { Observable, of } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { MsgBoxComponent } from '../msg-box/msg-box.component';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceOwnerService {
  cachedResourceOwners: IResourceOwner[];
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private router: Router) { }
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
        this.openDialog('operation failed')
      this.openDialog('operation success')
    });
  }
  updateResourceOwnerPwd(resourceOwner: IResourceOwner): void {
    this.httpProxy.netImpl.updateResourceOwnerPwd(resourceOwner).subscribe(result => {
      if (!result)
        this.openDialog('operation failed')
      this.openDialog('operation success, please login again')
      /** clear authentication info */
      this.httpProxy.netImpl.authenticatedEmail = undefined;
      this.httpProxy.netImpl.currentUserAuthInfo = undefined;
      this.router.navigateByUrl('/login');
    });
  }
  deleteResourceOwner(resourceOwner: IResourceOwner): void {
    this.httpProxy.netImpl.deleteResourceOwner(resourceOwner).subscribe(result => {
      if (!result)
        this.openDialog('operation failed')
      this.openDialog('operation success')
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
    result ? this.openDialog('operation success, old token has been revoked') : this.openDialog('operation failed');
  }
}
