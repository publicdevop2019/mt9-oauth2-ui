import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { IProductSimple, ProductService, IProductTotalResponse } from 'src/app/service/product.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
  styleUrls: ['./summary-product.component.css']
})
export class SummaryProductComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'category', 'name', 'price', 'orderStorage', 'actualStorage', 'star'];
  dataSource: MatTableDataSource<IProductSimple>;
  pageNumber = 0;
  pageSize = 20;
  totoalProductCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private sub: Subscription
  constructor(private productSvc: ProductService, private breakpointObserver: BreakpointObserver) {
    this.productSvc.getAllProduct(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalProductHandler(products)
    });
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(next => {
      if (next.breakpoints[Breakpoints.XSmall]) {
        this.displayedColumns = ['id', 'name', 'price', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Small]) {
        this.displayedColumns = ['id', 'name', 'price', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Medium]) {
        this.displayedColumns = ['id', 'category', 'name', 'price', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.Large]) {
        this.displayedColumns = ['id', 'category', 'name', 'price', 'orderStorage', 'actualStorage', 'star'];
      }
      else if (next.breakpoints[Breakpoints.XLarge]) {
        this.displayedColumns = ['id', 'category', 'name', 'price', 'orderStorage', 'actualStorage', 'star'];
      }
      else {
        console.warn('unknown device width match!')
      }
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
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
    this.productSvc.getAllProduct(this.pageNumber || 0, this.pageSize).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  private totalProductHandler(products: IProductTotalResponse) {
    this.dataSource = new MatTableDataSource(products.productSimpleList);
    this.totoalProductCount = products.totalProductCount;
    this.dataSource.sort = this.sort;
  }

}
