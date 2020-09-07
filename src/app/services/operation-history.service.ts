import { Injectable } from '@angular/core';
import { EntityCommonService } from '../clazz/entity.common-service';
import { environment } from 'src/environments/environment';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IChangeRecord {
  id: number,
  changeId: string,
  entityType: number,
  patchCommands?: IPatchCommand[],
  operationType: 'POST' | 'PATCH_BATCH' | 'PATCH_BY_ID' | 'PUT' | 'RESTORE' | 'DELETE_BY_ID' | 'DELETE_BY_QUERY',
  query?:string
}

export interface IPatchCommand {
  op: string,
  path: string,
  value: Object,
  expect?: number,
}
@Injectable({
  providedIn: 'root'
})
export class OperationHistoryService extends EntityCommonService<IChangeRecord, IChangeRecord>{
  public PRODUCT_SVC_NAME = '/auth-svc';
  public ENTITY_NAME = '/changes';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
