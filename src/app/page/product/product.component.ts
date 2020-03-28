import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IProductDetail, ProductService, IProductOptions, IProductOption } from 'src/app/service/product.service';
import { HttpProxyService } from 'src/app/service/http-proxy.service';
import { IForm } from 'magic-form/lib/classes/template.interface';
import { FORM_CONFIG, FORM_CONFIG_IMAGE, FORM_CONFIG_OPTIONS } from 'src/app/form-configs/product.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FormInfoService } from 'magic-form';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  product$: Observable<IProductDetail>;
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  validator: ValidateHelper;
  imageFormId = 'product_image';
  imageFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_IMAGE));
  imageFormvalidator: ValidateHelper;
  optionFormId = 'product_option';
  optionFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_OPTIONS));
  optionFormvalidator: ValidateHelper;
  subs: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    public productSvc: ProductService,
    private httpProxy: HttpProxyService,
    private fis: FormInfoService,
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis)
    this.imageFormvalidator = new ValidateHelper(this.imageFormId, this.imageFormInfo, this.fis)
    this.optionFormvalidator = new ValidateHelper(this.optionFormId, this.optionFormInfo, this.fis)
  }
  ngAfterViewInit(): void {
    this.subs.push(
      this.route.queryParamMap.subscribe(queryMaps => {
        this.state = queryMaps.get('state');
        if (queryMaps.get('state') === 'update') {
          let showCtrls = ['decreaseActualStorageBy', 'increaseActualStorageBy', 'decreaseOrderStorageBy', 'increaseOrderStorageBy'];
          let hideCtrls = ['orderStorage', 'actualStorage'];
          this.formInfo.inputs.forEach(e => {
            if (showCtrls.indexOf(e.key) > -1)
              e.display = true;
            if (hideCtrls.indexOf(e.key) > -1)
              e.display = false;
          });
          this.subs.push(this.product$.subscribe(byId => {
            this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id)
            this.fis.formGroupCollection[this.formId].get('category').setValue(byId.category)
            this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name)
            this.fis.formGroupCollection[this.formId].get('price').setValue(byId.price)
            this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(byId.imageUrlSmall)
            this.fis.formGroupCollection[this.formId].get('description').setValue(byId.description)
            this.fis.formGroupCollection[this.formId].get('sales').setValue(byId.sales)
            this.fis.formGroupCollection[this.formId].get('rate').setValue(byId.rate)
            if (byId.imageUrlLarge && byId.imageUrlLarge.length !== 0) {
              byId.imageUrlLarge.forEach((url, index) => {
                if (index === 0) {
                  this.fis.formGroupCollection[this.imageFormId].get('imageUrl').setValue(url);
                } else {
                  this.fis.formGroupCollection[this.imageFormId].addControl('imageUrl_' + this.fis.formGroupCollection_index[this.imageFormId], new FormControl(url));
                  this.fis.add(this.imageFormId);
                }
                this.fis.refreshLayout(this.imageFormInfo, this.imageFormId);
              })
            }
            if (byId.selectedOptions && byId.selectedOptions.length !== 0) {
              byId.selectedOptions.forEach((option, index) => {
                if (index === 0) {
                  this.fis.formGroupCollection[this.optionFormId].get('productOption').setValue(option.title);
                  //for child form
                  option.options.forEach((opt, index) => {
                    if (index == 0) {
                      this.fis.formGroupCollection['optionForm'].get('optionValue').setValue(opt.optionValue);
                      this.fis.formGroupCollection['optionForm'].get('optionPriceChange').setValue(opt.priceVar);
                    } else {
                      this.fis.formGroupCollection['optionForm'].addControl('optionValue_' + this.fis.formGroupCollection_index['optionForm'], new FormControl(opt.optionValue));
                      this.fis.formGroupCollection['optionForm'].addControl('optionPriceChange_' + this.fis.formGroupCollection_index['optionForm'], new FormControl(opt.priceVar));
                      this.fis.add('optionForm');
                    }
                  })
                  this.fis.refreshLayout(this.fis.formGroupCollection_formInfo['optionForm'], 'optionForm');
                  //for child form
                } else {
                  let indexSnapshot = this.fis.formGroupCollection_index[this.optionFormId];
                  this.fis.formGroupCollection[this.optionFormId].addControl('productOption_' + indexSnapshot, new FormControl(option.title));
                  /**
                   * @note set child form need to wait for all params to be created
                   */
                  setTimeout((i) => {
                    //for child form
                    let childFormId = 'optionForm_' + i;
                    option.options.forEach((opt, index) => {
                      if (index == 0) {
                        this.fis.formGroupCollection[childFormId].get('optionValue').setValue(opt.optionValue);
                        this.fis.formGroupCollection[childFormId].get('optionPriceChange').setValue(opt.priceVar);
                      } else {
                        this.fis.formGroupCollection[childFormId].addControl('optionValue_' + this.fis.formGroupCollection_index[childFormId], new FormControl(opt.optionValue));
                        this.fis.formGroupCollection[childFormId].addControl('optionPriceChange_' + this.fis.formGroupCollection_index[childFormId], new FormControl(opt.priceVar));
                        this.fis.add(childFormId);
                      }
                    });
                    this.fis.refreshLayout(this.fis.formGroupCollection_formInfo[childFormId], childFormId);
                    //for child form
                  }, 0, indexSnapshot)
                  this.fis.add(this.optionFormId);
                }
              });
              this.fis.refreshLayout(this.optionFormInfo, this.optionFormId);
            }
          }))
        } else if (queryMaps.get('state') === 'none') {

        } else {

        }
      })
    );
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.imageFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.imageFormId]);
    this.optionFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.optionFormId]);
    this.subs.push(this.fis.formGroupCollection[this.formId].get('imageUrlSmallFile').valueChanges.subscribe((next) => { this.uploadFile(next) }));
  }
  ngOnDestroy(): void {
    this.subs.forEach(e => e.unsubscribe());
    this.fis.formGroupCollection[this.formId].reset();
    delete this.fis.formGroupCollection[this.imageFormId];
  }
  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productSvc.getProductDetailById(+params.get('id')))
    );

  }
  convertToPayload(): IProductDetail {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let valueSnapshot = this.fis.formGroupCollection[this.imageFormId].value;
    let imagesUrl = [];
    imagesUrl = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string)
    let selectedOptions: IProductOptions[] = null;
    // if (this.optionCtrls.length !== 0) {
    //   selectedOptions =
    //     this.optionCtrls.map(e => {
    //       let var1 = <IProductOptions>{}
    //       var1.title = this.fis.formGroupCollection[this.formId].get(e).value;
    //       var1.options = Object.keys(this.fis.formGroupCollection[this.formId].controls).filter(el => el.indexOf(e + "_") > -1 && el.indexOf('_value') === -1).map(
    //         ctrl => {
    //           return <IProductOption>{
    //             optionValue: this.fis.formGroupCollection[this.formId].get(ctrl).value,
    //             priceVar: this.fis.formGroupCollection[this.formId].get(ctrl + '_value').value
    //           }
    //         }
    //       );
    //       return var1;
    //     })
    // }
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
  private uploadFile(files: FileList) {
    this.httpProxy.netImpl.uploadFile(files.item(0)).subscribe(next => {
      this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(next)
    })
  }
}
