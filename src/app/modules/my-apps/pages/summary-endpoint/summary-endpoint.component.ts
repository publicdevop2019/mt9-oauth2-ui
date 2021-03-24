import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_HTTP_METHOD } from 'src/app/clazz/constants';
import { ISumRep, SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IEndpoint } from 'src/app/clazz/validation/aggregate/endpoint/interfaze-endpoint';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { EndpointComponent } from '../endpoint/endpoint.component';
@Component({
  selector: 'app-summary-endpoint',
  templateUrl: './summary-endpoint.component.html',
  styleUrls: ['./summary-endpoint.component.css']
})
export class SummaryEndpointComponent extends SummaryEntityComponent<IEndpoint, IEndpoint> implements OnDestroy {
  displayedColumns: string[] = ['id', 'description', 'resourceId', 'path',  'method', 'edit', 'delete'];
  sheetComponent = EndpointComponent;
  httpMethodList = CONST_HTTP_METHOD;
  public allClientList: IOption[];
  constructor(
    public entitySvc: EndpointService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public clientSvc: ClientService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3);
  }
  updateSummaryData(next: ISumRep<IEndpoint>) {
    super.updateSummaryData(next);
    let ids = next.data.map(e => e.resourceId);
    let var0 = new Set(ids);
    let var1 = new Array(...var0);
    this.clientSvc.readEntityByQuery(0, var1.length, "clientId:" + var1.join('.')).subscribe(next => {
      this.allClientList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
    })
  }
  getOption(value: string, options: IOption[]) {
    return options.find(e => e.value == value)
  }
}
