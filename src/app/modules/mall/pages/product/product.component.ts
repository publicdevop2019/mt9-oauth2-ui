import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ATTR_GEN_FORM_CONFIG } from 'src/app/form-configs/attribute-general-dynamic.config';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { ATTR_SALES_FORM_CONFIG } from 'src/app/form-configs/attribute-sales-dynamic.config';
import { FORM_CONFIG, FORM_CONFIG_IMAGE, FORM_CONFIG_OPTIONS } from 'src/app/form-configs/product.config';
import { AttributeService, IBizAttribute as IBizAttribute } from 'src/app/services/attribute.service';
import { CategoryService, ICatalogCustomer, ICatalogCustomerHttp } from 'src/app/services/catalog.service';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { IProductDetail, IProductOption, IProductOptions, ISku, ProductService } from 'src/app/services/product.service';
import { getLabel, getLayeredLabel } from 'src/app/clazz/utility';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  productDetail: IProductDetail;
  salesFormIdTempId = 'attrSalesFormChild';
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrProdFormId = 'attributesProd';
  attrProdFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  // save a copy of attrFormInfo so when toggle, no need to translate again
  attrProdFormInfoI18n: IForm;
  attrSalesFormId = 'attributeSales';
  attrSalesFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_SALES_FORM_CONFIG));
  attrSalesFormInfoI18n: IForm;
  attrGeneralFormId = 'attributesGeneral';
  attrGeneralFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_GEN_FORM_CONFIG));
  attrGeneralFormInfoI18n: IForm;
  validator: ValidateHelper;
  imageFormId = 'product_image';
  imageFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_IMAGE));
  imageFormvalidator: ValidateHelper;
  optionFormId = 'product_option';
  optionFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_OPTIONS));
  optionFormvalidator: ValidateHelper;
  public attrList: IBizAttribute[];
  private subs: { [key: string]: Subscription } = {};
  private subscriptions: Subscription = new Subscription();
  public catalogs: ICatalogCustomerHttp;
  private udpateSkusOriginalCopy: ISku[];
  private formCreatedOb: Observable<string>;
  private prodFormCreatedOb: Observable<string>;
  private salesFormCreatedOb: Observable<string>;
  private genFormCreatedOb: Observable<string>;
  constructor(
    public productSvc: ProductService,
    private httpProxy: HttpProxyService,
    private fis: FormInfoService,
    public translate: TranslateService,
    private categorySvc: CategoryService,
    public attrSvc: AttributeService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<ProductComponent>,
    private changeDecRef: ChangeDetectorRef
  ) {
    let sub = this.productSvc.closeSheet.subscribe(() => {
      this._bottomSheetRef.dismiss();
    })
    this.subs['closeSheet'] = sub;
    this.subscriptions.add(sub)
    this.productDetail = data as IProductDetail;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis);
    this.imageFormvalidator = new ValidateHelper(this.imageFormId, this.imageFormInfo, this.fis);
    this.optionFormvalidator = new ValidateHelper(this.optionFormId, this.optionFormInfo, this.fis);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.prodFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrProdFormId));
    this.salesFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrSalesFormId));
    this.genFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrGeneralFormId));
    let sub0 = this.formCreatedOb.subscribe(() => {
      if (this.productDetail) {
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.productDetail.id)
        this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(this.productDetail.attributesKey)
        this.fis.formGroupCollection[this.formId].get('name').setValue(this.productDetail.name)
        this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(this.productDetail.imageUrlSmall)
        this.fis.formGroupCollection[this.formId].get('description').setValue(this.productDetail.description)
        this.fis.formGroupCollection[this.formId].get('startAt').setValue(this.productDetail.startAt ? new Date(this.productDetail.startAt).toLocaleString() : '')
        this.fis.formGroupCollection[this.formId].get('endAt').setValue(this.productDetail.endAt ? new Date(this.productDetail.endAt).toLocaleString() : '')
        this.formInfo.inputs.find(e => e.key === 'status').display = false;
        this.formInfo.inputs.find(e => e.key === 'startAt').display = true;
      } else {
        this.fis.formGroupCollection[this.formId].get('status').valueChanges.subscribe(next => {
          if (next === 'AVAILABLE') {
            this.fis.formGroupCollection[this.formId].get('startAt').setValue(new Date().valueOf())
            this.formInfo.inputs.find(e => e.key === 'startAt').display = false;
          } else {
            this.fis.formGroupCollection[this.formId].get('startAt').setValue('')
            this.formInfo.inputs.find(e => e.key === 'startAt').display = true;
          }
        })

      }
      let sub = this.fis.formGroupCollection[this.formId].get('selectBackendCatalog').valueChanges.subscribe(next => {
        this.loadAttributes(this.catalogs.data.find(e => e.id === +next))
      })
      this.subscriptions.add(sub);
    })
    let sub1 = this.attrSvc.getAttributeList().pipe(switchMap((next) => {
      // load attribute first then initialize form
      this.updateFormInfoOptions(next.data);
      this.attrList = next.data;
      return combineLatest(this.prodFormCreatedOb, this.salesFormCreatedOb, this.genFormCreatedOb).pipe(take(1))
    })).subscribe(() => {
      if (!this.productDetail) {
        this.subChangeForForm(this.salesFormIdTempId);
      } else {
        if (this.productDetail.attributesProd) {
          this.updateValueForForm(this.productDetail.attributesProd, this.attrProdFormId);
        }
        if (this.productDetail.attributesGen) {
          this.updateValueForForm(this.productDetail.attributesGen, this.attrGeneralFormId);
        }
        this.udpateSkusOriginalCopy = JSON.parse(JSON.stringify(this.productDetail.skus))
        if (this.productDetail.skus && this.productDetail.skus.length > 0) {
          this.updateAndSubSalesForm(this.productDetail.skus);
        }
        if (this.productDetail.imageUrlLarge && this.productDetail.imageUrlLarge.length !== 0) {
          this.productDetail.imageUrlLarge.forEach((url, index) => {
            if (index === 0) {
              this.fis.formGroupCollection[this.imageFormId].get('imageUrl').setValue(url);
            } else {
              this.fis.add(this.imageFormId);
              this.fis.formGroupCollection[this.imageFormId].get('imageUrl_' + (index - 1)).setValue(url);
            }
          })
        }
        if (this.productDetail.selectedOptions && this.productDetail.selectedOptions.length !== 0) {
          this.productDetail.selectedOptions.forEach((option, index) => {
            if (index === 0) {
              this.fis.formGroupCollection[this.optionFormId].get('productOption').setValue(option.title);
              //for child form
              let childFormId = 'optionForm'
              this.updateChildFormProductOption(option, childFormId);
              //for child form
            } else {
              this.fis.add(this.optionFormId);
              this.fis.formGroupCollection[this.optionFormId].get('productOption_' + (index - 1)).setValue(option.title);
              let childFormId = 'optionForm_' + (index - 1);
              let childFormCreated = this.fis.$ready.pipe(filter(e => e === childFormId));
              let sub = childFormCreated.subscribe(() => {
                this.updateChildFormProductOption(option, childFormId);
              })
              this.subs[childFormId + '_formCreate'] = sub;
              this.subscriptions.add(sub)
            }
          });
        }
      }
      this.subChangeForForm(this.attrProdFormId);
      this.subChangeForForm(this.attrGeneralFormId);
      // when add new child form sub for value chage if no sub
      let sub2 = this.fis.formGroupCollection[this.attrSalesFormId].valueChanges.subscribe(next => {
        Object.keys(next).filter(e => e.includes(this.salesFormIdTempId)).forEach(childrenFormId => {
          if (!this.subs[childrenFormId + '_valueChange']) {
            let childFormCreated = this.fis.$ready.pipe(filter(e => e === childrenFormId));
            let sub = childFormCreated.subscribe(() => {
              this.subChangeForForm(childrenFormId);
            })
            this.subs[childrenFormId + '_formCreate'] = sub;
            this.subscriptions.add(sub)
          }
        })
      });
      this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
      this.imageFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.imageFormId]);
      this.optionFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.optionFormId]);
      let sub3 = this.fis.formGroupCollection[this.formId].get('imageUrlSmallFile').valueChanges.subscribe((next) => { this.uploadFile(next) })
      this.subs['imageUrlSmallFile_valueChange'] = sub3;
      this.subs[this.formId + '_formCreate'] = sub0;
      this.subs['getAttributeList_http'] = sub1;
      this.subs[this.attrSalesFormId + '_valueChange'] = sub2;
      this.subscriptions.add(sub0)
      this.subscriptions.add(sub1)
      this.subscriptions.add(sub2)
      this.subscriptions.add(sub3)
    })
  }
  private updateChildFormProductOption(option: IProductOptions, childFormId: string) {
    option.options.forEach((opt, index) => {
      if (index == 0) {
        this.fis.formGroupCollection[childFormId].get('optionValue').setValue(opt.optionValue);
        this.fis.formGroupCollection[childFormId].get('optionPriceChange').setValue(opt.priceVar);
      } else {
        let snapshot = this.fis.formGroupCollection_index[childFormId];
        this.fis.add(childFormId);
        this.fis.formGroupCollection[childFormId].get('optionValue_' + snapshot).setValue(opt.optionValue);
        this.fis.formGroupCollection[childFormId].get('optionPriceChange_' + snapshot).setValue(opt.priceVar);
      }
    });
  }
  private updateAndSubSalesForm(skus: ISku[]) {
    skus.forEach((sku, index) => {
      if (index === 0) {
        this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder').setValue(sku.storageOrder);
        this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual').setValue(sku.storageActual);
        this.fis.formGroupCollection[this.attrSalesFormId].get('price').setValue(sku.price);
        this.fis.formGroupCollection[this.attrSalesFormId].get('sales').setValue(sku.sales);
        //start of child form
        let formInfo = this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form;
        this.updateValueForForm(sku.attributesSales, this.salesFormIdTempId);
        this.disabledAttrSalesChildForm(formInfo);
        //end of child form
        this.subChangeForForm(this.salesFormIdTempId);
      } else {
        this.fis.add(this.attrSalesFormId);
        this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder_' + (index - 1)).setValue(sku.storageOrder);
        this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual_' + (index - 1)).setValue(sku.storageActual);
        this.fis.formGroupCollection[this.attrSalesFormId].get('price_' + (index - 1)).setValue(sku.price);
        this.fis.formGroupCollection[this.attrSalesFormId].get('sales_' + (index - 1)).setValue(sku.sales);
        //start of child form
        let formId = this.salesFormIdTempId + '_' + (index - 1);

        let childFormCreated = this.fis.$ready.pipe(filter(e => e === formId));
        let sub = childFormCreated.subscribe(() => {
          let formInfo = this.fis.formGroupCollection_formInfo[formId];
          this.updateValueForForm(sku.attributesSales, formId);
          this.disabledAttrSalesChildForm(formInfo);
          this.subChangeForForm(formId);
          this.fis.$refresh.next();
        });
        this.subs[formId + '_formCreate'] = sub;
        this.subscriptions.add(sub)
        //end of child form
      }
    });
    this.displayStorageChangeInputs(this.fis.formGroupCollection_formInfo[this.attrSalesFormId]);
    this.disabledAttrSalesForm(this.fis.formGroupCollection_formInfo[this.attrSalesFormId]);
    this.fis.formGroupCollection_formInfo[this.attrSalesFormId];
    this.fis.$refresh.next();
  }
  private displayStorageChangeInputs(arg0: IForm) {
    let var0 = ['storage_OrderIncreaseBy', 'storage_OrderDecreaseBy', 'storage_ActualIncreaseBy', 'storage_ActualDecreaseBy']
    arg0.inputs.filter(e => var0.filter(ee => e.key.includes(ee)).length > 0).forEach(e => e.display = true);
  }
  private disabledAttrSalesForm(formInfo: IForm) {
    let var0 = ['storageOrder', 'storageActual', 'sales']
    formInfo.inputs.filter(e => var0.filter(ee => e.key.includes(ee)).length > 0).forEach(e => e.disabled = true);
  }
  private disabledAttrSalesChildForm(formInfo: IForm) {
    formInfo.inputs.forEach(e => e.disabled = true);
    formInfo.disabled = true;
  }
  /**
   * @description update formInfo first then initialize form, so add template can be correct
   * @param attrs 
   */
  private updateFormInfoOptions(attrs: IBizAttribute[]) {
    this.attrProdFormInfo.inputs[0].options = attrs.filter(e => e.type === 'PROD_ATTR').map(e => <IOption>{ label: getLabel(e), value: String(e.id) });
    this.attrGeneralFormInfo.inputs[0].options = attrs.filter(e => e.type === 'GEN_ATTR').map(e => <IOption>{ label: getLabel(e), value: String(e.id) });
    this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form.inputs[0].options = attrs.filter(e => e.type === 'SALES_ATTR').map(e => <IOption>{ label: getLabel(e), value: String(e.id) });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.fis.resetAll();
  }
  private transKeyMap: Map<string, string> = new Map();
  private translateFormLabel() {
    this.formInfo.inputs.forEach(e => {
      if (e.options) {
        e.options.forEach(el => {
          this.translate.get(el.label).subscribe((res: string) => {
            this.transKeyMap.set(e.key + el.value, el.label);
            el.label = res;
          });
        })
      }
      e.label && this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrProdFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrProdFormInfoI18n = JSON.parse(JSON.stringify(this.attrProdFormInfo));
    this.attrGeneralFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrGeneralFormInfoI18n = JSON.parse(JSON.stringify(this.attrGeneralFormInfo));
    this.attrSalesFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrSalesFormInfoI18n = JSON.parse(JSON.stringify(this.attrSalesFormInfo));
    this.imageFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.optionFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    //nested form
    this.optionFormInfo.inputs.filter(e => e.form)[0].form.inputs.forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrSalesFormInfo.inputs.filter(e => e.form)[0].form.inputs.forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
  }
  ngOnInit() {
    this.translateFormLabel();
    let sub = this.translate.onLangChange.subscribe(() => {
      this.translateFormLabel();
    })
    this.subs['i18n'] = sub;
    this.subscriptions.add(sub)
    this.categorySvc.getCatalogBackend()
      .subscribe(next => {
        if (next.data) {
          this.catalogs = next;
          this.formInfo.inputs[1].options = next.data.filter(ee => this.isLeafNode(next.data, ee)).map(e => <IOption>{ label: getLayeredLabel(e, next.data), value: String(e.id) });
          this.changeDecRef.markForCheck()
        }
      });
  }
  private isLeafNode(catalogs: ICatalogCustomer[], catalog: ICatalogCustomer): boolean {
    return catalogs.filter(node => node.parentId === catalog.id).length == 0
  }
  convertToPayload(): IProductDetail {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let valueSnapshot = this.fis.formGroupCollection[this.imageFormId].value;
    let imagesUrl = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string);
    let selectedOptions: IProductOptions[] = [];
    Object.keys(this.fis.formGroupCollection[this.optionFormId].controls).filter(e => e.indexOf('productOption') > -1).forEach((ctrlName) => {
      let var1 = <IProductOptions>{};
      var1.title = this.fis.formGroupCollection[this.optionFormId].get(ctrlName).value;
      var1.options = [];
      let fg = this.fis.formGroupCollection['optionForm' + ctrlName.replace('productOption', '')];
      var1.options = Object.keys(fg.controls).filter(e => e.indexOf('optionValue') > -1).map(e => {
        return <IProductOption>{
          optionValue: fg.get(e).value,
          priceVar: fg.get(e.replace('optionValue', 'optionPriceChange')).value,
        }
      });
      selectedOptions.push(var1)
    });
    let skusCalc: ISku[] = [];
    Object.keys(this.fis.formGroupCollection[this.attrSalesFormId].controls).filter(e => e.indexOf('storageOrder') > -1).forEach((ctrlName) => {
      let var1 = <ISku>{};
      let suffix = ctrlName.replace('storageOrder', '');
      var1.attributesSales = this.getAddedAttrs(this.salesFormIdTempId + suffix);
      var1.price = this.fis.formGroupCollection[this.attrSalesFormId].get('price' + suffix).value;
      if (!this.productDetail) {
        var1.storageOrder = this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder' + suffix).value;
        var1.storageActual = this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual' + suffix).value;
        var1.sales = this.fis.formGroupCollection[this.attrSalesFormId].get('sales' + suffix).value;
      } else if (this.productDetail && this.udpateSkusOriginalCopy.find(e => JSON.stringify(e.attributesSales.sort()) === JSON.stringify(var1.attributesSales.sort()))) {
        let var11 = this.fis.formGroupCollection[this.attrSalesFormId].get('storage_OrderIncreaseBy' + suffix).value;
        if (var11)
          var1.increaseOrderStorage = var11;
        let var12 = this.fis.formGroupCollection[this.attrSalesFormId].get('storage_OrderDecreaseBy' + suffix).value;
        if (var12)
          var1.decreaseOrderStorage = var12;
        let var13 = this.fis.formGroupCollection[this.attrSalesFormId].get('storage_ActualIncreaseBy' + suffix).value;
        if (var13)
          var1.increaseActualStorage = var13;
        let var14 = this.fis.formGroupCollection[this.attrSalesFormId].get('storage_ActualDecreaseBy' + suffix).value;
        if (var14)
          var1.decreaseActualStorage = var14;
      } else if (this.productDetail && this.udpateSkusOriginalCopy.find(e => JSON.stringify(e.attributesSales.sort()) !== JSON.stringify(var1.attributesSales.sort()))) {
        //new sku during update product
        var1.storageOrder = this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder' + suffix).value;
        var1.storageActual = this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual' + suffix).value;
        var1.sales = this.fis.formGroupCollection[this.attrSalesFormId].get('sales' + suffix).value;
      } else {

      }
      skusCalc.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      attributesKey: formGroup.get('attributesKey').value,
      attributesProd: this.hasAttr(this.attrProdFormId) ? this.getAddedAttrs(this.attrProdFormId) : null,
      attributesGen: this.hasAttr(this.attrGeneralFormId) ? this.getAddedAttrs(this.attrGeneralFormId) : null,
      name: formGroup.get('name').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description: formGroup.get('description').value,
      imageUrlLarge: imagesUrl,
      selectedOptions: selectedOptions.filter(e => e.title !== ''),
      skus: skusCalc,
      endAt: formGroup.get('endAt').value ? this.parseDate(formGroup.get('endAt').value) : undefined,
      startAt: formGroup.get('startAt').value ? this.parseDate(formGroup.get('startAt').value) : undefined
    }
  }
  parseDate(value: string): number {
    if (this.productDetail) {
      if (this.productDetail.startAt && new Date(this.productDetail.startAt).toLocaleString() === value) {
        return this.productDetail.startAt
      }
      if (this.productDetail.endAt && new Date(this.productDetail.endAt).toLocaleString() === value) {
        return this.productDetail.endAt
      }
    }
    let date = value.split(', ')[0]
    let time = value.split(', ')[1]
    let utcDate = date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0] + 'T';
    let utcTime = time.split(':')[0] + ':' + time.split(':')[1] + ':' + time.split(':')[2] + 'Z';
    return Date.parse(utcDate + utcTime) + new Date().getTimezoneOffset() * 60 * 1000

  }
  private uploadFile(files: FileList) {
    this.httpProxy.uploadFile(files.item(0)).subscribe(next => {
      this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(next)
    })
  }
  public loadAttributes(attr: ICatalogCustomer) {
    let tags: string[] = [];
    tags.push(...attr.attributes);
    while (attr.parentId !== null && attr.parentId !== undefined) {
      let nextId = attr.parentId;
      attr = this.catalogs.data.find(e => e.id === nextId);
      tags.push(...attr.attributes);
    }
    this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(tags);
  }
  private hasAttr(formId: string): boolean {
    let attrFormValue = this.fis.formGroupCollection[formId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).filter(idKey => attrFormValue[idKey]).length > 0;
  }
  private getAddedAttrs(formId: string): string[] {
    let attrFormValue = this.fis.formGroupCollection[formId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).map(idKey => {
      let selected = this.attrList.find(e => String(e.id) === attrFormValue[idKey]);
      let append = idKey.replace('attributeId', '');
      let attrValue: string;
      if (selected.method === 'SELECT') {
        attrValue = this.fis.formGroupCollection[formId].get('attributeValueSelect' + append).value;
      } else {
        attrValue = this.fis.formGroupCollection[formId].get('attributeValueManual' + append).value;
      }
      return selected.id + ':' + attrValue
    });
  }
  private updateValueForForm(attrs: string[], formId: string) {
    attrs.forEach((attr, index) => {
      if (index === 0) {
        let selected = this.attrList.find(e => String(e.id) === attr.split(':')[0]);
        this.fis.formGroupCollection[formId].get('attributeId').setValue(String(selected.id));
        if (selected.method === 'SELECT') {
          this.fis.formGroupCollection_formInfo[formId].inputs.find(e => e.key === 'attributeValueSelect').display = true;
          this.fis.formGroupCollection_formInfo[formId].inputs.find(ee => ee.key === 'attributeValueSelect').options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
          this.fis.formGroupCollection[formId].get('attributeValueSelect').setValue(attr.split(':')[1]);
        } else {
          this.fis.formGroupCollection_formInfo[formId].inputs.find(e => e.key === 'attributeValueManual').display = true;
          this.fis.formGroupCollection[formId].get('attributeValueManual').setValue(String(attr.split(':')[1]));
        }
      } else {
        let selected = this.attrList.find(e => String(e.id) === attr.split(':')[0]);
        this.fis.add(formId);
        this.fis.formGroupCollection[formId].get('attributeId_' + (index - 1)).setValue(String(selected.id));
        if (selected.method === 'SELECT') {
          this.fis.formGroupCollection[formId].get('attributeValueSelect_' + (index - 1)).setValue(attr.split(':')[1]);
        } else {
          this.fis.formGroupCollection[formId].get('attributeValueManual_' + (index - 1)).setValue(attr.split(':')[1]);
        }
        //update display after new inputs added
        if (selected.method === 'SELECT') {
          this.fis.formGroupCollection_formInfo[formId].inputs.find(e => e.key === 'attributeValueSelect_' + (index - 1)).display = true;
          this.fis.formGroupCollection_formInfo[formId].inputs.find(e => e.key === 'attributeValueSelect_' + (index - 1)).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
        } else {
          this.fis.formGroupCollection_formInfo[formId].inputs.find(e => e.key === 'attributeValueManual_' + (index - 1)).display = true;
        }
      }
    })
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  private subChangeForForm(formId: string) {
    if (!this.subs[formId + '_valueChange']) {
      let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
        Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
          let selected = this.attrList.find(e => String(e.id) === next[idKey]);
          if (selected) {
            let append = idKey.replace('attributeId', '');
            this.fis.formGroupCollection_formInfo[formId].inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
            this.fis.formGroupCollection_formInfo[formId].inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
            if (selected.method === 'SELECT') {
              this.fis.formGroupCollection_formInfo[formId].inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
            }
          }
        });
      });
      this.subs[formId + '_valueChange'] = sub;
      this.subscriptions.add(sub)
    }
  }
}
