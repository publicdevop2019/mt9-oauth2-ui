import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ISecurityProfile } from '../page/summary-security-profile/summary-security-profile.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';

@Injectable({
  providedIn: 'root'
})
export class SecurityProfileService {
  currentPageIndex:number;
  cachedSecurityProfiles: ISecurityProfile[];
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }

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
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
