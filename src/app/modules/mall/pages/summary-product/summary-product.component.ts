import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet, MatDialog, MatSlideToggle } from '@angular/material';
import { filter } from 'rxjs/operators';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { UpdateProdStatusDialogComponent } from 'src/app/components/update-prod-status-dialog/update-prod-status-dialog.component';
import { DeviceService } from 'src/app/services/device.service';
import { IProductDetail, IProductSimple, ProductService } from 'src/app/services/product.service';
import { isNullOrUndefined } from 'util';
import * as UUID from 'uuid/v1';
import { ProductComponent } from '../product/product.component';
@Component({
  selector: 'app-summary-product',
  templateUrl: './summary-product.component.html',
})
export class SummaryProductComponent extends SummaryEntityComponent<IProductSimple, IProductDetail> implements OnDestroy {
  displayedColumns: string[] = ['id', 'coverImage', 'name', 'priceList', 'sales', 'status', 'endAt', 'edit', 'delete', 'clone'];
  sheetComponent = ProductComponent;
  constructor(
    protected entitySvc: ProductService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet,5);
  }
  toggleProductStatus(row: IProductSimple, toggle: MatSlideToggle) {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let next: 'AVAILABLE' | 'UNAVAILABLE';
    if (this.isAvaliable(row)) {
      next = 'UNAVAILABLE'
    } else {
      next = 'AVAILABLE'
    }
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.updateProdStatus(row.id, next, UUID()));
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
  doBatchOffline() {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateProdStatus(ids, 'UNAVAILABLE', UUID()));

  }
  doBatchOnline() {
    const dialogRef = this.dialog.open(UpdateProdStatusDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateProdStatus(ids, 'AVAILABLE', UUID()));
  }
}
