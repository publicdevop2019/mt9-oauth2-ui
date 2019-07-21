import { Injectable } from '@angular/core';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { MsgBoxComponent } from '../msg-box/msg-box.component';

@Injectable({
  providedIn: 'root'
})
export class SecurityProfileService {
  cachedSecurityProfiles: ISecurityProfile[];
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private router: Router) { }

  readAll(): Observable<ISecurityProfile[]> {
    return this.httpProxy.netImpl.getSecurityProfiles();
  }
  read(id: number): Observable<ISecurityProfile> {
    return this.cachedSecurityProfiles ? of(this.cachedSecurityProfiles.find(e => e.id === id)) : of(undefined)
  }
  create(securityProfiel: ISecurityProfile) {
    this.httpProxy.netImpl.createSecurityProfile(securityProfiel).subscribe(result => {
      this.notify(result)
    })
  }
  update(securityProfiel: ISecurityProfile) {
    this.httpProxy.netImpl.updateSecurityProfile(securityProfiel).subscribe(result => {
      this.notify(result)
    })

  }
  delete(securityProfiel: ISecurityProfile) {
    this.httpProxy.netImpl.deleteSecurityProfile(securityProfiel).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this.openDialog('operation success') : this.openDialog('operation failed');
  }
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
}
