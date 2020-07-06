import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { ISecurityProfile } from '../modules/my-apps/pages/summary-security-profile/summary-security-profile.component';

@Injectable({
  providedIn: 'root'
})
export class SecurityProfileService {
  currentPageIndex:number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }

  readAll(): Observable<ISecurityProfile[]> {
    return this.httpProxy.netImpl.getSecurityProfiles();
  }
  read(id: number): Observable<ISecurityProfile> {
    return this.httpProxy.netImpl.getSecurityProfiles().pipe(switchMap(next=>of(next.find(e=>e.id === id))))
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
  batchUpdate(batchUpdateForm: {[key:string]:string}) {
    this.httpProxy.netImpl.batchUpdateSecurityProfile(batchUpdateForm).subscribe(result => {
      this.notify(result)
    })

  }
  delete(id: number) {
    this.httpProxy.netImpl.deleteSecurityProfile(id).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
