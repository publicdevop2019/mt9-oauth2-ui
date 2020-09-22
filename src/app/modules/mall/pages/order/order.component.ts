import { Component, Inject, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { ORDER_PRODUCT_CONFIG, ORDER_ADDRESS_CONFIG, ORDER_DETAIL_CONFIG, ORDER_TASK_CONFIG } from 'src/app/form-configs/order.config';
import { ICartItem, IOrder } from 'src/app/interfaze/commom.interface';
import { OrderService } from 'src/app/services/order.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy {
  formIdOrder = 'orderDetail';
  formInfoOrder: IForm = JSON.parse(JSON.stringify(ORDER_DETAIL_CONFIG));
  formIdTask = 'orderTask';
  formInfoTask: IForm = JSON.parse(JSON.stringify(ORDER_TASK_CONFIG));
  formIdAddress = 'orderAddress';
  formInfoAddress: IForm = JSON.parse(JSON.stringify(ORDER_ADDRESS_CONFIG));
  formIdProduct = 'orderProduct';
  formInfoProduct: IForm = JSON.parse(JSON.stringify(ORDER_PRODUCT_CONFIG));
  orderBottomSheet: IBottomSheet<IOrder>;
  private formCreatedOb1: Observable<string>;
  private formCreatedOb2: Observable<string>;
  private formCreatedOb3: Observable<string>;
  private formCreatedOb4: Observable<string>;
  constructor(
    public orderSvc: OrderService,
    public taskSvc: TaskService,
    private fis: FormInfoService,
    private tSvc: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, // keep as any is needed
    private _bottomSheetRef: MatBottomSheetRef<OrderComponent>,
  ) {
    this.orderBottomSheet = data;
    this.formCreatedOb1 = this.fis.$ready.pipe(filter(e => e === this.formIdOrder));
    this.formCreatedOb2 = this.fis.$ready.pipe(filter(e => e === this.formIdAddress));
    this.formCreatedOb3 = this.fis.$ready.pipe(filter(e => e === this.formIdProduct));
    this.formCreatedOb4 = this.fis.$ready.pipe(filter(e => e === this.formIdTask));
    combineLatest(this.formCreatedOb1, this.formCreatedOb2, this.formCreatedOb3).pipe(take(1)).subscribe(next => {
      this.fis.formGroupCollection[this.formIdOrder].patchValue(this.orderBottomSheet.from);
      this.fis.formGroupCollection[this.formIdAddress].patchValue(this.orderBottomSheet.from.address);
      let var0 = this.beforePatchProduct(this.orderBottomSheet.from.productList);
      let value0 = this.fis.parsePayloadArr(var0.map(e => e.productId), 'productId');
      let value1 = this.fis.parsePayloadArr(var0.map(e => e.name), 'name');
      let value2 = this.fis.parsePayloadArr(var0.map(e => e.finalPrice), 'finalPrice');
      let value3 = this.fis.parsePayloadArr(var0.map(e => e.attributesSales.join(",")), 'attributesSales');
      let value4 = this.fis.parsePayloadArr(var0.map(e => e.imageUrlSmall), 'imageUrlSmall');
      let value5 = this.fis.parsePayloadArr(var0.map(e => e.selectedOptions.map(e => e.title + ":" + e.options[0].optionValue + "-" + e.options[0].priceVar).join(",")), 'selectedOptions');
      Object.assign(value0, value1)
      Object.assign(value0, value2)
      Object.assign(value0, value3)
      Object.assign(value0, value4)
      Object.assign(value0, value5)
      this.fis.restoreDynamicForm(this.formIdProduct, value0, var0.length)
    });
    combineLatest(this.taskSvc.readByQuery(0, 10, "referenceId:" + this.orderBottomSheet.from.id), this.formCreatedOb4).pipe(take(1)).subscribe(next => {
      let var0 = next[0].data;
      let value0 = this.fis.parsePayloadArr(var0.map(e => e.createdAt), 'createdAt');
      let value1 = this.fis.parsePayloadArr(var0.map(e => e.createdBy), 'createdBy');
      let value2 = this.fis.parsePayloadArr(var0.map(e => e.id), 'id');
      let value3 = this.fis.parsePayloadArr(var0.map(e => e.modifiedAt), 'modifiedAt');
      let value4 = this.fis.parsePayloadArr(var0.map(e => e.modifiedBy), 'modifiedBy');
      let value5 = this.fis.parsePayloadArr(var0.map(e => e.referenceId), 'referenceId');
      let value8 = this.fis.parsePayloadArr(var0.map(e => e.transactionId), 'transactionId');
      let value9 = this.fis.parsePayloadArr(var0.map(e => e.version), 'version');
      let var1 = var0.map(e => this.tSvc.get(e.taskStatus));
      let var2 = var0.map(e => this.tSvc.get(e.taskName));

      let ob1 = combineLatest(...var1)
      let ob2 = combineLatest(...var2)
      combineLatest(ob1, ob2).subscribe(next => {
        let value6 = this.fis.parsePayloadArr(next[0], 'taskStatus');
        let value7 = this.fis.parsePayloadArr(next[1], 'taskName');
        Object.assign(value0, value6);
        Object.assign(value0, value7);
        Object.assign(value0, value1);
        Object.assign(value0, value2);
        Object.assign(value0, value3);
        Object.assign(value0, value4);
        Object.assign(value0, value5);
        Object.assign(value0, value8);
        Object.assign(value0, value9);
        this.fis.restoreDynamicForm(this.formIdTask, value0, var0.length)
      })
    })
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.fis.resetAll();
  }
  beforePatchProduct(productList: ICartItem[]): ICartItem[] {
    return productList.map(e => {
      e.attributesSales = e.attributesSales.map(ee => {
        let attrId = ee.split(":")[0];
        let value = ee.split(":")[1];
        return e.attrIdMap[attrId] + ":" + value
      });
      return e;
    })
  }
}
