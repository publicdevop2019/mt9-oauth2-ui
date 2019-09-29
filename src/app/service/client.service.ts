import { Injectable } from '@angular/core';
import { IClient } from '../page/summary-client/summary-client.component';
import { Observable, of } from 'rxjs';
import { HttpProxyService } from './http-proxy.service';
import { MsgBoxComponent } from '../msg-box/msg-box.component';
import { MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
/**
 * responsible for convert FormGroup to business model
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /** @todo set expire time for cached data */
  cachedClients: IClient[];
  currentPageIndex:number;
  constructor(private router: Router, private httpProxy: HttpProxyService, public dialog: MatDialog) { }
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
    return this.cachedClients ? of(this.cachedClients.filter(e => e.resourceIndicator)) : of(undefined)
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
  openDialog(msg: string): void {
    this.dialog.open(MsgBoxComponent, {
      width: '250px',
      data: msg
    });
  }
  notify(result: boolean) {
    result ? this.openDialog('operation success') : this.openDialog('operation failed');
  }
  notifyTokenRevocation(result: boolean) {
    result ? this.openDialog('operation success, old token has been revoked') : this.openDialog('operation failed');
  }
}
