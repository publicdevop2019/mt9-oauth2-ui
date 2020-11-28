import { Injectable } from '@angular/core';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { environment } from 'src/environments/environment';
import { IClient } from '../clazz/validation/aggregate/client/interfaze-client';
@Injectable({
  providedIn: 'root'
})
export class ClientService extends EntityCommonService<IClient, IClient>{
  private AUTH_SVC_NAME = '/auth-svc';
  private ENTITY_NAME = '/clients';
  entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  supportEvent = true;
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
  revokeClientToken(clientId: number): void {
    this.httpProxy.revokeClientToken(clientId).subscribe(result => {
      result ? this.interceptor.openSnackbar('OPERATION_SUCCESS_TOKEN') : this.interceptor.openSnackbar('OPERATION_FAILED');
    })
  }
}
