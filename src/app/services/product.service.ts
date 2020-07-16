import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
export interface IProductTotalResponse {
  data: IProductSimple[],
  totalPageCount: number,
  totalProductCount: number,
}
export interface IProductSimple {
  id: string;
  name: string;
  attributesKey: string[];
  priceList:number[];
  totalSales:number;
}
export interface IProductOptions {
  title: string;
  options: IProductOption[];
}
export interface IProductOption {
  optionValue: string;
  priceVar?: string;
}
export interface ISku {
  attributesSales: string[];
  storageOrder?: number;
  storageActual?: number;
  price: number;
  sales?: number;
  increaseOrderStorage?: number;
  decreaseOrderStorage?: number;
  increaseActualStorage?: number;
  decreaseActualStorage?: number;
}
export interface IProductDetail {
  id: string;
  name: string;
  imageUrlSmall: string;
  description: string;
  attributesKey: string[];
  imageUrlLarge?: string[];
  selectedOptions?: IProductOptions[];
  specification?: string[];
  attributesProd?: string[];
  attributesGen?: string[];
  skus: ISku[];
  status:'AVAILABLE'|'UNAVAILABLE'
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  refreshSummary:Subject<void>=new Subject();
  closeSheet:Subject<void>=new Subject();
  currentPageIndex: number;
  constructor(private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getAllProduct(pageNum: number, pageSize: number): Observable<IProductTotalResponse> {
    return this.httpProxy.getAllProducts(pageNum, pageSize)
  }
  searchProductsByTags(pageNum: number, pageSize: number, tags: string[]): Observable<IProductTotalResponse> {
    return this.httpProxy.searchProductsByTags(pageNum, pageSize, tags)
  }
  searchProductById(id: number): Observable<IProductTotalResponse> {
    return this.httpProxy.searchProductById(id)
  }
  searchProductByKeyword(pageNum: number, pageSize: number, keyword: string): Observable<IProductTotalResponse> {
    return this.httpProxy.searchProductByKeyword(pageNum, pageSize, keyword)
  }
  getProductDetailById(id: number): Observable<IProductDetail> {
    return this.httpProxy.getProductDetail(id)
  }
  create(product: IProductDetail) {
    this.httpProxy.createProduct(product).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  update(product: IProductDetail) {
    this.httpProxy.updateProduct(product).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })

  }
  delete(id: number) {
    this.httpProxy.deleteProduct(id).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
      this.closeSheet.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
