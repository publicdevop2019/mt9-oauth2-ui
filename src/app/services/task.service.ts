import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IBizTask {
    id: number,
    taskName: string,
    taskStatus: 'COMPLETED' | 'STARTED' | 'ROLLBACK',
    transactionId: string,
    referenceId: number,
    createdBy: string,
    createdAt: string,
    modifiedBy: string,
    modifiedAt: string,
    version:number
}
@Injectable({
    providedIn: 'root'
})
export class TaskService extends EntityCommonService<IBizTask, IBizTask> {
    private SVC_NAME = '/profile-svc';
    private ENTITY_NAME = '/tasks';
    entityRepo: string = environment.serverUri + this.SVC_NAME + this.ENTITY_NAME;
    role: string = 'admin';
    constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
        super(httpProxy, interceptor);
    }
}
