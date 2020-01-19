import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OrderService } from 'src/app/service/order.service';
import { IOrder } from 'src/app/interfaze/commom.interface';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { grantTypeEnums, scopeEnums } from '../summary-client/summary-client.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order$: Observable<IOrder>;
  state: 'update' | 'create';
  orderForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    address: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    productList: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    paymentType: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),
    paymentAmt: new FormControl({ value: '', disabled: true }, [
      Validators.required
    ]),

  });
  constructor(
    private route: ActivatedRoute,
    public clientService: OrderService,
  ) {
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
            this.orderForm.patchValue({
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

  ngOnInit() {
  }

}
