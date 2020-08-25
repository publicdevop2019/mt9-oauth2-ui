import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig, Sort } from '@angular/material';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { ClientComponent } from '../client/client.component';
import { IClient, IAuthority, IClientSumRep } from '../../interface/client.interface';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { Subscription } from 'rxjs';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
})
export class SummaryClientComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'clientId','description', 'resourceIndicator', 'grantTypeEnums', 'accessTokenValiditySeconds', 'grantedAuthorities', 'resourceIds', 'edit', 'token', 'delete'];
  dataSource: MatTableDataSource<IClient>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  totoalItemCount: number;
  private subs: Subscription = new Subscription()
  constructor(
    public clientService: ClientService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {
    let sub = this.clientService.refreshSummary.pipe(switchMap(() => this.clientService.getClients(this.clientService.currentPageIndex, this.deviceSvc.pageSize))).subscribe(next => { this.updateSummaryData(next) })
    let sub0 = this.clientService.getClients(this.clientService.currentPageIndex, this.deviceSvc.pageSize).subscribe(next => { this.updateSummaryData(next) })
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit() {
  }
  updateSummaryData(next: IClientSumRep) {
    this.dataSource = new MatTableDataSource(next.data)
    this.totoalItemCount = next.totalItemCount;
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.clientService.getClientById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(ClientComponent, config);
      })
    } else {
      this._bottomSheet.open(ClientComponent, config);
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  revokeClientToken(clientId: string) {
    this.clientService.revokeClientToken(clientId);
  }
  pageHandler(e: PageEvent) {
    this.clientService.currentPageIndex = e.pageIndex
  }
  parseAuthority(autho: IAuthority[]): string[] {
    return autho.map(e => e.grantedAuthority)
  }
  updateTable(sort: Sort) {
    this.clientService.getClients(this.clientService.currentPageIndex, this.deviceSvc.pageSize, sort.active, sort.direction).subscribe(next => {
      this.updateSummaryData(next)
    });
  }
  doPatchDesc(id: number, event: IEditEvent) {
    this.clientService.doPatch(id, event, 'description', UUID())
  }
}