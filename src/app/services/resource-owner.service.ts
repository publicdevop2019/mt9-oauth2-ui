import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { logout } from '../clazz/utility';
import { IResourceOwner, IResourceOwnerUpdatePwd } from '../clazz/validation/aggregate/user/interfaze-user';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
@Injectable({
  providedIn: 'root'
})
export class ResourceOwnerService extends EntityCommonService<IResourceOwner, IResourceOwner>{
  private AUTH_SVC_NAME = '/auth-svc';
  private ENTITY_NAME = '/users';
  entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(private router: Router, private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
  revokeResourceOwnerToken(id: number): void {
    this.httpProxy.revokeResourceOwnerToken(id).subscribe(result => {
      result ? this.interceptor.openSnackbar('OPERATION_SUCCESS_TOKEN') : this.interceptor.openSnackbar('OPERATION_FAILED');
    })
  }
  updateMyPwd(resourceOwner: IResourceOwnerUpdatePwd, changeId: string): void {
    this.httpProxy.updateResourceOwnerPwd(resourceOwner, changeId).subscribe(result => {
      result ? this.interceptor.openSnackbar('OPERATION_SUCCESS_LOGIN') : this.interceptor.openSnackbar('OPERATION_FAILED');
      /** clear authentication info */
      this.httpProxy.currentUserAuthInfo = undefined;
      logout()
    });
  }
  batchUpdateUserStatus(ids: number[], status: 'LOCK' | 'UNLOCK', changeId: string) {
    this.httpProxy.batchUpdateUserStatus(this.entityRepo, this.role, ids, status, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
}
