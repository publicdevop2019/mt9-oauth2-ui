import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { getLabel, getLayeredLabel, parseAttributePayload } from 'src/app/clazz/utility';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ATTR_GEN_FORM_CONFIG } from 'src/app/form-configs/attribute-general-dynamic.config';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { ATTR_SALES_FORM_CONFIG } from 'src/app/form-configs/attribute-sales-dynamic.config';
import { ATTR_SALE_FORM_CONFIG_IMAGE, FORM_CONFIG, FORM_CONFIG_IMAGE, FORM_CONFIG_OPTIONS } from 'src/app/form-configs/product.config';
import { AttributeService, IBizAttribute as IBizAttribute } from 'src/app/services/attribute.service';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { IAttrImage, IProductDetail, IProductOption, IProductOptions, ISku, ProductService, IProductSimple } from 'src/app/services/product.service';
import * as UUID from 'uuid/v1';
import { IBottomSheet, ISumRep } from 'src/app/clazz/summary.component';
import { environment } from 'src/environments/environment';
interface IProductSimplePublic {
  imageUrlSmall: string;
  name: string;
  description: string;
  lowestPrice: number;
  totalSales: number;
  id: number;
}
interface IProductSkuPublic {
  attributesSales: string[];
  price: number;
  storage: number;
}
interface IProductDetailPublic extends IProductSimplePublic {
  imageUrlLarge?: string[];
  selectedOptions?: IProductOptions[];
  specification?: string[];
  skus: IProductSkuPublic[],
  storage?: number,
  attrIdMap: { [key: number]: string }
  attributeSaleImages?: IAttrImage[]
}
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  subForFileUpload(formId: string) {
    let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
      Object.keys(next).forEach(key => {
        if (typeof next[key] !== 'string') {
          this.uploadFileCommon((next[key] as FileList), formId, key)
        }
      })
    });
    this.subscriptions.add(sub);
  }
  hasEmptyAttrSales(e: ISku): boolean {
    return e.attributesSales.length === 0 || (e.attributesSales.length === 1 && e.attributesSales[0] === '')
  }
  productDetail: IProductDetail;
  productBottomSheet: IBottomSheet<IProductDetail>;
  changeId: string = UUID();
  salesFormIdTempId = 'attrSalesFormChild';
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrProdFormId = 'attributesProd';
  attrProdFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  attrSalesFormId = 'attributeSales';
  attrSalesFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_SALES_FORM_CONFIG));
  attrGeneralFormId = 'attributesGeneral';
  attrGeneralFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_GEN_FORM_CONFIG));
  validator: ValidateHelper;
  imageAttrSaleFormId = 'productAttrSaleImage';
  imageAttrSaleChildFormId = 'imageChildForm';
  imageAttrSaleFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_SALE_FORM_CONFIG_IMAGE));
  imageFormId = 'product_image';
  imageFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_IMAGE));
  imageFormvalidator: ValidateHelper;
  optionFormId = 'product_option';
  optionFormInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_OPTIONS));
  optionFormvalidator: ValidateHelper;
  public attrList: IBizAttribute[];
  private subs: { [key: string]: Subscription } = {};
  private subscriptions: Subscription = new Subscription();
  public catalogs: ISumRep<ICatalog>;
  private udpateSkusOriginalCopy: ISku[];
  private formCreatedOb: Observable<string>;
  private prodFormCreatedOb: Observable<string>;
  private salesFormCreatedOb: Observable<string>;
  private genFormCreatedOb: Observable<string>;
  private imgAttrSaleFormCreatedOb: Observable<string>;
  private salesFormIdTempFormCreatedOb: Observable<string>;
  private imageAttrSaleChildFormCreatedOb: Observable<string>;
  public hasSku: boolean = false;
  constructor(
    public productSvc: ProductService,
    private httpProxy: HttpProxyService,
    private fis: FormInfoService,
    private categorySvc: CatalogService,
    public attrSvc: AttributeService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, // keep as any is needed
    private _bottomSheetRef: MatBottomSheetRef<ProductComponent>,
    private changeDecRef: ChangeDetectorRef
  ) {
    let sub = this.productSvc.closeSheet.subscribe(() => {
      this._bottomSheetRef.dismiss();
    })
    let keys = ['storageActual', 'storageOrder', 'price', 'sales']
    let keys2 = ['storage_OrderIncreaseBy', 'storage_OrderDecreaseBy', 'storage_ActualIncreaseBy', 'storage_ActualDecreaseBy']
    this.subs['closeSheet'] = sub;
    this.subscriptions.add(sub);
    this.productBottomSheet = data;
    this.productDetail = this.productBottomSheet.from;
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis);
    this.imageFormvalidator = new ValidateHelper(this.imageFormId, this.imageFormInfo, this.fis);
    this.optionFormvalidator = new ValidateHelper(this.optionFormId, this.optionFormInfo, this.fis);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.prodFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrProdFormId));
    this.salesFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrSalesFormId));
    this.genFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrGeneralFormId));
    this.imgAttrSaleFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.imageAttrSaleFormId));
    this.salesFormIdTempFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.salesFormIdTempId));
    this.imageAttrSaleChildFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.imageAttrSaleChildFormId));
    let sub0 = this.formCreatedOb.pipe(take(1)).subscribe(() => {
      if (this.productBottomSheet.context !== 'new') {
        this.attrSalesFormInfo.disabled=true;
        this.fis.restore(this.formId, this.productDetail);
        this.fis.formGroupCollection[this.formId].get('startAt').setValue(this.productDetail.startAt ? new Date(this.productDetail.startAt).toLocaleString() : '')
        this.fis.formGroupCollection[this.formId].get('endAt').setValue(this.productDetail.endAt ? new Date(this.productDetail.endAt).toLocaleString() : '')
        this.formInfo.inputs.find(e => e.key === 'status').display = false;
        this.formInfo.inputs.find(e => e.key === 'startAt').display = true;
      } else {
        let sub = this.fis.formGroupCollection[this.formId].get('status').valueChanges.subscribe(next => {
          if (next === 'AVAILABLE') {
            this.fis.formGroupCollection[this.formId].get('startAt').setValue(new Date().toLocaleString())
            this.formInfo.inputs.find(e => e.key === 'startAt').display = false;
          } else {
            this.fis.formGroupCollection[this.formId].get('startAt').setValue('')
            this.formInfo.inputs.find(e => e.key === 'startAt').display = true;
          }
        });
        this.subscriptions.add(sub);
      }
      let sub = this.fis.formGroupCollection[this.formId].get('selectBackendCatalog').valueChanges.subscribe(next => {
        this.loadAttributes(this.catalogs.data.find(e => e.id === +next))
      })
      let sub2 = this.fis.formGroupCollection[this.formId].get('hasSku').valueChanges.subscribe(next => {
        if (next === 'YES') {
          this.hasSku = true;
          this.formInfo.inputs.filter(e => keys.includes(e.key)).forEach(e => e.display = false);
          this.formInfo.inputs.filter(e => keys2.includes(e.key)).forEach(e => e.display = false);
        } else {
          this.hasSku = false;
          this.formInfo.inputs.filter(e => keys.includes(e.key)).forEach(e => e.display = true);
        }
      })
      this.subscriptions.add(sub);
      this.subscriptions.add(sub2);
    })
    let sub1 = this.attrSvc.readByQuery(0, 1000).pipe(switchMap((next) => {
      // load attribute first then initialize form
      this.updateFormInfoOptions(next.data);
      this.attrList = next.data;
      this.changeDecRef.markForCheck() // this is required to initialize all forms
      return combineLatest(this.prodFormCreatedOb, this.genFormCreatedOb).pipe(take(1))
    })).subscribe(() => {
      //sub for image update
      this.subForFileUpload(this.imageFormId);
      if (this.productBottomSheet.context === 'new') {
        let sub = this.salesFormIdTempFormCreatedOb.pipe(take(1)).subscribe(() => {
          this.subChangeForForm(this.salesFormIdTempId);
        })
        this.subscriptions.add(sub)
      } else {
        if (this.productDetail.attributesProd) {
          this.subChangeForForm(this.attrProdFormId);
          this.updateValueForForm(this.productDetail.attributesProd, this.attrProdFormId);
        }
        if (this.productDetail.attributesGen) {
          this.subChangeForForm(this.attrGeneralFormId);
          this.updateValueForForm(this.productDetail.attributesGen, this.attrGeneralFormId);
        }
        if (this.productDetail.skus.filter(e => this.hasEmptyAttrSales(e)).length === 0) {
          // use sku form
          this.udpateSkusOriginalCopy = JSON.parse(JSON.stringify(this.productDetail.skus))
          this.fis.formGroupCollection[this.formId].get('hasSku').setValue('YES', { emitEvent: false });
          this.hasSku = true;
          this.formInfo.inputs.filter(e => keys.includes(e.key)).forEach(e => e.display = false);
          this.salesFormCreatedOb.pipe(take(1)).subscribe(() => {
            this.updateAndSubSalesForm(this.productDetail.skus);
          });
        } else {
          // use no sku form
          this.fis.formGroupCollection[this.formId].get('hasSku').setValue('NO', { emitEvent: false });
          this.hasSku = false;
          this.formInfo.inputs.filter(e => keys.includes(e.key)).forEach(e => e.display = true);
          this.fis.restore(this.formId, this.productDetail.skus[0]);
          this.disabledAttrSalesForm(this.fis.formGroupCollection_formInfo[this.formId]);
          this.displayStorageChangeInputs(this.fis.formGroupCollection_formInfo[this.formId]);
          this.fis.$refresh.next();
        }
        if (this.productDetail.imageUrlLarge && this.productDetail.imageUrlLarge.length !== 0) {
          this.fis.restoreDynamicForm(this.imageFormId, this.fis.parsePayloadArr(this.productDetail.imageUrlLarge, 'imageUrl'), this.productDetail.imageUrlLarge.length)
        }
        if (this.productDetail.selectedOptions && this.productDetail.selectedOptions.length !== 0) {
          this.fis.restoreDynamicForm(this.optionFormId, this.fis.parsePayloadArr(this.productDetail.selectedOptions.map(e => e.title), 'productOption'), this.productDetail.selectedOptions.length);
          this.productDetail.selectedOptions.forEach((option, index) => {
            if (index === 0) {
              //for child form
              let childFormId = 'optionForm'
              this.updateChildFormProductOption(option, childFormId);
              //for child form
            } else {
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
        if (this.productDetail.attributeSaleImages && this.productDetail.attributeSaleImages.length !== 0) {
          this.imgAttrSaleFormCreatedOb.pipe(take(1)).subscribe(() => {
            let attrs = this.productDetail.attributeSaleImages.map(e => e.attributeSales);
            this.subChangeForForm(this.imageAttrSaleFormId);
            this.updateValueForForm(attrs, this.imageAttrSaleFormId);
            this.imageAttrSaleChildFormCreatedOb.pipe(take(1)).subscribe(() => {
              this.productDetail.attributeSaleImages.forEach((e, index) => {
                if (index === 0) {
                  this.fis.restoreDynamicForm(this.imageAttrSaleChildFormId, this.fis.parsePayloadArr(e.imageUrls, 'imageUrl'), e.imageUrls.length)
                  this.subForFileUpload(this.imageAttrSaleChildFormId);
                } else {
                  let formId = this.imageAttrSaleChildFormId + '_' + (index - 1);
                  let childFormCreated = this.fis.$ready.pipe(filter(e => e === formId));
                  let sub = childFormCreated.subscribe(() => {
                    this.subForFileUpload(formId);
                    this.fis.restoreDynamicForm(formId, this.fis.parsePayloadArr(e.imageUrls, 'imageUrl'), e.imageUrls.length)
                    this.fis.$refresh.next();
                  });
                  this.subs[formId + '_formCreate'] = sub;
                  this.subscriptions.add(sub)
                }
              })
            })
          })
        }
      }
      this.salesFormCreatedOb.pipe(take(1)).subscribe(() => {
        this.subChangeForForm(this.imageAttrSaleFormId);
        // when add new child form sub for value chage if no sub
        let sub2 = this.fis.formGroupCollection[this.attrSalesFormId].valueChanges.subscribe(next => {
          Object.keys(next).filter(e => e.includes(this.salesFormIdTempId)).forEach(childrenFormId => {
            if (!this.subs[childrenFormId + '_valueChange']) {
              let childFormCreated = this.fis.$ready.pipe(filter(e => e === childrenFormId));
              let sub = childFormCreated.subscribe(() => {
                this.subChangeForForm(childrenFormId);
              })
              this.subs[childrenFormId + '_formCreate'] = sub;
              this.subs[this.attrSalesFormId + '_valueChange'] = sub2;
              this.subscriptions.add(sub)
            }
          })
        });
        this.subscriptions.add(sub2)
      })
      this.subChangeForForm(this.attrProdFormId);
      this.subChangeForForm(this.attrGeneralFormId);

      this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
      this.imageFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.imageFormId]);
      this.optionFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.optionFormId]);
      let sub3 = this.fis.formGroupCollection[this.formId].get('imageUrlSmall').valueChanges.subscribe((next) => { this.uploadFile(next) })
      this.subs['imageUrlSmallFile_valueChange'] = sub3;
      this.subscriptions.add(sub3)
    })
    this.subs['getAttributeList_http'] = sub1;
    this.subs[this.formId + '_formCreate'] = sub0;
    this.subscriptions.add(sub0)
    this.subscriptions.add(sub1)
  }
  private updateChildFormProductOption(option: IProductOptions, childFormId: string) {
    let value = this.fis.parsePayloadArr(option.options.map(e => e.optionValue), 'optionValue');
    let value2 = this.fis.parsePayloadArr(option.options.map(e => e.priceVar), 'optionPriceChange');
    Object.assign(value, value2)
    this.fis.restoreDynamicForm(childFormId, value, option.options.length);
  }
  private updateAndSubSalesForm(skus: ISku[]) {
    let value = this.fis.parsePayloadArr(skus.map(e => e.storageOrder), 'storageOrder');
    let value2 = this.fis.parsePayloadArr(skus.map(e => e.storageActual), 'storageActual');
    let value3 = this.fis.parsePayloadArr(skus.map(e => e.price), 'price');
    let value4 = this.fis.parsePayloadArr(skus.map(e => e.sales), 'sales');
    Object.assign(value, value2)
    Object.assign(value, value3)
    Object.assign(value, value4)
    this.fis.restoreDynamicForm(this.attrSalesFormId, value, skus.length);
    skus.forEach((sku, index) => {
      if (index === 0) {
        //start of child form
        let formInfo = this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form;
        this.salesFormIdTempFormCreatedOb.pipe(take(1)).subscribe(() => {
          this.subChangeForForm(this.salesFormIdTempId);
          this.updateValueForForm(sku.attributesSales, this.salesFormIdTempId);
        })
        if (this.productBottomSheet.context !== 'clone') {
          this.disabledAttrSalesChildForm(formInfo);
        }
        //end of child form
      } else {
        //start of child form
        let formId = this.salesFormIdTempId + '_' + (index - 1);

        let childFormCreated = this.fis.$ready.pipe(filter(e => e === formId));
        let sub = childFormCreated.subscribe(() => {
          let formInfo = this.fis.formGroupCollection_formInfo[formId];
          this.subChangeForForm(formId);
          this.updateValueForForm(sku.attributesSales, formId);
          if (this.productBottomSheet.context !== 'clone') {
            this.disabledAttrSalesChildForm(formInfo);
          }
          this.fis.$refresh.next();
        });
        this.subs[formId + '_formCreate'] = sub;
        this.subscriptions.add(sub)
        //end of child form
      }
    });
    if (this.productBottomSheet.context !== 'clone') {
      this.displayStorageChangeInputs(this.fis.formGroupCollection_formInfo[this.attrSalesFormId]);
      this.disabledAttrSalesForm(this.fis.formGroupCollection_formInfo[this.attrSalesFormId]);
    }
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
    this.attrProdFormInfo.inputs[0].options = attrs.filter(e => e.type === 'PROD_ATTR').map(e => <IOption>{ label: getLabel(e), value: e.id });
    this.attrGeneralFormInfo.inputs[0].options = attrs.filter(e => e.type === 'GEN_ATTR').map(e => <IOption>{ label: getLabel(e), value: e.id });
    this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form.inputs[0].options = attrs.filter(e => e.type === 'SALES_ATTR').map(e => <IOption>{ label: getLabel(e), value: e.id });
    this.imageAttrSaleFormInfo.inputs[0].options = attrs.filter(e => e.type === 'SALES_ATTR').map(e => <IOption>{ label: getLabel(e), value: e.id });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.fis.resetAll();
  }
  ngOnInit() {
    this.categorySvc.readByQuery(0, 1000, 'type:BACKEND')
      .subscribe(next => {
        if (next.data) {
          this.catalogs = next;
          this.formInfo.inputs[1].options = next.data.filter(ee => this.isLeafNode(next.data, ee)).map(e => <IOption>{ label: getLayeredLabel(e, next.data), value: String(e.id) });
          this.changeDecRef.markForCheck()
        }
      });
  }
  private isLeafNode(catalogs: ICatalog[], catalog: ICatalog): boolean {
    return catalogs.filter(node => node.parentId === catalog.id).length == 0
  }
  convertToPayload(): IProductDetail {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let valueSnapshot = this.fis.formGroupCollection[this.imageFormId].value;
    let imagesUrl = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string).filter(e => e !== '');
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
    if (this.hasSku) {
      Object.keys(this.fis.formGroupCollection[this.attrSalesFormId].controls).filter(e => e.indexOf('storageOrder') > -1).forEach((ctrlName) => {
        let var1 = <ISku>{};
        let suffix = ctrlName.replace('storageOrder', '');
        var1.attributesSales = this.getAddedAttrs(this.salesFormIdTempId + suffix);
        var1.price = this.fis.formGroupCollection[this.attrSalesFormId].get('price' + suffix).value;
        if (this.productBottomSheet.context === 'new' || this.productBottomSheet.context === 'clone') {
          //create
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
    } else {
      let var1 = <ISku>{};
      var1.attributesSales = [];
      if (!this.productDetail) {
        //create
        var1.storageOrder = formGroup.get('storageOrder').value
        var1.storageActual = formGroup.get('storageActual').value
        var1.price = formGroup.get('price').value;
        var1.sales = formGroup.get('sales').value;
        skusCalc.push(var1)
      } else {
        //update
        var1.increaseOrderStorage = formGroup.get('storage_OrderIncreaseBy').value
        var1.decreaseOrderStorage = formGroup.get('storage_OrderDecreaseBy').value
        var1.increaseActualStorage = formGroup.get('storage_ActualIncreaseBy').value
        var1.decreaseActualStorage = formGroup.get('storage_ActualDecreaseBy').value
        var1.price = formGroup.get('price').value;
        var1.sales = formGroup.get('sales').value;
        skusCalc.push(var1)
      }
    }
    let attrSaleImages = [];
    if (this.hasSku && this.hasAttrsForCtrl()) {
      Object.keys(this.fis.formGroupCollection[this.imageAttrSaleFormId].controls).filter(e => e.indexOf('attributeId') > -1).forEach((ctrlName) => {
        let var1 = <IAttrImage>{};
        var1.attributeSales = this.getAddedAttrsForCtrl(ctrlName)
        let append = ctrlName.replace('attributeId', '');
        let childFormValue = this.fis.formGroupCollection[this.imageAttrSaleChildFormId + append].value;
        var1.imageUrls = Object.keys(childFormValue).map(e => childFormValue[e] as string).filter(e => e !== '');;
        attrSaleImages.push(var1)
      });
    }
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
      startAt: formGroup.get('startAt').value ? this.parseDate(formGroup.get('startAt').value) : undefined,
      attributeSaleImages: attrSaleImages,
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
      this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(environment.serverUri+'/file-upload-svc/files/public/'+ next, { emitEvent: false })
      this.changeDecRef.detectChanges();
    })
  }
  private uploadFileCommon(files: FileList, formId: string, ctrlName: string) {
    this.httpProxy.uploadFile(files.item(0)).subscribe(next => {
      this.fis.formGroupCollection[formId].get(ctrlName).setValue(environment.serverUri+'/file-upload-svc/files/public/'+next, { emitEvent: false })
      this.changeDecRef.detectChanges();
    })
  }
  public loadAttributes(attr: ICatalog) {
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
      let selected = this.attrList.find(e => e.id === attrFormValue[idKey]);
      if (selected) {
        let append = idKey.replace('attributeId', '');
        let attrValue: string;
        if (selected.method === 'SELECT') {
          attrValue = this.fis.formGroupCollection[formId].get('attributeValueSelect' + append).value;
        } else {
          attrValue = this.fis.formGroupCollection[formId].get('attributeValueManual' + append).value;
        }
        return selected.id + ':' + attrValue
      }
    });
  }
  private getAddedAttrsForCtrl(ctrlName: string): string {
    let selected = this.attrList.find(e => e.id === this.fis.formGroupCollection[this.imageAttrSaleFormId].get(ctrlName).value);
    let append = ctrlName.replace('attributeId', '');
    let attrValue: string;
    if (selected.method === 'SELECT') {
      attrValue = this.fis.formGroupCollection[this.imageAttrSaleFormId].get('attributeValueSelect' + append).value;
    } else {
      attrValue = this.fis.formGroupCollection[this.imageAttrSaleFormId].get('attributeValueManual' + append).value;
    }
    return selected.id + ':' + attrValue
  }
  private hasAttrsForCtrl(): boolean {
    let attrFormValue = this.fis.formGroupCollection[this.imageAttrSaleFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).filter(idKey => attrFormValue[idKey]).length > 0;
  }
  private updateValueForForm(attrs: string[], formId: string) {
    this.fis.restoreDynamicForm(formId, parseAttributePayload(attrs, this.attrList), attrs.length);
    this.fis.$refresh.next();
    this.changeDecRef.markForCheck();
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  private subChangeForForm(formId: string) {
    if (!this.subs[formId + '_valueChange']) {
      let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
        Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
          let selected = this.attrList.find(e => e.id === next[idKey]);
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
  createProduct() {
    this.productSvc.create(this.convertToPayload(), this.changeId)
  }
  updateProduct() {
    this.productSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(), this.changeId)
  }
  previewFlag: boolean = false;
  doPreview() {
    this.previewFlag = !this.previewFlag;
  }
  parseProductForm() {
    let beforeParse = this.convertToPayload();
    let var1: IProductSkuPublic[] = [];
    let skuIds = new Set<string>();
    let lowestPrice = 0;
    beforeParse.skus.forEach(e => {
      e.attributesSales.forEach(ee => {
        skuIds.add(ee.split(":")[0])
      });
      var1.push(<IProductSkuPublic>{
        attributesSales: e.attributesSales,
        storage: e.storageOrder,
        price: e.price
      });
      if (lowestPrice === 0)
        lowestPrice = e.price
      if (lowestPrice > e.price)
        lowestPrice = e.price
    })
    let parsedIdMap = {};
    skuIds.forEach(id => {
      parsedIdMap[id] = this.attrList.find(e => e.id.toString() === id).name
    })
    let afterParse = <IProductDetailPublic>{
      name: beforeParse.name,
      imageUrlSmall: beforeParse.imageUrlSmall,
      imageUrlLarge: beforeParse.imageUrlLarge,
      description: beforeParse.description,
      attributeSaleImages: beforeParse.attributeSaleImages,
      selectedOptions: beforeParse.selectedOptions,
      skus: var1,
      attrIdMap: parsedIdMap,
      lowestPrice: lowestPrice
    }
    return afterParse;
  }

}
