import { Injectable } from '@angular/core';
import { IQueryProvider } from 'mt-form-builder/lib/classes/template.interface';
import { environment } from 'src/environments/environment';
import { CATALOG_TYPE } from '../clazz/constants';
import { EntityCommonService } from '../clazz/entity.common-service';
import { ICatalog } from '../clazz/validation/aggregate/catalog/interfaze-catalog';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './interceptors/http.interceptor';
export interface ICatalogCustomerTreeNode {
  id: string,
  name: string,
  children?: ICatalogCustomerTreeNode[],
  tags?: string[],
  reviewRequired: boolean
}
@Injectable({
  providedIn: 'root'
})
export class CatalogService extends EntityCommonService<ICatalog, ICatalog> implements IQueryProvider {
  private PRODUCT_SVC_NAME = '/product-svc';
  private ENTITY_NAME = '/catalogs';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  queryPrefix: string = undefined
  constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
  readByQuery(num: number, size: number, query?: string, by?: string, order?: string, headers?: {}) {
    return this.readEntityByQuery(num, size, query, by, order, headers);
  };

  readEntityByQuery(num: number, size: number, query?: string, by?: string, order?: string, headers?: {}) {
    if (query && (query.includes(CATALOG_TYPE.BACKEND) || query.includes(CATALOG_TYPE.FRONTEND))) {
      return this.httpProxySvc.readEntityByQuery<ICatalog>(this.entityRepo, this.role, num, size, query, by, order, headers)
    } else {
      return this.httpProxySvc.readEntityByQuery<ICatalog>(this.entityRepo, this.role, num, size, query ? (this.queryPrefix + query) : this.queryPrefix, by, order, headers)
    }
  };

}
