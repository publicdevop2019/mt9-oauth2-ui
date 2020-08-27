import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { IResourceOwner } from '../../interface/resource-owner.interface';
import { ResourceOwnerComponent } from '../resource-owner/resource-owner.component';
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
})
export class SummaryResourceOwnerComponent  extends SummaryEntityComponent<IResourceOwner, IResourceOwner> implements OnDestroy {
  displayedColumns: string[] = ['id', 'email','locked','createAt', 'edit', 'token', 'delete'];
  sheetComponent = ResourceOwnerComponent;
  constructor(
    protected entitySvc: ResourceOwnerService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    ) {
      super(entitySvc, deviceSvc, bottomSheet,2);
  }
  revokeResourceOwnerToken(id: number) {
    this.entitySvc.revokeResourceOwnerToken(id);
  }
}
