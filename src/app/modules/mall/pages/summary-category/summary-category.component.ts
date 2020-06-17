import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService, ICategory } from 'src/app/services/category.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IClient } from '../../../../pages/summary-client/summary-client.component';

@Component({
  selector: 'app-summary-category',
  templateUrl: './summary-category.component.html',
  styleUrls: ['./summary-category.component.css']
})
export class SummaryCategoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'star'];
  dataSource: MatTableDataSource<ICategory>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public categorySvc:CategoryService) { 
    this.categorySvc.getCategories().subscribe(categories => {
      this.dataSource = new MatTableDataSource(categories.categoryList)
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
  pageHandler(e: PageEvent) {
    this.categorySvc.currentPageIndex = e.pageIndex
  }
}
