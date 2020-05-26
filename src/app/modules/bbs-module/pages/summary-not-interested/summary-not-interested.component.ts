import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IUserReaction, ReactionService, IUserReactionResult } from 'src/app/services/reaction.service';

@Component({
  selector: 'app-summary-not-interested',
  templateUrl: './summary-not-interested.component.html',
  styleUrls: ['./summary-not-interested.component.css']
})
export class SummaryNotInterestedComponent implements OnInit {
  displayedColumns: string[] = ['count', 'referenceId', 'referenceType'];
  dataSource: MatTableDataSource<IUserReaction>;
  pageNumber = 0;
  pageSize = 20;
  totoal = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private commentSvc: ReactionService) {
    this.commentSvc.rankNotInterested(this.pageNumber || 0, this.pageSize).subscribe(products => {
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
    this.totoal = posts.total;
  }
}
