import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SummaryEntityComponent, ISumRep } from 'src/app/clazz/summary.component';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { CatalogComponent } from '../catalog/catalog.component';

@Component({
  selector: 'app-summary-category',
  templateUrl: './summary-catalog.component.html',
})
export class SummaryCatalogComponent extends SummaryEntityComponent<ICatalog, ICatalog> implements OnDestroy {
  formId = 'summaryCatalogCustomerView';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
  catalogQueryPrefix: string;
  viewType: "TREE_VIEW" | "LIST_VIEW" = "LIST_VIEW";
  displayedColumns: string[] = ['id', 'name', 'parentId', 'edit', 'delete'];
  sheetComponent = CatalogComponent;
  private formCreatedOb: Observable<string>;
  constructor(
    public entitySvc: CatalogService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private fis: FormInfoService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 4, true);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    this.formCreatedOb.subscribe(() => {
      let sub = this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
        this.viewType = e.view;
        if (this.viewType === 'TREE_VIEW') {
          this.entitySvc.readByQuery(0, 1000, this.catalogQueryPrefix).subscribe(next => {
            this.updateSummaryData(next)
          });
        } else {
          this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.catalogQueryPrefix).subscribe(next => {
            this.updateSummaryDataExt(next)
          });
        }
      });
      this.subs.add(sub)
      this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType, { onlySelf: true });
    })
    let ob = this.route.queryParamMap.pipe(switchMap(queryMaps => {
      if (queryMaps.get('type') === 'frontend') {
        this.catalogQueryPrefix = 'type:FRONTEND';
      } else {
        this.catalogQueryPrefix = 'type:BACKEND';
      }
      return this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.catalogQueryPrefix);
    }));
    let sub = ob.subscribe(next => {
      this.updateSummaryDataExt(next);
    });
    let sub0 = this.entitySvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryDataExt(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  mappedParentCatalogs: IOption[];
  fullCatalogsList: IOption[];
  updateSummaryDataExt(inputs: ISumRep<ICatalog>) {
    this.updateSummaryData(inputs);
    let parentId: number[] = inputs.data.map(e => e.parentId).filter(e => e);
    if (parentId.length > 0)
      this.entitySvc.readByQuery(0, parentId.length, this.catalogQueryPrefix + ',id:' + parentId.join('.')).subscribe(next => {
        this.mappedParentCatalogs = next.data.map(e => <IOption>{ label: e.name, value: e.id });
      });
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, 1000, this.catalogQueryPrefix).subscribe(next => {
      this.fullCatalogsList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
    });
  }
  ngOnDestroy(): void {
    this.fis.reset(this.formId);
    super.ngOnDestroy();
  }
  doSearch(queryString: string) {
    this.queryString = this.catalogQueryPrefix + ',' + queryString;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryDataExt(next)
    })
  }
  getOption(value: string, options: IOption[]) {
    return options.find(e => e.value == value)
  }
}
