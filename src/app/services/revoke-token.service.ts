import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IRevokeToken {
  id: number;
  targetId:number;
  issuedAt:number;
  type:'Client'|'User'
}
@Injectable({
  providedIn: 'root'
})
export class RevokeTokenService extends EntityCommonService<IRevokeToken, IRevokeToken>{
  private AUTH_SVC_NAME = '/proxy';
  private ENTITY_NAME = '/revoke-tokens';
  entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
