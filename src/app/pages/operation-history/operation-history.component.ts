import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet, PageEvent } from '@angular/material';
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
  label: string;
  queryPrefix: string;
  constructor(
    public entitySvc: OperationHistoryService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
  ) {
    super(entitySvc, deviceSvc, bottomSheet, 3, true);
    let ob = this.route.queryParamMap.pipe(switchMap(queryMaps => {
      this.entitySvc.currentPageIndex = 0;//reset var
      this.queryString = undefined;
      if (queryMaps.get('type') === 'auth') {
        this.entitySvc.PRODUCT_SVC_NAME = '/auth-svc';
        if (queryMaps.get('entity') === 'client') {
          this.queryPrefix = 'entityType:BizClient'
          this.label = 'OPERATION_DASHBOARD_CLIENT'
        }
        if (queryMaps.get('entity') === 'user') {
          this.queryPrefix = 'entityType:BizUser'
          this.label = 'OPERATION_DASHBOARD_USER'
        }
      } else if (queryMaps.get('type') === 'proxy') {
        this.entitySvc.PRODUCT_SVC_NAME = '/proxy';
        if (queryMaps.get('entity') === 'token') {
          this.label = 'OPERATION_DASHBOARD_TOKEN'
          this.queryPrefix = 'entityType:RevokeToken'
        }
        if (queryMaps.get('entity') === 'endpoint') {
          this.label = 'OPERATION_DASHBOARD_EP'
          this.queryPrefix = 'entityType:BizEndpoint'
        }
      } else if (queryMaps.get('type') === 'product') {
        this.entitySvc.PRODUCT_SVC_NAME = '/product-svc';
        if (queryMaps.get('entity') === 'sku') {
          this.label = 'OPERATION_DASHBOARD_SKU'
          this.queryPrefix = 'entityType:BizSku'
        }
        if (queryMaps.get('entity') === 'product') {
          this.label = 'OPERATION_DASHBOARD_PRODUCT'
          this.queryPrefix = 'entityType:Product'
        }
        if (queryMaps.get('entity') === 'catalog') {
          this.label = 'OPERATION_DASHBOARD_CATALOG'
          this.queryPrefix = 'entityType:BizCatalog'
        }
        if (queryMaps.get('entity') === 'attribute') {
          this.label = 'OPERATION_DASHBOARD_ATTR'
          this.queryPrefix = 'entityType:BizAttribute'
        }
        if (queryMaps.get('entity') === 'filter') {
          this.label = 'OPERATION_DASHBOARD_FILTER'
          this.queryPrefix = 'entityType:BizFilter'
        }
      } else if(queryMaps.get('type') === 'profile'){
        this.entitySvc.PRODUCT_SVC_NAME = '/profile-svc';
        if (queryMaps.get('entity') === 'order') {
          this.label = 'OPERATION_DASHBOARD_ORDER'
          this.queryPrefix = 'entityType:BizOrder'
        }
      }else {

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
  supportRollback(row: IChangeRecord) {
    return ['POST', 'DELETE_BY_ID', 'DELETE_BY_QUERY'].includes(row.operationType);
  }
  doSearch(queryString: string) {
    this.queryString = this.queryPrefix + (queryString ? queryString : '');
    super.doSearch(this.queryString);
  }
  pageHandler(e: PageEvent) {
    if (this.queryString && this.queryString.includes('entityType')) {
    } else {
      this.queryString = this.queryPrefix + (this.queryString ? this.queryString : '');
    }
    super.pageHandler(e);
  }
}