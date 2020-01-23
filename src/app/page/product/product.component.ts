import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IProductDetail, ProductService, IProductOptions, IProductOption } from 'src/app/service/product.service';
import { HttpProxyService } from 'src/app/service/http-proxy.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  state: string;
  urlLargeCount: number = 0;
  optionCount: number = 0;
  optionValueCount: {} = {};
  product$: Observable<IProductDetail>;
  imagesUrlLargeCtrls: string[] = [];
  optionCtrls: string[] = [];
  optionValueCtrls: string[] = [];

  productForm = new FormGroup({
    id: new FormControl('', [
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    price: new FormControl('', [
      Validators.required
    ]),
    imageUrlSmall: new FormControl({ value: '', disabled: true }, [
    ]),
    description: new FormControl('', [
    ]),
    sales: new FormControl('', [
    ]),
    rate: new FormControl('', [
    ]),
    actualStorage: new FormControl('', [
    ]),
    increaseActualStorageBy: new FormControl('', [
    ]),
    decreaseActualStorageBy: new FormControl('', [
    ]),
    orderStorage: new FormControl('', [
    ]),
    increaseOrderStorageBy: new FormControl('', [
    ]),
    decreaseOrderStorageBy: new FormControl('', [
    ]),
  });
  constructor(
    private route: ActivatedRoute,
    public productSvc: ProductService,
    private httpProxy: HttpProxyService
  ) {
  }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productSvc.getProductDetailById(+params.get('id')))
    );
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.product$.subscribe(byId => {
          this.productForm.get('id').setValue(byId.id)
          this.productForm.get('category').setValue(byId.category)
          this.productForm.get('name').setValue(byId.name)
          this.productForm.get('price').setValue(byId.price)
          this.productForm.get('imageUrlSmall').setValue(byId.imageUrlSmall)
          this.productForm.get('description').setValue(byId.description)
          this.productForm.get('sales').setValue(byId.sales)
          this.productForm.get('rate').setValue(byId.rate)
          if (byId.imageUrlLarge && byId.imageUrlLarge.length !== 0) {
            byId.imageUrlLarge.forEach(url => {
              this.imagesUrlLargeCtrls.push('imageUrlLarge_' + this.urlLargeCount);
              this.productForm.addControl('imageUrlLarge_' + this.urlLargeCount, new FormControl(url))
              this.urlLargeCount++;
            })
          }
          if (byId.selectedOptions && byId.selectedOptions.length !== 0) {
            byId.selectedOptions.forEach(option => {
              let parent = 'option_' + this.optionCount;
              this.optionCount++;
              this.optionCtrls.push(parent);
              this.productForm.addControl(parent, new FormControl(option.title))
              if (option.options !== null && option.options !== undefined && option.options.length !== 0) {
                option.options.forEach(op => {
                  if (this.optionValueCount[parent] === undefined || this.optionValueCount[parent] === null) {
                    this.optionValueCount[parent] = 0;
                  }
                  this.optionValueCtrls.push(parent + '_' + this.optionValueCount[parent]);
                  this.productForm.addControl(parent + '_' + this.optionValueCount[parent], new FormControl(op.optionValue))
                  this.productForm.addControl(parent + '_' + this.optionValueCount[parent] + '_value', new FormControl(op.priceVar))
                  this.optionValueCount[parent]++;
                })
              };
            })
          }
        })
      } else if (queryMaps.get('state') === 'none') {

      } else {

      }
    })
  }
  convertToPayload(formGroup: FormGroup): IProductDetail {
    let imagesUrl: string[] = null;
    if (this.imagesUrlLargeCtrls.length !== 0) {
      imagesUrl = this.imagesUrlLargeCtrls.map(e => this.productForm.get(e).value)
    }
    let selectedOptions: IProductOptions[] = null;
    if (this.optionCtrls.length !== 0) {
      selectedOptions =
        this.optionCtrls.map(e => {
          let var1 = <IProductOptions>{}
          var1.title = this.productForm.get(e).value;
          var1.options = Object.keys(this.productForm.controls).filter(el => el.indexOf(e + "_") > -1 && el.indexOf('_value') === -1).map(
            ctrl => {
              return <IProductOption>{
                optionValue: this.productForm.get(ctrl).value,
                priceVar: this.productForm.get(ctrl + '_value').value
              }
            }
          );
          return var1;
        })
    }
    return {
      id: formGroup.get('id').value,
      category: formGroup.get('category').value,
      name: formGroup.get('name').value,
      price: formGroup.get('price').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description: formGroup.get('description').value,
      sales: formGroup.get('sales').value,
      rate: formGroup.get('rate').value,
      imageUrlLarge: imagesUrl,
      selectedOptions: selectedOptions,
      orderStorage: formGroup.get('orderStorage').value,
      increaseOrderStorageBy: formGroup.get('increaseOrderStorageBy').value,
      decreaseOrderStorageBy: formGroup.get('decreaseOrderStorageBy').value,
      actualStorage: formGroup.get('actualStorage').value,
      increaseActualStorageBy: formGroup.get('increaseActualStorageBy').value,
      decreaseActualStorageBy: formGroup.get('decreaseActualStorageBy').value
    }
  }
  addNewCtrl() {
    this.imagesUrlLargeCtrls.push('imageUrlLarge_' + this.urlLargeCount);
    this.productForm.addControl('imageUrlLarge_' + this.urlLargeCount, new FormControl())
    this.urlLargeCount++;
  }
  removeCtrl(ctrlName: string) {
    this.imagesUrlLargeCtrls = this.imagesUrlLargeCtrls.filter(e => e !== ctrlName);
    this.productForm.removeControl(ctrlName)
  }
  addOptionNewCtrl() {
    this.optionCtrls.push('option_' + this.optionCount);
    this.productForm.addControl('option_' + this.optionCount, new FormControl())
    this.optionCount++;
  }
  removeOptionCtrl(ctrlName: string) {
    this.optionCtrls = this.optionCtrls.filter(e => e !== ctrlName);
    this.productForm.removeControl(ctrlName);
  }
  removeOptionValueCtrl(ctrlName: string) {
    this.optionValueCtrls = this.optionValueCtrls.filter(e => e !== ctrlName);
    this.productForm.removeControl(ctrlName)
  }
  addOptionValueNewCtrl(parent: string) {
    if (this.optionValueCount[parent] === undefined || this.optionValueCount[parent] === null) {
      console.dir('resettting')
      this.optionValueCount[parent] = 0;
    }
    this.optionValueCtrls.push(parent + '_' + this.optionValueCount[parent]);
    this.productForm.addControl(parent + '_' + this.optionValueCount[parent], new FormControl())
    this.productForm.addControl(parent + '_' + this.optionValueCount[parent] + '_value', new FormControl())
    this.optionValueCount[parent]++;
  }
  getRelated(list: string[], prefix: string): string[] {
    return list.filter(e => e.indexOf(prefix) > -1)
  }
  uploadFile(files: FileList) {
    this.httpProxy.netImpl.uploadFile(files.item(0)).subscribe(next => {
      this.productForm.get('imageUrlSmall').setValue(next)
    })
  }
}
