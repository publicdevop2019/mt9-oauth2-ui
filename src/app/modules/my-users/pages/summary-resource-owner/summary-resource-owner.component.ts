import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { DeviceService } from 'src/app/services/device.service';
import { IAuthority } from 'src/app/modules/my-apps/interface/client.interface';
import { ResourceOwnerComponent } from '../resource-owner/resource-owner.component';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
export interface IResourceOwner {
  id?: number,
  email: string;
  password?: string;
  locked: boolean;
  subscription?: boolean;
  grantedAuthorities: IAuthority[];
}
export interface IPendingResourceOwner {
  email: string;
  password?: string;
  activationCode?: string;
}
export interface IForgetPasswordRequest {
  email: string;
  token?: string;
  newPassword?: string;
}
export interface IResourceOwnerUpdatePwd {
  password: string;
  currentPwd: string;
}
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
})
export class SummaryResourceOwnerComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'edit', 'token', 'delete'];
  dataSource: MatTableDataSource<IResourceOwner>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public resourceOwnerService: ResourceOwnerService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.resourceOwnerService.refreshSummary.pipe(switchMap(() => this.resourceOwnerService.getResourceOwners())).subscribe(next => { this.updateSummaryData(next) })
    this.resourceOwnerService.getResourceOwners().subscribe(next => { this.updateSummaryData(next) })
  }
  updateSummaryData(next: IResourceOwner[]) {
    this.dataSource = new MatTableDataSource(next)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  revokeResourceOwnerToken(resourceOwnersName: string) {
    this.resourceOwnerService.revokeResourceOwnerToken(resourceOwnersName);
  }
  pageHandler(e: PageEvent) {
    this.resourceOwnerService.currentPageIndex = e.pageIndex
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.resourceOwnerService.getResourceOwner(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(ResourceOwnerComponent, config);
      })
    } else {
      this._bottomSheet.open(ResourceOwnerComponent, config);
    }
  }
}
