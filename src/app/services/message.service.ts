import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { IIdBasedEntity } from '../clazz/summary.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './interceptors/http.interceptor';
import * as UUID from 'uuid/v1';
export interface IDetail extends IIdBasedEntity {
    date: number
    message: string
}
@Injectable({
    providedIn: 'root'
})
export class MessageService extends EntityCommonService<IDetail, IDetail>{
    private SVC_NAME = '/messenger-svc';
    private ENTITY_NAME = '/systemNotifications';
    entityRepo: string = environment.serverUri + this.SVC_NAME + this.ENTITY_NAME;
    role: string = 'root';
    constructor(httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
        super(httpProxy, interceptor);
    }
    public latestMessage: string[] = [];
    saveMessage(message: string) {
        if (this.latestMessage.length === 5) {
            this.latestMessage.splice(0, 1)
        }
        this.latestMessage.push(message);
    }
    private socket: WebSocket;
    connect() {
        if (environment.mode !== 'offline') {
            const jwtBody = this.httpProxySvc.currentUserAuthInfo.access_token.split('.')[1];
            const raw = atob(jwtBody);
            if ((JSON.parse(raw).authorities as string[]).filter(e => e === "ROLE_ROOT").length > 0) {
                this.httpProxySvc.createEntity(environment.serverUri+'/auth-svc/tickets', this.role, null, UUID()).subscribe(next => {
                    this.socket = new WebSocket(`ws://localhost:8111/messenger-svc/web-socket?jwt=${btoa(next)}`);
                    this.socket.addEventListener('message', (event) => {
                        this.saveMessage(event.data as string);
                    });
                });
            }
        }
    }
    clear() {
        this.latestMessage = [];
    }
}
