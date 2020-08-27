import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { combineLatest } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { FilterService, IBizFilter } from 'src/app/services/filter.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-summary-filter',
  templateUrl: './summary-filter.component.html',
})
export class SummaryFilterComponent extends SummaryEntityComponent<IBizFilter, IBizFilter> implements OnDestroy {
  displayedColumns: string[] = ['id', 'catalogs', 'edit', 'delete'];
  sheetComponent = FilterComponent;
  private fronCatalog: ICatalog[]
  constructor(
    public entitySvc: FilterService,
    public deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
    private catalogSvc: CatalogService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 0,true);
    let sub = this.entitySvc.refreshSummary.pipe(switchMap(() => this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()))).subscribe(next => { this.updateSummaryData(next) })
    combineLatest(this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()), this.catalogSvc.readByQuery(0, 1000, 'query=type:FRONTEND')).pipe(take(1)).subscribe(next => {
      this.updateSummaryData(next[0]);
      this.fronCatalog = next[1].data
    })
    this.subs.add(sub)
  }
  public parseCatalogId(id: number) {
    return this.fronCatalog.find(e => e.id === id).name
  }
  parse(inputs: string[]) {
    return inputs.map(e => this.parseCatalogId(+e)).join(',')
  }
}
