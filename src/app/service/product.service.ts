import { Injectable } from '@angular/core';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
import { Observable, of, merge } from 'rxjs';
import { ICategory } from './category.service';
import { switchMap, flatMap } from 'rxjs/operators';
export interface IProductSimple {
  imageUrlSmall: string;
  name: string;
  description: string;
  rate?: string;
  price: string;
  sales: string;
  category: string;
  id: string;
}
export interface IProductOptions {
  title: string;
  options: IProductOption[];
}
export interface IProductOption {
  optionValue: string;
  priceVar?: string;
}
export interface IProductDetail extends IProductSimple {
  imageUrlLarge?: string[];
  selectedOptions?: IProductOptions[];
  specification?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getProductWAllCategory(): Observable<IProductSimple[]> {
    return this.httpProxy.netImpl.getCategories().pipe(switchMap(next => {
      let ob:Observable<IProductSimple[]>[]=next.map(e=>this.httpProxy.netImpl.getProducts(e.title));
      let ob2:Observable<IProductSimple[]>=merge(...[ob]).pipe(flatMap(flat=>flat))
      return   ob2;
    }))
    
  }
  getProductDetailById(id: number): Observable<IProductDetail> {
    return this.httpProxy.netImpl.getProductDetail(id)
  }
  create(product: IProductDetail) {
    this.httpProxy.netImpl.createProduct(product).subscribe(result => {
      this.notify(result)
    })
  }
  update(product: IProductDetail) {
    this.httpProxy.netImpl.updateProduct(product).subscribe(result => {
      this.notify(result)
    })

  }
  delete(product: IProductDetail) {
    this.httpProxy.netImpl.deleteProduct(product).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
