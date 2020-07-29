import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { switchMap } from 'rxjs/operators';
export interface IFilterItem {
  id: number,
  name: string,
  values: string[]
}
export interface IFilter {
  id: number
  catalogs: string[],
  filters: IFilterItem[]
}
export interface IFilterSummary {
  id: number,
  catalogs: string[]
}
export interface IFilterSummaryNet {
  data: IFilterSummary[];
  totalItemCount: number,
}
@Injectable({
  providedIn: 'root'
})
export class FilterService {
  refreshSummary: Subject<void> = new Subject();
  closeSheet: Subject<void> = new Subject();
  currentPageIndex: number = 0;
  constructor(private httpProxy: HttpProxyService, private _httpInterceptor: CustomHttpInterceptor) {

  }
  getById(id: number): Observable<IFilter> {
    return this.httpProxy.readFilter(id)
  }
  getAll(pageNum: number, pageSize: number, sortBy?: string, sortOrder?: string): Observable<IFilterSummaryNet> {
    return this.httpProxy.getAllFilters(pageNum, pageSize, sortBy, sortOrder)
  }
  create(filter: IFilter) {
    this.httpProxy.createFilter(filter).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(attribute: IFilter) {
    this.httpProxy.updateFilter(attribute).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })

  }
  delete(id: number) {
    this.httpProxy.deleteFilter(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
}
