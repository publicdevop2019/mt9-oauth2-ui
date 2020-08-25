import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { CustomHttpInterceptor } from './http.interceptor';
import { switchMap } from 'rxjs/operators';
import { IClient } from '../modules/my-apps/interface/client.interface';
import { IEditEvent } from '../components/editable-field/editable-field.component';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  currentPageIndex: number=0;
  refreshSummary: Subject<void> = new Subject();
  constructor(private router: Router, private httpProxy: HttpProxyService, public dialog: MatDialog, private _httpInterceptor: CustomHttpInterceptor) { }
  revokeClientToken(clientId: string): void {
    this.httpProxy.revokeClientToken(clientId).subscribe(result => {
      this.notifyTokenRevocation(result);
    })
  }
  getClients(pageNum: number, pageSize: number, sortBy?: string, sortOrder?: string) {
    return this.httpProxy.getClients(pageNum, pageSize, sortBy, sortOrder)
  }
  getClientById(id: number): Observable<IClient> {
    return this.httpProxy.getClientsById(id);
  }
  getResourceClient() {
    return this.httpProxy.getResourceClient();
  }
  updateClient(client: IClient, changeId: string): void {
    this.httpProxy.updateClient(client, changeId).subscribe(result => {
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
  createClient(client: IClient, changeId: string): void {
    this.httpProxy.createClient(client, changeId).subscribe(result => {
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
  doPatch(id: number, value: IEditEvent, type: string, changeId: string) {
    this.httpProxy.updateAuthSvcField(id, 'clients', type, value, changeId).subscribe(result => {
      this.notify(result)
      this.refreshSummary.next()
    })
  }
}
