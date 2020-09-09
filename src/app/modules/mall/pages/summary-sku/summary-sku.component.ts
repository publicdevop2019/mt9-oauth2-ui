import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { ISkuNew } from 'src/app/services/product.service';
import { SkuService } from 'src/app/services/sku.service';
import { ProductComponent } from '../product/product.component';
@Component({
  selector: 'app-summary-sku',
  templateUrl: './summary-sku.component.html',
  styleUrls: ['./summary-sku.component.css']
})
export class SummarySkuComponent extends SummaryEntityComponent<ISkuNew, ISkuNew> implements OnDestroy {
  displayedColumns: string[] = ['id', 'referenceId', 'description','storageOrder', 'storageActual', 'price', 'sales', 'edit', 'delete'];
  sheetComponent = ProductComponent;
  constructor(
    public entitySvc: SkuService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 5);
  }
}
