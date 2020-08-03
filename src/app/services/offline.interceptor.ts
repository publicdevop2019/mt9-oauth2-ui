import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockAttr } from 'src/assets/mock-attributes';
import { mockCatalogAdmin } from 'src/assets/mock-catalog-admin';
import { mockCatalogCustomer } from 'src/assets/mock-catalog-customer';
import { mockClient } from 'src/assets/mock-clients';
import { mockOrders } from 'src/assets/mock-order';
import { mockProductDetails as mockProductDetail } from 'src/assets/mock-product-detail';
import { mockProducts } from 'src/assets/mock-product-simple';
import { mockResourceO } from 'src/assets/mock-resource-owners';
import { mockSP } from 'src/assets/mock-security-profile';
import { environment } from 'src/environments/environment';
import { IAuthorizeCode } from '../interfaze/commom.interface';
import { mockFilters } from 'src/assets/mock-filters';
import { mockFilter } from 'src/assets/mock-filter';
import { mockProductDetailsNoSku } from 'src/assets/mock-product-detail-no-sku';
/**
 * use refresh token if call failed
 */
@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private DEFAULT_DELAY = 1000;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.mode === 'offline') {
      if (['delete', 'put', 'post', 'patch'].includes(req.method.toLowerCase())) {
        if (req.url.includes('/authorize'))
          return of(new HttpResponse({ status: 200, body: { authorize_code: 'dummyCode' } as IAuthorizeCode })).pipe(delay(this.DEFAULT_DELAY))
        if (req.url.includes('/oauth/token')) {
          const mockedToken = {
            access_token: 'mockTokenString',
            refresh_token: 'mockTokenString2'
          };
          return of(new HttpResponse({ status: 200, body: mockedToken })).pipe(delay(this.DEFAULT_DELAY));
        }
        return of(new HttpResponse({ status: 200 })).pipe(delay(this.DEFAULT_DELAY));
      }
      if (['get'].includes(req.method.toLowerCase())) {
        if (req.url.includes('admin/attributes')) {
          return of(new HttpResponse({ status: 200, body: mockAttr })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/admin/productDetails/')) {
          return of(new HttpResponse({ status: 200, body: mockProductDetailsNoSku })).pipe(delay(this.DEFAULT_DELAY))
          // return of(new HttpResponse({ status: 200, body: mockProductDetail })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('admin/productDetails')) {
          return of(new HttpResponse({ status: 200, body: mockProducts })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/admin/catalogs?query=type:FRONTEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogCustomer })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/admin/catalogs?query=type:BACKEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogAdmin })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/')) {
          return of(new HttpResponse({ status: 200, body: mockProducts })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/proxy/security/profiles')) {
          return of(new HttpResponse({ status: 200, body: mockSP })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('clients')) {
          return of(new HttpResponse({ status: 200, body: mockClient })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('resourceOwners')) {
          return of(new HttpResponse({ status: 200, body: mockResourceO })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('orders')) {
          return of(new HttpResponse({ status: 200, body: mockOrders })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('filters/')) {
          return of(new HttpResponse({ status: 200, body: mockFilter })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('filters')) {
          return of(new HttpResponse({ status: 200, body: mockFilters })).pipe(delay(this.DEFAULT_DELAY))
        }
      }
    }
    return next.handle(req);
  }
}