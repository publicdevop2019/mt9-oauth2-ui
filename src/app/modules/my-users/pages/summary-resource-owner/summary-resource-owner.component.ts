import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { IAuthority } from 'src/app/modules/my-apps/pages/summary-client/summary-client.component';
import { DeviceService } from 'src/app/services/device.service';
export interface IResourceOwner {
  id?: number,
  email: string;
  password: string;
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
  displayedColumns: string[] = ['id', 'email', 'edit', 'delete', 'token'];
  dataSource: MatTableDataSource<IResourceOwner>;
  /** @todo add access control based on role */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public resourceOwnerService: ResourceOwnerService, public deviceSvc: DeviceService) {
    this.resourceOwnerService.getResourceOwners().subscribe(resourceOwners => {
      this.resourceOwnerService.cachedResourceOwners = resourceOwners;
      this.dataSource = new MatTableDataSource(resourceOwners);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
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
}
