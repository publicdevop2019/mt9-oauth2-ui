import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IProductDetail, IProductSimple } from 'src/app/clazz/validation/aggregate/product/interfaze-product';
import { OperationConfirmDialogComponent } from 'src/app/components/operation-confirm-dialog/operation-confirm-dialog.component';
import { DeviceService } from 'src/app/services/device.service';
import { ProductService } from 'src/app/services/product.service';
import { isNullOrUndefined } from 'util';
import * as UUID from 'uuid/v1';
import { ProductComponent } from '../product/product.component';
@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
})
export class SummaryProductComponent extends SummaryEntityComponent<IProductSimple, IProductDetail> implements OnDestroy {
  displayedColumns: string[] = ['id', 'coverImage', 'name', 'sales', 'status', 'endAt', 'edit', 'delete', 'clone'];
  // sheetComponent = ProductComponent;
  sheetComponent = ProductComponent;
  constructor(
    public entitySvc: ProductService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 7);
  }
  toggleProductStatus(row: IProductSimple) {
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let next: 'AVAILABLE' | 'UNAVAILABLE';
    if (this.isAvaliable(row)) {
      next = 'UNAVAILABLE'
    } else {
      next = 'AVAILABLE'
    }
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.updateProdStatus(row.id, next, UUID()));
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
  doBatchOffline() {
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateProdStatus(ids, 'UNAVAILABLE', UUID()));

  }
  doBatchOnline() {
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateProdStatus(ids, 'AVAILABLE', UUID()));
  }
}
