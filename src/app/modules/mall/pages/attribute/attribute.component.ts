import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG, FORM_CONFIG_ATTR_VALUE } from 'src/app/form-configs/attribute.config';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit, OnDestroy {
  attribute: IBizAttribute;
  formId = 'attributes';
  manualEnter = false;
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formIdAttrValue = 'attributesValue';
  formInfoAttrValue: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  formInfoAttrValueI18n: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  validator: ValidateHelper;
  private formCreatedOb: Observable<string>;
  private attrFormCreatedOb: Observable<string>;
  private subs: Subscription=new Subscription()
  constructor(
    public attributeSvc: AttributeService,
    private fis: FormInfoService,
    public translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<AttributeComponent>
  ) {
    let sub = this.attributeSvc.closeSheet.subscribe(() => {
      this._bottomSheetRef.dismiss()
    })
    this.subs.add(sub)
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.attrFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdAttrValue));
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
    this.attribute = data as IBizAttribute;
    combineLatest(this.formCreatedOb).pipe(take(1)).subscribe(() => {
      this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
        this.manualEnter = next === 'SELECT';
        if (this.manualEnter) {
          this.formInfoAttrValue = JSON.parse(JSON.stringify(this.formInfoAttrValueI18n));
        }
      });
      if (this.attribute) {
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.attribute.id);
        this.fis.formGroupCollection[this.formId].get('name').setValue(this.attribute.name);
        this.fis.formGroupCollection[this.formId].get('method').setValue(this.attribute.method);
        this.fis.formGroupCollection[this.formId].get('type').setValue(this.attribute.type);
        this.fis.formGroupCollection[this.formId].get('description').setValue(this.attribute.description);
        combineLatest(this.attrFormCreatedOb).pipe(take(1)).subscribe(() => {
          if (this.attribute.selectValues && this.attribute.selectValues.length !== 0) {
            this.attribute.selectValues.forEach((e, index) => {
              if (index === 0) {
                this.fis.formGroupCollection[this.formIdAttrValue].get('attrValue').setValue(e);
              } else {
                this.fis.add(this.formIdAttrValue);
                this.fis.formGroupCollection[this.formIdAttrValue].get('attrValue_' + (index - 1)).setValue(e);
              }
            })
          }
        })
      }
      this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    })
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
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
    this.formInfoAttrValue.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.formInfoAttrValueI18n = JSON.parse(JSON.stringify(this.formInfoAttrValue));
    let sub = this.translate.onLangChange.subscribe(() => {
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
    this.subs.add(sub)
  }
  convertToPayload(): IBizAttribute {
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
