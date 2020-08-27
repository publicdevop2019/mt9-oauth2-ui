import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { EndpointService } from 'src/app/services/endpoint.service';
import { SecurityProfileComponent } from '../security-profile/security-profile.component';
export interface ISecurityProfileSumRep {
  data: ISecurityProfile[],
  totalItemCount: number,
}
export interface ISecurityProfile {
  resourceId: string;
  description?: string;
  path: string;
  method: string;
  expression: string;
  id: number;
}
@Component({
  selector: 'app-summary-security-profile',
  templateUrl: './summary-security-profile.component.html',
  styleUrls: ['./summary-security-profile.component.css']
})
export class SummarySecurityProfileComponent extends SummaryEntityComponent<ISecurityProfile, ISecurityProfile> implements OnDestroy {
  displayedColumns: string[] = ['id', 'description', 'resourceId', 'path', 'expression', 'method', 'edit', 'delete'];
  sheetComponent = SecurityProfileComponent;
  constructor(
    protected entitySvc: EndpointService,
    public deviceSvc: DeviceService,
    public _bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, _bottomSheet);
  }
}
