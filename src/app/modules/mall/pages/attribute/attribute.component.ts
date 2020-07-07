import { Component, OnInit, InjectionToken, Inject } from '@angular/core';
import { IAttribute, AttributeService } from 'src/app/services/attribute.service';
import { Observable, Subscription } from 'rxjs';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { FORM_CONFIG, FORM_CONFIG_ATTR_VALUE } from 'src/app/form-configs/attribute.config';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, ICatalogCustomer } from 'src/app/services/category.service';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  attribute: IAttribute;
  formId = 'attributes';
  manualEnter = false;
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formIdAttrValue = 'attributesValue';
  formInfoAttrValue: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  formInfoAttrValueI18n: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  validator: ValidateHelper;
  constructor(
    public attributeSvc: AttributeService,
    private fis: FormInfoService,
    public translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<AttributeComponent>
  ) {
    this.attribute = data as IAttribute;
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
  }
  dismiss(event: MouseEvent){
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngAfterViewInit(): void {
    this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    if (this.attribute) {
      this.fis.formGroupCollection[this.formId].get('id').setValue(this.attribute.id);
      this.fis.formGroupCollection[this.formId].get('name').setValue(this.attribute.name);
      this.fis.formGroupCollection[this.formId].get('method').setValue(this.attribute.method);
      this.fis.formGroupCollection[this.formId].get('type').setValue(this.attribute.type);
      this.fis.formGroupCollection[this.formId].get('description').setValue(this.attribute.description);
      setTimeout(() => {
        if (this.attribute.selectValues && this.attribute.selectValues.length !== 0) {
          this.attribute.selectValues.forEach((e, index) => {
            if (index === 0) {
              this.fis.formGroupCollection[this.formIdAttrValue].get('attrValue').setValue(e);
            } else {
              this.fis.formGroupCollection[this.formIdAttrValue].addControl('attrValue_' + this.fis.formGroupCollection_index[this.formIdAttrValue], new FormControl(e));
              this.fis.add(this.formIdAttrValue);
            }
            this.fis.refreshLayout(this.formInfoAttrValue, this.formIdAttrValue);
          })
        }
      }, 0)
    }
    this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
      this.manualEnter = next === 'SELECT';
      if (this.manualEnter) {
        this.formInfoAttrValue = JSON.parse(JSON.stringify(this.formInfoAttrValueI18n));
      }
    })
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
    this.formInfoAttrValue.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.formInfoAttrValueI18n = JSON.parse(JSON.stringify(this.formInfoAttrValue));
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
      this.formInfoAttrValue.inputs.filter(e => e.label).forEach(e => {
        this.translate.get(e.label).subscribe((res: string) => {
          this.transKeyMap.set(e.key, e.label);
          e.label = res;
        });
      })
    });
  }
  convertToPayload(): IAttribute {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let values = null;
    if (formGroup.get('method').value === 'SELECT') {
      let valueSnapshot = this.fis.formGroupCollection[this.formIdAttrValue].value;
      values = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string);
    }
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      method: formGroup.get('method').value,
      selectValues: values,
      type: formGroup.get('type').value,
    }
  }
}
