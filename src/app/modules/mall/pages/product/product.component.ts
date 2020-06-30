import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Form } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { FORM_CONFIG, FORM_CONFIG_IMAGE, FORM_CONFIG_OPTIONS } from 'src/app/form-configs/product.config';
import { AttributeService, IAttribute } from 'src/app/services/attribute.service';
import { CategoryService, ICatalogCustomer, ICatalogCustomerHttp } from 'src/app/services/category.service';
import { HttpProxyService } from 'src/app/services/http-proxy.service';
import { IProductDetail, IProductOption, IProductOptions, ProductService, ISku } from 'src/app/services/product.service';
import { ATTR_SALES_FORM_CONFIG } from 'src/app/form-configs/attribute-sales-dynamic.config';
import { ATTR_GEN_FORM_CONFIG } from 'src/app/form-configs/attribute-general-dynamic.config';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  product$: Observable<IProductDetail>;
  salesFormIdTemp = 'attrSalesFormChild';
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrProdFormId = 'attributes';
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
  private subs: Subscription[] = [];
  public attrList: IAttribute[];
  private childFormSub: { [key: string]: Subscription } = {};
  public catalogs: ICatalogCustomerHttp;
  constructor(
    private route: ActivatedRoute,
    public productSvc: ProductService,
    private httpProxy: HttpProxyService,
    private fis: FormInfoService,
    public translate: TranslateService,
    private categorySvc: CategoryService,
    public attrSvc: AttributeService,
  ) {
    this.validator = new ValidateHelper(this.formId, this.formInfo, this.fis);
    this.imageFormvalidator = new ValidateHelper(this.imageFormId, this.imageFormInfo, this.fis);
    this.optionFormvalidator = new ValidateHelper(this.optionFormId, this.optionFormInfo, this.fis);
  }
  ngAfterViewInit(): void {
    this.subs.push(
      this.route.queryParamMap.subscribe(queryMaps => {
        this.state = queryMaps.get('state');
        if (queryMaps.get('state') === 'update') {
          this.subs.push(this.product$.subscribe(byId => {
            this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id)
            this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(byId.attributesKey)
            this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name)
            this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(byId.imageUrlSmall)
            this.fis.formGroupCollection[this.formId].get('description').setValue(byId.description)
            this.fis.formGroupCollection[this.formId].get('status').setValue(byId.status)
            if (byId.attributesProd) {
              setTimeout(() => {
                this.updateChildForm(byId.attributesProd, this.attrProdFormId, this.attrProdFormInfo);
              }, 0)
            }
            if (byId.attributesGen) {
              setTimeout(() => {
                this.updateChildForm(byId.attributesGen, this.attrGeneralFormId, this.attrGeneralFormInfo);
              }, 0)
            }
            if (byId.skus && byId.skus.length > 0) {
              this.updateSalesForm(byId.skus);
            }
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
    this.fetchAttrList();
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    this.imageFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.imageFormId]);
    this.optionFormvalidator.updateErrorMsg(this.fis.formGroupCollection[this.optionFormId]);
    this.subs.push(this.fis.formGroupCollection[this.formId].get('imageUrlSmallFile').valueChanges.subscribe((next) => { this.uploadFile(next) }));
  }
  updateSalesForm(skus: ISku[]) {
    setTimeout(() => {
      skus.forEach((sku, index) => {
        if (index === 0) {
          this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder').setValue(sku.storageOrder);
          this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual').setValue(sku.storageActual);
          this.fis.formGroupCollection[this.attrSalesFormId].get('price').setValue(sku.price);
          this.fis.formGroupCollection[this.attrSalesFormId].get('sales').setValue(sku.sales);
          //for child form
          let formInfo = this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form;
          this.updateChildForm(sku.attributesSales, this.salesFormIdTemp, formInfo);
          //for child form
        } else {
          let indexSnapshot = this.fis.formGroupCollection_index[this.attrSalesFormId];
          this.fis.formGroupCollection[this.attrSalesFormId].addControl('storageOrder_' + indexSnapshot, new FormControl(sku.storageOrder));
          this.fis.formGroupCollection[this.attrSalesFormId].addControl('storageActual_' + indexSnapshot, new FormControl(sku.storageActual));
          this.fis.formGroupCollection[this.attrSalesFormId].addControl('price_' + indexSnapshot, new FormControl(sku.price));
          this.fis.formGroupCollection[this.attrSalesFormId].addControl('sales_' + indexSnapshot, new FormControl(sku.sales));
          //for child form
          let formId = this.salesFormIdTemp + '_' + indexSnapshot;
          this.fis.add(this.attrSalesFormId);
          let formInfo = this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined && e.key === formId).form;
          setTimeout(() => {
            this.updateChildForm(sku.attributesSales, formId, formInfo);
          }, 0)
          //for child form
        }
      });
      this.fis.refreshLayout(this.attrSalesFormInfo, this.attrSalesFormId);
    }, 0)
  }
  fetchAttrList() {
    this.attrSvc.getAttributeList().subscribe(next => {
      //update formInfo first then initialize form, so add template can be correct
      this.attrProdFormInfo.inputs[0].options = next.data.filter(e => e.type === 'PROD_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrGeneralFormInfo.inputs[0].options = next.data.filter(e => e.type === 'GEN_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).form.inputs[0].options = next.data.filter(e => e.type === 'SALES_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrList = next.data;
      if (this.state === 'create') {
        //wait for form initialize complete
        setTimeout(() => {
          //@todo add observable to indicate form has been initialized
          this.fis.formGroupCollection[this.attrProdFormId].valueChanges.subscribe(next => {
            Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
              let selected = this.attrList.find(e => String(e.id) === next[idKey]);
              if (selected) {
                let append = idKey.replace('attributeId', '');
                this.attrProdFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
                this.attrProdFormInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
                if (selected.method === 'SELECT') {
                  this.attrProdFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                }
              }
            })
          });
          this.fis.formGroupCollection[this.attrGeneralFormId].valueChanges.subscribe(next => {
            Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
              let selected = this.attrList.find(e => String(e.id) === next[idKey]);
              if (selected) {
                let append = idKey.replace('attributeId', '');
                this.attrGeneralFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
                this.attrGeneralFormInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
                if (selected.method === 'SELECT') {
                  this.attrGeneralFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                }
              }
            })
          });
          //sub nested form attrSalesFormChild
          let childForm = this.fis.formGroupCollection[this.salesFormIdTemp];
          let childFormInfo = this.fis.formGroupCollection_formInfo[this.salesFormIdTemp];
          let sub = childForm.valueChanges.subscribe(next => {
            Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
              let selected = this.attrList.find(e => String(e.id) === next[idKey]);
              if (selected) {
                let append = idKey.replace('attributeId', '');
                childFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
                childFormInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
                if (selected.method === 'SELECT') {
                  childFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                }
              }
            })
          });
        }, 0);
      }
      setTimeout(() => {
        // when add new child form sub for value chage if no sub
        this.fis.formGroupCollection[this.attrSalesFormId].valueChanges.subscribe(next => {
          setTimeout(() => {
            Object.keys(next).filter(e => e.includes(this.salesFormIdTemp)).forEach(childrenFormId => {
              if (!this.childFormSub[childrenFormId]) {
                let childdrenFormInfo = this.fis.formGroupCollection_formInfo[childrenFormId];
                let childrenForm = this.fis.formGroupCollection[childrenFormId];
                let sub = childrenForm.valueChanges.subscribe(next => {
                  Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
                    let selected = this.attrList.find(e => String(e.id) === next[idKey]);
                    if (selected) {
                      let append = idKey.replace('attributeId', '');
                      childdrenFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
                      childdrenFormInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
                      if (selected.method === 'SELECT') {
                        childdrenFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                      }
                    }
                  })
                });
                this.childFormSub[childrenFormId] = sub;
              }
            })
          }, 0)
        });
      }, 0)

    });
  }
  ngOnDestroy(): void {
    this.subs.forEach(e => e.unsubscribe());
    Object.keys(this.childFormSub).forEach(e => {
      this.childFormSub[e] && this.childFormSub[e].unsubscribe();
    })
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  private updateFormLabel() {
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
    this.updateFormLabel();
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.updateFormLabel();
    })
    this.subs.push(this.sub);
    this.categorySvc.getCatalogBackend()
      .subscribe(next => {
        if (next.data) {
          this.catalogs = next;
        }
      });
    this.product$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.productSvc.getProductDetailById(+params.get('id')))
    );
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
      var1.storageOrder = this.fis.formGroupCollection[this.attrSalesFormId].get('storageOrder' + suffix).value;
      var1.storageActual = this.fis.formGroupCollection[this.attrSalesFormId].get('storageActual' + suffix).value;
      var1.price = this.fis.formGroupCollection[this.attrSalesFormId].get('price' + suffix).value;
      var1.sales = this.fis.formGroupCollection[this.attrSalesFormId].get('sales' + suffix).value;
      var1.attributesSales = this.getAddedAttrs(this.salesFormIdTemp + suffix);
      skusCalc.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      attributesKey: formGroup.get('attributesKey').value,
      attributesProd: this.attrList ? this.getAddedAttrs(this.attrProdFormId) : null,
      attributesGen: this.attrList ? this.getAddedAttrs(this.attrGeneralFormId) : null,
      name: formGroup.get('name').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description: formGroup.get('description').value,
      imageUrlLarge: imagesUrl,
      selectedOptions: selectedOptions.filter(e => e.title !== ''),
      skus: skusCalc,
      status: formGroup.get('status').value,
    }
  }
  private uploadFile(files: FileList) {
    this.httpProxy.netImpl.uploadFile(files.item(0)).subscribe(next => {
      this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(next)
    })
  }
  public loadAttributes(attr: ICatalogCustomer) {
    let tags: string[] = [];
    tags.push(...attr.attributesKey);
    while (attr.parentId !== null && attr.parentId !== undefined) {
      let nextId = attr.parentId;
      attr = this.catalogs.data.find(e => e.id === nextId);
      tags.push(...attr.attributesKey);
    }
    this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(tags);
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
      return selected.name + ':' + attrValue
    });
  }
  private updateChildForm(attrs: string[], formId: string, formInfo: IForm) {
    attrs.forEach((attr, index) => {
      if (index === 0) {
        let selected = this.attrList.find(e => e.name === attr.split(':')[0]);
        this.fis.formGroupCollection[formId].get('attributeId').setValue(String(selected.id));
        if (selected.method === 'SELECT') {
          formInfo.inputs.find(e => e.key === 'attributeValueSelect').display = true;
          formInfo.inputs.find(ee => ee.key === 'attributeValueSelect').options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
          this.fis.formGroupCollection[formId].get('attributeValueSelect').setValue(attr.split(':')[1]);
        } else {
          formInfo.inputs.find(e => e.key === 'attributeValueManual').display = true;
          this.fis.formGroupCollection[formId].get('attributeValueManual').setValue(String(attr.split(':')[1]));
        }
      } else {
        let selected = this.attrList.find(e => e.name === attr.split(':')[0]);
        this.fis.formGroupCollection[formId].addControl('attributeId_' + this.fis.formGroupCollection_index[formId], new FormControl(String(selected.id)));
        if (selected.method === 'SELECT') {
          this.fis.formGroupCollection[formId].addControl('attributeValueSelect_' + this.fis.formGroupCollection_index[formId], new FormControl(attr.split(':')[1]));
          this.fis.formGroupCollection[formId].addControl('attributeValueManual_' + this.fis.formGroupCollection_index[formId], new FormControl(''));
        } else {
          this.fis.formGroupCollection[formId].addControl('attributeValueSelect_' + this.fis.formGroupCollection_index[formId], new FormControl(''));
          this.fis.formGroupCollection[formId].addControl('attributeValueManual_' + this.fis.formGroupCollection_index[formId], new FormControl(attr.split(':')[1]));
        }
        this.fis.add(formId);
        //update display after new inputs added
        let copy = this.fis.formGroupCollection_index[formId];
        copy--;
        if (selected.method === 'SELECT') {
          formInfo.inputs.find(e => e.key === 'attributeValueSelect_' + copy).display = true;
          formInfo.inputs.find(e => e.key === 'attributeValueSelect_' + copy).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
        } else {
          formInfo.inputs.find(e => e.key === 'attributeValueManual_' + copy).display = true;
        }
      }
      this.fis.refreshLayout(formInfo, formId);
    })
    // @todo add observable to indicate form has been initialized
    let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
      Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
        let selected = this.attrList.find(e => String(e.id) === next[idKey]);
        if (selected) {
          let append = idKey.replace('attributeId', '');
          formInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
          formInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
          if (selected.method === 'SELECT') {
            formInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
          }
        }
      });
    });
    this.childFormSub[formId] = sub;
  }
}
