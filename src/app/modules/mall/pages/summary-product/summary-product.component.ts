import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetConfig, MatDialog, MatPaginator, MatSlideToggle, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { interval, Subscription, Observable } from 'rxjs';
import { debounce, filter, map, switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { UpdateProdStatusDialogComponent } from 'src/app/components/update-prod-status-dialog/update-prod-status-dialog.component';
import { CatalogService, ICatalogCustomer } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { IProductSimple, IProductTotalResponse, ProductService, IProductDetail, IBizProductBottomSheet } from 'src/app/services/product.service';
import { isNullOrUndefined } from 'util';
import { ProductComponent } from '../product/product.component';
import { SelectionModel } from '@angular/cdk/collections';
import * as UUID from 'uuid/v1';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
import { FORM_SEARCH_CONFIG } from 'src/app/form-configs/search-product.config';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
})
export class SummaryProductComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'coverImage', 'name', 'priceList', 'sales', 'status', 'endAt', 'edit', 'delete', 'clone'];
  columnWidth: number;
  dataSource: MatTableDataSource<IProductSimple>;
  totoalItemCount = 0;
  pageSizeOffset = 8;
  private subs: Subscription = new Subscription()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSlideToggle, { static: true }) slide: MatSlideToggle;
  selection = new SelectionModel<IProductSimple>(true, []);
  constructor(public productSvc: ProductService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public translate: TranslateService,
    private fis: FormInfoService
  ) {
    let sub = this.productSvc.refreshSummary.pipe(switchMap(() =>
      this.productSvc.getAllProduct(this.productSvc.currentPageIndex, this.getPageSize())
    )).subscribe(next => { this.totalProductHandler(next) })
    let sub0 = this.productSvc.getAllProduct(this.productSvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.totalProductHandler(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.fis.resetAll();
  }
  toggleProductStatus(row: IProductSimple, toggle: MatSlideToggle) {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let next: 'AVAILABLE' | 'UNAVAILABLE';
    if (this.isAvaliable(row)) {
      next = 'UNAVAILABLE'
    } else {
      next = 'AVAILABLE'
    }
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.productSvc.updateProdStatus(row.id, next, UUID()));
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
  openBottomSheet(id?: number, clone?: boolean): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.panelClass = 'fix-height'
    if (hasValue(id)) {
      this.productSvc.getProductDetailById(id).subscribe(next => {
        if (clone) {
          config.data = <IBizProductBottomSheet>{ context: 'clone', from: next };
          this._bottomSheet.open(ProductComponent, config);
        } else {
          config.data = <IBizProductBottomSheet>{ context: 'edit', from: next };
          this._bottomSheet.open(ProductComponent, config);
        }
      })
    } else {
      config.data = <IBizProductBottomSheet>{ context: 'new', from: undefined };
      this._bottomSheet.open(ProductComponent, config);
    }
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
    this.productSvc.currentPageIndex = e.pageIndex;
    this.productSvc.getAllProduct(this.productSvc.currentPageIndex, this.getPageSize()).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  private getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  private totalProductHandler(products: IProductTotalResponse) {
    if (products.data) {
      this.dataSource = new MatTableDataSource(products.data);
      this.totoalItemCount = products.totalItemCount;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.totoalItemCount = 0;
    }
  }

  updateTable(sort: Sort) {
    this.productSvc.getAllProduct(this.productSvc.currentPageIndex, this.getPageSize(), sort.active, sort.direction).subscribe(products => {
      this.totalProductHandler(products)
    });
  }
  showOptions() {
    if (!this.displayedColumns.includes('select')) {
      this.displayedColumns = ['select', ...this.displayedColumns]
    } else {
      this.displayedColumns = this.displayedColumns.filter(e => e !== 'select')
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IProductSimple): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  doBatchOffline() {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.productSvc.batchUpdateProdStatus(ids, 'UNAVAILABLE', UUID()));

  }
  doBatchOnline() {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.productSvc.batchUpdateProdStatus(ids, 'AVAILABLE', UUID()));
  }
  doBatchDelete() {
    let ids = this.selection.selected.map(e => e.id)
    this.productSvc.batchDelete(ids)
  }
  doPatch(id: number, event: IEditEvent) {
    this.productSvc.updateName(id, event, UUID())

  }
  doClone(id: number) {
    this.openBottomSheet(id, true)
  }
  doSearch(queryString: string) {
    this.productSvc.currentPageIndex = 0;
    this.productSvc.searchProductWithQuery(this.productSvc.currentPageIndex, this.getPageSize(), queryString).subscribe(next=>{
      this.totalProductHandler(next)
    })
  }
}
