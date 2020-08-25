import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { switchMap } from 'rxjs/operators';
import { CustomHttpInterceptor } from './http.interceptor';
import { IEditEvent } from '../components/editable-field/editable-field.component';
export interface IBizAttribute {
  id: number,
  name: string,
  description?: string,
  selectValues?: string[],
  method: 'MANUAL' | 'SELECT',
  type: 'PROD_ATTR' | 'SALES_ATTR' | 'KEY_ATTR' | 'GEN_ATTR'
}
export interface IAttributeHttp {
  data: IBizAttribute[];
  totalItemCount: number,
}
@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  refreshSummary: Subject<void> = new Subject();
  closeSheet: Subject<void> = new Subject();
  currentPageIndex: number = 0;
  constructor(private httpProxy: HttpProxyService, private _httpInterceptor: CustomHttpInterceptor) {

  }
  getAttributeById(id: number): Observable<IBizAttribute> {
    return this.httpProxy.getAttributeById(id)
  }
  getAttributeList(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<IAttributeHttp> {
    return this.httpProxy.getAttributes(pageNum, pageSize, sortBy, sortOrder)
  }
  create(attribute: IBizAttribute, changeId: string) {
    this.httpProxy.createAttribute(attribute, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(attribute: IBizAttribute, changeId: string) {
    this.httpProxy.updateAttribute(attribute, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })

  }
  delete(id: number) {
    this.httpProxy.deleteAttribute(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
  doPatch(id: number, value: IEditEvent, type: string, changeId: string) {
    this.httpProxy.updateProductSvcField(id, 'attributes', type, value, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
}
