import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { ClientComponent } from '../client/client.component';
import { IClient } from '../../interface/client.interface';
@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
})
export class SummaryClientComponent implements OnInit {
  displayedColumns: string[] = ['id', 'clientId', 'edit', 'token','delete'];
  dataSource: MatTableDataSource<IClient>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public clientService: ClientService,
    public deviceSvc:DeviceService,
    private _bottomSheet: MatBottomSheet,
    ) {
    this.clientService.getClients().subscribe(clients => {
      this.dataSource = new MatTableDataSource(clients)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngOnInit() {
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (id) {
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
}