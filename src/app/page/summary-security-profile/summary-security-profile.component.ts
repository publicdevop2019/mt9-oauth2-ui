import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityProfileService } from 'src/app/service/security-profile.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  header:string;
  displayedColumns: string[] = ['id', 'resourceID', 'path', 'method', 'star'];
  dataSource: MatTableDataSource<ISecurityProfile>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public securityProfileSvc: SecurityProfileService, private breakpointObserver: BreakpointObserver) {
    this.securityProfileSvc.readAll().subscribe(profiles => {
      this.securityProfileSvc.cachedSecurityProfiles = profiles;
      this.dataSource = new MatTableDataSource(profiles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(next => {
      if (next.breakpoints[Breakpoints.XSmall]) {
        console.dir('xsmall')
        this.displayedColumns = ['resourceID', 'path', 'method'];
      }
      else if (next.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['resourceID', 'path', 'method'];
      }
      else if (next.breakpoints[Breakpoints.Medium]) {
        this.displayedColumns = ['id', 'resourceID', 'path', 'method', 'star'];
        console.dir('medium')
      }
      else if (next.breakpoints[Breakpoints.Large]) {
        this.displayedColumns = ['id', 'resourceID', 'path', 'method', 'star'];
        console.dir('large')
      }
      else if (next.breakpoints[Breakpoints.XLarge]) {
        this.displayedColumns = ['id', 'resourceID', 'path', 'method', 'star'];
        console.dir('xlarge')
      }
      else {
        console.error('unknown device width match!')
        console.dir(next)
      }
    });
  }

  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.securityProfileSvc.currentPageIndex = e.pageIndex
  }
}
