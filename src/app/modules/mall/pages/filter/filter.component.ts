import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Aggregate } from 'src/app/clazz/abstract-aggregate';
import { IBottomSheet } from 'src/app/clazz/summary.component';
import { getLabel, getLayeredLabel } from 'src/app/clazz/utility';
import { IBizAttribute } from 'src/app/clazz/validation/aggregate/attribute/interfaze-attribute';
import { ICatalog } from 'src/app/clazz/validation/aggregate/catalog/interfaze-catalog';
import { IBizFilter, IFilterItem } from 'src/app/clazz/validation/aggregate/filter/interfaze-filter';
import { FilterValidator } from 'src/app/clazz/validation/aggregate/filter/validator-filter';
import { ErrorMessage, hasValue } from 'src/app/clazz/validation/validator-common';
import { FORM_CATALOG_CONFIG, FORM_CONFIG, FORM_FILTER_ITEM_CONFIG } from 'src/app/form-configs/filter.config';
import { AttributeService } from 'src/app/services/attribute.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { FilterService } from 'src/app/services/filter.service';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent extends Aggregate<FilterComponent,IBizFilter>  implements OnInit {
  formIdCatalog = 'filtersCatalog';
  formIdFilter = 'filtersFilter';
  childFormId = 'filterForm';
  manualEnter = false;
  formInfoCatalog: IForm = JSON.parse(JSON.stringify(FORM_CATALOG_CONFIG));
  formInfoFilter: IForm = JSON.parse(JSON.stringify(FORM_FILTER_ITEM_CONFIG));
  private formCreatedOb: Observable<string>;
  private catalogFormCreatedOb: Observable<string>;
  private filterFormCreatedOb: Observable<string>;
  private childFormOb: Observable<string>;
  attrList: IBizAttribute[];
  catalogList: ICatalog[];
  catalogIndex: number = 0;
  catalogChunkSize: number = 10;
  constructor(
    public filterSvc: FilterService,
    fis: FormInfoService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    bottomSheetRef: MatBottomSheetRef<FilterComponent>,
    private categorySvc: CatalogService,
    cdr: ChangeDetectorRef,
    public attrSvc: AttributeService,
  ) {
    super('filters',JSON.parse(JSON.stringify(FORM_CONFIG)),new FilterValidator(),bottomSheetRef,data,fis,cdr,true);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.catalogFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdCatalog));
    this.filterFormCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formIdFilter));
    this.childFormOb = this.fis.$ready.pipe(filter(e => e === this.childFormId));
    this.fis.$loadNextPage.subscribe(e => {
      if (e.formId === this.formIdCatalog && e.ctrlKey.includes('catalogId')) {
        this.catalogIndex++;
        this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND',undefined,undefined,{loading:false}).subscribe(next => {
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
    combineLatest([this.attrSvc.readByQuery(0, 1000), this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND'), this.formCreatedOb, this.catalogFormCreatedOb, this.filterFormCreatedOb, this.childFormOb]).pipe(take(1)).subscribe((next) => {
      this.attrList = next[0].data;
      this.catalogList = next[1].data;
      this.formInfoFilter.inputs[0].options = next[0].data.map(e => <IOption>{ label: getLabel(e), value: e.id });
      this.formInfoCatalog.inputs[0].options = next[1].data.map(e => <IOption>{ label: getLayeredLabel(e, next[1].data), value: String(e.id) });
      this.fis.formGroupCollection_template[this.formIdFilter] = JSON.parse(JSON.stringify(this.formInfoFilter))
      this.fis.formGroupCollection_template[this.formIdCatalog] = JSON.parse(JSON.stringify(this.formInfoCatalog))
      this.cdr.detectChanges()
      this.resumeFromEventStore();
      if (this.aggregate && this.eventStore.length === 0) {
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.aggregate.id);
        this.fis.formGroupCollection[this.formId].get('description').setValue(this.aggregate.description);
        if (this.aggregate.catalogs && this.aggregate.catalogs.length !== 0) {
          this.categorySvc.readByQuery(this.catalogIndex, this.catalogChunkSize, 'type:FRONTEND,id:' + this.aggregate.catalogs.join('.')).subscribe(next => {
            this.catalogList = [...next.data, ...this.catalogList];
            this.fis.restoreDynamicForm(this.formIdCatalog, this.fis.parsePayloadArr(this.aggregate.catalogs, 'catalogId'), this.aggregate.catalogs.length);
            this.formInfoCatalog.inputs.forEach(a => {
              a.options = [...this.catalogList.map(ee => <IOption>{ label: getLayeredLabel(ee, this.catalogList), value: String(ee.id) })];
            })
          })

        }
        if (this.aggregate.filters && this.aggregate.filters.length !== 0) {
          this.fis.restoreDynamicForm(this.formIdFilter, this.fis.parsePayloadArr(this.aggregate.filters.map(e => e.id), 'attributeId'), this.aggregate.filters.length);

          this.aggregate.filters.forEach((e, index) => {
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
    if (this.aggregate)
      this.validateHelper.validate(this.validator, this.convertToPayload, 'adminUpdateFilterCommandValidator', this.fis, this, this.errorMapper)
    else
      this.validateHelper.validate(this.validator, this.convertToPayload, 'adminCreateFilterCommandValidator', this.fis, this, this.errorMapper)
  }
  ngOnDestroy(): void {
    this.cleanUp()
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
      description: hasValue(formGroup.get('description').value) ? formGroup.get('description').value : null,
      version:cmpt.aggregate&&cmpt.aggregate.version
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

  }
  create() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'adminCreateFilterCommandValidator', this.fis, this, this.errorMapper))
      this.filterSvc.create(this.convertToPayload(this), this.changeId,this.eventStore)
  }
  update() {
    if (this.validateHelper.validate(this.validator, this.convertToPayload, 'adminUpdateFilterCommandValidator', this.fis, this, this.errorMapper))
      this.filterSvc.update(this.aggregate.id, this.convertToPayload(this), this.changeId,this.eventStore,this.version)
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
