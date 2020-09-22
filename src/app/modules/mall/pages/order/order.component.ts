import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { ORDER_PRODUCT_CONFIG, ORDER_ADDRESS_CONFIG, ORDER_DETAIL_CONFIG } from 'src/app/form-configs/order.config';
import { ICartItem, IOrder } from 'src/app/interfaze/commom.interface';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnDestroy {
  formIdOrder = 'orderDetail';
  formInfoOrder: IForm = JSON.parse(JSON.stringify(ORDER_DETAIL_CONFIG));
  formIdAddress = 'orderAddress';
  formInfoAddress: IForm = JSON.parse(JSON.stringify(ORDER_ADDRESS_CONFIG));
  formIdProduct = 'orderProduct';
  formInfoProduct: IForm = JSON.parse(JSON.stringify(ORDER_PRODUCT_CONFIG));
  orderBottomSheet: IBottomSheet<IOrder>;
  private formCreatedOb1: Observable<string>;
  private formCreatedOb2: Observable<string>;
  private formCreatedOb3: Observable<string>;
  constructor(
    public orderSvc: OrderService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, // keep as any is needed
  ) {
    this.orderBottomSheet = data;
    this.formCreatedOb1 = this.fis.$ready.pipe(filter(e => e === this.formIdOrder));
    this.formCreatedOb2 = this.fis.$ready.pipe(filter(e => e === this.formIdAddress));
    this.formCreatedOb3 = this.fis.$ready.pipe(filter(e => e === this.formIdProduct));
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
    })
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
