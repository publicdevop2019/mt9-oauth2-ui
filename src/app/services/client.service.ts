import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
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
  refreshSummary: Subject<void> = new Subject();
  constructor(private router: Router, private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  revokeClientToken(clientId: string): void {
    this.httpProxy.revokeClientToken(clientId).subscribe(result => {
      this.notifyTokenRevocation(result);
    })
  }
  getClients(): Observable<IClient[]> {
    return this.httpProxy.getClients()
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
    this.httpProxy.updateClient(client).subscribe(result => {
      this.notifyTokenRevocation(result)
      this.refreshSummary.next()
    })
  }
  delete(id: number): void {
    this.httpProxy.deleteClient(id).subscribe(result => {
      this.notify(result)
      this.router.navigateByUrl('/dashboard/clients');
      this.refreshSummary.next()
    })
  }
  createClient(client: IClient): void {
    this.httpProxy.createClient(client).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
  notify(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
  notifyTokenRevocation(result: boolean) {
    result ? this._httpInterceptor.openSnackbar('OPERATION_SUCCESS_TOKEN') : this._httpInterceptor.openSnackbar('OPERATION_FAILED');
  }
}
