import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IProductSimple, ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
  styleUrls: ['./summary-product.component.css']
})
export class SummaryProductComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'name', 'price','star'];
  dataSource: MatTableDataSource<IProductSimple>;
  dataSourceArray:IProductSimple[]=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public productSvc: ProductService) {
    this.productSvc.getProductWAllCategory().subscribe(products => {
      this.dataSourceArray=[...this.dataSourceArray,...products]
      this.dataSource = new MatTableDataSource(this.dataSourceArray);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    this.productSvc.currentPageIndex = e.pageIndex
  }

}
