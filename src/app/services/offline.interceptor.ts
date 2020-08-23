import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockAttrs } from 'src/assets/mocks/mock-attributes';
import { mockCatalogAdmin } from 'src/assets/mocks/mock-catalog-admin';
import { mockCatalogCustomer } from 'src/assets/mocks/mock-catalog-customer';
import { mockClient } from 'src/assets/mocks/mock-clients';
import { mockFilter } from 'src/assets/mocks/mock-filter';
import { mockFilters } from 'src/assets/mocks/mock-filters';
import { mockOrders } from 'src/assets/mocks/mock-order';
import { mockProductDetails } from 'src/assets/mocks/mock-product-detail';
import { mockProducts } from 'src/assets/mocks/mock-product-simple';
import { mockResourceO } from 'src/assets/mocks/mock-resource-owners';
import { mockSP } from 'src/assets/mocks/mock-security-profile';
import { environment } from 'src/environments/environment';
import { IAuthorizeCode } from '../interfaze/commom.interface';
import { mockCatalog } from 'src/assets/mocks/mock-catalog';
import { mockAttr } from 'src/assets/mocks/mock-attribute';
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
        if (req.url.includes('attributes/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockAttr })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('attributes/admin')) {
          return of(new HttpResponse({ status: 200, body: mockAttrs })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/products/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockProductDetails })).pipe(delay(this.DEFAULT_DELAY))
          // return of(new HttpResponse({ status: 200, body: mockProductDetail })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('products/admin')) {
          return of(new HttpResponse({ status: 200, body: mockProducts })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin?query=type:FRONTEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogCustomer })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin?query=type:BACKEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogAdmin })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockCatalog })).pipe(delay(this.DEFAULT_DELAY))
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
        if (req.url.includes('filters/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockFilter })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('filters/admin')) {
          return of(new HttpResponse({ status: 200, body: mockFilters })).pipe(delay(this.DEFAULT_DELAY))
        }
      }
    }
    return next.handle(req);
  }
}