import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { DeviceService } from 'src/app/services/device.service';
import { AttributeComponent } from '../attribute/attribute.component';
@Component({
  selector: 'app-summary-attribute',
  templateUrl: './summary-attribute.component.html',
})
export class SummaryAttributeComponent extends SummaryEntityComponent<IBizAttribute, IBizAttribute> implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'value', 'type', 'edit', 'delete'];
  sheetComponent = AttributeComponent;
  constructor(
    public entitySvc: AttributeService,
    public deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet,2);
  }
}
