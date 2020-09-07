import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { IChangeRecord, OperationHistoryService } from 'src/app/services/operation-history.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operation-history',
  templateUrl: './operation-history.component.html',
  styleUrls: ['./operation-history.component.css']
})
export class OperationHistoryComponent extends SummaryEntityComponent<IChangeRecord, IChangeRecord> implements OnDestroy {
  displayedColumns: string[] = ['id', 'changeId', 'entityType', 'createDeleteCommand', 'createDeleteCommandQuery', 'patchCommand', 'revoke'];
  // sheetComponent = ClientComponent;
  constructor(
    public entitySvc: OperationHistoryService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3, true);
    let ob = this.route.queryParamMap.pipe(switchMap(queryMaps => {
      if (queryMaps.get('type') === 'auth') {
        this.entitySvc.PRODUCT_SVC_NAME = '/auth-svc';
      } else if (queryMaps.get('type') === 'proxy') {
        this.entitySvc.PRODUCT_SVC_NAME = '/proxy';
      } else if (queryMaps.get('type') === 'product') {
        this.entitySvc.PRODUCT_SVC_NAME = '/product-svc';
      } else {
        
      }
      this.entitySvc.entityRepo = environment.serverUri + this.entitySvc.PRODUCT_SVC_NAME + this.entitySvc.ENTITY_NAME
      return this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize());
    }));
    let sub = ob.subscribe(next => {
      this.updateSummaryData(next);
    });
    let sub0 = this.entitySvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  supportRollback(row: IChangeRecord) {
    return ['POST', 'DELETE_BY_ID', 'DELETE_BY_QUERY'].includes(row.operationType);
  }
}