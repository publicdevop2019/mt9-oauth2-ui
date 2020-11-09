import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { AbstractAggregate } from 'src/app/clazz/abstract-aggregate';
import { IBottomSheet, ISumRep } from 'src/app/clazz/summary.component';
import { getLabel, getLayeredLabel, parseAttributePayload } from 'src/app/clazz/utility';
import { IBizAttribute } from 'src/app/clazz/validation/aggregate/attribute/interfaze-attribute';
import { ICatalog } from 'src/app/clazz/validation/aggregate/catalog/interfaze-catalog';
import { CatalogValidator } from 'src/app/clazz/validation/aggregate/catalog/validator-catalog';
import { ErrorMessage } from 'src/app/clazz/validation/validator-common';
import { ATTR_PROD_FORM_CONFIG } from 'src/app/form-configs/attribute-product-dynamic.config';
import { FORM_CONFIG } from 'src/app/form-configs/catalog.config';
import { AttributeService } from 'src/app/services/attribute.service';
import { CatalogService } from 'src/app/services/catalog.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent extends AbstractAggregate<CatalogComponent, ICatalog> implements OnInit, OnDestroy {
  attrFormId = 'attributes';
  attrFormInfo: IForm = JSON.parse(JSON.stringify(ATTR_PROD_FORM_CONFIG));
  attrList: IBizAttribute[];
  private formCreatedOb: Observable<string>;
  private attrFormCreatedOb: Observable<string>;
  constructor(
    public entitySvc: CatalogService,
    private fis: FormInfoService,
    public attrSvc: AttributeService,
    private changeDecRef: ChangeDetectorRef,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<CatalogComponent>
  ) {
    super('category', JSON.parse(JSON.stringify(FORM_CONFIG)), new CatalogValidator(), bottomSheetRef,data);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.attrFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.attrFormId));

    let sub1 = combineLatest([this.formCreatedOb, this.attrSvc.readByQuery(0, 1000)]).pipe(take(1)).pipe(switchMap(next => {
      this.attrFormInfo.inputs[0].options = next[1].data.map(e => <IOption>{ label: getLabel(e), value: e.id });//update formInfo first then initialize form, so add template can be correct
      this.attrList = next[1].data;
      this.changeDecRef.markForCheck();//refresh view for create
      this.subForCatalogTypeChange(true);
      if (this.aggregate) {
        this.fis.restore(this.formId, this.aggregate);
      }
      return this.attrFormCreatedOb
    })).subscribe(() => {
      this.subForAttrFormChange();
      if (this.aggregate && this.aggregate.attributes) {
        this.fis.restoreDynamicForm(this.attrFormId, parseAttributePayload(this.aggregate.attributes, this.attrList), this.aggregate.attributes.length);
      }
      this.fis.$refresh.next();
      this.changeDecRef.markForCheck();
    })
    this.subs['combineLatest'] = sub1;
  }
  private subForCatalogTypeChange(skipReset: boolean) {
    let sub3 = this.fis.formGroupCollection[this.formId].get('catalogType').valueChanges.subscribe(next => {
      this.formInfo.inputs.find(e => e.key === 'parentId').display = true;
      let catalogOb: Observable<ISumRep<ICatalog>>;
      if (next === 'FRONTEND') {
        catalogOb = this.entitySvc.readByQuery(0, 1000, 'type:FRONTEND');
      } else {
        catalogOb = this.entitySvc.readByQuery(0, 1000, 'type:BACKEND')
      }
      catalogOb.subscribe(next1 => {
        this.formInfo.inputs.find(e => e.key === 'parentId').options = next1.data.map(e => { return <IOption>{ label: getLayeredLabel(e, next1.data), value: e.id } })
        this.changeDecRef.markForCheck();
      })
      if (!skipReset) {
        this.fis.formGroupCollection[this.formId].get('parentId').reset();
      }
      this.changeDecRef.markForCheck();
    });
    this.subs['catalogTypeChange'] = sub3;
  }
  private subForAttrFormChange() {
    let sub2 = this.fis.formGroupCollection[this.attrFormId].valueChanges.subscribe(next => {
      Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
        let selected = this.attrList.find(e => e.id === next[idKey]);
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
    this.subs['attrFormChange'] = sub2;
  }
  ngOnDestroy(): void {
    Object.keys(this.subs).forEach(k => { this.subs[k].unsubscribe() })
    this.fis.resetAllExcept(['summaryCatalogCustomerView'])
  }
  ngOnInit() {
  }
  convertToPayload(cmpt: CatalogComponent): ICatalog {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    return {
      id: formGroup.get('id').value,
      name: formGroup.get('name').value,
      parentId: formGroup.get('parentId').value,
      attributes: cmpt.hasAttr() ? cmpt.getAttributeAsPayload() : [],
      catalogType: formGroup.get('catalogType').value ? formGroup.get('catalogType').value : '',
    }
  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'CREATE', this.fis, this, this.errorMapper))
      this.entitySvc.create(this.convertToPayload(this), this.changeId)
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'UPDATE', this.fis, this, this.errorMapper))
      this.entitySvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(this), this.changeId)
  }

  errorMapper(original: ErrorMessage[], cmpt: CatalogComponent) {
    return original.map(e => {
      if (e.key === 'attributes') {
        return {
          ...e,
          key: 'attributeId',
          formId: cmpt.attrFormId
        }
      } else {
        return {
          ...e,
          formId: cmpt.formId
        }
      }
    })
  }
  private hasAttr(): boolean {
    let attrFormValue = this.fis.formGroupCollection[this.attrFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).filter(idKey => attrFormValue[idKey]).length > 0;
  }
  private getAttributeAsPayload(): string[] {
    let attrFormValue = this.fis.formGroupCollection[this.attrFormId].value;
    return Object.keys(attrFormValue).filter(e => e.includes('attributeId')).map(idKey => {
      let selected = this.attrList.find(e => e.id === attrFormValue[idKey]);
      let append = idKey.replace('attributeId', '');
      let attrValue: string;
      if (selected) {
        if (selected.method === 'SELECT') {
          attrValue = this.fis.formGroupCollection[this.attrFormId].get('attributeValueSelect' + append).value;
        } else {
          attrValue = this.fis.formGroupCollection[this.attrFormId].get('attributeValueManual' + append).value;
        }
        return selected.id + ':' + attrValue
      }
    });
  }
}
