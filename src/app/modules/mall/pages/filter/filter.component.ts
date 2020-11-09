import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { getLabel, getLayeredLabel } from 'src/app/clazz/utility';
import { ValidatorHelper } from 'src/app/clazz/validateHelper';
import { IBizAttribute } from 'src/app/clazz/validation/aggregate/attribute/interfaze-attribute';
import { ICatalog } from 'src/app/clazz/validation/aggregate/catalog/interfaze-catalog';
import { IBizFilter, IFilterItem } from 'src/app/clazz/validation/aggregate/filter/interfaze-filter';
import { FilterValidator } from 'src/app/clazz/validation/aggregate/filter/validator-filter';
import { ErrorMessage, hasValue } from 'src/app/clazz/validation/validator-common';
import { FORM_CATALOG_CONFIG, FORM_CONFIG, FORM_FILTER_ITEM_CONFIG } from 'src/app/form-configs/filter.config';
import { AttributeService } from 'src/app/services/attribute.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { FilterService } from 'src/app/services/filter.service';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  filter: IBizFilter;
  formId = 'filters';
  formIdCatalog = 'filtersCatalog';
  formIdFilter = 'filtersFilter';
  childFormId = 'filterForm';
  manualEnter = false;
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formInfoCatalog: IForm = JSON.parse(JSON.stringify(FORM_CATALOG_CONFIG));
  formInfoFilter: IForm = JSON.parse(JSON.stringify(FORM_FILTER_ITEM_CONFIG));
  private formCreatedOb: Observable<string>;
  private catalogFormCreatedOb: Observable<string>;
  private filterFormCreatedOb: Observable<string>;
  private childFormOb: Observable<string>;
  private subscriptions: Subscription = new Subscription()
  private subs: { [key: string]: Subscription } = {};
  attrList: IBizAttribute[];
  catalogList: ICatalog[];
  private validator = new FilterValidator()
  private validateHelper = new ValidatorHelper()
  changeId: string = UUID();
  productBottomSheet: IBottomSheet<IBizFilter>;
  catalogIndex: number = 0;
  catalogChunkSize: number = 100;
  constructor(
    public filterSvc: FilterService,
    private fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<FilterComponent>,
    private categorySvc: CatalogService,
    private cdr: ChangeDetectorRef,
    public attrSvc: AttributeService,
  ) {
    let sub = this.filterSvc.closeSheet.subscribe(() => {
      this._bottomSheetRef.dismiss()
    })
    this.subscriptions.add(sub)
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.catalogFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdCatalog));
    this.filterFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdFilter));
    this.childFormOb = this.fis.$ready.pipe(filter(e => e === this.childFormId));
    this.filter = (data as IBottomSheet<IBizFilter>).from;
    this.fis.$loadNextPage.subscribe(e => {
      if (e.formId === this.formIdCatalog && e.ctrlKey.includes('catalogId')) {
        this.catalogIndex++;
        this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND').subscribe(next => {
          if (next.data.length === 0) {
            this.fis.completeLoading = [...this.fis.completeLoading, e];
          } else {
            this.catalogList = [...this.catalogList, ...next.data];
            this.formInfoCatalog.inputs.filter(el => el.key.includes(e.ctrlKey.replace(new RegExp("_.*$"), ''))).forEach(a => {
              a.options = [...this.catalogList.map(ee => <IOption>{ label: getLayeredLabel(ee, this.catalogList), value: String(ee.id) })];
            })
            this.fis.formGroupCollection_template[this.formIdCatalog].inputs[0].options = [...this.catalogList.map(ee => <IOption>{ label: getLayeredLabel(ee, this.catalogList), value: String(ee.id) })];
            this.fis.$refresh.next();
            this.fis.$loadNextPageComplete.next(e);
          }
        })
      }
    })
    combineLatest(this.attrSvc.readByQuery(0, 1000), this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND'), this.formCreatedOb, this.catalogFormCreatedOb, this.filterFormCreatedOb, this.childFormOb).pipe(take(1)).subscribe((next) => {
      this.attrList = next[0].data;
      this.catalogList = next[1].data;
      this.formInfoFilter.inputs[0].options = next[0].data.map(e => <IOption>{ label: getLabel(e), value: e.id });
      this.formInfoCatalog.inputs[0].options = next[1].data.map(e => <IOption>{ label: getLayeredLabel(e, next[1].data), value: String(e.id) });
      this.fis.formGroupCollection_template[this.formIdFilter] = JSON.parse(JSON.stringify(this.formInfoFilter))
      this.fis.formGroupCollection_template[this.formIdCatalog] = JSON.parse(JSON.stringify(this.formInfoCatalog))
      this.cdr.detectChanges()
      if (this.filter) {
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.filter.id);
        this.fis.formGroupCollection[this.formId].get('description').setValue(this.filter.description);
        if (this.filter.catalogs && this.filter.catalogs.length !== 0) {
          this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND,id:' + this.filter.catalogs.join('.')).subscribe(next => {
            this.catalogList = [...next.data, ...this.catalogList];
            this.fis.restoreDynamicForm(this.formIdCatalog, this.fis.parsePayloadArr(this.filter.catalogs, 'catalogId'), this.filter.catalogs.length);
            this.formInfoCatalog.inputs.forEach(a => {
              a.options = [...this.catalogList.map(ee => <IOption>{ label: getLayeredLabel(ee, this.catalogList), value: String(ee.id) })];
            })
          })

        }
        if (this.filter.filters && this.filter.filters.length !== 0) {
          this.fis.restoreDynamicForm(this.formIdFilter, this.fis.parsePayloadArr(this.filter.filters.map(e => e.id), 'attributeId'), this.filter.filters.length);

          this.filter.filters.forEach((e, index) => {
            if (index === 0) {
              //for child form
              this.updateChildFormFilter(e, this.childFormId);
              //for child form
              this.subForCtrlChange('attributeId')
            } else {
              let childFormId = this.childFormId + '_' + (index - 1);
              let childFormCreated = this.fis.$ready.pipe(filter(e => e === childFormId));
              let sub = childFormCreated.subscribe(() => {
                this.updateChildFormFilter(e, childFormId);
                this.subForCtrlChange('attributeId_' + (index - 1))
              })
              this.subs[childFormId + '_formCreate'] = sub;
              this.subscriptions.add(sub)

            }
          });
        }

      } else {
        this.subForCtrlChange('attributeId')
      }
      this.subChangeForForm(this.formIdFilter);

    })
  }
  private updateChildFormFilter(option: IFilterItem, childFormId: string) {
    this.fis.formGroupCollection_index[childFormId] = 0;
    this.fis.formGroupCollection_formInfo[childFormId].inputs = this.fis.formGroupCollection_formInfo[childFormId].inputs.filter(e => !e.key.includes('value_'))
    this.fis.formGroupCollection[childFormId].get('value').reset();
    this.fis.restoreDynamicForm(childFormId, this.fis.parsePayloadArr(option.values, 'value'), option.values.length);
    if (this.filter)
      this.validateHelper.validate(this.validator, this.convertToPayload, 'UPDATE', this.fis, this, this.errorMapper)
    else
      this.validateHelper.validate(this.validator, this.convertToPayload, 'CREATE', this.fis, this, this.errorMapper)
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.fis.resetAll();
  }
  ngOnInit() {
  }
  public updateSelectCatalogs(catalog: ICatalog) {
    if (this.fis.formGroupCollection_index[this.formIdCatalog] === 0) {
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogId').setValue(catalog.id);
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogName').setValue(catalog.name);
    } else {
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogId_' + (this.fis.formGroupCollection_index[this.formIdCatalog] - 1)).setValue(catalog.id);
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogName_' + (this.fis.formGroupCollection_index[this.formIdCatalog] - 1)).setValue(catalog.name);
    }
    this.fis.add(this.formIdCatalog)
  }
  convertToPayload(cmpt: FilterComponent): IBizFilter {
    let formGroup = cmpt.fis.formGroupCollection[cmpt.formId];
    let varValue = cmpt.fis.formGroupCollection[cmpt.formIdCatalog].value;
    let catalogs = Object.keys(varValue).map(e => varValue[e] as string).filter(e => e);
    let filters: IFilterItem[] = [];
    Object.keys(cmpt.fis.formGroupCollection[cmpt.formIdFilter].controls).filter(e => e.indexOf('attributeId') > -1).forEach((ctrlName) => {
      let var1 = <IFilterItem>{};
      var1.id = +cmpt.fis.formGroupCollection[cmpt.formIdFilter].get(ctrlName).value;
      if (var1.id > 0) {
        var1.name = cmpt.attrList.find(e => e.id === var1.id).name
      } else {
        var1.name = ''
      }
      var1.values = [];
      let fg = cmpt.fis.formGroupCollection[cmpt.childFormId + ctrlName.replace('attributeId', '')];
      if (fg) {
        var1.values = Object.keys(fg.controls).filter(e => e.indexOf('value') > -1).map(e => fg.get(e).value);
      } else {
        var1.values = [];
      }
      filters.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      catalogs: catalogs,
      filters: filters,
      description: hasValue(formGroup.get('description').value) ? formGroup.get('description').value : null
    }
  }
  private subChangeForForm(formId: string) {
    if (!this.subs[formId + '_valueChange']) {
      let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
        Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
          if (!this.subs[idKey + '_valueChange_ctrl']) {
            this.subForCtrlChange(idKey)
          }
        });
      });
      this.subs[formId + '_valueChange'] = sub;
      this.subscriptions.add(sub)
    }
  }
  subForCtrlChange(idKey: string) {
    let sub = this.fis.formGroupCollection[this.formIdFilter].get(idKey).valueChanges.subscribe(next => {
      let selected = this.attrList.find(e => e.id === next);
      if (selected) {
        let append = idKey.replace('attributeId', '');
        let var1 = <IFilterItem>{
          id: selected.id,
          name: selected.name,
          values: selected.selectValues
        }
        this.updateChildFormFilter(var1, this.childFormId + append);
      }
    })
    this.subs[idKey + '_valueChange_ctrl'] = sub;
    this.subscriptions.add(sub)

  }
  createFilter() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'CREATE', this.fis, this, this.errorMapper))
      this.filterSvc.create(this.convertToPayload(this), this.changeId)
  }
  updateFilter() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'UPDATE', this.fis, this, this.errorMapper))
      this.filterSvc.update(this.fis.formGroupCollection[this.formId].get('id').value, this.convertToPayload(this), this.changeId)
  }
  errorMapper(original: ErrorMessage[], cmpt: FilterComponent) {
    return original.map(e => {
      if (e.key === 'catalogs') {
        return {
          ...e,
          key: 'catalogId',
          formId: cmpt.formIdCatalog
        }
      } else if (e.key.includes('_filterItemName')) {
        let idx = +e.key.split('_')[0];
        return {
          ...e,
          key: cmpt.fis.formGroupCollection_formInfo[cmpt.formIdFilter].inputs.filter(e => e.key.includes('attributeId')).find((e, index) => index === idx).key,
          formId: cmpt.formIdFilter
        }
      } else if (e.key.includes('_filterItemValueList')) {
        let idx = +e.key.split('_')[0];
        let idx2 = +e.key.split('_')[1];
        let formId = idx === 0 ? cmpt.childFormId : (cmpt.childFormId + '_' + (idx - 1))
        return {
          ...e,
          key: cmpt.fis.formGroupCollection_formInfo[formId].inputs.filter(e => e.key.includes('value')).find((e, index) => index === idx2).key,
          formId: formId
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
