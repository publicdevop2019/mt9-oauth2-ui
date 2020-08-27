import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { FORM_CONFIG, FORM_CONFIG_ATTR_VALUE } from 'src/app/form-configs/attribute.config';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import * as UUID from 'uuid/v1';
import { IBottomSheet } from 'src/app/clazz/summary.component';
@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit, OnDestroy {
  attribute: IBizAttribute;
  formId = 'attributes';
  manualSelect = false;
  changeId: string = UUID();
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formIdAttrValue = 'attributesValue';
  formInfoAttrValue: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  validator: ValidateHelper;
  productBottomSheet: IBottomSheet<IBizAttribute>;
  private formCreatedOb: Observable<string>;
  private attrFormCreatedOb: Observable<string>;
  private subs: Subscription = new Subscription()
  constructor(
    public attributeSvc: AttributeService,
    private fis: FormInfoService,
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
    this.attribute = (data as IBottomSheet<IBizAttribute>).from;
    combineLatest(this.formCreatedOb).pipe(take(1)).subscribe(() => {
      this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
        this.manualSelect = next === 'SELECT';
      });
      if (this.attribute) {
        this.fis.restore(this.formId, this.attribute);
        combineLatest(this.attrFormCreatedOb).pipe(take(1)).subscribe(() => {
          if (this.attribute.selectValues && this.attribute.selectValues.length !== 0) {
            this.fis.restoreDynamicForm(this.formIdAttrValue, this.fis.parsePayloadArr(this.attribute.selectValues,'attrValue'), this.attribute.selectValues.length)
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
  ngOnInit() {
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
  createAttr() {
    this.attributeSvc.create(this.convertToPayload(), this.changeId)
  }
  updateAttr() {
    this.attributeSvc.update(this.fis.formGroupCollection[this.formId].get('id').value,this.convertToPayload(), this.changeId)
  }
}
