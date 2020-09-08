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
  queryPrefix: string;
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
        if (queryMaps.get('entity') === 'client')
          this.queryPrefix = 'entityType:BizClient'
        if (queryMaps.get('entity') === 'user')
          this.queryPrefix = 'entityType:BizUser'
      } else if (queryMaps.get('type') === 'proxy') {
        this.entitySvc.PRODUCT_SVC_NAME = '/proxy';
        if (queryMaps.get('entity') === 'token')
          this.queryPrefix = 'entityType:RevokeToken'
        if (queryMaps.get('entity') === 'endpoint')
          this.queryPrefix = 'entityType:BizEndpoint'
      } else if (queryMaps.get('type') === 'product') {
        this.entitySvc.PRODUCT_SVC_NAME = '/product-svc';
        if (queryMaps.get('entity') === 'product')
          this.queryPrefix = 'entityType:Product'
        if (queryMaps.get('entity') === 'catalog')
          this.queryPrefix = 'entityType:BizCatalog'
        if (queryMaps.get('entity') === 'attribute')
          this.queryPrefix = 'entityType:BizAttribute'
        if (queryMaps.get('entity') === 'filter')
          this.queryPrefix = 'entityType:BizFilter'
      } else {

      }
      this.entitySvc.entityRepo = environment.serverUri + this.entitySvc.PRODUCT_SVC_NAME + this.entitySvc.ENTITY_NAME;
      return this.entitySvc.readByQuery(this.entitySvc.currentPageIndex, this.getPageSize(), this.queryPrefix);
    }));
    let sub = ob.subscribe(next => {
      this.updateSummaryData(next);
    });
    let sub0 = this.entitySvc.refreshSummary.pipe(switchMap(() => ob)).subscribe(next => { this.updateSummaryData(next) });
    this.subs.add(sub)
    this.subs.add(sub0)
  }
  getLable() {
    let label:string;
    if (this.queryPrefix === 'entityType:BizClient') {
      label = 'OPERATION_DASHBOARD_CLIENT'
    } else if (this.queryPrefix = 'entityType:BizUser') {
      label = 'OPERATION_DASHBOARD_USER'
    } else if (this.queryPrefix = 'entityType:BizEndpoint') {
      label = 'OPERATION_DASHBOARD_EP'
    } else if (this.queryPrefix = 'entityType:RevokeToken') {
      label = 'OPERATION_DASHBOARD_TOKEN'
    } else if (this.queryPrefix = 'entityType:Product') {
      label = 'OPERATION_DASHBOARD_PRODUCT'
    } else if (this.queryPrefix = 'entityType:BizCatalog') {
      label = 'OPERATION_DASHBOARD_PRODUCT'
    } else if (this.queryPrefix = 'entityType:BizAttribute') {
      label = 'OPERATION_DASHBOARD_PRODUCT'
    } else if (this.queryPrefix = 'entityType:BizFilter') {
      label = 'OPERATION_DASHBOARD_PRODUCT'
    } else {
    }
    return label;
  }
  supportRollback(row: IChangeRecord) {
    return ['POST', 'DELETE_BY_ID', 'DELETE_BY_QUERY'].includes(row.operationType);
  }
}