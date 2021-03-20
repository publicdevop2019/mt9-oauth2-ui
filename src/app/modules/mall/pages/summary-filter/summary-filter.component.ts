import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { ISumRep, SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IBizFilter } from 'src/app/clazz/validation/aggregate/filter/interfaze-filter';
import { CatalogService } from 'src/app/services/catalog.service';
import { DeviceService } from 'src/app/services/device.service';
import { FilterService } from 'src/app/services/filter.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-summary-filter',
  templateUrl: './summary-filter.component.html',
})
export class SummaryFilterComponent extends SummaryEntityComponent<IBizFilter, IBizFilter> implements OnDestroy {
  displayedColumns: string[] = ['id', 'description', 'catalogs', 'edit', 'delete','review'];
  sheetComponent = FilterComponent;
  public catalogList: IOption[] = []
  constructor(
    public entitySvc: FilterService,
    public deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
    public catalogSvc: CatalogService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 0);
  }

  updateSummaryData(next: ISumRep<IBizFilter>) {
    super.updateSummaryData(next)
    let var0 = new Set(next.data.flatMap(e => e.catalogs));
    let var1 = new Array(...var0);
    if (var1.length > 0) {
      this.catalogSvc.readByQuery(0, var1.length, 'type:FRONTEND,id:' + var1.join('.')).subscribe(next => {
        this.catalogList = next.data.map(e => <IOption>{ label: e.name, value: e.id })
      })
    }
  }
  getCatalogList(inputs: string[]): IOption[] {
    return this.catalogList.filter(e => inputs.includes(e.value + ""))
  }
}
