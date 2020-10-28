import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { combineLatest } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SummaryEntityComponent, ISumRep } from 'src/app/clazz/summary.component';
import { CatalogService, ICatalog } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { FilterService, IBizFilter } from 'src/app/services/filter.service';
import { FilterComponent } from '../filter/filter.component';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';

@Component({
  selector: 'app-summary-filter',
  templateUrl: './summary-filter.component.html',
})
export class SummaryFilterComponent extends SummaryEntityComponent<IBizFilter, IBizFilter> implements OnDestroy {
  displayedColumns: string[] = ['id', 'description', 'catalogs', 'edit', 'delete'];
  sheetComponent = FilterComponent;
  public mappedCatalog: ICatalog[]
  public fullCatalog: IOption[]
  constructor(
    public entitySvc: FilterService,
    public deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
    private catalogSvc: CatalogService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 0, true);
    let sub = this.entitySvc.refreshSummary.pipe(switchMap(() => this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()))).subscribe(next => { this.updateSummaryDataExt(next) })
    this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize()).subscribe(next => {
      this.updateSummaryDataExt(next);
    })
    this.catalogSvc.readByQuery(0, 1000, 'type:FRONTEND').subscribe(next => {
      this.fullCatalog = next.data.map(e => <IOption>{ label: e.name, value: String(e.id) })
    })
    this.subs.add(sub)
  }
  public parseCatalogId(id: number) {
    return this.mappedCatalog.find(e => e.id === id).name
  }
  getCatalogList(inputs: string[]): IOption[] {
    return inputs.map(e => <IOption>{ label: this.parseCatalogId(+e), value: e })
  }
  private updateSummaryDataExt(inputs: ISumRep<IBizFilter>) {
    super.updateSummaryData(inputs);
    let var0: string[] = []
    inputs.data.forEach(e => {
      var0.push(...e.catalogs)
    })
    if (var0.length > 0)
      this.catalogSvc.readByQuery(0, var0.length, 'type:FRONTEND,id:' + var0.join('.')).subscribe(next => {
        this.mappedCatalog = next.data
      })
  }
}
