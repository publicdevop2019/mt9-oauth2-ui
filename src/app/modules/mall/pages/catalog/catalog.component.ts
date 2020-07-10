import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { FORM_CONFIG } from 'src/app/form-configs/catalog.config';
import { AttributeService, IAttribute } from 'src/app/services/attribute.service';
import { CategoryService, ICatalogCustomer } from 'src/app/services/catalog.service';
import { hasValue } from 'src/app/clazz/utility';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { filter, take, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
  category: ICatalogCustomer;
  formId = 'category';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  attrFormId = 'attributes';
  attrFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  // save a copy of attrFormInfo so when toggle, no need to translate again
  attrFormInfoI18n: IForm;
  attrList: IAttribute[];
  private formCreatedOb: Observable<string>;
  private attrFormCreatedOb: Observable<string>;
  private subs: Subscription[] = [];
  constructor(
    public categorySvc: CategoryService,
    private fis: FormInfoService,
    public translate: TranslateService,
    public attrSvc: AttributeService,
    private changeDecRef: ChangeDetectorRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<CatalogComponent>
  ) {
    this.category = data as ICatalogCustomer;
    this.formCreatedOb = this.fis.newFormCreated.pipe(filter(e => e === this.formId));
    this.formCreatedOb.subscribe()
    this.attrFormCreatedOb = this.fis.newFormCreated.pipe(filter(e => e === this.attrFormId));

    let sub1 = combineLatest(this.formCreatedOb, this.attrSvc.getAttributeList()).pipe(take(1)).pipe(switchMap(next => {
      this.subForCatalogTypeChange();
      //update formInfo first then initialize form, so add template can be correct
      this.attrFormInfo.inputs[0].options = next[1].data.map(e => <IOption>{ label: this.getLabel(e), value: String(e.id) });
      this.attrList = next[1].data;
      if (this.category) {
        this.fis.formGroupCollection[this.formId].get('catalogType').setValue(this.category.catalogType);
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.category.id);
        this.fis.formGroupCollection[this.formId].get('name').setValue(this.category.name);
        if (hasValue(this.category.parentId))
          this.fis.formGroupCollection[this.formId].get('parentId').setValue(this.category.parentId.toString())
      }
      return this.attrFormCreatedOb
    })).subscribe(() => {
      if (this.category && this.category.attributes) {
          this.category.attributes.forEach((attr, index) => {
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
      }
      this.subForAttrFormChange();
    })
    this.subs.push(sub1)
  }
  private subForCatalogTypeChange() {
    let sub3 = this.fis.formGroupCollection[this.formId].get('catalogType').valueChanges.subscribe(next => {
      this.formInfo.inputs.find(e => e.key === 'parentId').display = true;
      if (next === 'FRONTEND') {
        this.categorySvc.getCatalogFrontend().subscribe(next1 => {
          this.formInfo.inputs.find(e => e.key === 'parentId').options = next1.data.map(e => { return <IOption>{ label: e.name, value: e.id.toString() } })
        })
      } else if (next === 'BACKEND') {
        this.categorySvc.getCatalogBackend().subscribe(next1 => {
          this.formInfo.inputs.find(e => e.key === 'parentId').options = next1.data.map(e => { return <IOption>{ label: e.name, value: e.id.toString() } })
        })
      } else {

      }
      this.fis.formGroupCollection[this.formId].get('parentId').reset();
    });
    this.subs.push(sub3)
  }
  private subForAttrFormChange() {
    let sub2 = this.fis.formGroupCollection[this.attrFormId].valueChanges.subscribe(next => {
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
    this.subs.push(sub2)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  private getLabel(e: IAttribute): string {
    if (e.description) {
      return e.name + ' ( ' + e.description + ' )'
    }
    return e.name
  }
  ngOnDestroy(): void {
    this.subs.forEach(e => e && e.unsubscribe());
    this.fis.resetAll();
  }
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
    let sub4 = this.translate.onLangChange.subscribe(() => {
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
    this.subs.push(sub4)
  }
  convertToCategoryPayload(): ICatalogCustomer {
    let formGroup = this.fis.formGroupCollection[this.formId];
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      parentId: formGroup.get('parentId').value,
      attributes: this.hasAttr() ? this.getAddedAttrs() : null,
      catalogType: formGroup.get('catalogType').value ? formGroup.get('catalogType').value : null,
    }
  }
  private hasAttr(): boolean {
    let attrFormValue = this.fis.formGroupCollection[this.attrFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).filter(idKey => attrFormValue[idKey]).length > 0;
  }
  private getAddedAttrs(): string[] {
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
