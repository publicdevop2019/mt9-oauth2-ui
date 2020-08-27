import { Injectable } from '@angular/core';
import { EntityCommonService } from '../clazz/entity.common-service';
import { IClient } from '../modules/my-apps/interface/client.interface';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClientService extends EntityCommonService<IClient, IClient>{
  private AUTH_SVC_NAME = '/auth-svc';
  private ENTITY_NAME = '/clients';
  entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
  revokeClientToken(clientId: number): void {
    this.httpProxy.revokeClientToken(clientId).subscribe(result => {
      result ? this.interceptor.openSnackbar('OPERATION_SUCCESS_TOKEN') : this.interceptor.openSnackbar('OPERATION_FAILED');
    })
  }
}
