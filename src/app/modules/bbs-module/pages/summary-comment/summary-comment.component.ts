import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { CommentService, IComment, ICommentSummary } from 'src/app/services/comment.service';

@Component({
  selector: 'app-summary-comment',
  templateUrl: './summary-comment.component.html',
  styleUrls: ['./summary-comment.component.css']
})
export class SummaryCommentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'content', 'publishedAt', 'publisherId','star'];
  dataSource: MatTableDataSource<IComment>;
  pageNumber = 0;
  pageSize = 20;
  total=0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public commentSvc: CommentService) {
    this.commentSvc.getAllComments(this.pageNumber || 0, this.pageSize).subscribe(products => {
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
    this.commentSvc.getAllComments(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalHandler(products)
    });
  }
  private totalHandler(posts: ICommentSummary) {
    this.dataSource = new MatTableDataSource(posts.results);
    this.dataSource.sort = this.sort;
    this.total=posts.total
  }

}