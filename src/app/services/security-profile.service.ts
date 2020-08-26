import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { ISecurityProfile } from '../modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';

@Injectable({
  providedIn: 'root'
})
export class SecurityProfileService {
  currentPageIndex:number=0;
  refreshSummary:Subject<void>=new Subject();
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }

  readAll(pageNum: number, pageSize: number, sortBy?: string, sortOrder?: string){
    return this.httpProxy.getSecurityProfiles(pageNum,pageSize,sortBy,sortOrder);
  }
  readById(id: number){
    return this.httpProxy.getSecurityProfilesById(id)
  }
  create(securityProfiel: ISecurityProfile,changeId:string) {
    this.httpProxy.createSecurityProfile(securityProfiel,changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(securityProfiel: ISecurityProfile,changeId:string) {
    this.httpProxy.updateSecurityProfile(securityProfiel,changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
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
