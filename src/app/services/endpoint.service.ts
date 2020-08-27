import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { ISecurityProfile } from '../modules/my-apps/pages/summary-security-profile/summary-security-profile.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';

@Injectable({
  providedIn: 'root'
})
export class EndpointService extends EntityCommonService<ISecurityProfile, ISecurityProfile>{
  private AUTH_SVC_NAME = '/auth-svc';
  private ENTITY_NAME = '/proxy/endpoints';
  entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
