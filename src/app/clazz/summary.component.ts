import { SelectionModel } from '@angular/cdk/collections';
import { ComponentType } from '@angular/cdk/portal';
import { OnDestroy, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
import { DeviceService } from 'src/app/services/device.service';
import * as UUID from 'uuid/v1';
import { IEditListEvent } from '../components/editable-select-multi/editable-select-multi.component';
import { IEditBooleanEvent } from '../components/editable-boolean/editable-boolean.component';
export interface IIdBasedEntity {
  id: number
}
export interface IEntityService<C extends IIdBasedEntity, D> {
  readById: (id: number) => Observable<D>;
  readByQuery: (num: number, size: number, query?: string, by?: string, order?: string) => Observable<ISumRep<C>>;
  deleteByQuery: (query: string) => void;
  deleteById: (id: number) => void;
  create: (s: D, changeId: string) => void;
  update: (id: number, s: D, changeId: string) => void;
  patch: (id: number, event: IEditEvent, changeId: string, fieldName: string) => void;
  patchList: (id: number, event: IEditListEvent, changeId: string, fieldName: string) => void;
  patchBoolean: (id: number, event: IEditBooleanEvent, changeId: string, fieldName: string) => void;
  refreshSummary: Observable<any>;
  currentPageIndex: number;
}
export interface ISumRep<T> {
  data: T[],
  totalItemCount: number
}
export interface IBottomSheet<S> {
  context: 'clone' | 'new' | 'edit';
  from: S;
}
export class SummaryEntityComponent<T extends IIdBasedEntity, S> implements OnDestroy {
  sheetComponent: ComponentType<any>;
  displayedColumns: string[] = [];
  columnWidth: number;
  queryString: string = undefined;
  dataSource: MatTableDataSource<T>;
  totoalItemCount = 0;
  pageSizeOffset = 0;
  sortBy: string = undefined;
  sortOrder: string = undefined;
  protected subs: Subscription = new Subscription()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<T>(true, []);
  constructor(
    protected entitySvc: IEntityService<T, S>,
    protected deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
    protected _pageSizeOffset: number,
    protected skipInitialLoad?: boolean
  ) {
    this.pageSizeOffset = _pageSizeOffset;
    if (!skipInitialLoad) {
      let sub0 = this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.updateSummaryData(next) });
      let sub = this.entitySvc.refreshSummary.pipe(switchMap(() =>
        this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize())
      )).subscribe(next => { this.updateSummaryData(next) })
      this.subs.add(sub)
      this.subs.add(sub0)
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  openBottomSheet(id?: number, clone?: boolean): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.panelClass = 'fix-height'
    if (hasValue(id)) {
      this.entitySvc.readById(id).subscribe(next => {
        if (clone) {
          config.data = <IBottomSheet<S>>{ context: 'clone', from: next };
          this.bottomSheet.open(this.sheetComponent, config);
        } else {
          config.data = <IBottomSheet<S>>{ context: 'edit', from: next };
          this.bottomSheet.open(this.sheetComponent, config);
        }
      })
    } else {
      config.data = <IBottomSheet<S>>{ context: 'new', from: undefined };
      this.bottomSheet.open(this.sheetComponent, config);
    }
  }
  pageHandler(e: PageEvent) {
    this.entitySvc.currentPageIndex = e.pageIndex;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(products => {
      this.updateSummaryData(products)
    });
  }
  protected getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  protected updateSummaryData(products: ISumRep<T>) {
    if (products.data) {
      this.dataSource = new MatTableDataSource(products.data);
      this.totoalItemCount = products.totalItemCount;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.totoalItemCount = 0;
    }
  }
  updateTable(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(products => {
      this.updateSummaryData(products)
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
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  doBatchDelete() {
    let ids = this.selection.selected.map(e => e.id)
    this.entitySvc.deleteByQuery(this.getIdQuery(ids))
  }
  doPatch(id: number, event: IEditEvent, fieldName: string) {
    this.entitySvc.patch(id, event, UUID(), fieldName)
  }
  doPatchBoolean(id: number, event: IEditBooleanEvent, fieldName: string) {
    this.entitySvc.patchBoolean(id, event, UUID(), fieldName)
  }
  doPatchList(id: number, event: IEditListEvent, fieldName: string) {
    this.entitySvc.patchList(id, event, UUID(), fieldName)
  }
  doClone(id: number) {
    this.openBottomSheet(id, true)
  }
  doSearch(queryString: string) {
    console.dir(queryString)
    this.queryString = queryString;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryData(next)
    })
  }
  private getIdQuery(ids: number[]): string {
    return 'id:' + ids.join(".")
  }
}
