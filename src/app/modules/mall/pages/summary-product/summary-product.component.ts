import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatBottomSheetConfig, MatBottomSheet, MatDialog, MatSlideToggle } from '@angular/material';
import { interval, Subscription } from 'rxjs';
import { debounce, filter, map, switchMap } from 'rxjs/operators';
import { CategoryService, ICatalogCustomer } from 'src/app/services/catalog.service';
import { IProductSimple, IProductTotalResponse, ProductService } from 'src/app/services/product.service';
import { DeviceService } from 'src/app/services/device.service';
import { ProductComponent } from '../product/product.component';
import { hasValue } from 'src/app/clazz/utility';
import { DeleteConfirmDialogComponent } from 'src/app/components/delete-confirm-dialog/delete-confirm-dialog.component';
import { UpdateProdStatusDialogComponent } from 'src/app/components/update-prod-status-dialog/update-prod-status-dialog.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
})
export class SummaryProductComponent implements OnInit, OnDestroy {
  exactSearch = new FormControl('', []);
  rangeSearch = new FormControl('', []);
  displayedColumns: string[] = ['id', 'name', 'priceList', 'totalSales', 'status', 'expireAt', 'edit', 'delete'];
  columnWidth: number;
  dataSource: MatTableDataSource<IProductSimple>;
  totoalProductCount = 0;
  pageSizeOffset = 4;
  private subs: Subscription = new Subscription()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public catalogsData: ICatalogCustomer[];
  constructor(public productSvc: ProductService, private categorySvc: CategoryService, public deviceSvc: DeviceService, private _bottomSheet: MatBottomSheet, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    let sub = this.productSvc.refreshSummary.pipe(switchMap(() =>
      this.productSvc.getAllProduct(this.productSvc.currentPageIndex || 0, this.getPageSize())
    )).subscribe(next => { this.totalProductHandler(next) })
    let sub0 = this.productSvc.getAllProduct(this.productSvc.currentPageIndex || 0, this.getPageSize()).subscribe(next => { this.totalProductHandler(next) });
    let sub1 = this.categorySvc.getCatalogBackend()
      .subscribe(catalogs => {
        if (catalogs.data)
          this.catalogsData = catalogs.data;
      });
    let sub2 = this.exactSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        return this.productSvc.searchProductById(e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })
    let sub3 = this.rangeSearch.valueChanges.pipe(debounce(() => interval(1000)))
      .pipe(filter(el => this.invalidSearchParam(el))).pipe(map(el => el.trim())).pipe(switchMap(e => {
        this.productSvc.currentPageIndex = 0;
        return this.productSvc.searchProductByKeyword(this.productSvc.currentPageIndex, this.getPageSize(), e)
      })).subscribe(next => {
        this.totalProductHandler(next)
      })
    this.subs.add(sub)
    this.subs.add(sub0)
    this.subs.add(sub1)
    this.subs.add(sub2)
    this.subs.add(sub3)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  toggleProductStatus(row: IProductSimple, toggle: MatSlideToggle) {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let next: 'AVAILABLE' | 'UNAVAILABLE';
    if (this.isAvaliable(row)) {
      next = 'UNAVAILABLE'
    } else {
      next = 'AVAILABLE'
    }
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.productSvc.updateProdStatus(+row.id, next));
    dialogRef.afterClosed().pipe(filter(result => !result)).subscribe(() => { toggle.toggle() })
  }
  isAvaliable(row: IProductSimple) {
    if (isNullOrUndefined(row.startAt))
      return false;
    let current = new Date()
    if (current.valueOf() >= row.startAt) {
      if (isNullOrUndefined(row.endAt)) {
        return true;
      }
      if (current.valueOf() < row.endAt) {
        return true;
      } else {
        return false;
      }
    } else {
      return false
    }

  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.panelClass = 'fix-height'
    if (hasValue(id)) {
      this.productSvc.getProductDetailById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(ProductComponent, config);
      })
    } else {
      this._bottomSheet.open(ProductComponent, config);
    }
  }
  ngOnInit() {
  }
  searchWithTags(catalog: ICatalogCustomer) {
    this.productSvc.currentPageIndex = 0;
    this.productSvc.searchProductsByTags(this.productSvc.currentPageIndex, this.getPageSize(), catalog.attributes).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  pageHandler(e: PageEvent) {
    this.productSvc.currentPageIndex = e.pageIndex;
    this.productSvc.getAllProduct(this.productSvc.currentPageIndex || 0, this.getPageSize()).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  private getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  private totalProductHandler(products: IProductTotalResponse) {
    if (products.data) {
      this.dataSource = new MatTableDataSource(products.data);
      this.totoalProductCount = products.totalProductCount;
      this.dataSource.sort = this.sort;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.totoalProductCount = 0;
      this.dataSource.sort = this.sort;
    }
  }
  private invalidSearchParam(input: string): boolean {
    let spaces: RegExp = new RegExp(/^\s*$/)
    return !spaces.test(input)
  }
}
