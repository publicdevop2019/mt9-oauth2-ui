import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { EndpointService, IEndpoint } from 'src/app/services/endpoint.service';
import { SecurityProfileComponent } from '../security-profile/security-profile.component';
import { CONST_HTTP_METHOD } from 'src/app/clazz/constants';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { ClientService } from 'src/app/services/client.service';
import { IClient } from '../../interface/client.interface';
@Component({
  selector: 'app-summary-security-profile',
  templateUrl: './summary-security-profile.component.html',
  styleUrls: ['./summary-security-profile.component.css']
})
export class SummarySecurityProfileComponent extends SummaryEntityComponent<IEndpoint, IEndpoint> implements OnDestroy {
  displayedColumns: string[] = ['id', 'description', 'resourceId', 'path', 'expression', 'method', 'edit', 'delete'];
  sheetComponent = SecurityProfileComponent;
  httpMethodList=CONST_HTTP_METHOD;
  resourceClients: IClient[] ;
  public resourceClientList: IOption[];
  constructor(
    public entitySvc: EndpointService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public clientSvc: ClientService,
  ) {
    super(entitySvc, deviceSvc, bottomSheet,2);
    this.clientSvc.readByQuery(0, 1000, 'resourceIndicator:1')
    .subscribe(next => {
      if (next.data) {
        this.resourceClients = next.data;
        this.resourceClientList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
      }
    });
  }
  getOption(value:string,options:IOption[]){
    return options.find(e=>e.value==value)
  }
}
