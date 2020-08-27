import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { ClientService } from 'src/app/services/client.service';
import { DeviceService } from 'src/app/services/device.service';
import { IAuthority, IClient } from '../../interface/client.interface';
import { ClientComponent } from '../client/client.component';
@Component({
  selector: 'app-summary-client',
  templateUrl: './summary-client.component.html',
})
export class SummaryClientComponent extends SummaryEntityComponent<IClient, IClient> implements OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'description', 'resourceIndicator', 'grantTypeEnums', 'accessTokenValiditySeconds', 'grantedAuthorities', 'resourceIds', 'edit', 'token', 'delete'];
  sheetComponent = ClientComponent;
  constructor(
    protected entitySvc: ClientService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet,2);
  }
  revokeClientToken(clientId: number) {
    this.entitySvc.revokeClientToken(clientId);
  }
  parseAuthority(autho: IAuthority[]): string[] {
    return autho.map(e => e.grantedAuthority)
  }
}