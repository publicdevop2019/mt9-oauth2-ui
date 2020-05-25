import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpProxyService } from './http-proxy.service';
import { MatDialog } from '@angular/material';
import { CustomHttpInterceptor } from './http.interceptor';
import { Observable, of } from 'rxjs';
import { IClient } from '../pages/summary-client/summary-client.component';
import { switchMap } from 'rxjs/operators';
import { IOrder } from '../interfaze/commom.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  currentPageIndex: number;
  constructor(private router: Router, private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  getOrders(): Observable<IOrder[]> {
    return this.httpProxy.netImpl.getOrders()
  }
  getOrderById(id: string): Observable<IOrder> {
    return this.getOrders().pipe(switchMap(orders => {
      return of(orders.find(el => el.id == id))
    }))
  }
  updateOrder(client: IClient): void {
  }
  deleteOrder(client: IClient): void {
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
  notifyTokenRevocation(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success, old token has been revoked') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
