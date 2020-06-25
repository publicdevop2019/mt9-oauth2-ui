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
import { IProductDetail, IProductOption, IProductOptions, ProductService } from 'src/app/services/product.service';
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
  formId = 'product';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrFormId = 'attributes';
  attrFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  // save a copy of attrFormInfo so when toggle, no need to translate again
  attrFormInfoI18n: IForm;
  attrSalesFormId = 'attributeSales';
  attrSalesFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_SALES_FORM_CONFIG));
  attrSalesFormInfoI18n: IForm;
  attrGeneralFormId = 'attributeGeneral';
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
  private childFormSub: { formId: string, sub: Subscription };
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
  updateChildForm(attrs: string[], formId: string, formInfo: IForm) {
    setTimeout(() => {
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
      this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
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
    }, 0);
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
            this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(byId.attributesKey)
            this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name)
            this.fis.formGroupCollection[this.formId].get('price').setValue(byId.price)
            this.fis.formGroupCollection[this.formId].get('imageUrlSmall').setValue(byId.imageUrlSmall)
            this.fis.formGroupCollection[this.formId].get('description').setValue(byId.description)
            this.fis.formGroupCollection[this.formId].get('sales').setValue(byId.sales)
            this.fis.formGroupCollection[this.formId].get('rate').setValue(byId.rate)
            if (byId.attributesProd) {
              this.updateChildForm(byId.attributesProd, this.attrFormId, this.attrFormInfo);
            }
            if (byId.attributesGen) {
              this.updateChildForm(byId.attributesGen, this.attrGeneralFormId, this.attrGeneralFormInfo);
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
  fetchAttrList() {
    this.attrSvc.getAttributeList().subscribe(next => {
      //update formInfo first then initialize form, so add template can be correct
      this.attrFormInfo.inputs[0].options = next.data.filter(e => e.type === 'PROD_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrGeneralFormInfo.inputs[0].options = next.data.filter(e => e.type === 'GEN_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrSalesFormInfo.inputs[2].form.inputs[0].options = next.data.filter(e => e.type === 'SALES_ATTR').map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.attrList = next.data;
      if (this.state === 'create') {
        //wait for form initialize complete
        setTimeout(() => {
          //@todo add observable to indicate form has been initialized
          this.fis.formGroupCollection[this.attrFormId].valueChanges.subscribe(next => {
            console.dir(next)
            Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
              let selected = this.attrList.find(e => String(e.id) === next[idKey]);
              if (selected) {
                let append = idKey.replace('attributeId', '');
                this.attrFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).display = selected.method === 'SELECT';
                this.attrFormInfo.inputs.find(ee => ee.key === 'attributeValueManual' + append).display = selected.method !== 'SELECT';
                if (selected.method === 'SELECT') {
                  this.attrFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect' + append).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
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
          let childFormId = this.attrSalesFormInfo.inputs.find(e => e.form !== null && e.form !== undefined).key
          let childForm = this.fis.formGroupCollection[childFormId];
          let childFormInfo = this.fis.formGroupCollection_formInfo[childFormId];
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
          this.childFormSub = { formId: childFormId, sub: sub };
          // when add new child form sub for value chage if no sub
          this.fis.formGroupCollection[this.attrSalesFormId].valueChanges.subscribe(next => {
            setTimeout(() => {
              Object.keys(next).filter(e => e.includes(childFormId)).forEach(childrenFormId => {
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
                  this.childFormSub = { formId: childFormId, sub: sub };
                }
              })
            }, 0)
          });
        }, 0);
      }

    });
  }
  ngOnDestroy(): void {
    this.subs.forEach(e => e.unsubscribe());
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  private updateFormLabel() {
    this.formInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrFormInfoI18n = JSON.parse(JSON.stringify(this.attrFormInfo));
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
  public catalogs: ICatalogCustomerHttp;
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
    Object.keys(this.fis.formGroupCollection[this.optionFormId].controls).filter(e => e.indexOf('productOption') > -1).forEach((opt) => {
      let var1 = <IProductOptions>{};
      var1.title = this.fis.formGroupCollection[this.optionFormId].get(opt).value;
      var1.options = [];
      let fg = this.fis.formGroupCollection['optionForm' + opt.replace('productOption', '')];
      var1.options = Object.keys(fg.controls).filter(e => e.indexOf('optionValue') > -1).map(e => {
        return <IProductOption>{
          optionValue: fg.get(e).value,
          priceVar: fg.get(e.replace('optionValue', 'optionPriceChange')).value,
        }
      });
      selectedOptions.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      attributesKey: formGroup.get('attributesKey').value,
      attributesProd: this.attrList ? this.getAddedAttrs() : null,
      name: formGroup.get('name').value,
      price: formGroup.get('price').value,
      imageUrlSmall: formGroup.get('imageUrlSmall').value,
      description: formGroup.get('description').value,
      sales: formGroup.get('sales').value,
      rate: formGroup.get('rate').value,
      imageUrlLarge: imagesUrl,
      selectedOptions: selectedOptions.filter(e => e.title !== ''),
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
  loadAttributes(attr: ICatalogCustomer) {
    let tags: string[] = [];
    tags.push(...attr.attributesKey);
    while (attr.parentId !== null && attr.parentId !== undefined) {
      let nextId = attr.parentId;
      attr = this.catalogs.data.find(e => e.id === nextId);
      tags.push(...attr.attributesKey);
    }
    this.fis.formGroupCollection[this.formId].get('attributesKey').setValue(tags);
  }
  getAddedAttrs(): string[] {
    let attrFormValue = this.fis.formGroupCollection[this.attrFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).map(idKey => {
      let selected = this.attrList.find(e => String(e.id) === attrFormValue[idKey]);
      let append = idKey.replace('attributeId', '');
      let attrValue: string;
      if (selected.method === 'SELECT') {
        attrValue = this.fis.formGroupCollection[this.attrFormId].get('attributeValueSelect' + append).value;
      } else {
        attrValue = this.fis.formGroupCollection[this.attrFormId].get('attributeValueManual' + append).value;
      }
      return selected.name + ':' + attrValue
    });
  }
}
