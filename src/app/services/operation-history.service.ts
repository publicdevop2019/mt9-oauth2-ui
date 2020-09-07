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
  createDeleteCommand?: ICreateDeleteCommand,
}
export interface IPatchCommand {
  op: string,
  path: string,
  value: Object,
  expect?: number,
}
export interface ICreateDeleteCommand {
  query: string,
  operationType: 'CREATE' | 'DELETE',
}
@Injectable({
  providedIn: 'root'
})
export class OperationHistoryService extends EntityCommonService<IChangeRecord, IChangeRecord>{
  private PRODUCT_SVC_NAME = '/auth-svc';
  private ENTITY_NAME = '/changes';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'root';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
}
