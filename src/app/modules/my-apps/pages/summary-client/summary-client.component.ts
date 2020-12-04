import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_GRANT_TYPE, CONST_ROLES } from 'src/app/clazz/constants';
import { ISumRep, SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IClient } from 'src/app/clazz/validation/aggregate/client/interfaze-client';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { ClientComponent } from '../client/client.component';
@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
})
export class SummaryClientComponent extends SummaryEntityComponent<IClient, IClient> implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'resourceIndicator', 'grantTypeEnums', 'accessTokenValiditySeconds', 'grantedAuthorities', 'resourceIds', 'edit', 'token', 'delete'];
  sheetComponent = ClientComponent;
  public grantTypeList: IOption[] = CONST_GRANT_TYPE;
  public roleList: IOption[] = CONST_ROLES;
  resourceClientList: IOption[] = [];
  constructor(
    public entitySvc: ClientService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 8);
  }
  updateSummaryData(next: ISumRep<IClient>) {
    super.updateSummaryData(next);
    let var0 = new Set(next.data.flatMap(e => e.resourceIds));
    let var1 = new Array(...var0);
    this.entitySvc.readByQuery(0, var1.length, "id:" + var1.join('.')).subscribe(next => {
      this.resourceClientList = next.data.map(e => <IOption>{ label: e.name, value: e.id });
    })
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
    return this.resourceClientList.filter(e => inputs.includes(e.value + ''))
  }
}