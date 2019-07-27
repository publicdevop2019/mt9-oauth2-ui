import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface ISecurityProfile {
  resourceID: string;
  path: string;
  method: string;
  expression: string;
  id: number;
  url?: string;
}
@Component({
  selector: 'app-summary-security-profile',
  templateUrl: './summary-security-profile.component.html',
  styleUrls: ['./summary-security-profile.component.css']
})
export class SummarySecurityProfileComponent implements OnInit {
  displayedColumns: string[] = ['id', 'resourceID', 'path', 'method', 'star'];
  dataSource: MatTableDataSource<ISecurityProfile>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private securityProfileSvc: SecurityProfileService) {
    this.securityProfileSvc.readAll().subscribe(profiles => {
      this.securityProfileSvc.cachedSecurityProfiles = profiles;
      this.dataSource = new MatTableDataSource(profiles);
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
}
