import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterService, IFilterSummary, IFilterSummaryNet } from 'src/app/services/filter.service';
import { MatTableDataSource, MatPaginator, MatSort, MatBottomSheet, MatBottomSheetConfig, PageEvent } from '@angular/material';
import { Subscription, combineLatest } from 'rxjs';
import { DeviceService } from 'src/app/services/device.service';
import { switchMap, take } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { AttributeComponent } from '../attribute/attribute.component';
import { FilterComponent } from '../filter/filter.component';
import { CategoryService, ICatalogCustomer } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-summary-filter',
  templateUrl: './summary-filter.component.html',
})
export class SummaryFilterComponent implements OnInit {
  displayedColumns: string[] = ['id', 'catalogs', 'edit', 'delete'];
  dataSource: MatTableDataSource<IFilterSummary>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private subs: Subscription = new Subscription()
  private fronCatalog: ICatalogCustomer[]
  constructor(
    public filterSvc: FilterService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
    private catalogSvc: CategoryService,
  ) {
    let sub = this.filterSvc.refreshSummary.pipe(switchMap(() => this.filterSvc.getAll())).subscribe(next => { this.updateSummaryData(next) })
    combineLatest(this.filterSvc.getAll(), this.catalogSvc.getCatalogFrontend()).pipe(take(1)).subscribe(next => {
      this.updateSummaryData(next[0]);
      this.fronCatalog = next[1].data
    })
    this.subs.add(sub)
  }
  public parseCatalogId(id: number) {
    return this.fronCatalog.find(e => e.id === id).name
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
  updateSummaryData(next: IFilterSummaryNet) {
    this.dataSource = new MatTableDataSource(next.data)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.filterSvc.getById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(FilterComponent, config);
      })
    } else {
      this._bottomSheet.open(FilterComponent, config);
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
    this.filterSvc.currentPageIndex = e.pageIndex
  }
  parse(inputs: string[]) {
    return inputs.map(e => this.parseCatalogId(+e)).join(',')
  }
}
