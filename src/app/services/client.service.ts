import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { switchMap } from 'rxjs/operators';
import { IClient } from '../modules/my-apps/interface/client.interface';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
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
  getClientById(id: number): Observable<IClient> {
    return this.getClients().pipe(switchMap(clients => {
      return of(clients.find(el => el.id === id))
    }))
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
  delete(id: number): void {
    this.httpProxy.netImpl.deleteClient(id).subscribe(result => {
      this.notify(result)
      this.router.navigateByUrl('/dashboard/clients');
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
