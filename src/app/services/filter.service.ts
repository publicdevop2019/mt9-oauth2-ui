import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IFilterItem {
  id: number,
  name: string,
  values: string[]
}
export interface IBizFilter {
  id: number,
  catalogs: string[],
  description?:string
  filters: IFilterItem[]
}
@Injectable({
  providedIn: 'root'
})
export class FilterService extends EntityCommonService<IBizFilter, IBizFilter>{
  private PRODUCT_SVC_NAME = '/product-svc';
  private ENTITY_NAME = '/filters';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
