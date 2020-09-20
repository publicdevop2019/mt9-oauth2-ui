import { Component } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IOrder } from 'src/app/interfaze/commom.interface';
import { DeviceService } from 'src/app/services/device.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-summary-order',
  templateUrl: './summary-order.component.html',
})
export class SummaryOrderComponent extends SummaryEntityComponent<IOrder, IOrder> {
  displayedColumns: string[] = ['id', 'paymentAmt', 'orderState', 'edit'];
  sheetComponent = OrderComponent;
  constructor(
    public entitySvc: OrderService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 5);
  }
}
