import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { IFilter, FilterService, IFilterSummaryNet, IFilterItem } from 'src/app/services/filter.service';
import { FORM_CONFIG, FORM_CATALOG_CONFIG, FORM_FILTER_ITEM_CONFIG } from 'src/app/form-configs/filter.config';
import { IForm, IAttribute, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { ValidateHelper } from 'src/app/clazz/validateHelper';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { FormInfoService } from 'mt-form-builder';
import { TranslateService } from '@ngx-translate/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { filter, take } from 'rxjs/operators';
import { CategoryService, ICatalogCustomerHttp, ICatalogCustomer } from 'src/app/services/catalog.service';
import { getLabel } from 'src/app/clazz/utility';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  filter: IFilter;
  formId = 'filters';
  formIdCatalog = 'filtersCatalog';
  formIdFilter = 'filtersFilter';
  childFormId = 'filterForm';
  manualEnter = false;
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  formInfoCatalog: IForm = JSON.parse(JSON.stringify(FORM_CATALOG_CONFIG));
  formInfoFilter: IForm = JSON.parse(JSON.stringify(FORM_FILTER_ITEM_CONFIG));
  validator: ValidateHelper;
  formInfoCatalogI18n: IForm;
  formInfoFilterI18n: IForm;
  private formCreatedOb: Observable<string>;
  private catalogFormCreatedOb: Observable<string>;
  private filterFormCreatedOb: Observable<string>;
  private childFormOb: Observable<string>;
  private subscriptions: Subscription = new Subscription()
  private subs: { [key: string]: Subscription } = {};
  attrList: IBizAttribute[];
  catalogList: ICatalogCustomer[];
  constructor(
    public filterSvc: FilterService,
    private fis: FormInfoService,
    public translate: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<FilterComponent>,
    private categorySvc: CategoryService,
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
    this.validator = new ValidateHelper(this.formId, this.formInfo, fis)
    this.filter = data as IFilter;

    combineLatest(this.attrSvc.getAttributeList(), this.categorySvc.getCatalogFrontend(), this.formCreatedOb, this.catalogFormCreatedOb, this.filterFormCreatedOb, this.childFormOb).pipe(take(1)).subscribe((next) => {
      this.attrList = next[0].data;
      this.catalogList = next[1].data;
      this.formInfoFilter.inputs[0].options = next[0].data.map(e => <IOption>{ label: getLabel(e), value: String(e.id) });
      this.formInfoCatalog.inputs[0].options = next[1].data.map(e => <IOption>{ label: e.name, value: String(e.id) });
      this.fis.formGroupCollection_template[this.formIdFilter] = JSON.parse(JSON.stringify(this.formInfoFilter))
      this.fis.formGroupCollection_template[this.formIdCatalog] = JSON.parse(JSON.stringify(this.formInfoCatalog))
      this.cdr.detectChanges()
      if (this.filter) {
        this.fis.formGroupCollection[this.formId].get('id').setValue(this.filter.id);
        if (this.filter.catalogs && this.filter.catalogs.length !== 0) {
          this.filter.catalogs.forEach((url, index) => {
            if (index === 0) {
              this.fis.formGroupCollection[this.formIdCatalog].get('catalogId').setValue(url);
            } else {
              this.fis.add(this.formIdCatalog);
              this.fis.formGroupCollection[this.formIdCatalog].get('catalogId_' + (index - 1)).setValue(url);
            }
          })
        }
        if (this.filter.filters && this.filter.filters.length !== 0) {
          this.filter.filters.forEach((e, index) => {
            if (index === 0) {
              this.fis.formGroupCollection[this.formIdFilter].get('attributeId').setValue(String(e.id));
              //for child form
              this.updateChildFormFilter(e, this.childFormId);
              //for child form
            } else {
              this.fis.add(this.formIdFilter);
              this.fis.formGroupCollection[this.formIdFilter].get('attributeId_' + (index - 1)).setValue(e.id);
              let childFormId = this.childFormId + '_' + (index - 1);
              let childFormCreated = this.fis.$ready.pipe(filter(e => e === childFormId));
              childFormCreated.subscribe(() => {
                this.updateChildFormFilter(e, childFormId);
              })
            }
          });
        }
      } else {
        this.subChangeForForm(this.formIdFilter);
      }

      this.validator.updateErrorMsg(this.fis.formGroupCollection[this.formId]);
    })
  }
  private updateChildFormFilter(option: IFilterItem, childFormId: string) {
    option.values.forEach((opt, index) => {
      if (index == 0) {
        this.fis.formGroupCollection[childFormId].get('value').setValue(opt);
      } else {
        let snapshot = this.fis.formGroupCollection_index[childFormId];
        this.fis.add(childFormId);
        this.fis.formGroupCollection[childFormId].get('value_' + snapshot).setValue(opt);
      }
    });
  }
  dismiss(event: MouseEvent) {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
    this.fis.resetAll();
  }
  private transKeyMap: Map<string, string> = new Map();
  ngOnInit() {
    this.translateFormLabel();
    let sub = this.translate.onLangChange.subscribe(() => {
      this.translateFormLabel();
    })
    this.subscriptions.add(sub);
  }
  public updateSelectCatalogs(catalog: ICatalogCustomer) {
    if (this.fis.formGroupCollection_index[this.formIdCatalog] === 0) {
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogId').setValue(catalog.id);
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogName').setValue(catalog.name);
    } else {
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogId_' + (this.fis.formGroupCollection_index[this.formIdCatalog] - 1)).setValue(catalog.id);
      this.fis.formGroupCollection[this.formIdCatalog].get('catalogName_' + (this.fis.formGroupCollection_index[this.formIdCatalog] - 1)).setValue(catalog.name);
    }
    this.fis.add(this.formIdCatalog)
  }
  convertToPayload(): IFilter {
    let formGroup = this.fis.formGroupCollection[this.formId];
    let varValue = this.fis.formGroupCollection[this.formIdCatalog].value;
    let catalogs = Object.keys(varValue).map(e => varValue[e] as string);
    let filters: IFilterItem[] = [];
    Object.keys(this.fis.formGroupCollection[this.formIdFilter].controls).filter(e => e.indexOf('attributeId') > -1).forEach((ctrlName) => {
      let var1 = <IFilterItem>{};
      var1.id = +this.fis.formGroupCollection[this.formIdFilter].get(ctrlName).value;
      var1.name = this.attrList.find(e => e.id === var1.id).name
      var1.values = [];
      let fg = this.fis.formGroupCollection['filterForm' + ctrlName.replace('attributeId', '')];
      var1.values = Object.keys(fg.controls).filter(e => e.indexOf('value') > -1).map(e => fg.get(e).value);
      filters.push(var1)
    });
    return {
      id: formGroup.get('id').value,
      catalogs: catalogs,
      filters: filters,
    }
  }
  private translateFormLabel() {
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
    this.formInfoCatalog.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.formInfoCatalogI18n = JSON.parse(JSON.stringify(this.formInfoCatalog));
    this.formInfoFilter.inputs.filter(e => e.label).forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
    this.formInfoFilterI18n = JSON.parse(JSON.stringify(this.formInfoFilter));
    //nested form
    this.formInfoFilter.inputs.filter(e => e.form)[0].form.inputs.forEach(e => {
      this.translate.get(e.label).subscribe((res: string) => {
        this.transKeyMap.set(e.key, e.label);
        e.label = res;
      });
    })
  }
  private subChangeForForm(formId: string) {
    if (!this.subs[formId + '_valueChange']) {
      let sub = this.fis.formGroupCollection[formId].valueChanges.subscribe(next => {
        Object.keys(next).filter(e => e.includes('attributeId')).forEach(idKey => {
          let selected = this.attrList.find(e => String(e.id) === next[idKey]);
          if (selected) {
            let append = idKey.replace('attributeId', '');
            let var1 = <IFilterItem>{
              id: selected.id,
              name: selected.name,
              values: selected.selectValues
            }
            this.updateChildFormFilter(var1, 'filterForm' + append);
          }
        });
      });
      this.subs[formId + '_valueChange'] = sub;
      this.subscriptions.add(sub)
    }
  }
}
