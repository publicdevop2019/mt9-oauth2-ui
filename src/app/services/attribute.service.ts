import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IBizAttribute {
  id: number,
  name: string,
  description?: string,
  selectValues?: string[],
  method: 'MANUAL' | 'SELECT',
  type: 'PROD_ATTR' | 'SALES_ATTR' | 'KEY_ATTR' | 'GEN_ATTR'
}
export interface IAttributeHttp {
  data: IBizAttribute[];
  totalItemCount: number,
}
@Injectable({
  providedIn: 'root'
})
export class AttributeService extends EntityCommonService<IBizAttribute, IBizAttribute> {
  private PRODUCT_SVC_NAME = '/product-svc';
  private ENTITY_NAME = '/attributes';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
