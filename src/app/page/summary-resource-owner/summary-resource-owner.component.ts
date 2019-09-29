import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IAuthority } from '../summary-client/summary-client.component';
import { ResourceOwnerService } from 'src/app/service/resource-owner.service';
export interface IResourceOwner {
  id?: number,
  email: string;
  password: string;
  locked: boolean;
  grantedAuthorities: IAuthority[];
}
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
  styleUrls: ['./summary-resource-owner.component.css']
})
export class SummaryResourceOwnerComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'star', 'token'];
  dataSource: MatTableDataSource<IResourceOwner>;
  /** @todo add access control based on role */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public resourceOwnerService: ResourceOwnerService) {
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
