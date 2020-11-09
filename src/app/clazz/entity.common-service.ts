import { Subject } from 'rxjs';
import { IEditEvent } from '../components/editable-field/editable-field.component';
import { HttpProxyService } from '../services/http-proxy.service';
import { CustomHttpInterceptor } from '../services/http.interceptor';
import { IEntityService, IIdBasedEntity } from "./summary.component";
import { IEditListEvent } from '../components/editable-select-multi/editable-select-multi.component';
import { IEditBooleanEvent } from '../components/editable-boolean/editable-boolean.component';
import { IEditInputListEvent } from '../components/editable-input-multi/editable-input-multi.component';

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
    deleteByQuery(query: string, changeId: string) {
        this.httpProxySvc.deleteEntityByQuery(this.entityRepo, this.role, query, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    deleteById(id: number, changeId: string) {
        this.httpProxySvc.deleteEntityById(this.entityRepo, this.role, id, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    create(s: D, changeId: string) {
        this.httpProxySvc.createEntity(this.entityRepo, this.role, s, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    update(id: number, s: D, changeId: string) {
        this.httpProxySvc.updateEntity(this.entityRepo, this.role, id, s, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    patch(id: number, event: IEditEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    patchAtomicNum(id: number, event: IEditEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityAtomicById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    patchList(id: number, event: IEditListEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityListById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    patchMultiInput(id: number, event: IEditInputListEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityInputListById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    patchBoolean(id: number, event: IEditBooleanEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityBooleanById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    notify(result: boolean) {
        result ? this.interceptor.openSnackbar('OPERATION_SUCCESS') : this.interceptor.openSnackbar('OPERATION_FAILED');
    }
}