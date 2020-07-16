import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { switchMap } from 'rxjs/operators';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IAttribute {
  id: number,
  name: string,
  description?: string,
  selectValues?: string[],
  method: 'MANUAL' | 'SELECT',
  type: 'PROD_ATTR' | 'SALES_ATTR' | 'KEY_ATTR' | 'GEN_ATTR'
}
export interface IAttributeHttp {
  data: IAttribute[]
}
@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  refreshSummary:Subject<void>=new Subject();
  closeSheet:Subject<void>=new Subject();
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, private _httpInterceptor: CustomHttpInterceptor) {

  }
  getAttributeById(id: number): Observable<IAttribute> {
    return this.getAttributeList().pipe(switchMap(els => {
      return of(els.data.find(el => el.id === id))
    }))
  }
  getAttributeList(): Observable<IAttributeHttp> {
    return this.httpProxy.getAttributes()
  }
  create(attribute: IAttribute) {
    this.httpProxy.createAttribute(attribute).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(attribute: IAttribute) {
    this.httpProxy.updateAttribute(attribute).subscribe(result => {
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
}
