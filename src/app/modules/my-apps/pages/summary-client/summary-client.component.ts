import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_GRANT_TYPE, CONST_ROLES } from 'src/app/clazz/constants';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { IClient } from '../../interface/client.interface';
import { ClientComponent } from '../client/client.component';
@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
})
export class SummaryClientComponent extends SummaryEntityComponent<IClient, IClient> implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'resourceIndicator', 'grantTypeEnums', 'accessTokenValiditySeconds', 'grantedAuthorities', 'resourceIds', 'edit', 'token', 'delete'];
  sheetComponent = ClientComponent;
  resourceClients: IClient[];
  public grantTypeList: IOption[] = CONST_GRANT_TYPE;
  public roleList: IOption[] = CONST_ROLES;
  public resourceClientList: IOption[];
  constructor(
    public entitySvc: ClientService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3);
    this.entitySvc.readByQuery(0, 1000, 'resourceIndicator:1')
      .subscribe(next => {
        if (next.data) {
          this.resourceClients = next.data;
          this.resourceClientList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
        }
      });
  }
  revokeClientToken(clientId: number) {
    this.entitySvc.revokeClientToken(clientId);
  }
  getList(inputs: string[]) {
    return inputs.map(e => <IOption>{ label: e, value: e })
  }
  getAuthorityList(inputs: string[]) {
    return inputs.map(e => <IOption>{ label: e, value: e })
  }
  getResourceList(inputs: string[]) {
    return inputs.map(ee => this.resourceClients.find(e => e.id === +ee)).map(e => <IOption>{ label: e.name, value: e.id })
  }
}