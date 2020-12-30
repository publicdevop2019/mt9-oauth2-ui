import { SelectionModel } from '@angular/cdk/collections';
import { ComponentType } from '@angular/cdk/portal';
import { OnDestroy, ViewChild, Directive } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
import { DeviceService } from 'src/app/services/device.service';
import * as UUID from 'uuid/v1';
import { IEditListEvent } from '../components/editable-select-multi/editable-select-multi.component';
import { IEditBooleanEvent } from '../components/editable-boolean/editable-boolean.component';
import { IEditInputListEvent } from '../components/editable-input-multi/editable-input-multi.component';
import { hasValue } from './validation/validator-common';
export interface IIdBasedEntity {
  id: string;
  version: number
}
export interface IEventAdminRep {
  id: number,
  events: any[],
  version: number,
}
export interface IEntityService<C extends IIdBasedEntity, D> {
  readEventStreamById: (id: string) => Observable<IEventAdminRep>;
  saveEventStream: (id: string, events: any[], changeId: string) => void;
  replaceEventStream: (id: string, events: any[], changeId: string, version: number) => void;
  deleteEventStream: (id: string, changeId: string) => void;
  readById: (id: string) => Observable<D>;
  readByQuery: (num: number, size: number, query?: string, by?: string, order?: string) => Observable<ISumRep<C>>;
  deleteByQuery: (query: string, changeId: string) => void;
  deleteById: (id: string, changeId: string) => void;
  create: (s: D, changeId: string, events: any[]) => void;
  update: (id: string, s: D, changeId: string, events: any[], version: number) => void;
  patch: (id: string, event: IEditEvent, changeId: string, fieldName: string) => void;
  patchAtomicNum: (id: string, event: IEditEvent, changeId: string, fieldName: string) => void;
  patchList: (id: string, event: IEditListEvent, changeId: string, fieldName: string) => void;
  patchMultiInput: (id: string, event: IEditInputListEvent, changeId: string, fieldName: string) => void;
  patchBoolean: (id: string, event: IEditBooleanEvent, changeId: string, fieldName: string) => void;
  refreshSummary: Observable<any>;
  currentPageIndex: number;
  supportEvent: boolean;
}
export interface ISumRep<T> {
  data: T[],
  totalItemCount: number
}
export interface IBottomSheet<S> {
  context: 'clone' | 'new' | 'edit';
  from: S;
  events: IEventAdminRep;
}
@Directive()
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
      let sub0 = this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.updateSummaryData(next); });
      let sub = this.entitySvc.refreshSummary.pipe(switchMap(() =>
        this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString)
      )).subscribe(next => { this.updateSummaryData(next); })
      this.subs.add(sub)
      this.subs.add(sub0)
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  openBottomSheet(id?: string, clone?: boolean): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.panelClass = 'fix-height'
    if (hasValue(id)) {
      if (this.entitySvc.supportEvent) {
        combineLatest([this.entitySvc.readById(id), this.entitySvc.readEventStreamById(id)]).subscribe(combined => {
          if (clone) {
            config.data = <IBottomSheet<S>>{ context: 'clone', from: combined[0], events: combined[1] };
            this.bottomSheet.open(this.sheetComponent, config);
          } else {
            config.data = <IBottomSheet<S>>{ context: 'edit', from: combined[0], events: combined[1] };
            this.bottomSheet.open(this.sheetComponent, config);
          }
        })
      } else {
        this.entitySvc.readById(id).subscribe(next => {
          if (clone) {
            config.data = <IBottomSheet<S>>{ context: 'clone', from: next };
            this.bottomSheet.open(this.sheetComponent, config);
          } else {
            config.data = <IBottomSheet<S>>{ context: 'edit', from: next };
            this.bottomSheet.open(this.sheetComponent, config);
          }
        })
      }
    } else {
      config.data = <IBottomSheet<S>>{ context: 'new', from: undefined, events: {} };
      this.bottomSheet.open(this.sheetComponent, config);
    }
  }
  pageHandler(e: PageEvent) {
    this.entitySvc.currentPageIndex = e.pageIndex;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryData(next);
    });
  }
  protected getPageSize() {
    return (this.deviceSvc.pageSize - this.pageSizeOffset) > 0 ? (this.deviceSvc.pageSize - this.pageSizeOffset) : 1;
  }
  protected updateSummaryData(next: ISumRep<T>) {
    if (next.data) {
      this.dataSource = new MatTableDataSource(next.data);
      this.totoalItemCount = next.totalItemCount;
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.totoalItemCount = 0;
    }
    this.selection.clear();
  }
  updateTable(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryData(next)
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
    this.entitySvc.deleteByQuery(this.getIdQuery(ids), UUID())
  }
  doPatch(id: string, event: IEditEvent, fieldName: string) {
    this.entitySvc.patch(id, event, UUID(), fieldName)
  }
  doMultiInputPatch(id: string, event: IEditInputListEvent, fieldName: string) {
    this.entitySvc.patchMultiInput(id, event, UUID(), fieldName)
  }
  doPatchBoolean(id: string, event: IEditBooleanEvent, fieldName: string) {
    this.entitySvc.patchBoolean(id, event, UUID(), fieldName)
  }
  doPatchAtomicNum(id: string, event: IEditEvent, fieldName: string) {
    this.entitySvc.patchAtomicNum(id, event, UUID(), fieldName)
  }
  doPatchList(id: string, event: IEditListEvent, fieldName: string) {
    this.entitySvc.patchList(id, event, UUID(), fieldName)
  }
  doClone(id: string) {
    this.openBottomSheet(id, true)
  }
  doDeleteById(id: string) {
    this.entitySvc.deleteById(id, UUID())
  }
  doDeleteByQuery(query: string) {
    this.entitySvc.deleteByQuery(query, UUID())
  }
  doSearch(queryString: string) {
    this.queryString = queryString;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryData(next);
    })
  }
  private getIdQuery(ids: string[]): string {
    return 'id:' + ids.join(".")
  }
}
