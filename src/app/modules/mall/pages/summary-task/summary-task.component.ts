import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { IBizTask, TaskService } from 'src/app/services/task.service';
@Component({
  selector: 'app-summary-task',
  templateUrl: './summary-task.component.html',
  styleUrls: ['./summary-task.component.css']
})
export class SummaryTaskComponent extends SummaryEntityComponent<IBizTask, IBizTask> implements OnDestroy {

  displayedColumns: string[] = ['id', 'referenceId', 'taskName', 'taskStatus', 'rollbackReason', 'transactionId', 'createAt', 'createdBy', 'modifiedAt', 'modifiedBy'];
  constructor(
    public entitySvc: TaskService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3);
  }
}
