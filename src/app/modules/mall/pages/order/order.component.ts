import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { IOrder } from 'src/app/interfaze/commom.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { grantTypeEnums, scopeEnums } from '../../../../pages/summary-client/summary-client.component';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG } from 'src/app/form-configs/order.config';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FormInfoService } from 'mt-form-builder';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {
  order$: Observable<IOrder>;
  state: 'update' | 'create';
  formId = 'order';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  constructor(
    private route: ActivatedRoute,
    public clientService: OrderService,
    private fis: FormInfoService
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
    this.order$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.clientService.getOrderById(params.get('id')))
    );
    this.route.queryParamMap.subscribe(
      queryMaps => {
        this.state = queryMaps.get('state') as 'update' | 'create';
        if (queryMaps.get('state') === 'update') {
          this.order$.subscribe(order => {
            if (order === null || order === undefined)
              throw new Error('unable to find target resource');//replace with error handler
            this.fis.formGroupCollection[this.formId].patchValue({
              id: order.id,
              address: JSON.stringify(order.address),
              productList: JSON.stringify(order.productList),
              paymentAmt: order.paymentAmt,
              paymentType: order.paymentType,
            });
          })
        } else if (queryMaps.get('state') === 'none') {

        } else {

        }
      }
    )
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
  }
  ngOnDestroy(): void {
    this.fis.formGroupCollection[this.formId].reset();
  }

}
