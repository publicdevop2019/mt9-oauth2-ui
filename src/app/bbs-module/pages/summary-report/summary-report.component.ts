import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IUserReaction, ReactionService, IUserReactionResult } from 'src/app/service/reaction.service';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {
  displayedColumns: string[] = ['count', 'referenceId', 'referenceType'];
  dataSource: MatTableDataSource<IUserReaction>;
  pageNumber = 0;
  pageSize = 20;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private commentSvc: ReactionService) {
    this.commentSvc.rankReports(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalHandler(products)
    });
  }
  ngOnDestroy(): void {
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
    this.pageNumber = e.pageIndex;
    this.commentSvc.rankDislikes(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalHandler(products)
    });
  }
  private totalHandler(posts: IUserReactionResult) {
    this.dataSource = new MatTableDataSource(posts.results);
    this.dataSource.sort = this.sort;
  }
}
