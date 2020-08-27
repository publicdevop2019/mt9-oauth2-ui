import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SecurityProfileService } from 'src/app/services/security-profile.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatSlideToggle, MatBottomSheet, MatBottomSheetConfig, Sort } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DeviceService } from 'src/app/services/device.service';
import { SecurityProfileComponent } from '../security-profile/security-profile.component';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import * as UUID from 'uuid/v1';
import { IEditEvent } from 'src/app/components/editable-field/editable-field.component';
export interface ISecurityProfileSumRep {
  data: ISecurityProfile[],
  totalItemCount: number,
}
export interface ISecurityProfile {
  resourceId: string;
  description?:string;
  path: string;
  method: string;
  expression: string;
  id: number;
}
@Component({
  selector: 'app-summary-security-profile',
  templateUrl: './summary-security-profile.component.html',
  styleUrls: ['./summary-security-profile.component.css']
})
export class SummarySecurityProfileComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id','description', 'resourceId', 'path', 'expression','method', 'edit', 'delete'];
  dataSource: MatTableDataSource<ISecurityProfile>;
  private subs: Subscription = new Subscription()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<ISecurityProfile>(true, []);
  totoalItemCount: number;
  constructor(public securityProfileSvc: SecurityProfileService, public deviceSvc: DeviceService, private _bottomSheet: MatBottomSheet,) {
    let sub = this.securityProfileSvc.refreshSummary.pipe(switchMap(() => this.securityProfileSvc.readAll(this.securityProfileSvc.currentPageIndex, deviceSvc.pageSize))).subscribe(next => { this.updateSummaryData(next) });
    let sub0 = this.securityProfileSvc.readAll(this.securityProfileSvc.currentPageIndex, deviceSvc.pageSize).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  updateSummaryData(next: ISecurityProfileSumRep) {
    this.dataSource = new MatTableDataSource(next.data)
    this.totoalItemCount = next.totalItemCount;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.securityProfileSvc.readById(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(SecurityProfileComponent, config);
      })
    } else {
      this._bottomSheet.open(SecurityProfileComponent, config);
    }
  }
  showOptions() {
    if (!this.displayedColumns.includes('select')) {
      this.displayedColumns = ['select', ...this.displayedColumns]
    } else {
      this.displayedColumns = this.displayedColumns.filter(e => e !== 'select')

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
    this.securityProfileSvc.currentPageIndex = e.pageIndex;
    if (this.sort) {
      this.securityProfileSvc.readAll(this.securityProfileSvc.currentPageIndex, this.deviceSvc.pageSize, this.sort.active, this.sort.direction).subscribe(next => {
        this.updateSummaryData(next)
      });
    } else {
      this.securityProfileSvc.readAll(this.securityProfileSvc.currentPageIndex, this.deviceSvc.pageSize).subscribe(next => {
        this.updateSummaryData(next)
      });
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
  checkboxLabel(row?: ISecurityProfile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  private sort: Sort;
  updateTable(sort: Sort) {
    this.sort = sort;
    this.securityProfileSvc.readAll(this.securityProfileSvc.currentPageIndex, this.deviceSvc.pageSize, sort.active, sort.direction).subscribe(next => {
      this.updateSummaryData(next)
    });
  }
  doPatchDesc(id: number, event: IEditEvent) {
    // this.clientService.doPatch(id, event, 'description', UUID())
  }
}
