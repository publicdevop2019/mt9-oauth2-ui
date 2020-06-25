import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
export interface ICatalogCustomer {
  id: number,
  name: string,
  parentId?: number,
  attributesKey?: string[],
  catalogType?: 'BACKEND' | 'FRONTEND',
}
export interface ICatalogCustomerTreeNode {
  id: number,
  name: string,
  children?: ICatalogCustomerTreeNode[],
  tags?: string[],
}
export interface ICatalogCustomerHttp {
  data: ICatalogCustomer[],
  meta?: any
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getCatalogFrontend(): Observable<ICatalogCustomerHttp> {
    return this.httpProxy.netImpl.getCatalogFrontendAdmin()
  }
  getCatalogBackend(): Observable<ICatalogCustomerHttp> {
    return this.httpProxy.netImpl.getCatalogBackendAdmin()
  }
  getCatalogFrontendById(id: number): Observable<ICatalogCustomer> {
    return this.getCatalogFrontend().pipe(switchMap(els => {
      return of(els.data.find(el => el.id === id))
    }))
  }
  getCatalogBackendById(id: number): Observable<ICatalogCustomer> {
    return this.getCatalogBackend().pipe(switchMap(els => {
      return of(els.data.find(el => el.id === id))
    }))
  }
  create(category: ICatalogCustomer) {
    this.httpProxy.netImpl.createCategory(category).subscribe(result => {
      this.notify(result)
    })
  }
  update(category: ICatalogCustomer) {
    this.httpProxy.netImpl.updateCategory(category).subscribe(result => {
      this.notify(result)
    })

  }
  delete(category: ICatalogCustomer) {
    this.httpProxy.netImpl.deleteCategory(category).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
