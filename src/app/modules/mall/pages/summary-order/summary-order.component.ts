import { Component } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { switchMap } from 'rxjs/operators';
import { ISumRep, SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { ICartItem, IOrder } from 'src/app/interfaze/commom.interface';
import { IResourceOwner } from 'src/app/modules/my-users/interface/resource-owner.interface';
import { DeviceService } from 'src/app/services/device.service';
import { OrderService } from 'src/app/services/order.service';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-summary-order',
  templateUrl: './summary-order.component.html',
})
export class SummaryOrderComponent extends SummaryEntityComponent<IOrder, IOrder> {
  displayedColumns: string[] = ['id', 'productList', 'paymentAmt', 'orderState', 'createdAt', 'createdBy', 'view'];
  sheetComponent = OrderComponent;
  constructor(
    public entitySvc: OrderService,
    private roSvc: ResourceOwnerService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 2, true);
    let sub0 = this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => { this.updateSummaryData(next); this.loadUser(next) });
    let sub = this.entitySvc.refreshSummary.pipe(switchMap(() =>
      this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString)
    )).subscribe(next => { this.updateSummaryData(next); this.loadUser(next) })
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  public parsedUserId: { [key: number]: IResourceOwner } = {}
  loadUser(orders: ISumRep<IOrder>) {
    if(orders.data.length>0){
      let ids = orders.data.map(e => e.createdBy);
      let unique = new Array(...new Set(ids));
      let query = "id:" + unique.join('.');
      let parsedUserId: { [key: number]: IResourceOwner } = {}
  
      this.roSvc.readByQuery(0, unique.length, query).subscribe(next => {
        next.data.forEach(e => {
          parsedUserId[e.id] = e
        })
        this.parsedUserId = parsedUserId;
      })
    }
  }
  public parse(items: ICartItem[]): IOption[] {
    return items.map(e => <IOption>{ label: e.name, value: e.productId });
  }
}
