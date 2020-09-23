import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EntityCommonService } from '../clazz/entity.common-service';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';

export interface IProductSimple {
  id: number;
  name: string;
  endAt: number;
  startAt: number;
  attributesKey: string[];
  priceList: number[];
  totalSales: number;
  coverImage: string;
  attrSalesMap: { [key: string]: number }
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
export interface ISkuNew {
  id: number
  referenceId: string,
  description: string,
  storageOrder: number;
  storageActual: number;
  price: number;
  sales: number;
}
export interface IProductDetail {
  id: number;
  name: string;
  imageUrlSmall: string;
  description: string;
  attributesKey: string[];
  imageUrlLarge?: string[];
  selectedOptions?: IProductOptions[];
  specification?: string[];
  attributesProd?: string[];
  attributesGen?: string[];
  attributeSaleImages?: IAttrImage[]
  skus: ISku[];
  endAt?: number,
  startAt?: number,
  lowestPrice?: number;
  totaleSales?: number;
}
export interface IAttrImage {
  attributeSales: string,
  imageUrls: string[]
}
@Injectable({
  providedIn: 'root'
})
export class ProductService extends EntityCommonService<IProductSimple, IProductDetail>{
  private PRODUCT_SVC_NAME = '/product-svc';
  private ENTITY_NAME = '/products';
  entityRepo: string = environment.serverUri + this.PRODUCT_SVC_NAME + this.ENTITY_NAME;
  role: string = 'admin';
  constructor(private httpProxy: HttpProxyService, interceptor: CustomHttpInterceptor) {
    super(httpProxy, interceptor);
  }
  updateProdStatus(id: number, status: 'AVAILABLE' | 'UNAVAILABLE', changeId: string) {
    this.httpProxy.updateProductStatus(id, status, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  batchUpdateProdStatus(ids: number[], status: 'AVAILABLE' | 'UNAVAILABLE', changeId: string) {
    this.httpProxy.batchUpdateProductStatus(ids, status, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
}
