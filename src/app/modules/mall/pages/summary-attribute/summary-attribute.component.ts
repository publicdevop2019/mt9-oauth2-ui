import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IBizAttribute, AttributeService, IAttributeHttp } from 'src/app/services/attribute.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig, Sort } from '@angular/material';
import { DeviceService } from 'src/app/services/device.service';
import { AttributeComponent } from '../attribute/attribute.component';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { Subscription } from 'rxjs';
import * as UUID from 'uuid/v1';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
@Component({
  selector: 'app-summary-attribute',
  templateUrl: './summary-attribute.component.html',
})
export class SummaryAttributeComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'value', 'type', 'edit', 'delete'];
  dataSource: MatTableDataSource<IBizAttribute>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private subs: Subscription = new Subscription()
  totoalItemCount: number;
  constructor(
    public attrSvc: AttributeService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {
    let sub = this.attrSvc.refreshSummary.pipe(switchMap(() => this.attrSvc.getAttributeList(this.attrSvc.currentPageIndex, this.getPageSize()))).subscribe(next => { this.updateSummaryData(next) })
    let sub0 = this.attrSvc.getAttributeList(this.attrSvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.updateSummaryData(next) })
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
  updateSummaryData(next: IAttributeHttp) {
    this.dataSource = new MatTableDataSource(next.data);
    this.totoalItemCount = next.totalItemCount;
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.attrSvc.getAttributeById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(AttributeComponent, config);
      })
    } else {
      this._bottomSheet.open(AttributeComponent, config);
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
    this.attrSvc.currentPageIndex = e.pageIndex;
    this.attrSvc.getAttributeList(this.attrSvc.currentPageIndex, this.getPageSize()).subscribe(next => {
      this.updateSummaryData(next)
    });
  }
  private getPageSize() {
    return (this.deviceSvc.pageSize) > 0 ? (this.deviceSvc.pageSize) : 1;
  }
  updateTable(sort: Sort) {
    this.attrSvc.getAttributeList(this.attrSvc.currentPageIndex, this.getPageSize(), sort.active, sort.direction).subscribe(next => {
      this.updateSummaryData(next)
    });
  }
  doPatchName(id: number, event: IEditEvent) {
    this.attrSvc.doPatch(id, event, 'name', UUID())
  }
  doPatchDesc(id: number, event: IEditEvent) {
    this.attrSvc.doPatch(id, event, 'description', UUID())
  }
}
