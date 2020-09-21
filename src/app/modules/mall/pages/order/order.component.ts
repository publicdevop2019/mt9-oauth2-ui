import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { switchMap } from 'rxjs/operators';
import { ORDER_PRODUCT_CONFIG, ORDER_ADDRESS_CONFIG } from 'src/app/form-configs/order.config';
import { ICartItem } from 'src/app/interfaze/commom.interface';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  formIdAddress = 'orderAddress';
  formInfoAddress: IForm = JSON.parse(JSON.stringify(ORDER_ADDRESS_CONFIG));
  formIdProduct = 'orderProduct';
  formInfoProduct: IForm = JSON.parse(JSON.stringify(ORDER_PRODUCT_CONFIG));
  constructor(
    private route: ActivatedRoute,
    public orderSvc: OrderService,
    private fis: FormInfoService
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.orderSvc.readById(+params.get('id')))
    ).subscribe(order => {
      this.fis.formGroupCollection[this.formIdAddress].patchValue(order.address);
      let var0 = this.beforePatchProduct(order.productList);
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
