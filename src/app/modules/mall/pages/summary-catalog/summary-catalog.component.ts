import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { FormInfoService } from 'mt-form-builder';
import { IForm, IOption } from 'mt-form-builder/lib/classes/template.interface';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { CATALOG_TYPE } from 'src/app/clazz/constants';
import { SummaryEntityComponent, ISumRep } from 'src/app/clazz/summary.component';
import { ICatalog } from 'src/app/clazz/validation/aggregate/catalog/interfaze-catalog';
import { FORM_CONFIG } from 'src/app/form-configs/catalog-view.config';
import { CatalogService } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { CatalogComponent } from '../catalog/catalog.component';

@Component({
  selector: 'app-summary-category',
  templateUrl: './summary-catalog.component.html',
})
export class SummaryCatalogComponent extends SummaryEntityComponent<ICatalog, ICatalog> implements OnDestroy {
  formId = 'summaryCatalogCustomerView';
  formInfo: IForm = JSON.parse(JSON.stringify(FORM_CONFIG));
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
    super(entitySvc, deviceSvc, bottomSheet, 5, true);
    this.formCreatedOb = this.fis.$ready.pipe(filter(e => e === this.formId));
    let sub = combineLatest([this.formCreatedOb, this.route.queryParamMap]).subscribe(combine => {
      if (combine[1].get('type') === 'frontend') {
        this.entitySvc.queryPrefix = CATALOG_TYPE.FRONTEND;
      } else {
        this.entitySvc.queryPrefix = CATALOG_TYPE.BACKEND;
      }
      let sub = this.fis.formGroupCollection[this.formId].valueChanges.subscribe(e => {
        this.viewType = e.view;
        if (this.viewType === 'TREE_VIEW') {
          this.entitySvc.readByQuery(0, 1000).subscribe(next => {//@todo how to load tree structure
            this.updateSummaryData(next)
          });
        } else {
          this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => {
            this.updateSummaryDataExt(next)
          });
        }
      });
      this.subs.add(sub)
      this.fis.formGroupCollection[this.formId].get('view').setValue(this.viewType);
    })
    this.subs.add(sub)
  }
  catalogList: IOption[] = [];
  updateSummaryDataExt(inputs: ISumRep<ICatalog>) {
    this.updateSummaryData(inputs);
    let parentId: number[] = inputs.data.map(e => e.parentId).filter(e => e);
    if (parentId.length > 0)
      this.entitySvc.readByQuery(0, parentId.length, ',id:' + parentId.join('.')).subscribe(next => {
        this.catalogList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
      });
  }
  ngOnDestroy(): void {
    this.fis.reset(this.formId);
    super.ngOnDestroy();
  }
  doSearch(queryString: string) {
    this.queryString = queryString ? ("," + queryString) : this.queryString;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(next => {
      this.updateSummaryDataExt(next)
    })
  }
  pageHandler(e: PageEvent) {
    this.entitySvc.currentPageIndex = e.pageIndex;
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryString, this.sortBy, this.sortOrder).subscribe(products => {
      this.updateSummaryDataExt(products)
    });
  }
  getOption(value: string, options: IOption[]) {
    return options.find(e => e.value == value)
  }
}
