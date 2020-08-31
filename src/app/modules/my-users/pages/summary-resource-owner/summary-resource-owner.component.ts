import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { IOption } from 'mt-form-builder/lib/classes/template.interface';
import { CONST_ROLES_USER } from 'src/app/clazz/constants';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { IAuthority } from 'src/app/modules/my-apps/interface/client.interface';
import { DeviceService } from 'src/app/services/device.service';
import { ResourceOwnerService } from 'src/app/services/resource-owner.service';
import { IResourceOwner } from '../../interface/resource-owner.interface';
import { ResourceOwnerComponent } from '../resource-owner/resource-owner.component';
import { OperationConfirmDialogComponent } from 'src/app/components/operation-confirm-dialog/operation-confirm-dialog.component';
import { filter } from 'rxjs/operators';
import * as UUID from 'uuid/v1';
@Component({
  selector: 'app-summary-resource-owner',
  templateUrl: './summary-resource-owner.component.html',
})
export class SummaryResourceOwnerComponent extends SummaryEntityComponent<IResourceOwner, IResourceOwner> implements OnDestroy {
  displayedColumns: string[] = ['id', 'email', 'grantedAuthorities', 'locked', 'createAt', 'edit', 'token', 'delete'];
  sheetComponent = ResourceOwnerComponent;
  roleList = CONST_ROLES_USER;
  constructor(
    public entitySvc: ResourceOwnerService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 2);
  }
  revokeResourceOwnerToken(id: number) {
    this.entitySvc.revokeResourceOwnerToken(id);
  }
  getAuthorityList(inputs: IAuthority[]) {
    return inputs.map(e => <IOption>{ label: this.roleList.find(ee => ee.value === e.grantedAuthority).label, value: e.grantedAuthority })
  }
  doBatchLock(){
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateUserStatus(ids, 'LOCK', UUID()));
  }
  doBatchUnlock(){
    const dialogRef = this.dialog.open(OperationConfirmDialogComponent);
    let ids = this.selection.selected.map(e => e.id)
    dialogRef.afterClosed().pipe(filter(result => result)).subscribe(() => this.entitySvc.batchUpdateUserStatus(ids, 'UNLOCK', UUID()));
  }
}
