import { Subject } from 'rxjs';
import { IEditEvent } from '../components/editable-field/editable-field.component';
import { HttpProxyService } from '../services/http-proxy.service';
import { CustomHttpInterceptor } from '../services/http.interceptor';
import { IEntityService, IIdBasedEntity } from "./summary.component";

export class EntityCommonService<C extends IIdBasedEntity, D> implements IEntityService<C, D>{
    httpProxySvc: HttpProxyService;
    refreshSummary: Subject<any> = new Subject();
    currentPageIndex: number = 0;
    entityRepo: string;
    role: string;
    interceptor: CustomHttpInterceptor
    constructor(httpProxySvc: HttpProxyService, interceptor: CustomHttpInterceptor) {
        this.httpProxySvc = httpProxySvc;
        this.interceptor = interceptor;
    }
    readById(id: number) {
        return this.httpProxySvc.readEntityById<D>(this.entityRepo, this.role, id)
    };
    readByQuery(num: number, size: number, query?: string, by?: string, order?: string) {
        return this.httpProxySvc.readEntityByQuery<C>(this.entityRepo, this.role, num, size, query, by, order)
    };
    deleteByQuery(query: string) {
        this.httpProxySvc.deleteEntityByQuery(this.entityRepo, this.role, query).subscribe(() => {
            this.refreshSummary.next();
        })
    };
    deleteById(id: number) {
        this.httpProxySvc.deleteEntityById(this.entityRepo, this.role, id).subscribe(() => {
            this.refreshSummary.next();
        })
    };
    create(s: D, changeId: string) {
        this.httpProxySvc.createEntity(this.entityRepo, this.role, s, changeId).subscribe(() => {
            this.refreshSummary.next();
        })
    };
    update(id: number, s: D, changeId: string) {
        this.httpProxySvc.updateEntity(this.entityRepo, this.role, id, s, changeId).subscribe(() => {
            this.refreshSummary.next();
        })
    };
    patch(id: number, event: IEditEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(() => {
            this.refreshSummary.next();
        })
    };
    notify(result: boolean) {
        result ? this.interceptor.openSnackbar('OPERATION_SUCCESS') : this.interceptor.openSnackbar('OPERATION_FAILED');
    }
}