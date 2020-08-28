import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm } from 'mt-form-builder/lib/classes/template.interface';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
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
  catalogType: string;
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
          if (this.catalogType === 'frontend') {
            this.entitySvc.readByQuery(0, 1000, 'query=type:FRONTEND').subscribe(next => {
              this.updateSummaryData(next)
            });
          } else {
            this.entitySvc.readByQuery(0, 1000, 'query=type:BACKEND').subscribe(next => {
              this.updateSummaryData(next)
            });
          }
        } else {
          if (this.catalogType === 'frontend') {
            this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), 'query=type:FRONTEND').subscribe(next => {
              this.updateSummaryData(next)
            });
          } else {
            this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), 'query=type:BACKEND').subscribe(next => {
              this.updateSummaryData(next)
            });
          }
        }
      });
      this.subs.add(sub)
      this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType, { onlySelf: true });
    })
    let ob = this.route.queryParamMap.pipe(switchMap(queryMaps => {
      this.catalogType = queryMaps.get('type');
      if (queryMaps.get('type') === 'frontend') {
        return this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), 'query=type:FRONTEND');
      } else if (queryMaps.get('type') === 'backend') {
        return this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), 'query=type:BACKEND');
      } else {
      }
    }));
    let sub = ob.subscribe(next => { this.updateSummaryData(next) });
    let sub0 = this.entitySvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  ngOnDestroy(): void {
    this.fis.reset(this.formId);
    super.ngOnDestroy();
  }
  getParenteName(id: number) {
    return ((id !== null && id !== undefined) && this.dataSource.data.find(e => e.id === id)) ? this.dataSource.data.find(e => e.id === id).name : '';
  }
  doSearch(queryString: string) {
    this.queryString = (this.catalogType === 'frontend' ? 'type:FRONTEND' : 'query=type:BACKEND') + ',' + queryString;
    super.doSearch(this.queryString);
  }
}
