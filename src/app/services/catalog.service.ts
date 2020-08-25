import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
import { IEditEvent } from '../components/editable-field/editable-field.component';
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
export class CatalogService {
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
  getCatalogById(id: number): Observable<ICatalogCustomer> {
    return this.httpProxy.getCatalogByIdAdmin(id)
  }
  create(category: ICatalogCustomer, changeId: string) {
    this.httpProxy.createCategory(category, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(category: ICatalogCustomer, changeId: string) {
    this.httpProxy.updateCategory(category, changeId).subscribe(result => {
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
  doPatch(id: number, value: IEditEvent, type: string, changeId: string) {
    this.httpProxy.updateProductSvcField(id, 'catalogs', type, value, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
}
