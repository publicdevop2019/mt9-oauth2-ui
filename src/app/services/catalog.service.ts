import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface ICatalog {
  id: number,
  name: string,
  parentId?: number,
  attributes?: string[],
  catalogType?: 'BACKEND' | 'FRONTEND',
}
export interface ICatalogCustomerTreeNode {
  id: number,
  name: string,
  children?: ICatalogCustomerTreeNode[],
  tags?: string[],
}
@Injectable({
  providedIn: 'root'
})
export class CatalogService extends EntityCommonService<ICatalog, ICatalog>{
  private PRODUCT_SVC_NAME = '/product-svc';
  private ENTITY_NAME = '/catalogs';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
