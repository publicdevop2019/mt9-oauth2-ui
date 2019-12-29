import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
export interface ICategory{
  id:number,
  title:string,
  url:string
}
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getCategories(): Observable<ICategory[]> {
    return this.httpProxy.netImpl.getCategories()
  }
  getCategoryById(id: number): Observable<ICategory> {
    return this.getCategories().pipe(switchMap(clients => {
      return of(clients.find(el => el.id === id))
    }))
  }
  create(category: ICategory) {
    this.httpProxy.netImpl.createCategory(category).subscribe(result => {
      this.notify(result)
    })
  }
  update(category: ICategory) {
    this.httpProxy.netImpl.updateCategory(category).subscribe(result => {
      this.notify(result)
    })

  }
  delete(category: ICategory) {
    this.httpProxy.netImpl.deleteCategory(category).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
