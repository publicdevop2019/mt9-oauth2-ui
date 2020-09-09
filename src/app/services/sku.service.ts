import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { ISkuNew } from './product.service';
@Injectable({
    providedIn: 'root'
})
export class SkuService extends EntityCommonService<ISkuNew, ISkuNew>{
    private AUTH_SVC_NAME = '/product-svc';
    private ENTITY_NAME = '/sku';
    entityRepo: string = environment.serverUri + this.AUTH_SVC_NAME + this.ENTITY_NAME;
    role: string = 'admin';
    constructor(private router: Router, private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
        super(httpProxy, interceptor);
    }
}
