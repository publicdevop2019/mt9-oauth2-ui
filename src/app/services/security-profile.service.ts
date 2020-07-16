import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of, Subject } from 'rxjs';
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
  refreshSummary:Subject<void>=new Subject();
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }

  readAll(): Observable<ISecurityProfile[]> {
    return this.httpProxy.getSecurityProfiles();
  }
  readById(id: number): Observable<ISecurityProfile> {
    return this.httpProxy.getSecurityProfiles().pipe(switchMap(next=>of(next.find(e=>e.id === id))))
  }
  create(securityProfiel: ISecurityProfile) {
    this.httpProxy.createSecurityProfile(securityProfiel).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(securityProfiel: ISecurityProfile) {
    this.httpProxy.updateSecurityProfile(securityProfiel).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })

  }
  batchUpdate(batchUpdateForm: {[key:string]:string}) {
    this.httpProxy.batchUpdateSecurityProfile(batchUpdateForm).subscribe(result => {
      this.notify(result)
    })

  }
  delete(id: number) {
    this.httpProxy.deleteSecurityProfile(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
}
