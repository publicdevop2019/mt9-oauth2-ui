import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { switchMap } from 'rxjs/operators';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IAttribute {
  id: number,
  name: string,
  value?: string,
  method: 'MANUAL' | 'SELECT',
}
export interface IAttributeHttp {
  data: IAttribute[]
}
@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  getAttributeById(id: number): Observable<IAttribute> {
    return this.getAttributeList().pipe(switchMap(els => {
      return of(els.data.find(el => el.id === id))
    }))
  }
  getAttributeList(): Observable<IAttributeHttp> {
    return this.httpProxy.netImpl.getAttributes()
  }
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, private _httpInterceptor: CustomHttpInterceptor) {

  }
  create(attribute: IAttribute) {
    this.httpProxy.netImpl.createAttribute(attribute).subscribe(result => {
      this.notify(result)
    })
  }
  update(attribute: IAttribute) {
    this.httpProxy.netImpl.updateAttribute(attribute).subscribe(result => {
      this.notify(result)
    })

  }
  delete(attribute: IAttribute) {
    this.httpProxy.netImpl.deleteAttribute(attribute).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}