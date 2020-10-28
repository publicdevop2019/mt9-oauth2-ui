import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { AttributeService, IBizAttribute } from 'src/app/services/attribute.service';
import { DeviceService } from 'src/app/services/device.service';
import { AttributeComponent } from '../attribute/attribute.component';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_ATTR_TYPE } from 'src/app/clazz/constants';
@Component({
  selector: 'app-summary-attribute',
  templateUrl: './summary-attribute.component.html',
})
export class SummaryAttributeComponent extends SummaryEntityComponent<IBizAttribute, IBizAttribute> implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'selectValues', 'type', 'edit', 'delete'];
  sheetComponent = AttributeComponent;
  attrTypeList=CONST_ATTR_TYPE;
  constructor(
    public entitySvc: AttributeService,
    public deviceSvc: DeviceService,
    protected bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet,2);
  }
  getOption(value:string,options:IOption[]){
    return options.find(e=>e.value==value)
  }
}
