import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatBottomSheet, MatBottomSheetConfig, Sort } from '@angular/material';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { DeviceService } from 'src/app/services/device.service';
import { ResourceOwnerComponent } from '../resource-owner/resource-owner.component';
import { switchMap } from 'rxjs/operators';
import { hasValue } from 'src/app/clazz/utility';
import { Subscription } from 'rxjs';
import { IResourceOwner, IUserSumRep } from '../../interface/resource-owner.interface';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
})
export class SummaryResourceOwnerComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'email','locked','createAt', 'edit', 'token', 'delete'];
  dataSource: MatTableDataSource<IResourceOwner>;
  private subs: Subscription = new Subscription()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  totoalItemCount: number;
  constructor(
    public resourceOwnerService: ResourceOwnerService,
    public deviceSvc: DeviceService,
    private _bottomSheet: MatBottomSheet,
  ) {
    let sub = this.resourceOwnerService.refreshSummary.pipe(switchMap(() => this.resourceOwnerService.getResourceOwners(this.resourceOwnerService.currentPageIndex, this.deviceSvc.pageSize))).subscribe(next => { this.updateSummaryData(next) })
    let sub0 = this.resourceOwnerService.getResourceOwners(this.resourceOwnerService.currentPageIndex, this.deviceSvc.pageSize).subscribe(next => { this.updateSummaryData(next) })
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
  updateSummaryData(next: IUserSumRep) {
    this.dataSource = new MatTableDataSource(next.data)
    this.totoalItemCount = next.totalItemCount;
  }
  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  revokeResourceOwnerToken(id: number) {
    this.resourceOwnerService.revokeResourceOwnerToken(id);
  }
  pageHandler(e: PageEvent) {
    this.resourceOwnerService.currentPageIndex = e.pageIndex
  }
  openBottomSheet(id?: number): void {
    let config = new MatBottomSheetConfig();
    config.autoFocus = true;
    if (hasValue(id)) {
      this.resourceOwnerService.getResourceOwner(id).subscribe(next => {
        config.data = next;
        this._bottomSheet.open(ResourceOwnerComponent, config);
      })
    } else {
      this._bottomSheet.open(ResourceOwnerComponent, config);
    }
  }
  updateTable(sort: Sort) {
    this.resourceOwnerService.getResourceOwners(this.resourceOwnerService.currentPageIndex, this.deviceSvc.pageSize, sort.active, sort.direction).subscribe(next => {
      this.updateSummaryData(next)
    });
  }
}
