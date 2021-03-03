import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { IIdBasedEntity } from '../clazz/summary.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './interceptors/http.interceptor';
export interface IMallMonitorMsg extends IIdBasedEntity {
    date: number;
    code: number;
    type: 'SKU_FAILURE'
    skuChange: ISkuChange[];
}
interface ISkuChange {
    skuId: string,
    storageType: 'ACTUAL' | 'ORDER',
    amount:number
}
@Injectable({
    providedIn: 'root'
})
export class MessageMallService extends EntityCommonService<IMallMonitorMsg, IMallMonitorMsg>{
    private SVC_NAME = '/messenger-svc';
    private ENTITY_NAME = '/mallNotifications';
    entityRepo: string = environment.serverUri + this.SVC_NAME + this.ENTITY_NAME;
    role: string = 'admin';
    constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
        super(httpProxy, interceptor);
    }
}
