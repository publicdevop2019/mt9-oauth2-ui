import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IClient } from '../page/summary-client/summary-client.component';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { switchMap } from 'rxjs/operators';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /** @todo set expire time for cached data */
  cachedClients: IClient[];
  currentPageIndex: number;
  constructor(private router: Router, private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  revokeClientToken(clientId: string): void {
    this.httpProxy.netImpl.revokeClientToken(clientId).subscribe(result => {
      this.notifyTokenRevocation(result);
    })
  }
  getClients(): Observable<IClient[]> {
    return this.httpProxy.netImpl.getClients()
  }
  getClient(id: number): Observable<IClient> {
    return this.cachedClients ? of(this.cachedClients.find(e => e.id === id)) : of(undefined)
  }
  getResourceClient(): Observable<IClient[]> {
    return this.getClients().pipe(switchMap(clients => {
      return of(clients.filter(el => el.resourceIndicator))
    }))
  }
  updateClient(client: IClient): void {
    this.httpProxy.netImpl.updateClient(client).subscribe(result => {
      this.notifyTokenRevocation(result)
    })
  }
  deleteClient(client: IClient): void {
    this.httpProxy.netImpl.deleteClient(client).subscribe(result => {
      this.notify(result)
      this.router.navigateByUrl('/dashboard');
    })
  }
  createClient(client: IClient): void {
    this.httpProxy.netImpl.createClient(client).subscribe(result => {
      this.notify(result)
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success') : this._httpInterceptor.openSnackbar('operation failed');
  }
  notifyTokenRevocation(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('operation success, old token has been revoked') : this._httpInterceptor.openSnackbar('operation failed');
  }
}
