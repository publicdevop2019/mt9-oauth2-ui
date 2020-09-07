import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { IChangeRecord, OperationHistoryService, ICreateDeleteCommand } from 'src/app/services/operation-history.service';

@Component({
  selector: 'app-operation-history',
  templateUrl: './operation-history.component.html',
  styleUrls: ['./operation-history.component.css']
})
export class OperationHistoryComponent extends SummaryEntityComponent<IChangeRecord, IChangeRecord> implements OnDestroy {
  displayedColumns: string[] = ['id', 'changeId', 'entityType', 'patchCommand', 'createDeleteCommand','createDeleteCommandQuery', 'revoke'];
  // sheetComponent = ClientComponent;
  constructor(
    public entitySvc: OperationHistoryService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3);
  }
  parse(command: ICreateDeleteCommand) {
    if (command) {
      return command.operationType
    }
  }
  parseQuery(command: ICreateDeleteCommand) {
    if (command) {
      return command.query
    }
  }
}