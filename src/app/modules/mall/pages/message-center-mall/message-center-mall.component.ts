import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';
import { SummaryEntityComponent } from 'src/app/clazz/summary.component';
import { DeviceService } from 'src/app/services/device.service';
import { IMallMonitorMsg, MessageMallService } from 'src/app/services/message-mall.service';

@Component({
  selector: 'app-message-center-mall',
  templateUrl: './message-center-mall.component.html',
  styleUrls: ['./message-center-mall.component.css']
})
export class MessageCenterMallComponent extends SummaryEntityComponent<IMallMonitorMsg, IMallMonitorMsg>{

  displayedColumns: string[] = ['date', 'code', 'skuChange'];
  constructor(
    public entitySvc: MessageMallService,
    public deviceSvc: DeviceService,
    public bottomSheet: MatBottomSheet,
    private txSvc: TranslateService
  ) {
    super(entitySvc, deviceSvc, bottomSheet, -2);
  }
  parseCode(code: number) {
    if (code === 10001) {
      return 'SKU_FAILURE'
    }
  }
  parseStorageType(type: 'ACTUAL' | 'ORDER') {
    return type+'_STORAGE'
  }
}
