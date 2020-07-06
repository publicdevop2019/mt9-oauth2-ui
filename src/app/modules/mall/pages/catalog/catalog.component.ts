import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { Observable, Subscription } from 'rxjs';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { FORM_CONFIG } from 'src/app/form-configs/catalog.config';
import { AttributeService, IAttribute } from 'src/app/services/attribute.service';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { hasValue } from 'src/app/clazz/utility';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {
  state: string;
  category: ICatalogCustomer;
  category$: Observable<ICatalogCustomer>;
  formId = 'category';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrFormId = 'attributes';
  attrFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  // save a copy of attrFormInfo so when toggle, no need to translate again
  attrFormInfoI18n: IForm;
  attrList: IAttribute[];
  constructor(
    private route: ActivatedRoute,
    public categorySvc: CategoryService,
    private fis: FormInfoService,
    public translate: TranslateService,
    public attrSvc: AttributeService,
  ) {
  }

  ngAfterViewInit(): void {
    this.fis.formGroupCollection[this.formId].get('catalogType').valueChanges.subscribe(next => {
      if (next === 'FRONTEND') {
        this.categorySvc.getCatalogFrontend().subscribe(next1 => {
          this.formInfo.inputs.find(e => e.key === 'parentId').options = next1.data.map(e => { return <IOption>{ label: e.name, value: e.id.toString() } })
          this.formInfo.inputs.find(e => e.key === 'parentId').display = true;
        })
      } else if (next === 'BACKEND') {
        this.categorySvc.getCatalogBackend().subscribe(next1 => {
          this.formInfo.inputs.find(e => e.key === 'parentId').options = next1.data.map(e => { return <IOption>{ label: e.name, value: e.id.toString() } })
          this.formInfo.inputs.find(e => e.key === 'parentId').display = true;
        })
      } else {

      }
      this.fis.formGroupCollection[this.formId].get('parentId').reset();
    });
    this.route.queryParamMap.subscribe(queryMaps => {
      this.state = queryMaps.get('state');
      if (queryMaps.get('state') === 'update') {
        this.category$.subscribe(byId => {
          this.fis.formGroupCollection[this.formId].get('catalogType').setValue(byId.catalogType);
          this.fis.formGroupCollection[this.formId].get('id').setValue(byId.id);
          this.fis.formGroupCollection[this.formId].get('name').setValue(byId.name);
          if (hasValue(byId.parentId))
            this.fis.formGroupCollection[this.formId].get('parentId').setValue(byId.parentId.toString())
          if (byId.attributesKey) {
            this.attrSvc.getAttributeList().subscribe(next => {
              //update formInfo first then initialize form, so add template can be correct
              this.attrFormInfo.inputs[0].options = next.data.map(e => <IOption>{ label: this.getLabel(e), value: String(e.id) });
              this.attrList = next.data;
              setTimeout(() => {
                byId.attributesKey.forEach((attr, index) => {
                  if (index === 0) {
                    let selected = this.attrList.find(e => e.name === attr.split(':')[0]);
                    this.fis.formGroupCollection[this.attrFormId].get('attributeId').setValue(String(selected.id));
                    if (selected.method === 'SELECT') {
                      this.attrFormInfo.inputs.find(e => e.key === 'attributeValueSelect').display = true;
                      this.attrFormInfo.inputs.find(ee => ee.key === 'attributeValueSelect').options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                      this.fis.formGroupCollection[this.attrFormId].get('attributeValueSelect').setValue(attr.split(':')[1]);
                    } else {
                      this.attrFormInfo.inputs.find(e => e.key === 'attributeValueManual').display = true;
                      this.fis.formGroupCollection[this.attrFormId].get('attributeValueManual').setValue(String(attr.split(':')[1]));
                    }
                  } else {
                    let selected = this.attrList.find(e => e.name === attr.split(':')[0]);
                    this.fis.formGroupCollection[this.attrFormId].addControl('attributeId_' + this.fis.formGroupCollection_index[this.attrFormId], new FormControl(String(selected.id)));
                    if (selected.method === 'SELECT') {
                      this.fis.formGroupCollection[this.attrFormId].addControl('attributeValueSelect_' + this.fis.formGroupCollection_index[this.attrFormId], new FormControl(attr.split(':')[1]));
                      this.fis.formGroupCollection[this.attrFormId].addControl('attributeValueManual_' + this.fis.formGroupCollection_index[this.attrFormId], new FormControl(''));
                    } else {
                      this.fis.formGroupCollection[this.attrFormId].addControl('attributeValueSelect_' + this.fis.formGroupCollection_index[this.attrFormId], new FormControl(''));
                      this.fis.formGroupCollection[this.attrFormId].addControl('attributeValueManual_' + this.fis.formGroupCollection_index[this.attrFormId], new FormControl(attr.split(':')[1]));
                    }
                    this.fis.add(this.attrFormId);
                    //update display after new inputs added
                    let copy = this.fis.formGroupCollection_index[this.attrFormId];
                    copy--;
                    if (selected.method === 'SELECT') {
                      this.attrFormInfo.inputs.find(e => e.key === 'attributeValueSelect_' + copy).display = true;
                      this.attrFormInfo.inputs.find(e => e.key === 'attributeValueSelect_' + copy).options = selected.selectValues.map(e => <IOption>{ label: e, value: e })
                    } else {
                      this.attrFormInfo.inputs.find(e => e.key === 'attributeValueManual_' + copy).display = true;
                    }
                  }
                  this.fis.refreshLayout(this.attrFormInfo, this.attrFormId);
                })
                // @todo add observable to indicate form has been initialized
                this.fis.formGroupCollection[this.attrFormId].valueChanges.subscribe(next => {
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
                  });
                });
              }, 0);
            });
          }
        })
      } else if (queryMaps.get('state') === 'create') {
        this.attrSvc.getAttributeList().subscribe(next => {
          //update formInfo first then initialize form, so add template can be correct
          this.attrFormInfo.inputs[0].options = next.data.map(e => <IOption>{ label: this.getLabel(e), value: String(e.id) });
          this.attrList = next.data;
          setTimeout(() => {
            // @todo add observable to indicate form has been initialized
            this.fis.formGroupCollection[this.attrFormId].valueChanges.subscribe(next => {
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
          }, 0);
        });
      } else {
      }
    });
  }
  getLabel(e: IAttribute): string {
    if (e.description) {
      return e.name + ' ( ' + e.description + ' )'
    }
    return e.name
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  private sub: Subscription;
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
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
    this.attrFormInfo.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.attrFormInfoI18n = JSON.parse(JSON.stringify(this.attrFormInfo));
    this.sub = this.translate.onLangChange.subscribe(() => {
      this.formInfo.inputs.forEach(e => {
        e.label && this.translate.get(this.transKeyMap.get(e.key)).subscribe((res: string) => {
          e.label = res;
        });
        if (e.options) {
          e.options.forEach(el => {
            this.translate.get(this.transKeyMap.get(e.key + el.value)).subscribe((res: string) => {
              el.label = res;
            });
          })
        }
      });
      this.attrFormInfo.inputs.filter(e => e.label).forEach(e => {
        this.translate.get(e.label).subscribe((res: string) => {
          this.transKeyMap.set(e.key, e.label);
          e.label = res;
        });
      })
    });
    // use non-observable hence forkjoin does not work with route observable
    if (this.route.snapshot.queryParamMap.get('type') && this.route.snapshot.queryParamMap.get('type').toLowerCase() === 'frontend') {
      this.category$ = this.categorySvc.getCatalogFrontendById(+this.route.snapshot.paramMap.get('id'))
    } else {
      this.category$ = this.categorySvc.getCatalogBackendById(+this.route.snapshot.paramMap.get('id'))
    }
  }
  convertToCategoryPayload(): ICatalogCustomer {
    let formGroup = this.fis.formGroupCollection[this.formId];

    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      parentId: formGroup.get('parentId').value,
      attributesKey: this.hasAttr() ? this.getAddedAttrs() : null,
      catalogType: formGroup.get('catalogType').value ? formGroup.get('catalogType').value : null,
    }
  }
  private hasAttr(): boolean {
    let attrFormValue = this.fis.formGroupCollection[this.attrFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).filter(idKey => attrFormValue[idKey]).length > 0;
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
