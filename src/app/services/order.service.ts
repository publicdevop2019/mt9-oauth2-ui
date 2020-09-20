import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { IOrder } from '../interfaze/commom.interface';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends EntityCommonService<IOrder, IOrder> {
  private SVC_NAME = '/profile-svc';
  private ENTITY_NAME = '/orders';
  entityRepo: string = environment.serverUri + this.SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
      super(httpProxy, interceptor);
  }
}
