import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
export interface ICatalogCustomer {
  id: number,
  name: string,
  parentId?: number,
  attributes?: string[],
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
  totalItemCount: number,
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  currentPageIndex: number = 0;
  refreshSummary: Subject<void> = new Subject();
  closeSheet: Subject<void> = new Subject();
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getCatalogFrontend(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<ICatalogCustomerHttp> {
    return this.httpProxy.getCatalogFrontendAdmin(pageNum, pageSize, sortBy, sortOrder)
  }
  getCatalogBackend(pageNum?: number, pageSize?: number, sortBy?: string, sortOrder?: string): Observable<ICatalogCustomerHttp> {
    return this.httpProxy.getCatalogBackendAdmin(pageNum, pageSize, sortBy, sortOrder)
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
    this.httpProxy.createCategory(category).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(category: ICatalogCustomer) {
    this.httpProxy.updateCategory(category).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })

  }
  delete(id: number) {
    this.httpProxy.deleteCategory(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
}
