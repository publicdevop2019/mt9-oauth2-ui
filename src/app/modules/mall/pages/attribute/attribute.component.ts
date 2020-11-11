import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IAddDynamicFormEvent, IForm } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AbstractAggregate } from 'src/app/clazz/abstract-aggregate';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { IBizAttribute } from 'src/app/clazz/validation/aggregate/attribute/interfaze-attribute';
import { AttributeValidator } from 'src/app/clazz/validation/aggregate/attribute/validator-attribute';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { FORM_CONFIG, FORM_CONFIG_ATTR_VALUE } from 'src/app/form-configs/attribute.config';
import { AttributeService } from 'src/app/services/attribute.service';
interface ISetValueEvent {
  type: 'setvalue'
  id: number,
  formId: string,
  key: string,
  value: string
}
@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent extends AbstractAggregate<AttributeComponent, IBizAttribute> implements OnInit, OnDestroy {
  manualSelect = false;
  formIdAttrValue = 'attributesValue';
  formInfoAttrValue: IForm = JSON.parse(JSON.stringify(FORM_CONFIG_ATTR_VALUE));
  private formCreatedOb: Observable<string>;
  private attrFormCreatedOb: Observable<string>;
  private eventStore: any[] = []
  private delayedEventStore: any[] = []
  private eventId: number = 0;
  private getEventId() {
    let var0 = this.eventId
    this.eventId++;
    return var0;
  }
  constructor(
    public attributeSvc: AttributeService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<AttributeComponent>
  ) {
    super('attributes', JSON.parse(JSON.stringify(FORM_CONFIG)), new AttributeValidator(), bottomSheetRef, data);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.attrFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdAttrValue));
    combineLatest([this.formCreatedOb]).pipe(take(1)).subscribe(() => {
      this.fis.formGroupCollection[this.formId].get('method').valueChanges.subscribe(next => {
        this.manualSelect = next === 'SELECT';
      });
      //dispatch stored events
      if (sessionStorage.getItem('eventStore')) {
        let events: any[] = JSON.parse(sessionStorage.getItem('eventStore'))
        this.eventStore = events;
        events.forEach(e => {
          console.dir('dispatch stored event')
          if (e.type === 'setvalue') {
            let e2 = e as ISetValueEvent;
            if (this.fis.formGroupCollection[e2.formId]) {
              this.fis.formGroupCollection[e2.formId].get(e2.key).setValue(e2.value)
            } else {
              this.delayedEventStore.push(e2);
            }
          } else if (e.type === 'addForm') {
            let e2 = e as IAddDynamicFormEvent;
            if (this.fis.formGroupCollection_formInfo[e2.formId]) {
              this.fis.add(e2.formId);
            } else {
              this.delayedEventStore.push(e2);
            }
          }
        })
      }
      let sub=this.fis.$eventPub.subscribe(_ => {
        console.dir(_)
        this.eventStore.push(_)
      })
      this.subs['eventPub']=sub;
      combineLatest([this.attrFormCreatedOb]).pipe(take(1)).subscribe(() => {
        this.delayedEventStore.forEach(e => {
          console.dir('dispatch stored delay event')
          if (e.type === 'setvalue') {
            let e2 = e as ISetValueEvent;
            if (this.fis.formGroupCollection[e2.formId]) {
              this.fis.formGroupCollection[e2.formId].get(e2.key).setValue(e2.value)
            } else {
              this.delayedEventStore.push(e2);
            }
          } else if (e.type === 'addForm') {
            let e2 = e as IAddDynamicFormEvent;
            this.fis.add(e2.formId);
          }
        })
      })
      if (this.aggregate) {
        this.fis.restore(this.formId, this.aggregate);
        combineLatest([this.attrFormCreatedOb]).pipe(take(1)).subscribe(() => {
          if (this.aggregate.selectValues && this.aggregate.selectValues.length !== 0) {
            this.fis.restoreDynamicForm(this.formIdAttrValue, this.fis.parsePayloadArr(this.aggregate.selectValues, 'attrValue'), this.aggregate.selectValues.length)
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    Object.keys(this.subs).forEach(k => { this.subs[k].unsubscribe() })
    this.fis.resetAll();
    sessionStorage.setItem('eventStore', JSON.stringify(this.eventStore))
    sessionStorage.setItem('eventId', this.eventId + '')
  }
  ngOnInit() {
  }
  convertToPayload(cmpt: AttributeComponent) {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    let values = null;
    if (formGroup.get('method').value === 'SELECT' && cmpt.fis.formGroupCollection[cmpt.formIdAttrValue]) {
      let valueSnapshot = cmpt.fis.formGroupCollection[cmpt.formIdAttrValue].value;
      values = Object.keys(valueSnapshot).map(e => valueSnapshot[e] as string);
    }
    return <IBizAttribute>{
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      description: formGroup.get('description').value ? formGroup.get('description').value : null,
      method: formGroup.get('method').value,
      selectValues: values,
      type: formGroup.get('type').value,
    }
  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'adminCreateAttributeCommandValidator', this.fis, this, this.errorMapper))
      this.attributeSvc.create(this.convertToPayload(this), this.changeId)
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'adminUpdateAttributeCommandValidator', this.fis, this, this.errorMapper))
      this.attributeSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(this), this.changeId)
  }

  errorMapper(original: ErrorMessage[], cmpt: AttributeComponent) {
    return original.map(e => {
      if (e.key === 'attributes') {
        return {
          ...e,
          key: 'attributeId',
          formId: cmpt.formId
        }
      } else if (e.key.includes("_valueOption")) {
        let idx = +e.key.split('_')[0];
        return {
          ...e,
          key: cmpt.fis.formGroupCollection_formInfo[cmpt.formIdAttrValue].inputs.find((e, index) => index === idx).key,
          formId: cmpt.formIdAttrValue
        }
      } else {
        return {
          ...e,
          formId: cmpt.formId
        }
      }
    })
  }
}
