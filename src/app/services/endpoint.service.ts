import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { IEndpoint } from '../clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
@Injectable({
  providedIn: 'root'
})
export class EndpointService extends EntityCommonService<IEndpoint, IEndpoint>{
  private ENTITY_NAME = '/proxy/endpoints';
  entityRepo: string = environment.serverUri + this.ENTITY_NAME;
  role: string = 'root';
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
